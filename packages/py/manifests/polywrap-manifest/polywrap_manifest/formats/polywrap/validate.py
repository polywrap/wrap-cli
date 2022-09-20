# This file was automatically generated. DO NOT MODIFY IT BY HAND. Instead, modify `validate.py.mustache` and run the
# `generate_manifest_types.py` script to regenerate this file.
from . import (
    AnyPolywrapManifest,
    PolywrapManifestFormats
)
from ... import validators
from typing import Callable, Dict, Optional
import fastjsonschema
import json

with open('manifest-schemas/formats/polywrap/0.0.1-prealpha.1.json') as json_file:
    schema_0_0_1_prealpha_1: Dict = json.load(json_file)
with open('manifest-schemas/formats/polywrap/0.0.1-prealpha.2.json') as json_file:
    schema_0_0_1_prealpha_2: Dict = json.load(json_file)
with open('manifest-schemas/formats/polywrap/0.0.1-prealpha.3.json') as json_file:
    schema_0_0_1_prealpha_3: Dict = json.load(json_file)
with open('manifest-schemas/formats/polywrap/0.0.1-prealpha.4.json') as json_file:
    schema_0_0_1_prealpha_4: Dict = json.load(json_file)
with open('manifest-schemas/formats/polywrap/0.0.1-prealpha.5.json') as json_file:
    schema_0_0_1_prealpha_5: Dict = json.load(json_file)
with open('manifest-schemas/formats/polywrap/0.0.1-prealpha.6.json') as json_file:
    schema_0_0_1_prealpha_6: Dict = json.load(json_file)
with open('manifest-schemas/formats/polywrap/0.0.1-prealpha.7.json') as json_file:
    schema_0_0_1_prealpha_7: Dict = json.load(json_file)
with open('manifest-schemas/formats/polywrap/0.0.1-prealpha.8.json') as json_file:
    schema_0_0_1_prealpha_8: Dict = json.load(json_file)
with open('manifest-schemas/formats/polywrap/0.0.1-prealpha.9.json') as json_file:
    schema_0_0_1_prealpha_9: Dict = json.load(json_file)

schemas: Dict[PolywrapManifestFormats: Dict] = {
    PolywrapManifestFormats('0.0.1-prealpha.1'): schema_0_0_1_prealpha_1,
    PolywrapManifestFormats('0.0.1-prealpha.2'): schema_0_0_1_prealpha_2,
    PolywrapManifestFormats('0.0.1-prealpha.3'): schema_0_0_1_prealpha_3,
    PolywrapManifestFormats('0.0.1-prealpha.4'): schema_0_0_1_prealpha_4,
    PolywrapManifestFormats('0.0.1-prealpha.5'): schema_0_0_1_prealpha_5,
    PolywrapManifestFormats('0.0.1-prealpha.6'): schema_0_0_1_prealpha_6,
    PolywrapManifestFormats('0.0.1-prealpha.7'): schema_0_0_1_prealpha_7,
    PolywrapManifestFormats('0.0.1-prealpha.8'): schema_0_0_1_prealpha_8,
    PolywrapManifestFormats('0.0.1-prealpha.9'): schema_0_0_1_prealpha_9,
}

formats_dict: Dict[str: Callable] = {
    'graphql_file': validators.graphql_file(),
    'yaml_file': validators.yaml_file(),
    'manifest_file': validators.manifest_file(),
    'package_name': validators.package_name(),
    'file': validators.file(),
    'wasm_language': validators.wasm_language(),
}

def validatePolywrapManifest(manifest: AnyPolywrapManifest, ext_schema: Optional[Dict] = None) -> None:
    if manifest.format not in schemas:
        raise KeyError(f'Unrecognized PolywrapManifest schema format "{manifest.format}"\nmanifest: {json.loads(manifest)}')

    try:
        fastjsonschema.validate(schemas[manifest.format], manifest, formats=formats_dict)
        if ext_schema:
            fastjsonschema.validate(ext_schema, manifest, formats=formats_dict)
    except fastjsonschema.JsonSchemaException as jse:
        raise ValueError(f'Validation errors encountered while sanitizing PolywrapManifest format "{manifest.format}"') from jse

