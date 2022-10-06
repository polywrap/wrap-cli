from typing import Any

from ..types import Wrapper


async def init_wrapper(packageOrWrapper: Any) -> Wrapper:
    if hasattr(packageOrWrapper, "create_wrapper"):
        return await packageOrWrapper.createWrapper()
    return packageOrWrapper
