import hashlib
import json
from typing import Any, Callable, Dict, Optional
from cachetools import TTLCache

from app.core.config import settings
from app.core.logging import logger

# In-memory cache for analytical summary tables (Max 200 query variants, 1-hour default TTL)
_summary_cache: TTLCache = TTLCache(maxsize=200, ttl=settings.CACHE_TTL_SECONDS)


def make_cache_key(prefix: str, params: Optional[Dict[str, Any]] = None) -> str:
    """Generates a deterministic cache key from query parameters."""
    if not params:
        return f"{prefix}:default"
    # Sort keys for consistent hashing
    serialized = json.dumps(params, sort_keys=True, default=str)
    hashed = hashlib.md5(serialized.encode("utf-8")).hexdigest()
    return f"{prefix}:{hashed}"


def get_cached_result(key: str) -> Optional[Any]:
    """Retrieves a cached analytical query result if present and fresh."""
    return _summary_cache.get(key)


def set_cached_result(key: str, value: Any) -> None:
    """Stores an analytical query result in the TTL cache."""
    _summary_cache[key] = value


def clear_cache() -> None:
    """Clears all in-memory query caches."""
    _summary_cache.clear()
    logger.info("Summary query cache cleared.")
