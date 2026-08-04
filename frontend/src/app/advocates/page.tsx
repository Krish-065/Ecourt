'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  Gavel, 
  Briefcase, 
  Phone, 
  Mail, 
  ShieldCheck, 
  Plus, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  UserCheck
} from 'lucide-react';
import { UserProfile } from '../../lib/api';

export default function AdvocatesDirectory() {
  const [user, setUser] = useState<UserProfile | null>(null);
  
  // Search Filters
  const [nameFilter, setNameFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [specializationFilter, setSpecializationFilter] = useState('');
  const [advocates, setAdvocates] = useState<any[]>([]);
  const [loadingList, setLoadingList] = useState(false);

  // Form State for upserting profile
  const [specialization, setSpecialization] = useState('Criminal Law');
  const [officeLocation, setOfficeLocation] = useState('');
  const [experienceYears, setExperienceYears] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [bio, setBio] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    // Load logged in user
    const saved = localStorage.getItem('ecourt_user');
    if (saved) {
      try {
        const u = JSON.parse(saved);
        setUser(u);
        if (u.role === 'ADVOCATE') {
          // Pre-populate some values
          setContactPhone(u.phone || '');
        }
      } catch (e) {}
    }

    fetchAdvocates();
  }, []);

  const fetchAdvocates = async () => {
    setLoadingList(true);
    try {
      const queryParams = new URLSearchParams();
      if (nameFilter) queryParams.append('name', nameFilter);
      if (locationFilter) queryParams.append('location', locationFilter);
      if (specializationFilter) queryParams.append('specialization', specializationFilter);

      const token = localStorage.getItem('ecourt_token');
      const res = await fetch(`http://localhost:5000/api/v1/advocates?${queryParams.toString()}`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      const data = await res.json();
      if (data.success) {
        setAdvocates(data.data);
      }
    } catch (e) {
      console.error('Failed to fetch advocates list:', e);
    } finally {
      setLoadingList(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchAdvocates();
  };

  const handleUpsertProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setStatusMsg(null);

    const token = localStorage.getItem('ecourt_token');
    if (!token) {
      setStatusMsg({ type: 'error', text: 'You must be signed in to list your profile.' });
      setSavingProfile(false);
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/v1/advocates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          specialization,
          officeLocation,
          experienceYears: parseInt(experienceYears, 10),
          contactPhone,
          bio
        })
      });

      const data = await res.json();
      if (data.success) {
        setStatusMsg({ type: 'success', text: '🎉 Practice profile updated successfully in the Advocate Directory!' });
        fetchAdvocates(); // reload directory list
      } else {
        setStatusMsg({ type: 'error', text: data.error || 'Failed to update profile.' });
      }
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message });
    } finally {
      setSavingProfile(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-6 px-4">
      {/* Header Banner */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-extrabold shadow-2xs">
          <Gavel className="h-4 w-4 text-amber-600" />
          Indian Advocate Directory
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Find & Connect with <span className="text-indigo-600">Verified Advocates</span>
        </h1>
        <p className="text-xs text-slate-600 font-medium leading-relaxed">
          Search legal professionals across India verified against Bar Council registries by name, specialization, or office location.
        </p>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Hand Search Column */}
        <div className="space-y-6 lg:col-span-1">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <Search className="h-4 w-4 text-indigo-600" />
              Filter Directory
            </h3>

            <form onSubmit={handleSearchSubmit} className="space-y-4 text-xs font-semibold">
              <div className="space-y-1">
                <label className="text-slate-600">Advocate Name</label>
                <input 
                  type="text" 
                  value={nameFilter}
                  onChange={(e) => setNameFilter(e.target.value)}
                  placeholder="e.g. Adv. Rajesh Sharma"
                  className="w-full glass-input px-3.5 py-2.5 rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-600">Office Location (City/State)</label>
                <input 
                  type="text" 
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  placeholder="e.g. Mumbai or Maharashtra"
                  className="w-full glass-input px-3.5 py-2.5 rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-600">Specialization</label>
                <select 
                  value={specializationFilter}
                  onChange={(e) => setSpecializationFilter(e.target.value)}
                  className="w-full glass-input px-3 py-2.5 rounded-xl bg-white font-bold"
                >
                  <option value="">All Specializations</option>
                  <option value="Criminal Law">Criminal Law</option>
                  <option value="Civil Litigation">Civil Litigation</option>
                  <option value="Corporate Law & Tax">Corporate Law & Tax</option>
                  <option value="Family Law">Family Law</option>
                  <option value="Constitutional Writs">Constitutional Writs</option>
                </select>
              </div>

              <button 
                type="submit"
                className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs transition"
              >
                Apply Directory Filters
              </button>
            </form>
          </div>

          {/* Advocate-only Profile Management Box */}
          {user?.role === 'ADVOCATE' && (
            <div className="p-6 rounded-3xl bg-amber-50/70 border border-amber-200 shadow-sm space-y-4">
              <div className="space-y-1">
                <h3 className="text-sm font-extrabold text-amber-900 flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-amber-700" />
                  My Professional Profile
                </h3>
                <p className="text-[10px] text-slate-500">
                  Update your directory details so citizens and clients can locate your office.
                </p>
              </div>

              {statusMsg && (
                <div className={`p-3 rounded-xl border text-[11px] font-bold ${
                  statusMsg.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
                }`}>
                  {statusMsg.text}
                </div>
              )}

              <form onSubmit={handleUpsertProfile} className="space-y-3.5 text-xs font-semibold">
                <div className="space-y-1">
                  <label className="text-slate-700">Practice Area</label>
                  <select 
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    className="w-full glass-input px-3 py-2 rounded-xl bg-white font-bold"
                  >
                    <option>Criminal Law</option>
                    <option>Civil Litigation</option>
                    <option>Corporate Law & Tax</option>
                    <option>Family Law</option>
                    <option>Constitutional Writs</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700">Office City & State</label>
                  <input 
                    type="text"
                    value={officeLocation}
                    onChange={(e) => setOfficeLocation(e.target.value)}
                    placeholder="e.g. Mumbai, Maharashtra"
                    className="w-full glass-input px-3 py-2 rounded-xl"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700">Years of Practice</label>
                  <input 
                    type="number"
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(e.target.value)}
                    placeholder="e.g. 8"
                    className="w-full glass-input px-3 py-2 rounded-xl"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700">Practice Phone Number</label>
                  <input 
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full glass-input px-3 py-2 rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700">Brief Practice Bio</label>
                  <textarea 
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Focus areas, past achievements..."
                    className="w-full glass-input px-3 py-2 rounded-xl h-20 resize-none"
                  />
                </div>

                <button 
                  type="submit"
                  disabled={savingProfile}
                  className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs transition"
                >
                  {savingProfile ? 'Updating Directory...' : 'List / Update Profile'}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Right Hand Advocates List Column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-slate-900">
              Directory Directory Results ({advocates.length})
            </h2>
            <span className="text-[10px] text-slate-500 font-medium">Auto-updates dynamically</span>
          </div>

          {loadingList ? (
            <div className="p-8 rounded-3xl bg-white border border-slate-200 text-center font-bold text-slate-500">
              Loading Verified Advocates...
            </div>
          ) : advocates.length === 0 ? (
            <div className="p-8 rounded-3xl bg-white border border-slate-200 text-center space-y-2">
              <Gavel className="h-8 w-8 text-slate-300 mx-auto" />
              <p className="text-xs font-bold text-slate-500">No advocates match your filter criteria.</p>
              <p className="text-[10px] text-slate-400">Try adjusting name, location, or specialization filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {advocates.map((adv) => (
                <div key={adv.id} className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-indigo-400 hover:shadow-md transition space-y-4 flex flex-col justify-between">
                  <div className="space-y-2.5">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-extrabold text-slate-900 flex items-center gap-1">
                          {adv.full_name}
                          <ShieldCheck className="h-4 w-4 text-emerald-600 fill-emerald-100" />
                        </h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 border border-indigo-200 text-indigo-700 inline-block mt-0.5">
                          {adv.specialization}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-500 font-bold block">EXPERIENCE</span>
                        <p className="text-xs font-extrabold text-slate-900">{adv.experience_years} Years</p>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-600 leading-relaxed font-medium line-clamp-3">
                      {adv.bio || "No biography provided. Contact directly for legal consultation."}
                    </p>
                  </div>

                  <div className="space-y-2 pt-3 border-t border-slate-100 text-[11px] font-medium text-slate-700">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span>{adv.office_location}</span>
                    </div>
                    {adv.contact_phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span>{adv.contact_phone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span>{adv.email}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
