# This file was automatically generated. DO NOT MODIFY IT BY HAND. Instead, modify the source JSON Schema file and run 
# the `generate_manifest_types.py` script to regenerate this file.
from typing import List

from statham.schema.constants import Maybe
from statham.schema.elements import Array, Object, String
from statham.schema.property import Property


class ImportRedirectsItem(Object, additionalProperties=False):

    uri: str = Property(String(), required=True)

    schema: str = Property(String(), required=True)


class PolywrapManifest(Object, additionalProperties=False):

    format: str = Property(String(const='0.0.1-prealpha.9'), required=True)

    name: str = Property(String(format='packageName'), required=True)

    build: Maybe[str] = Property(String(format='manifestFile'))

    meta: Maybe[str] = Property(String(format='manifestFile'))

    deploy: Maybe[str] = Property(String(format='manifestFile'))

    language: str = Property(String(format='wasmLanguage'), required=True)

    module: Maybe[str] = Property(String(format='file'))

    schema: str = Property(String(format='graphqlFile'), required=True)

    import_redirects: Maybe[List[ImportRedirectsItem]] = Property(Array(ImportRedirectsItem))

    __type: str = Property(String(const='PolywrapManifest'), required=True)
