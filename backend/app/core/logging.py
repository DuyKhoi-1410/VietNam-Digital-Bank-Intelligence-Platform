import logging
import re
import sys
from typing import Any, Dict


# Patterns to redact from logs
SENSITIVE_PATTERNS = [
    re.compile(r"-----BEGIN [A-Z ]+ PRIVATE KEY-----.*?-----END [A-Z ]+ PRIVATE KEY-----", re.DOTALL),
    re.compile(r'"private_key":\s*"[^"]+"'),
    re.compile(r'"client_secret":\s*"[^"]+"'),
    re.compile(r'"token":\s*"[^"]+"'),
    re.compile(r"Bearer\s+[A-Za-z0-9\-\._~\+\/]+=*", re.IGNORECASE),
]


class SanitizedFormatter(logging.Formatter):
    """
    Log formatter that strips credentials and prevents leakage of private keys
    or sensitive authentication tokens.
    """
    def format(self, record: logging.LogRecord) -> str:
        original = super().format(record)
        sanitized = original
        for pattern in SENSITIVE_PATTERNS:
            sanitized = pattern.sub("[REDACTED_SECRET]", sanitized)
        return sanitized


def setup_logging(debug: bool = False) -> logging.Logger:
    """Configures application-wide structured logging."""
    log_level = logging.DEBUG if debug else logging.INFO
    logger = logging.getLogger("vdbi")
    logger.setLevel(log_level)

    # Avoid duplicate handlers if re-initialized
    if not logger.handlers:
        handler = logging.StreamHandler(sys.stdout)
        handler.setLevel(log_level)
        formatter = SanitizedFormatter(
            fmt="%(asctime)s | %(levelname)-7s | [%(name)s:%(module)s:%(lineno)d] | %(message)s",
            datefmt="%Y-%m-%d %H:%M:%S"
        )
        handler.setFormatter(formatter)
        logger.addHandler(handler)

    # Suppress verbose Google API and HTTP client debug logs
    logging.getLogger("google.auth").setLevel(logging.WARNING)
    logging.getLogger("google.cloud").setLevel(logging.INFO)
    logging.getLogger("urllib3").setLevel(logging.WARNING)
    logging.getLogger("uvicorn.access").setLevel(logging.INFO)

    return logger


logger = setup_logging()
