# import pytest 


# test_message = "test message to hash"


# @pytest.fixture(autouse=True)
# async def setup():
#     client = PolywrapClient(
#         plugins = PluginRegistration(
#             uri = "wrap://ens/sha3.polywrap.eth",
#             plugin = sha3_plugin()
#         )
#     )


# async def test_sha3_512_matches():
#     expected = sha3_512(test_message)
#     response = await client.query(
#         uri = "wrap://ens/sha3.polywrap.eth",
#         query = f"""query {{
#           sha3_512(message: "{test_message}")
#         }}"""
#     )

#     assert response.data
#     assert response.errors is None
#     assert response.data.sha3_512 == expected


# async def test_sha3_384_matches():
#     expected = sha3_384(test_message)
#     response = await client.query(
#         uri = "wrap://ens/sha3.polywrap.eth",
#         query = f"""query {{
#           sha3_384(message: "{test_message}")
#         }}"""
#     )

#     assert response.data
#     assert response.errors is None
#     assert response.data.sha3_384 == expected


# async def test_sha3_256_matches():
#     expected = sha3_256(test_message)
#     response = await client.query(
#         uri = "wrap://ens/sha3.polywrap.eth",
#         query = f"""query {{
#           sha3_256(message: "{test_message}")
#         }}"""
#     )

#     assert response.data
#     assert response.errors is None
#     assert response.data.sha3_256 == expected


# async def test_sha3_224_matches():
#     expected = sha3_224(test_message)
#     response = await client.query(
#         uri = "wrap://ens/sha3.polywrap.eth",
#         query = f"""query {{
#           sha3_224(message: "{test_message}")
#         }}"""
#     )

#     assert response.data
#     assert response.errors is None
#     assert response.data.sha3_224 == expected


# async def test_keccak512_matches():
#     expected = keccak512(test_message)
#     response = await client.query(
#         uri = "wrap://ens/sha3.polywrap.eth",
#         query = f"""query {{
#           keccak512(message: "{test_message}")
#         }}"""
#     )

#     assert response.data
#     assert response.errors is None
#     assert response.data.keccak512 == expected


# async def test_keccak384_matches():
#     expected = keccak384(test_message)
#     response = await client.query(
#         uri = "wrap://ens/sha3.polywrap.eth",
#         query = f"""query {{
#           keccak384(message: "{test_message}")
#         }}"""
#     )

#     assert response.data
#     assert response.errors is None
#     assert response.data.keccak384 == expected


# async def test_keccak256_matches():
#     expected = keccak256(test_message)
#     response = await client.query(
#         uri = "wrap://ens/sha3.polywrap.eth",
#         query = f"""query {{
#           keccak256(message: "{test_message}")
#         }}"""
#     )

#     assert response.data
#     assert response.errors is None
#     assert response.data.keccak256 == expected


# async def test_keccak256_buffer_matches():
#     test_message_buffer = test_message.encode()
#     expected = keccak256(test_message)
#     response = await client.query(
#         uri = "wrap://ens/sha3.polywrap.eth",
#         query = f"""query {{
#           buffer_keccak_256(message: "{test_message}")
#         }}""",
#         variables = {
#             "message": test_message_buffer
#         }
#     )

#     assert response.data
#     assert response.errors is None
#     assert response.data.buffer_keccak_256 == expected


# async def test_keccak224_matches():
#     expected = keccak224(test_message)
#     response = await client.query(
#         uri = "wrap://ens/sha3.polywrap.eth",
#         query = f"""query {{
#           keccak224(message: "{test_message}")
#         }}"""
#     )

#     assert response.data
#     assert response.errors is None
#     assert response.data.keccak224 == expected


# async def test_shake128_matches():
#     expected = shake128(test_message)
#     response = await client.query(
#         uri = "wrap://ens/sha3.polywrap.eth",
#         query = f"""query {{
#           shake128(message: "{test_message}")
#         }}"""
#     )

#     assert response.data
#     assert response.errors is None
#     assert response.data.shake128 == expected


# async def test_shake256_matches():
#     expected = shake256(test_message)
#     response = await client.query(
#         uri = "wrap://ens/sha3.polywrap.eth",
#         query = f"""query {{
#           shake256(message: "{test_message}")
#         }}"""
#     )

#     assert response.data
#     assert response.errors is None
#     assert response.data.shake256 == expected
