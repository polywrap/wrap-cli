# This file was automatically generated. DO NOT MODIFY IT BY HAND. Instead, modify the source JSON Schema file and run 
# the `generate_manifest_types.py` script to regenerate this file.
from typing import List

from statham.schema.constants import Maybe
from statham.schema.elements import Array, Object, String
from statham.schema.property import Property


class Schema(Object, additionalProperties=False):

    file: str = Property(String(format='file'), required=True)


class Module(Object, additionalProperties=False):

    language: str = Property(String(), required=True)

    file: str = Property(String(format='file'), required=True)


class Mutation(Object, additionalProperties=False):

    schema: Schema = Property(Schema, required=True)

    module: Module = Property(Module, required=True)


class Query(Object, additionalProperties=False):

    schema: Schema = Property(Schema, required=True)

    module: Module = Property(Module, required=True)


class ImportRedirectsItem(Object, additionalProperties=False):

    uri: str = Property(String(), required=True)

    schema: str = Property(String(), required=True)


class PolywrapManifest(Object, additionalProperties=False):

    format: str = Property(String(const='0.0.1-prealpha.1'), required=True)

    description: Maybe[str] = Property(String())

    repository: Maybe[str] = Property(String())

    mutation: Maybe[Mutation] = Property(Mutation)

    query: Maybe[Query] = Property(Query)

    import_redirects: Maybe[List[ImportRedirectsItem]] = Property(Array(ImportRedirectsItem))

    __type: str = Property(String(const='PolywrapManifest'), required=True)
