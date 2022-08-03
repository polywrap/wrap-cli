# This file was automatically generated. DO NOT MODIFY IT BY HAND. Instead, modify `validate.py.mustache` and run the
# `generate_manifest_types.py` script to regenerate this file.
from . import (
    AnyDeployManifest,
    DeployManifestFormats
)
from ... import validators
from typing import Callable, Dict, Optional
import fastjsonschema
import json

with open('manifest-schemas/formats/polywrap.deploy/0.0.1-prealpha.1.json') as json_file:
    schema_0_0_1_prealpha_1: Dict = json.load(json_file)

schemas: Dict[DeployManifestFormats: Dict] = {
    DeployManifestFormats('0.0.1-prealpha.1'): schema_0_0_1_prealpha_1,
}

formats_dict: Dict[str: Callable] = {
    'polywrap_uri': validators.polywrap_uri(),
}

def validateDeployManifest(manifest: AnyDeployManifest, ext_schema: Optional[Dict] = None) -> None:
    if manifest.format not in schemas:
        raise KeyError(f'Unrecognized DeployManifest schema format "{manifest.format}"\nmanifest: {json.loads(manifest)}')

    try:
        fastjsonschema.validate(schemas[manifest.format], manifest, formats=formats_dict)
        if ext_schema:
            fastjsonschema.validate(ext_schema, manifest, formats=formats_dict)
    except fastjsonschema.JsonSchemaException as jse:
        raise ValueError(f'Validation errors encountered while sanitizing DeployManifest format "{manifest.format}"') from jse

