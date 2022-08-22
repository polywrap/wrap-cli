# import pytest 


# def test_response_type_text():
#     response = from_axios_response(
#         status = 200,
#         status_text = "Ok",
#         data = "body-content",
#         headers = { ["Accept"]: "application-json", ["X-Header"]: "test-value" },
#         config = { "response_type": "text"}
#     )

#     assert response.headers == [
#       { "key": "Accept", "value": "application-json" },
#       { "key": "X-Header", "value": "test-value" },
#     ]
#     assert response.status == 200
#     assert response.status_text == "Ok"
#     assert response.body == "body-content"


# def test_response_type_text_header_map():
#     response = from_axios_response(
#         status = 200,
#         status_text = "Ok",
#         data = "body-content",
#         headers = { ["Accept"]: "application-json", ["X-Header"]: "test-value", ["set-cookie"]: ['key=val;', 'key2=val2;'] },
#         config = { "response_type": "text"}
#     )

#     assert response.headers == [
#       { "key": "Accept", "value": "application-json" },
#       { "key": "X-Header", "value": "test-value" },
#       { "key": "set-cookie", "value": "key=val; key2=val2;" },
#     ]
#     assert response.status == 200
#     assert response.status_text == "Ok"
#     assert response.body == "body-content"


# def test_response_type_array_buffer():
#     response = from_axios_response(
#         status = 200,
#         status_text = "Ok",
#         data = "body-content",
#         headers = { ["Accept"]: "application-json", ["X-Header"]: "test-value" },
#         config = { "response_type": "arraybuffer"}
#     )

#     assert response.headers == [
#       { "key": "Accept", "value": "application-json" },
#       { "key": "X-Header", "value": "test-value" },
#     ]
#     assert response.status == 200
#     assert response.status_text == "Ok"
#     assert response.body == "body-content".encode("base64")


# def test_with_headers():
#     config = to_axios_request_config(
#         headers = [
#             { "key": "Accept", "value": "application-json" },
#             { "key": "X-Header", "value": "test-value" },
#         ],
#         response_type = "TEXT",
#         body = "body-content"
#     )

#     assert config.headers == {
#         ["Accept"]: "application-json",
#         ["X-Header"]: "test-value",
#     }
#     assert config.params is None
#     assert config.response_type == "text"


# def test_with_url_params():
#     config = to_axios_request_config(
#         url_params = [{ "key": "tag", "value": "data" }],
#         response_type = ResponseTypeEnum.BINARY,
#         body = "body-content"
#     )

#     assert config.headers is None
#     assert config.params == { ["tag"]: "data" }
#     assert config.response_type == "arraybuffer"



