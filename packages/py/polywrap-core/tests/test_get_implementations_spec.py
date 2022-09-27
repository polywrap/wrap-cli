from polywrap_core import get_implementations, Uri, UriRedirect, InterfaceImplementations


def test_works_complex_redirects():
    interface1_uri = "wrap://ens/some-interface1.eth"
    interface2_uri = "wrap://ens/some-interface2.eth"
    interface3_uri = "wrap://ens/some-interface3.eth"

    implementation1_uri = "wrap://ens/some-implementation.eth"
    implementation2_uri = "wrap://ens/some-implementation2.eth"
    implementation3_uri = "wrap://ens/some-implementation3.eth"

    redirects = [
        UriRedirect(from_uri=Uri(interface1_uri), to_uri=Uri(interface2_uri)),
        UriRedirect(from_uri=Uri(implementation1_uri), to_uri=Uri(implementation2_uri)),
        UriRedirect(from_uri=Uri(implementation2_uri), to_uri=Uri(implementation3_uri)),
    ]

    interfaces = [
        InterfaceImplementations(
            interface=Uri(interface1_uri), implementations=[Uri(implementation1_uri), Uri(implementation2_uri)]
        ),
        InterfaceImplementations(interface=Uri(interface2_uri), implementations=[Uri(implementation3_uri)]),
        InterfaceImplementations(interface=Uri(interface3_uri), implementations=[Uri(implementation3_uri)]),
    ]

    get_implementations_results1 = get_implementations(Uri(interface1_uri), interfaces=interfaces, redirects=redirects)
    get_implementations_results2 = get_implementations(Uri(interface2_uri), interfaces=interfaces, redirects=redirects)
    get_implementations_results3 = get_implementations(Uri(interface3_uri), interfaces=interfaces, redirects=redirects)

    assert get_implementations_results1 == [
        Uri(implementation1_uri),
        Uri(implementation2_uri),
        Uri(implementation3_uri),
    ]

    assert get_implementations_results2 == [
        Uri(implementation1_uri),
        Uri(implementation2_uri),
        Uri(implementation3_uri),
    ]

    assert get_implementations_results3 == [
        Uri(implementation3_uri),
    ]


def test_interface_implementations_not_redirected():
    interface1_uri = "wrap://ens/some-interface1.eth"

    implementation1_uri = "wrap://ens/some-implementation.eth"
    implementation2_uri = "wrap://ens/some-implementation2.eth"

    redirects = [UriRedirect(from_uri=Uri(implementation1_uri), to_uri=Uri(implementation2_uri))]

    interfaces = [InterfaceImplementations(interface=Uri(interface1_uri), implementations=[Uri(implementation1_uri)])]

    get_implementations_results = get_implementations(Uri(interface1_uri), interfaces, redirects)

    assert Uri(implementation1_uri) == get_implementations_results
