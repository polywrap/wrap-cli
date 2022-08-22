# import pytest 


# default_reply_headers = {
#   'access-control-allow-origin': '*',
#   'access-control-allow-credentials': 'true'
# }


# wrapper_path = f"{__dirname}/integration"
# uri = f"fs/{wrapperPath}/build"

# @pytest.fixture(autouse=True)
# async def setup():
#     client = PolywrapClient(
#         plugins = [
#             PluginRegistration(
#                 uri = "wrap://ens/http.polywrap.eth",
#                 plugin = http_plugin()
#             )
#         ]
#     )

#     await build_wrapper(wrapper_path)


# async def get():
#     nock("http://www.example.com", { "req_headers": { 'X-Request-Header': "req-foo" } }) \
#         .default_reply_headers(default_reply_headers) \
#         .get("/api") \
#         .query({ "query": "foo" }) \
#         .reply(200, '{data: "test-response"}', { 'X-Response-Header': "resp-foo" })

#     response = await client.query(
#         uri,
#         query = """query {
#           get(
#             url: "http://www.example.com/api"
#             request: {
#               responseType: TEXT
#               urlParams: [{key: "query", value: "foo"}]
#               headers: [{key: "X-Request-Header", value: "req-foo"}]
#             }
#           )
#         }"""
#     )

#     assert response.data
#     assert response.errors is None
#     assert response.data.get.status == 200


# async def post():
#     nock("http://www.example.com", { "req_headers": { 'X-Request-Header': "req-foo" } }) \
#         .default_reply_headers(default_reply_headers) \
#         .post("/api", "{data: 'test-request'}") \
#         .query({ "query": "foo" }) \
#         .reply(200, '{data: "test-response"}', { 'X-Response-Header': "resp-foo" })

#     response = await client.query(
#         uri,
#         query = """query {
#             post(
#               url: "http://www.example.com/api"
#               request: {
#                 responseType: TEXT
#                 body: "{data: 'test-request'}"
#                 urlParams: [{key: "query", value: "foo"}]
#                 headers: [{key: "X-Request-Header", value: "req-foo"}]
#               }
#             )
#           }"""
#     )

#     assert response.data
#     assert response.errors is None
#     assert response.data.post.status == 200
#     assert response.data.post.body
