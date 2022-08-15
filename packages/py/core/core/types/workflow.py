from abc import ABC
from dataclasses import dataclass, field
from enum import Enum
from typing import Any, Awaitable, Dict, List, Optional

from . import ClientConfig, InvokeResult, Uri


@dataclass(slots=True, kw_only=True)
class Step:
    uri: Uri
    method: str
    args: Dict[str, Any] = field(default_factory=dict)
    config: Optional[ClientConfig] = None


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
    config: Optional[ClientConfig] = None
    context_id: Optional[str] = None
    ids: Optional[List[str]] = field(default_factory=list)


class WorkflowHandler(ABC):
    async def run(options: RunOptions) -> Awaitable[None]:
        pass
