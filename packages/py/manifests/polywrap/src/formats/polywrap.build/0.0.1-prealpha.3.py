# This file was automatically generated. DO NOT MODIFY IT BY HAND. Instead, modify the source JSON Schema file and run 
# the `generate_manifest_types.py` script to regenerate this file.
from typing import Any, List, Union

from statham.schema.constants import Maybe
from statham.schema.elements import AnyOf, Array, Boolean, Object, String
from statham.schema.property import Property


class Buildx(Object, additionalProperties=False):

    cache: Maybe[Union[str, bool]] = Property(AnyOf(String(format='directory'), Boolean()))

    output: Maybe[Union[str, bool]] = Property(AnyOf(String(format='buildxOutput'), Boolean()))

    removeBuilder: Maybe[bool] = Property(Boolean())


class Docker(Object, additionalProperties=False):

    name: Maybe[str] = Property(String(format='dockerImageName'))

    dockerfile: Maybe[str] = Property(String(format='dockerfileName'))

    buildImageId: Maybe[str] = Property(String(format='dockerImageId'))

    buildx: Maybe[Union[Buildx, bool]] = Property(AnyOf(Buildx, Boolean()))

    removeImage: Maybe[bool] = Property(Boolean())


class Config(Object):

    pass


class LinkedPackagesItem(Object, additionalProperties=False):

    name: str = Property(String(), required=True)

    path: str = Property(String(), required=True)

    filter: Maybe[str] = Property(String(format='regexString'))


class BuildManifest(Object, additionalProperties=False):

    format: str = Property(String(const='0.0.1-prealpha.3'), required=True)

    docker: Maybe[Docker] = Property(Docker)

    config: Maybe[Config] = Property(Config)

    linked_packages: Maybe[List[LinkedPackagesItem]] = Property(Array(LinkedPackagesItem))

    __type: str = Property(String(const='BuildManifest'), required=True)
