# import pytest


# @pytest.fixture(autouse=True)
# async def setup():
#     await init_test_environment()

#     ens_address = ens_address.ens_address
#     resolver_address = ens_address.resolver.address
#     registrar_address = ens_address.registrar_address

#     client = PolywrapClient(
#         plugins = [
#             PluginRegistration(
#                 uri = "wrap://ens/ethereum.polywrap.eth",
#                 plugin = ethereum_plugin(
#                     networks = {
#                         "testnet": {
#                             "providers": providers.ethereum,
#                             "signer": Wallet("0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d")
#                         }
#                     },
#                     default_network = "testnet"
#                 ),
#             ),
#             PluginRegistration(
#                 uri = "wrap://ens/ipfs.polywrap.eth",
#                 plugin = ipfs_plugin(
#                     provider = providers.ipfs,
#                     fallback_providers = defaultIpfsProviders,
#                 )
#             ),
#             PluginRegistration(
#                 uri = "wrap://ens/ens.polywrap.eth",
#                 plugin = ens_plugin(
#                     query = EnsPluginConfig(
#                         addresses = {
#                             "testnet": ens_address
#                         }
#                     )
#                 )
#             )
#         ]
#     )

#     await build_wrapper(wrapper_path)

#     yield

#     await stop_test_environment()


# async def test_call_contract_view():
#     node = name_hash("whatever.eth")
#     response = await client.query(
#         uri,
#         query = f"""query {{
#             callContractView( \
#               address: \"{ens_address}\",
#               method: \"function resolver(bytes32 node) external view returns (address)\",
#               args: [\"{node}\"]
#             )
#           }}"""
#     )

#     assert response.errors is None
#     assert response.data.call_contract_view
#     assert response.data.call_contract_view == "0x0000000000000000000000000000000000000000"

# async def test_call_contract_static_no_error():
#     label = "0x" + keccak256("testwhatever")
#     response = await client.query(
#         uri,
#         query = f"""query {{
#             callContractStatic(
#               address: "{registrar_address}",
#               method: "function register(bytes32 label, address owner)",
#               args: ["{label}", "{signer}"],
#               txOverrides: {{
#                 value: null,
#                 nonce: null,
#                 gasPrice: "50",
#                 gasLimit: "200000"
#               }}
#             )
#           }}"""
#     )

#     assert response.errors is None
#     assert response.data.call_contract_static
#     assert response.data.call_contract_static.error is False
#     assert response.data.call_contract_static.result == ""


# async def test_call_contract_static_error():
#     label = "0x" + keccak256("testwhatever")
#     response = await client.query(
#         uri,
#         query = f"""query {{
#             callContractStatic(
#               address: "{registrar_address}",
#               method: "function registerr(bytes32 label, address owner)",
#               args: ["{label}", "{signer}"],
#               txOverrides: {{
#                 value: null,
#                 nonce: null,
#                 gasPrice: "50",
#                 gasLimit: "1"
#               }}
#             )
#           }}"""
#     )

#     assert response.errors is None
#     assert response.data.call_contract_static
#     assert response.data.call_contract_static.error is True
#     assert "missing revert data in call exception" in response.data.call_contract_static.result


# async def test_get_balance():
#     signer_address_query = await client.invoke(
#         uri,
#         method = "get_signer_address"
#     )

#     response = await client.invoke(
#         uri,
#         method = "get_balance",
#         input = {
#             "address": signer_address_query.data
#         }
#     )

#     assert response.error is None
#     assert response.data


# async def test_encode_params():
#     response = await client.query(
#         uri,
#         query = """query {{
#             encodeParams(
#               types: ["uint256", "uint256", "address"],
#               values: ["8", "16", "0x0000000000000000000000000000000000000000"]
#             )
#           }}"""
#     )

#     assert response.data.encode_params == "0x000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000"

#     accepts_tuple_arg = await client.query(
#         uri,
#         query = """query {{
#             encodeParams(
#               types: $types
#               values: $values
#             )
#           }}""",
#         values = [
#             json.dumps({
#                 "start_time": "8",
#                 "end_time": "16",
#                 "token": "0x0000000000000000000000000000000000000000"
#             })
#         ]
#     )

#     assert accepts_tuple_arg.errors is None


# async def encode_function():
#     response = await client.query(
#         uri,
#         query = """query {
#             encodeFunction(
#               method: "function increaseCount(uint256)",
#               args: ["100"]
#             )
#           }"""
#     )

#     assert response.errors is None
#     assert response.data.encode_function == "0x46d4adf20000000000000000000000000000000000000000000000000000000000000064"

#     accepts_array_arg = await client.query(
#         uri,
#         query = """query {
#             encodeFunction(
#               method: $method
#               args: $args
#             )
#           }""",
#         variables = {
#             "method": "function createArr(uint256[] memory)",
#             "args": json.dumps([1, 2])
#         }
#     )

#     assert accepts_array_arg is None


# async def test_solidity_pack():
#     types = [
#         "address",
#         "uint24",
#         "address",
#         "uint24",
#         "address",
#     ]

#     values = [
#         "0x0000000000000000000000000000000000000001",
#         "3000",
#         "0x0000000000000000000000000000000000000002",
#         "3000",
#         "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
#     ]

#     result = await client.invoke(
#         uri,
#         method: "solidityPack",
#         input = {
#             types,
#             values
#         }
#     )

#     assert not result.error
#     assert result.data
#     assert result.data == "0x0000000000000000000000000000000000000001000bb80000000000000000000000000000000000000002000bb8c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"


# async def test_solidity_keccak256():
#     types = [
#         "address",
#         "uint24",
#         "address",
#         "uint24",
#         "address",
#     ]

#     values = [
#         "0x0000000000000000000000000000000000000001",
#         "3000",
#         "0x0000000000000000000000000000000000000002",
#         "3000",
#         "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
#     ]

#     result = await client.invoke(
#         uri,
#         method = "solidityKeccak256",
#         input = {
#             types,
#             values
#         }
#     )

#     assert not result.error
#     assert result.data
#     assert result.data == "0x5dd4ee83f9bab0157f0e929b6dddd106fd7de6e5089f0f05c2c0b861e3807588"


# async def test_solidity_sha256():
#     types = [
#         "address",
#         "uint24",
#         "address",
#         "uint24",
#         "address",
#     ]
#     values = [
#         "0x0000000000000000000000000000000000000001",
#         "3000",
#         "0x0000000000000000000000000000000000000002",
#         "3000",
#         "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
#     ]

#     result = await client.invoke(
#         uri,
#         method = "soliditySha256",
#         input = {
#             types,
#             values
#         }
#     )

#     assert not result.error
#     assert result.data
#     assert result.data == "0x8652504faf6e0d175e62c1d9c7e10d636d5ab8f153ec3257dab1726639058d27"


# async def test_get_signer_address():
#     response = await client.query(
#         uri,
#         query = """query {
#             getSignerAddress
#           }"""
#     )
#     assert response.errors is None
#     assert response.data.get_signer_address
#     assert response.data.get_signer_address.startswith("0x")


# async def test_get_signer_balance():
#     response = await client.query(
#         uri,
#         query = """query {
#             getSignerBalance
#           }"""
#     )

#     assert response.errors is None
#     assert response.data.get_signer_balance


# async def test_get_signer_transaction_count():
#     response = await client.query(
#         uri,
#         query = """query {
#             getSignerTransactionCount
#           }"""
#     )

#     assert response.errors is None
#     assert response.data.get_gas_price
#     assert int(response.data.get_gas_price)


# async def test_estimate_transaction_gas():
#     data = contracts.simple_storage.bytecode

#     response = await client.query(
#         uri,
#         query = f"""query {{
#             estimateTransactionGas(
#               tx: {{
#                 data: "{data}"
#               }}
#             )
#           }}"""
#     )

#     assert response.errors is None
#     assert response.data.estimate_transaction_gas
#     num = int(response.data.estimate_transaction_gas)
#     assert num > 0


# async def test_estimate_contract_call_gas():
#     label = "0x" + keccak256("testwhatever2")
#     response = await client.query(
#         uri,
#         query = f"""query {{
#             estimateContractCallGas(
#               address: "{registrar_address}",
#               method: "function register(bytes32 label, address owner)",
#               args: ["{label}", "{signer}"]
#             )
#           }}"""
#     )

#     assert response.data.estimate_contract_call_gas
#     assert response.errors is None
#     num = int(response.data.estimate_contract_call_gas)
#     assert num > 0


# async def test_check_address():
#     response = await client.query(
#         uri,
#         query = f"""query {{
#             checkAddress(address: "{signer}")
#           }}"""
#     )

#     assert response.errors is None
#     assert response.data.check_address
#     assert response.data.check_address is True


# async def test_to_wei():
#     response = await client.query(
#         uri,
#         query = """query {
#             toWei(eth: "20")
#           }"""
#     )

#     assert response.errors is None
#     assert response.data.to_wei
#     assert response.data.to_wei == "20000000000000000000"


# async def test_to_eth():
#     response = await client.query(
#         uri,
#         query = """query {
#             toEth(wei: "20000000000000000000")
#           }"""
#     )

#     assert response.errors is None
#     assert response.data.to_eth
#     assert response.data.to_eth == "20.0"


# async def test_await_transaction():
#     data = contracts.simple_storage.bytecode

#     response = await client.query(
#         uri,
#         query = f"""mutation {{
#             sendTransaction(
#               tx: {{
#                 data: "{data}"
#               }}
#             )
#           }}"""
#     )

#     assert response.errors is None
#     assert response.data.send_transaction.hash
#     tx_hash = str(response.data.send_transaction.hash)

#     await_response = await client.query(
#         uri,
#         query = f"""query {{
#             awaitTransaction(
#               txHash: "{tx_hash}",
#               confirmations: 1,
#               timeout: 60000
#             )
#           }}"""
#     )

#     assert await_response.errors is None
#     assert await_response.data.await_transaction
#     assert await_response.data.await_transaction.transaction_hash


# async def test_wait_for_event_name_transfer():
#     event = "event Transfer(bytes32 indexed node, address owner)"
#     label = "0x" + keccak256("testwhatever10")
#     domain = "testwhatever10.eth"
#     new_owner = "0xFFcf8FDEE72ac11b5c542428B35EEF5769C409f0"

#     listener_promise = client.query(
#         uri,
#         query = f"""query {{
#             waitForEvent(
#               address: "{ens_address}",
#               event: "{event}",
#               args: ["{name_hash(domain)}"],
#               timeout: 20000
#             )
#           }}"""
#     )

#     await client.query(
#         uri,
#         query = f"""mutation {{
#             callContractMethod(
#               address: "{registrar_address}",
#               method: "function register(bytes32 label, address owner)",
#               args: ["{label}", "{signer}"]
#             )
#           }}"""
#     )

#     await client.query(
#         uri,
#         query = f"""mutation {{
#             callContractMethod(
#               address: "{ens_address}",
#               method: "function setOwner(bytes32 node, address owner) external",
#               args: ["{name_hash(domain)}", "{new_owner}"]
#             )
#           }}"""
#     )

#     result = await listener_promise

#     assert isinstance(result.data.wait_for_event.data, str)
#     assert isinstance(result.data.wait_for_event.address, str)
#     assert result.data.wait_for_event.log
#     assert isinstance(result.data.wait_for_event.log.transaction_hash, str)


# async def test_wait_for_event_new_resolver():
#     event = "event NewResolver(bytes32 indexed node, address resolver)"
#     label = "0x" + keccak256("testwhatever12")
#     domain = "testwhatever12.eth"

#     listener_promise = client.query(
#         uri,
#         query = f"""query {{
#             waitForEvent(
#               address: "{ens_address}",
#               event: "{event}",
#               args: [],
#               timeout: 20000
#             )
#           }}"""
#     )

#     await client.query(
#         uri,
#         query = f"""mutation {{
#             callContractMethod(
#               address: "{registrar_address}", 
#               method: "function register(bytes32 label, address owner)", 
#               args: ["{label}", "{signer}"]
#             )
#           }}"""
#     )

#     await client.query(
#         uri,
#         query = f"""mutation {{
#             callContractMethod(
#               address: "${ens_address}",
#               method: "function setResolver(bytes32 node, address owner)",
#               args: ["${name_hash(domain)}", "${resolver_address}"]
#             )
#           }}"""
#     )

#     result = await listener_promise

#     assert isinstance(result.data.wait_for_event.data, str)
#     assert isinstance(result.data.wait_for_event.address, str)
#     assert result.data.wait_for_event.log
#     assert isinstance(result.data.wait_for_event.log.transaction_hash, str)


# async def test_get_network_mainnet():
#     mainnet_network = await client.query(
#         uri,
#         query = f"""query($networkNameOrChainId: String!) {{
#             getNetwork(
#               connection: {{
#                 networkNameOrChainId: $networkNameOrChainId
#               }}
#             )
#           }}""",
#         variables = {
#             "network_name_or_chain_id": "mainnet"
#         }
#     )

#     assert mainnet_network.data
#     assert not mainnet_network.errors
#     assert mainnet_network.data.get_network.chain_id == "1"
#     assert mainnet_network.data.get_network.name == "homestead"
#     assert mainnet_network.dadta.get_network.ens_address == "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e"


# async def test_get_network_polygon():
#     polygon_network = await client.query(
#         uri,
#         query = f"""query($node: String!) {{
#             getNetwork(
#               connection: {{
#                 node: $node
#               }}
#             )
#           }}""",
#         variables = {
#             "node": "https://polygon-rpc.com"
#         }
#     )

#     assert polygon_network.data
#     assert not polygon_network.errors
#     assert polygon_network.data.get_network.chain_id == "137"
#     assert polygon_network.data.get_network.name == "matic"
#     assert not polygon_network.dadta.get_network.ens_address


# async def test_get_network_mainnet_with_env():
#     mainnet_network = await client.query(
#         uri,
#         query = """query {
#             getNetwork
#           }""",
#         config = {
#             "envs": [
#                 {
#                     "uri": "wrap://ens/ethereum.polywrap.eth",
#                     "env": {
#                         "connection": {
#                             "network_name_or_chain_id": "mainnet"
#                         }
#                     }
#                 }
#             ]
#         }
#     )

#     assert mainnet_network.data
#     assert not mainnet_network.errors
#     assert mainnet_network.data.get_network.chain_id == "1"
#     assert mainnet_network.data.get_network.name == "homestead"
#     assert mainnet_network.dadta.get_network.ens_address == "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e"


# async def test_get_network_polygon_with_env():
#     polygon_network = await client.query(
#         uri,
#         query = """query {
#             getNetwork
#           }""",
#         config = {
#             "envs": [
#                 {
#                     "uri": "wrap://ens/ethereum.polywrap.eth",
#                     "env": {
#                         "connection": {
#                             "node": "https://polygon-rpc.com"
#                         }
#                     }
#                 }
#             ]
#         }
#     )

#     assert polygon_network.data
#     assert not polygon_network.errors
#     assert polygon_network.data.get_network.chain_id == "137"
#     assert polygon_network.data.get_network.name == "matic"


# async def test_call_contract_method():
#     label = "0x" + keccak256("testwhatever")
#     response = await client.query(
#         uri,
#         query = f"""mutation {{
#             callContractMethod(
#               address: "{registrar_address}", 
#               method: "function register(bytes32 label, address owner)", 
#               args: ["{label}", "{signer}"],               
#               txOverrides: {{
#                 value: null,
#                 nonce: null,
#                 gasPrice: "50",
#                 gasLimit: "200000"
#               }}
#             )
#           }}"""
#     )

#     assert response.errors is None
#     assert response.data.call_contract_method


# async def test_call_contract_method_and_wait():
#     label = "0x" + keccak256("testwhatever")
#     response = await client.query(
#         uri,
#         query = f"""mutation {{
#             callContractMethodAndWait(
#               address: "{registrar_address}", 
#               method: "function register(bytes32 label, address owner)", 
#               args: ["{label}", "{signer}"],
#               txOverrides: {{
#                 value: null,
#                 nonce: null,
#                 gasPrice: "50",
#                 gasLimit: "200000"
#               }}
#             )
#           }}"""
#     )

#     assert response.errors is None
#     assert response.data.call_contract_method_and_wait


# async def test_send_transaction():
#     responses = await client.query(
#         uri,
#         query = f"""mutation {{
#             sendTransaction(tx: {{ data: "{contracts.simple_storage.bytecode}" }})
#           }}"""
#     )

#     assert response.errors is None
#     assert response.data.send_transactions
#     assert response.data.sen_transactions.hash


# async def test_send_transaciton_and_wait():
#     response = await client.query(
#         uri,
#         query = f"""mutation {{
#             sendTransactionAndWait(tx: {{ data: "{contracts.simple_storage.bytecode}" }})
#           }}"""
#     )

#     assert response.errors is None
#     assert response.data.send_transaction_and_wait
#     assert response.data.send_transaction_and_wait.transaction_hash


# async def test_deploy_contract():
#     response = await client.query(
#         uri,
#         query = f"""mutation {{
#           deployContract(
#             abi: $abi,
#             bytecode: $bytecode
#           )
#         }}"""
#     )

#     assert response.errors is None
#     assert response.data.deploy_contract
#     assert "0x" in response.data.deploy_contract


# async def test_sign_message():
#     response = await client.query(
#         uri,
#         query = """mutation {
#             signMessage(message: "Hello World")
#           }"""
#     )

#     assert response.errors is None
#     assert response.data.sign_message == "0xa4708243bf782c6769ed04d83e7192dbcf4fc131aa54fde9d889d8633ae39dab03d7babd2392982dff6bc20177f7d887e27e50848c851320ee89c6c63d18ca761c"


# async def test_send_rpc():
#     res = await client.query(
#         uri,
#         query = """mutation {
#             sendRPC(method: "eth_blockNumber", params: [])
#           }"""
#     )

#     assert res.errors is None
#     assert res.data
#     assert res.data.send_rpc is True


# async def test_struct_argument():
#     response1 = await client.query(
#         uri,
#         query = """mutation {
#           deployContract(
#             abi: $abi,
#             bytecode: $bytecode
#           )
#         }""",
#         variables = {
#             "abi": json.dumps(contracts.struct_arg.abi)
#             "bytecode": contracts.struct_arg.bytecode
#         }
#     )

#     assert response1.errors is None
#     assert response1.data.deploy_contracts
#     assert "0x" in response1.data.deploy_contracts

#     address = str(response1.data.deploy_contract)
#     struct_arg = json.dumps(
#         "str": "foo bar",
#         "unsigned256": 123456,
#         "unsigned256_array": [2345, 6789]
#     )

#     response2 = await client.query(
#         uri,
#         query = f"""mutation {{
#             callContractMethodAndWait(
#               address: "{address}",
#               method: "function method(tuple(string str, uint256 unsigned256, uint256[] unsigned256Array) _arg) returns (string, uint256)",
#               args: [$structArg]
#             )
#           }}""",
#         variables = {
#             struct_arg
#         }
#     )

#     assert response2.errors is None
#     assert response2.data.call_contract_method_and_wait
#     assert response2.data.call_contract_method_and_wait.transaction_hash

