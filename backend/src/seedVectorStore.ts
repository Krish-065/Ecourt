import { Client } from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

function generatePseudoVector(text: string): number[] {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (hash << 5) - hash + text.charCodeAt(i);
    hash |= 0;
  }
  const vec: number[] = [];
  for (let i = 0; i < 384; i++) {
    const val = Math.sin(hash + i);
    vec.push(val);
  }
  const norm = Math.sqrt(vec.reduce((sum, val) => sum + val * val, 0));
  return vec.map((val) => val / norm);
}

async function seedVectorStore() {
  console.log('Connecting to PostgreSQL / Neon DB to seed Comprehensive Indian Bare Acts & Law Books...');
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();

    const compDatasetPath = path.resolve(__dirname, '../../datasets/comprehensive_indian_legal_corpus.json');
    const sampleDatasetPath = path.resolve(__dirname, '../../datasets/indian_bare_acts_sample.json');
    
    let datasetPath = compDatasetPath;
    if (!fs.existsSync(compDatasetPath)) {
      datasetPath = sampleDatasetPath;
    }

    if (!fs.existsSync(datasetPath)) {
      console.log('Dataset file not found.');
      return;
    }

    const items = JSON.parse(fs.readFileSync(datasetPath, 'utf8'));
    let count = 0;

    for (const item of items) {
      const vec = generatePseudoVector(item.content);
      const vecStr = `[${vec.join(',')}]`;
      const corpusType = item.category || item.corpus_type || 'BARE_ACT';
      const actName = item.act_or_court_name || item.act_name || 'Indian Law';
      const sectionRef = item.section_or_case_ref || item.section_ref || 'Provision';

      await client.query(
        `INSERT INTO legal_vector_store (corpus_type, act_or_court_name, section_or_case_ref, content, metadata, embedding)
         VALUES ($1, $2, $3, $4, $5, $6::vector)`,
        [corpusType, actName, sectionRef, item.content, JSON.stringify(item.metadata || {}), vecStr]
      );
      count++;
    }

    console.log(`🎉 Successfully seeded ${count} Comprehensive Legal vector entries into DB!`);
  } catch (err) {
    console.log('Vector DB Seeding Note (using local fallback engine if DB offline):', err);
  } finally {
    await client.end();
  }
}

seedVectorStore();
