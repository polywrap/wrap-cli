from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from enum import Enum
from typing import TYPE_CHECKING, Any, Dict, List, Optional

from .invoke import InvokeResult
from .uri import Uri

if TYPE_CHECKING:
    from .client import ClientConfig


@dataclass(slots=True, kw_only=True)
class Step:
    uri: Uri
    method: str
    args: Dict[str, Any] = field(default_factory=dict)
    config: Optional["ClientConfig"] = None


Job = Dict[str, "JobInfo"]


@dataclass(slots=True, kw_only=True)
class JobInfo:
    steps: List[Step]
    jobs: List[Job]


@dataclass(slots=True, kw_only=True)
class Workflow:
    name: str
    jobs: Job


class JobStatus(Enum):
    SUCCEED = "SUCCEED"
    FAILED = "FAILED"
    SKIPPED = "SKIPPED"


@dataclass(slots=True, kw_only=True)
class JobResult(InvokeResult):
    status: JobStatus


@dataclass(slots=True, kw_only=True)
class RunOptions:
    workflow: Workflow
    config: Optional["ClientConfig"] = None
    context_id: Optional[str] = None
    ids: Optional[List[str]] = field(default_factory=list)


class WorkflowHandler(ABC):
    @abstractmethod
    async def run(self, options: RunOptions) -> None:
        pass
