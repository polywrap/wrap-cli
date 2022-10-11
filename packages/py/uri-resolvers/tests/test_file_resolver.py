import pytest

from pathlib import Path

from polywrap_core import IFileReader, IUriResolver, Uri, UriPackage
from uri_resolvers import FsUriResolver, SimpleFileReader

@pytest.fixture
def file_reader():
    return SimpleFileReader()

@pytest.fixture
def fs_resolver(file_reader: IFileReader):
    return FsUriResolver(file_reader=file_reader)


@pytest.mark.asyncio
async def test_file_resolver(fs_resolver: IUriResolver):
    path = Path(__file__).parent.parent.joinpath("README.md")
    uri = Uri(f"wrap://fs/{path}")

    result = await fs_resolver.try_resolve_uri(uri, None, None) # type: ignore

    assert result.is_ok
    assert isinstance(result.unwrap(), UriPackage)