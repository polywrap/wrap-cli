# This file was automatically generated. DO NOT MODIFY IT BY HAND. Instead, modify the source JSON Schema file and run 
# the `generate_manifest_types.py` script to regenerate this file.
from typing import Any

from statham.schema.constants import Maybe
from statham.schema.elements import (
    AnyOf,
    Element,
    Number,
    Object,
    OneOf,
    String,
)
from statham.schema.property import Property


class RemoteModule(Object, additionalProperties=False):

    package: str = Property(String(), required=True)

    registry: str = Property(String(), required=True)

    version: str = Property(String(), required=True)

    dockerComposePath: Maybe[str] = Property(String())


class LocalModule(Object, additionalProperties=False):

    path: str = Property(String(), required=True)


class InfraManifest(Object, additionalProperties=False):

    format: str = Property(String(const='0.0.1-prealpha.2'), required=True)

    dockerCompose: Maybe[str] = Property(String())

    env: Maybe[Any] = Property(Element(patternProperties={'^.*$': AnyOf(String(), Number())}, additionalProperties=False))

    modules: Any = Property(Element(patternProperties={'^.*$': OneOf(RemoteModule, LocalModule, String(const='default'))}), required=True)

    __type: str = Property(String(const='InfraManifest'), required=True)
