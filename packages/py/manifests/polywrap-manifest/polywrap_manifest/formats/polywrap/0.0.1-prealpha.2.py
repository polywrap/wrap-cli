# This file was automatically generated. DO NOT MODIFY IT BY HAND. Instead, modify the source JSON Schema file and run 
# the `generate_manifest_types.py` script to regenerate this file.
from typing import List

from statham.schema.constants import Maybe
from statham.schema.elements import Array, Object, String
from statham.schema.property import Property


class Mutation(Object, additionalProperties=False):

    schema: str = Property(String(format='file'), required=True)

    module: str = Property(String(format='file'), required=True)


class Query(Object, additionalProperties=False):

    schema: str = Property(String(format='file'), required=True)

    module: str = Property(String(format='file'), required=True)


class Modules(Object, additionalProperties=False):

    mutation: Maybe[Mutation] = Property(Mutation)

    query: Maybe[Query] = Property(Query)


class ImportRedirectsItem(Object, additionalProperties=False):

    uri: str = Property(String(), required=True)

    schema: str = Property(String(), required=True)


class PolywrapManifest(Object, additionalProperties=False):

    format: str = Property(String(const='0.0.1-prealpha.2'), required=True)

    repository: Maybe[str] = Property(String())

    build: Maybe[str] = Property(String(format='file'))

    language: str = Property(String(format='wasmLanguage'), required=True)

    modules: Modules = Property(Modules, required=True)

    import_redirects: Maybe[List[ImportRedirectsItem]] = Property(Array(ImportRedirectsItem))

    __type: str = Property(String(const='PolywrapManifest'), required=True)
