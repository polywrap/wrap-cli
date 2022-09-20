# This file was automatically generated. DO NOT MODIFY IT BY HAND. Instead, modify `validate.py.mustache` and run the
# `generate_manifest_types.py` script to regenerate this file.
from . import (
    AnyBuildManifest,
    BuildManifestFormats
)
from ... import validators
from typing import Callable, Dict, Optional
import fastjsonschema
import json

with open('manifest-schemas/formats/polywrap.build/0.0.1-prealpha.1.json') as json_file:
    schema_0_0_1_prealpha_1: Dict = json.load(json_file)
with open('manifest-schemas/formats/polywrap.build/0.0.1-prealpha.2.json') as json_file:
    schema_0_0_1_prealpha_2: Dict = json.load(json_file)
with open('manifest-schemas/formats/polywrap.build/0.0.1-prealpha.3.json') as json_file:
    schema_0_0_1_prealpha_3: Dict = json.load(json_file)

schemas: Dict[BuildManifestFormats: Dict] = {
    BuildManifestFormats('0.0.1-prealpha.1'): schema_0_0_1_prealpha_1,
    BuildManifestFormats('0.0.1-prealpha.2'): schema_0_0_1_prealpha_2,
    BuildManifestFormats('0.0.1-prealpha.3'): schema_0_0_1_prealpha_3,
}

formats_dict: Dict[str: Callable] = {
    'directory': validators.directory(),
    'buildx_output': validators.buildx_output(),
    'docker_image_name': validators.docker_image_name(),
    'docker_image_id': validators.docker_image_id(),
    'dockerfile_name': validators.dockerfile_name(),
    'regex_string': validators.regex_string(),
}

def validateBuildManifest(manifest: AnyBuildManifest, ext_schema: Optional[Dict] = None) -> None:
    if manifest.format not in schemas:
        raise KeyError(f'Unrecognized BuildManifest schema format "{manifest.format}"\nmanifest: {json.loads(manifest)}')

    try:
        fastjsonschema.validate(schemas[manifest.format], manifest, formats=formats_dict)
        if ext_schema:
            fastjsonschema.validate(ext_schema, manifest, formats=formats_dict)
    except fastjsonschema.JsonSchemaException as jse:
        raise ValueError(f'Validation errors encountered while sanitizing BuildManifest format "{manifest.format}"') from jse

