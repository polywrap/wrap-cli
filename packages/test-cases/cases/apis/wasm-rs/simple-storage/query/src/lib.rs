pub mod w3;
use w3::imported::InputCallContractView;
pub use w3::*;

pub fn get_data(input: InputGetData) -> i32 {
    EthereumQuery::call_contract_view(&InputCallContractView {
        address: input.address,
        method: "function get() view returns (u64)".to_string(),
        args: None,
        connection: input.connection,
    })
    .parse::<i32>()
    .unwrap()
}