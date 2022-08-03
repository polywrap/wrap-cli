# This file was automatically generated. DO NOT MODIFY IT BY HAND. Instead, modify the source JSON Schema file and run 
# the `generate_manifest_types.py` script to regenerate this file.
from typing import Any

from statham.schema.constants import Maybe
from statham.schema.elements import Element, Object, String
from statham.schema.property import Property


class Config(Object):

    pass


class (Object, additionalProperties=False):

    package: str = Property(String(), required=True)

    config: Maybe[Config] = Property(Config)

    depends_on: Maybe[str] = Property(String())

    uri: Maybe[str] = Property(String(format='polywrapUri'))


class DeployManifest(Object, additionalProperties=False):

    format: str = Property(String(const='0.0.1-prealpha.1'), required=True)

    stages: Any = Property(Element(patternProperties={'^.*$': }), required=True)

    __type: str = Property(String(const='DeployManifest'), required=True)
