# This file was automatically generated. DO NOT MODIFY IT BY HAND. Instead, modify the source JSON Schema file and run 
# the `generate_manifest_types.py` script to regenerate this file.
from typing import List

from statham.schema.constants import Maybe
from statham.schema.elements import Array, Object, String
from statham.schema.property import Property


class LinksItem(Object, additionalProperties=False):

    name: str = Property(String(), required=True)

    icon: Maybe[str] = Property(String(format='imageFile'))

    url: str = Property(String(format='websiteUrl'), required=True)


class QueriesItem(Object, additionalProperties=False):

    name: str = Property(String(), required=True)

    description: Maybe[str] = Property(String())

    query: str = Property(String(format='graphqlFile'), required=True)

    vars: Maybe[str] = Property(String(format='jsonFile'))


class MetaManifest(Object, additionalProperties=False):

    format: str = Property(String(const='0.0.1-prealpha.3'), required=True)

    displayName: Maybe[str] = Property(String())

    subtext: Maybe[str] = Property(String())

    description: Maybe[str] = Property(String())

    repository: Maybe[str] = Property(String(format='websiteUrl'))

    tags: Maybe[List[str]] = Property(Array(String(format='packageTag')))

    icon: Maybe[str] = Property(String(format='imageFile'))

    links: Maybe[List[LinksItem]] = Property(Array(LinksItem))

    queries: Maybe[List[QueriesItem]] = Property(Array(QueriesItem))

    __type: str = Property(String(const='MetaManifest'), required=True)
