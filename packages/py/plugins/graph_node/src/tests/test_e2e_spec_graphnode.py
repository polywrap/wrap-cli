# import pytest 


# uri = "ens/graph-node.polywrap.eth"
# provider = "https://api.thegraph.com"

# client = PolywrapClient(
#     plugins = [
#         uri,
#         plugin(provider)
#     ]
# )

# graph_node = GraphNodePlugin(provider)


# async def test_query_works():
#     data, errors = await client.query(
#         uri,
#         query = """query {
#         querySubgraph(
#           subgraphAuthor: "ensdomains",
#           subgraphName: "ens",
#           query: $query
#         )
#       }""",
#         variables = {
#             "query": """{
#           domains(first: 5) {
#             id
#             name
#             labelName
#             labelhash
#           }
#           transfers(first: 5) {
#             id
#             domain {
#               id
#             }
#             blockNumber
#             transactionID
#           }
#         }"""
#         }
#     )

#     assert errors is None
#     assert data
#     assert data.query_subgraph

#     result = json.loads(str(data.query_subgraph))

#     assert result.data
#     assert result.data.domains
#     assert result.data.transfers


# async def test_errors_in_querystring():
#     with pytest.raises(Exception, match = "Message: Type \`Domain\` has no field \`ids\` Message: Type \`Domain\` has no field \`names\` Message: Type \`Domain\` has no field \`labelNames\`"):
#         graph_node.query_subgraph(
#             subgraph_author = "ensdomains",
#             subgraph_name = "ens",
#             query = """{
#             domains(first: 5) {
#                 ids
#                 names
#                 labelNames
#                 labelhash
#             }
#             transfers(first: 5) {
#                 id
#                 domain {
#                 id
#                 }
#                 blockNumber
#                 transactionID
#             }
#             }""",
#             client = client
#         )


# async def test_errors_wrong_subgraph_name_author():
#     with pytest.raises(Exception, match = "`ens/ens` does not exist"):
#         graph_node.query_subgraph(
#             subgraph_author = "ens",
#             subgraph_name = "ens",
#             query = """{
#             domains(first: 5) {
#                 id
#                 name
#                 labelName
#                 labelhash
#             }
#             transfers(first: 5) {
#                 id
#                 domain {
#                 id
#                 }
#                 blockNumber
#                 transactionID
#             }
#             }""",
#             client = client
#         )

#     with pytest.raises(Exception, match = "`ensdomains/foo` does not exist"):
#         graph_node.query_subgraph(
#             subgraph_author = "ensdomains",
#             subgraph_name = "foo",
#             query = """{
#             domains(first: 5) {
#                 id
#                 name
#                 labelName
#                 labelhash
#             }
#             transfers(first: 5) {
#                 id
#                 domain {
#                 id
#                 }
#                 blockNumber
#                 transactionID
#             }
#             }""",
#             client = client
#         )

