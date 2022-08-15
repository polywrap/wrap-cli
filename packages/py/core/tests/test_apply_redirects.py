import pytest

from .. import UriRedirect, apply_redirects


def test_typical_use_case():
    uri1 = "w3://ens/some-uri1.eth"
    uri2 = "w3://ens/some-uri2.eth"
    redirected_uri = apply_redirects(Uri(uri1), [UriRedirect(from_uri=Uri(uri1), to_uri=Uri(uri2))])
    assert Uri.equals(redirected_uri, Uri(uri2))


def test_redirect_stack_overrides():
    uri1 = "w3://ens/some-uri1.eth"
    uri2 = "w3://ens/some-uri2.eth"
    uri3 = "w3://ens/some-uri3.eth"

    redirected_uri = apply_redirects(
        Uri(uri1),
        [
            UriRedirect(from_uri=Uri(uri1), to_uri=Uri(uri2)),
            UriRedirect(from_uri=Uri(uri1), to_uri=Uri(uri3)),
        ],
    )

    assert Uri.equals(redirected_uri, Uri(uri2))


def test_can_not_redirect_to_self():
    expected = "Infinite loop while resolving URI"
    with pytest.raises(ValueError, match=expected):
        uri = "w3://ens/some-uri.eth"
        apply_redirects(
            Uri(uri),
            [
                UriRedirect(from_uri=Uri(uri), to_uri=Uri(uri)),
            ],
        )
