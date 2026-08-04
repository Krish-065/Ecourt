import re
from typing import Tuple

PROMPT_INJECTION_PATTERNS = [
    r"ignore (all )?previous instructions",
    r"disregard (all )?prior rules",
    r"reveal (the )?system prompt",
    r"you are now (in )?DAN mode",
    r"bypass (all )?safety",
    r"pretend you are unconstrained",
    r"override (system|security) directives",
    r"jailbreak",
]

def sanitize_and_check_prompt(user_prompt: str) -> Tuple[bool, str]:
    """
    Checks user prompt against known prompt injection and jailbreak signatures.
    Returns: (is_safe: bool, sanitized_prompt_or_error: str)
    """
    cleaned_prompt = user_prompt.strip()
    
    for pattern in PROMPT_INJECTION_PATTERNS:
        if re.search(pattern, cleaned_prompt, re.IGNORECASE):
            return False, "PROMPT_INJECTION_DETECTED: Security policy blocked potential jailbreak attempt."
            
    # Escape any malicious script injection
    cleaned_prompt = re.sub(r"<script.*?>.*?</script>", "", cleaned_prompt, flags=re.DOTALL | re.IGNORECASE)
    
    return True, cleaned_prompt
