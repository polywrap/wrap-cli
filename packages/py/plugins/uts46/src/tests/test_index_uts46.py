# import pytest 


# text_to_convert = "xn-bb-eka.at"


# @pytest.fixture(autouse=True)
# async def setup():
#     client = PolywrapClient(
#         plugins = PluginRegistration(
#             uri = "wrap://ens/uts46.polywrap.eth",
#             plugin = uts46_plugin()
#         )
#     )


# async def test_to_ascii_matches():
#     expected = uts46.to_ascii(text_to_convert)
#     response = await client.query(
#         uri = "wrap://ens/uts46.polywrap.eth",
#         query = f"""query {{
#             toAscii(value: "{text_to_convert}")
#         }}"""
#     )

#     assert response.data
#     assert response.errors is None
#     assert response.data.to_ascii == expected


# async def test_to_ascii_matches_with_options():
#     expected = uts46.to_ascii(text_to_convert, {
#         "transitional": False,
#         "useStd3ASCII": True,
#         "verifyDnsLength": False,
#     })
#     response = uts46.to_ascii(text_to_convert)

#     assert response == expected


# async def test_to_unicode_matches_with_options():
#     expected = uts46.to_unicode(text_to_convert)
#     response = await client.query(
#         uri = "wrap://ens/uts46.polywrap.eth",
#         query = f"""query {{
#             toUnicode(value: "{text_to_convert}")
#         }}"""
#     )

#     assert response.data
#     assert response.errors is None
#     assert response.data.to_ascii == expected


# async def test_convert_matches():
#     expected = uts46.convert(text_to_convert)
#     response = await client.query(
#         uri = "wrap://ens/uts46.polywrap.eth",
#         query = f"""query {{
#             convert(value: "{text_to_convert}")
#         }}"""
#     )

#     assert response.data
#     assert response.errors is None
#     assert response.data.to_ascii == expected
