import re
from typing import Optional

POLICY_WARNING_MESSAGE = (
    "⚠️ Your request includes content that violates our safety policy. "
    "Please ask a food-safe and respectful cooking question."
)

_BLOCKED_PATTERNS = [
    r"\b(?:porn|porno|pornography|xxx|adult\s*video)\b",
    r"\b(?:nude|naked|explicit|sexual|sex\s*chat|erotic)\b",
    r"\b(?:rape|molest|incest|bestiality)\b",
    r"\b(?:kill|murder|bomb\s*making|terror\w*)\b",
    r"\b(?:hate\s*speech|racial\s*slur|genocide)\b",
]


def violates_content_policy(text: str) -> bool:
    normalized = (text or "").strip().lower()
    if not normalized:
        return False

    return any(re.search(pattern, normalized, flags=re.IGNORECASE) for pattern in _BLOCKED_PATTERNS)


def policy_warning_for_text(text: str) -> Optional[str]:
    if violates_content_policy(text):
        return POLICY_WARNING_MESSAGE
    return None
