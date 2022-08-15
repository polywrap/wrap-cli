from .. import Uri, sanitize_uri_redirects, UriRedirect


def test_return_empty_array_if_given():
    redirects = sanitize_uri_redirects([])
    assert redirects == []


def test_return_plugin_from_plugin_definitions():
    redirects = sanitize_uri_redirects([UriRedirect(from_uri="w3://w3/api", to_uri="w3://w3/api")])
    assert redirects == [UriRedirect(from_uri=Uri("w3://w3/api"), to_uri=Uri("w3://w3/api"))]
