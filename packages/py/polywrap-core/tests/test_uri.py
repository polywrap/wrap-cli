import pytest

from polywrap_core.types.uri import Uri, UriConfig


def test_inserts_wrap_scheme_if_not_present():
    uri = Uri("/authority-v2/path.to.thing.root/sub/path")
    assert uri.uri == "wrap://authority-v2/path.to.thing.root/sub/path"
    assert uri.authority == "authority-v2"
    assert uri.path == "path.to.thing.root/sub/path"


def test_fail_non_uri_input():
    assert not Uri.is_uri("not a Uri object")


def test_fail_no_authority():
    expected = "URI is malformed"
    with pytest.raises(ValueError, match=expected):
        Uri("wrap://path")


def test_fail_no_path():
    expected = "URI is malformed"
    with pytest.raises(ValueError, match=expected):
        Uri("wrap://authority/")


def test_fail_no_scheme():
    expected = "The wrap:// scheme must be at the beginning of the URI string"
    with pytest.raises(ValueError, match=expected):
        Uri("path/wrap://something")


def test_fail_empty_string():
    expected = "The provided URI is empty"
    with pytest.raises(ValueError, match=expected):
        Uri("")


def test_true_if_uri_valid():
    _, is_valid = Uri.is_valid_uri("wrap://valid/uri")
    assert is_valid


def test_false_if_uri_invalid():
    _, is_valid = Uri.is_valid_uri("wrap://.....")
    assert not is_valid


def test_return_parsed_uri_config_from_is_valid_uri():
    config = None
    config, is_valid = Uri.is_valid_uri("wrap://valid/uri", config)
    assert is_valid
    assert config == UriConfig(uri="wrap://valid/uri", authority="valid", path="uri")
