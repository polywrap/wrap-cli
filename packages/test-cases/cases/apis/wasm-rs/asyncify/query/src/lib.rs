pub mod w3;
use w3::imported::ethereum_query;
use w3::query;
pub use w3::*;

pub fn get_data(input: query::InputGetData) -> i32 {
    ethereum_query::EthereumQuery::call_contract_view(&ethereum_query::InputCallContractView {
        address: input.address,
        method: "function get() view returns (u64)".to_string(),
        args: None,
        connection: input.connection,
    })
    .parse::<i32>()
    .unwrap()
}
