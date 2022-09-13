# import pytest 


# async def test_log_to_console():
#     polywrap_client = PolywrapClient()

#     response = await polywrap_client.query(
#         uri = "wrap://ens/js-logger.polywrap.eth",
#         query = """query {
#           log(
#             level: DEBUG
#             message: "Test message"
#           )
#         }"""
#     )

#     assert response.data
#     assert response.errors
#     assert response.data.log is True

