from __future__ import annotations

from typing import Callable, Union

from .....types import Env, Uri, WrapManifest, Wrapper

CreateWrapperFunc = Callable[[Uri, WrapManifest, str, Union[Env, None]], Wrapper]
