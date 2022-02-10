pub mod w3;
use w3::imported::ethereum_query;
use w3::InputGetData;
pub use w3::*;

pub fn get_data(input: InputGetData) -> i32 {
    match EthereumQuery::call_contract_view(&ethereum_query::InputCallContractView {
        address: input.address,
        method: "function get() view returns (uint256)".to_string(),
        args: None,
        connection: input.connection,
    }) {
        Ok(v) => v.parse::<i32>().unwrap(),
        Err(e) => panic!("{}", e),
    }
}
