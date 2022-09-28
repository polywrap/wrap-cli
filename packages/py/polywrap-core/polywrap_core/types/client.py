from __future__ import annotations

from dataclasses import dataclass, field
from typing import TYPE_CHECKING, List

from .env import Env

if TYPE_CHECKING:
    from ..uri_resolution.abc import IUriResolver


@dataclass(slots=True, kw_only=True)
class ClientConfig:
    resolver: List["IUriResolver"]
    envs: List[Env] = field(default_factory=list)


@dataclass(slots=True, kw_only=True)
class GetEnvsOptions:
    pass


@dataclass(slots=True, kw_only=True)
class GetUriResolversOptions:
    pass
