from __future__ import annotations

from dataclasses import dataclass

from . import Uri


@dataclass(slots=True, kw_only=True)
class UriRedirect:
    from_uri: Uri
    to_uri: Uri
