import re
from typing import Any, Final, Literal, Pattern, TypeGuard, Union

DIRECTORY_PATTERN: Final[Pattern] = re.compile(r'^/?[\w\-/]+$')
IMAGE_PATTERN: Final[Pattern] = re.compile(r'(\.svg|\.png)$')
PATH_PATTERN: Final[Pattern] = re.compile(r'^((\./|../)[^/ ]*)+/?$', re.M)
URL_PATTERN: Final[Pattern] = re.compile(
    r'^(https?://)?((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(:\d+)?(/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(#[-a-z\d_]*)?$',
    re.I,
)


def file(path: Any) -> TypeGuard[str]:
    if not isinstance(path, str):
        return False

    result = re.search(PATH_PATTERN, path, re.M)
    return result is not None and result.group() == path


def package_name(name: Any) -> TypeGuard[str]:
    return isinstance(name, str)


def package_tag(tag: Any) -> TypeGuard[str]:
    return isinstance(tag, str)


def docker_image_name(name: Any) -> TypeGuard[str]:
    return isinstance(name, str)


def dockerfile_name(value: Any) -> TypeGuard[str]:
    return isinstance(value, str) and file(value) and 'Dockerfile' in value


def docker_image_id(value: Any) -> TypeGuard[str]:
    return isinstance(value, str) and 'sha256:' in value


def wasm_language(language: Any) -> TypeGuard[Union[Literal['interface'], str]]:
    return isinstance(language, str) and (language == 'interface' or 'wasm/' in language)


def plugin_language(language: Any) -> TypeGuard[str]:
    return isinstance(language, str) and 'plugin/' in language


def app_language(language: Any) -> TypeGuard[str]:
    return isinstance(language, str) and 'app/' in language


def image_file(file_path: Any) -> TypeGuard[str]:
    return file(file_path) and re.search(IMAGE_PATTERN, file_path) is not None


def website_url(url: Any) -> TypeGuard[str]:
    return isinstance(url, str) and re.fullmatch(URL_PATTERN, url, re.I) is not None


def graphql_file(file_path: Any) -> TypeGuard[str]:
    return file(file_path) and file_path.endswith('.graphql')


def json_file(file_path: Any) -> TypeGuard[str]:
    return file(file_path) and file_path.endswith('.json')


def yaml_file(file_path: Any) -> TypeGuard[str]:
    return file(file_path) and file_path.endswith('.yaml')


def manifest_file(filePath: Any) -> TypeGuard[str]:
    return json_file(filePath) or yaml_file(filePath)


def regex_string(regex: Any) -> TypeGuard[str]:
    try:
        re.compile(regex)
        return True
    except:
        return False


def web3_api_uri(uri: Any) -> TypeGuard[Uri]:
    return isinstance(uri, str) and Uri.is_valid_uri(uri)


def schema_file(file_path: Any) -> TypeGuard[str]:
    return file(file_path)


def directory(path: Any) -> TypeGuard[Union[bool, str]]:
    return isinstance(path, bool) or (isinstance(path, str) and re.fullmatch(DIRECTORY_PATTERN, path) is not None)


def buildx_output(output: Any) -> TypeGuard[Union[bool, str]]:
    return isinstance(output, bool) or (isinstance(output, str) and output in {'docker', 'registry'})
