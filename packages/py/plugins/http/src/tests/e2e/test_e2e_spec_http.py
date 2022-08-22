# import pytest 


# default_reply_headers = {
#   'access-control-allow-origin': '*',
#   'access-control-allow-credentials': 'true'
# }


# @pytest.fixture(autouse=True)
# async def setup():
#     polywrap_client = PolywrapClient(
#         plugins = [
#             PluginRegistration(
#                 uri = "wrap://ens/http.polywrap.eth",
#                 plugin = http_plugin()
#             )
#         ]
#     )


# async def test_successful_request_with_response_type_text():
#     nock("http://www.example.com") \
#         .default_reply_headers(default_reply_headers) \
#         .get("/api") \
#         .reply(200, '{data: "test-response"}')

#     response = await polywrap_client.query(
#         uri = "wrap://ens/http.polywrap.eth",
#         query = """
#             query {
#             get(
#                 url: "http://www.example.com/api"
#                 request: {
#                 responseType: TEXT
#                 }
#             )
#             }
#         """
#     )

#     assert response.data
#     assert response.errors is None
#     assert response.data.get.status == 200
#     assert response.data.get.body == "{data: \"test-response\"}"
#     assert len(response.data.get.headers) == 2


# async def test_successful_request_with_response_type_binary():
#     nock("http://www.example.com") \
#         .default_reply_headers(default_reply_headers) \
#         .get("/api") \
#         .reply(200, '{data: "test-response"}')

#     response = await polywrap_client.query(
#         uri = "wrap://ens/http.polywrap.eth",
#         query = """
#             query {
#             get(
#                 url: "http://www.example.com/api"
#                 request: {
#                 responseType: BINARY
#                 }
#             )
#             }
#         """
#     )

#     assert response.data
#     assert response.errors is None
#     assert response.data.get.status == 200
#     assert response.data.get.body == "{data: \"test-response\"}".encode("base64")
#     assert len(response.data.get.headers) == 2


# async def test_successful_request_with_query_params_and_request_headers():
#     nock("http://www.example.com", { "req_headers": { 'X-Request-Header': "req-foo" } }) \
#         .default_reply_headers(default_reply_headers) \
#         .get("/api") \
#         .query({ "query": "foo"}) \
#         .reply(200, '{data: "test-response"}', { 'X-Response-Header': "resp-foo" })

#     response = await polywrap_client.query(
#         uri = "wrap://ens/http.polywrap.eth",
#         query = """
#             query {
#             get(
#               url: "http://www.example.com/api"
#               request: {
#                 responseType: TEXT
#                 urlParams: [{key: "query", value: "foo"}]
#                 headers: [{key: "X-Request-Header", value: "req-foo"}]
#               }
#             )
#           }
#         """
#     )

#     assert response.data
#     assert response.errors is None
#     assert response.data.get.status == 200
#     assert response.data.get.body == "{data: \"test-response\"}"
#     assert response.data.get.headers == [
#         { "key": "x-response-header", "value": "resp-foo" },
#         { "key": "access-control-allow-origin", "value": "*" },
#         { "key": "access-control-allow-credentials", "value": "true" }
#       ]


# async def test_failed_request():
#     nock("http://www.example.com") \
#         .default_reply_headers(default_reply_headers) \
#         .get("/api") \
#         .reply(404)

#     response = await polywrap_client.query(
#         uri = "wrap://ens/http.polywrap.eth",
#         query = """
#             query {
#             get(
#               url: "http://www.example.com/api"
#               request: {
#                 responseType: TEXT
#               }
#             )
#           }
#         """
#     )

#     assert response.data.get is None
#     assert response.errors


# async def test_successful_request_with_request_type_application_json():
#     req_payload = {
#         "data": "test-request"
#     }
#     req_payload_stringified = json.dumps(req_payload)

#     res_payload = {
#         "data": "test-request"
#     }

#     res_payload_stringified = json.dumps(res_payload)


#     nock("http://www.example.com") \
#         .default_reply_headers(default_reply_headers) \
#         .post("/api", req_payload_stringified) \
#         .reply(200, res_payload)

#     response = await polywrap_client.query(
#         uri = "wrap://ens/http.polywrap.eth",
#         query = """
#             query {
#             post(
#               url: "http://www.example.com/api"
#               request: {
#                 headers: [
#                   { key: "Content-Type", value: "application/json" },
#                 ],
#                 responseType: TEXT
#                 body: "{\\"data\\":\\"test-request\\"}"
#               }
#             )
#           }
#         """
#     )

#     assert response.data
#     assert response.errors is None
#     assert response.data.post.status == 200
#     assert response.data.post.body == res_payload_stringified
#     assert len(response.data.post.headers) == 2


# async def test_successful_request_response_type_text():
#     nock("http://www.example.com") \
#         .default_reply_headers(default_reply_headers) \
#         .post("/api", "{data: 'test-request'}") \
#         .reply(200, '{data: "test-response"}')

#     response = await polywrap_client.query(
#         uri = "wrap://ens/http.polywrap.eth",
#         query = """
#             query {
#             post(
#               url: "http://www.example.com/api"
#               request: {
#                 responseType: TEXT
#                 body: "{data: 'test-request'}"
#               }
#             )
#           }
#         """
#     )

#     assert response.data
#     assert response.errors is None
#     assert response.data.post.status == 200
#     assert response.data.post.body == '{data: "test-response"}'
#     assert len(response.data.post.headers) == 2


# async def test_successful_request_response_type_binary():
#     nock("http://www.example.com") \
#         .default_reply_headers(default_reply_headers) \
#         .post("/api", "{data: 'test-request'}") \
#         .reply(200, '{data: "test-response"}')

#     response = await polywrap_client.query(
#         uri = "wrap://ens/http.polywrap.eth",
#         query = """
#             query {
#             post(
#               url: "http://www.example.com/api"
#               request: {
#                 responseType: BINARY
#                 body: "{data: 'test-request'}"
#               }
#             )
#           }
#         """
#     )

#     assert response.data
#     assert response.errors is None
#     assert response.data.post.status == 200
#     assert response.data.post.body == '{data: "test-response"}'.encode("base64")
#     assert len(response.data.post.headers) == 2


# async def test_successful_request_query_params_request_headers():
#     nock("http://www.example.com", { "reqheaders": { 'X-Request-Header': "req-foo" } }) \
#         .default_reply_headers(default_reply_headers) \
#         .post("/api", "{data: 'test-request'}") \
#         .query({"query": "foo"}) \
#         .reply(200, '{data: "test-response"}', { 'X-Response-Header': "resp-foo" })

#     response = await polywrap_client.query(
#         uri = "wrap://ens/http.polywrap.eth",
#         query = """
#             query {
#             post(
#               url: "http://www.example.com/api"
#               request: {
#                 responseType: TEXT
#                 body: "{data: 'test-request'}"
#                 urlParams: [{key: "query", value: "foo"}]
#                 headers: [{key: "X-Request-Header", value: "req-foo"}]
#               }
#             )
#           }
#         """
#     )

#     assert response.data
#     assert response.errors is None
#     assert response.data.post.status == 200
#     assert response.data.post.body == '{data: "test-response"}'
#     assert response.data.post.headers == [
#         { "key": "x-response-header", "value": "resp-foo" },
#         { "key": "access-control-allow-origin", "value": "*" },
#         { "key": "access-control-allow-credentials", "value": "true" }
#       ]


# async def test_failed_request():
#     nock("http://www.example.com") \
#         .default_reply_headers(default_reply_headers) \
#         .post("/api") \
#         .reply(404)

#     response = await polywrap_client.query(
#         uri = "wrap://ens/http.polywrap.eth",
#         query = """
#             query {
#             post(
#               url: "http://www.example.com/api"
#               request: {
#                 responseType: TEXT
#               }
#             )
#           }
#         """
#     )

#     assert response.data.get is None
#     assert response.errors

