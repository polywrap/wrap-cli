pub mod w3;
use w3::imported::ethereum_query;
use w3::query;
pub use w3::*;

pub fn get_data(input: query::InputGetData) -> i32 {
    match ethereum_query::EthereumQuery::call_contract_view(
        &ethereum_query::InputCallContractView {
            address: input.address,
            method: "function get() view returns (uint256)".to_string(),
            args: None,
            connection: input.connection,
        },
    ) {
        Ok(v) => v.parse::<i32>().unwrap(),
        Err(e) => panic!("{}", e),
    }
}

pub fn return_true() -> bool {
    true
}
