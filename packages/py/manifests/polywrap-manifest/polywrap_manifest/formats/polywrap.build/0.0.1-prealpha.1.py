# This file was automatically generated. DO NOT MODIFY IT BY HAND. Instead, modify the source JSON Schema file and run 
# the `generate_manifest_types.py` script to regenerate this file.
from statham.schema.constants import Maybe
from statham.schema.elements import Object, String
from statham.schema.property import Property


class Docker(Object, additionalProperties=False):

    name: Maybe[str] = Property(String(format='dockerImageName'))

    dockerfile: Maybe[str] = Property(String(format='dockerfileName'))

    buildImageId: Maybe[str] = Property(String(format='dockerImageId'))


class Config(Object):

    pass


class BuildManifest(Object, additionalProperties=False):

    format: str = Property(String(const='0.0.1-prealpha.1'), required=True)

    docker: Maybe[Docker] = Property(Docker)

    config: Maybe[Config] = Property(Config)

    __type: str = Property(String(const='BuildManifest'), required=True)
