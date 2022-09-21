import os
import sys
from pathlib import Path
from typing import Final
from datamodel_code_generator import InputFileType, generate
from json_ref_dict import RefDict
# from packaging import version
# import chevron

AUTO_GENERATION_WARNING = """\
# This file was automatically generated. DO NOT MODIFY IT BY HAND. Instead, modify the source JSON Schema file and run 
# the `generate_manifest_types.py` script to regenerate this file.
"""
INPUT_PATH: Final[Path] = Path('../../../manifests/polywrap/formats/')
OUTPUT_PATH: Final[Path] = Path('./polywrap_manifest/formats')


def generate_types():
    os.walk(INPUT_PATH)
    for directory_path, _, file_names in os.walk(INPUT_PATH):
        schema_type = Path(directory_path).parts[-1]
        if schema_type == 'formats':
            continue

        format_modules = []
        schemata = dict()
        for file in file_names:
            schema_version = file.split('.json')[0]
            try:
                ref = str(RefDict.from_uri(Path(directory_path).joinpath(file).absolute().as_uri()))
                print("generating version ", schema_version)
                print("generating ref ", ref)

                out = OUTPUT_PATH.joinpath(schema_type)
                os.makedirs(out, exist_ok=True)

                generate(
                    ref,
                    input_file_type=InputFileType.JsonSchema,
                    input_filename=file,
                    output=out.joinpath(f'{schema_version}.py')
                )

                # schema = materialize(
                #     RefDict.from_uri(Path(directory_path).joinpath(file).absolute().as_uri()),
                #     context_labeller=title_labeller(),
                # )
                # schema['properties']['__type'] = {'type': 'string', 'const': schema['id']}
                # schema['required'].append('__type')
                # schema['title'] = schema['id']
                #
                # schemata[f'{schema_type}@{schema_version}'] = model_factory(schema)
                # print(schemata[f'{schema_type}@{schema_version}'].__init__)
                # with open(out.joinpath(f'{schema_version}.py'), 'w') as out:
                #     out.write(AUTO_GENERATION_WARNING)
                #     out.write(schemata[f'{schema_type}@{schema_version}'])
                #     out.flush()
            #
            #         formatModules.append({'interface': schema['id'], 'version': schemaVersion})
            except Exception as e:
                print(f'error generating the manifest file {file}: ', e, file=sys.stderr)
                raise e

        # def render_template(name: str, ctx: Dict[str, Any]):
        #     with open(f'./{name}.py.mustache', 'r') as template, open(
        #         OUTPUT_PATH.joinpath(schemaType, f'{name}.py'), 'w'
        #     ) as out:
        #         out.write(chevron.render(template, ctx))
        #         out.flush()
        #
        # index_formats = sorted(
        #     [
        #         {
        #             'type': module['interface'],
        #             'version': module['version'],
        #             'version_identifier': re.sub(r'[.\-]', '_', module['version']),
        #         }
        #         for module in formatModules
        #     ],
        #     key=lambda i: version.parse(i['version']),
        # )
        # render_template(
        #     '__init__',
        #     {
        #         'formats': index_formats,
        #         'latest': index_formats[-1],
        #     },
        # )
        # render_template('migrate', {'latest': index_formats[-1], 'prev_formats': index_formats[:-1]})
        # render_template('deserialize', {'type': index_formats[-1]['type']})
        # render_template(
        #     'validate',
        #     {
        #         'formats': [module | {'dir': schemaType} for module in index_formats],
        #         'latest': index_formats[-1] | {'dir': schemaType},
        #         'validators': list(set(
        #             [
        #                 re.sub('([A-Z]+)', r'_\1', child.format).lower()
        #                 for schema in schemata.values()
        #                 for elem in schema
        #                 for child in get_children(elem)
        #                 if isinstance(child, String) and isinstance(child.format, str) and len(child.format.strip()) > 0
        #             ]
        #         )),
        #     },
        # )
