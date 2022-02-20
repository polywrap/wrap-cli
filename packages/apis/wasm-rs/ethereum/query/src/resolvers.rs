use std::str::FromStr;
use web3::contract::Options;
use web3::ethabi::{Function, Param};
use web3::types::{Address, CallRequest};
use crate::connection::Connection;

pub async fn call_contract_view(
    address: &str, method: &str, args: &str, connection: Connection
) -> Result<&'static str, &'static str> {
    let function: Function = serde_json::from_str(format!("[{}]", method).as_str()).unwrap();
    let contract = connection.get_contract(address, format!("[{}]", method).as_str()).unwrap();

    let result: String = contract.query(
        "retrieve", (), None, Options::default(), None
    ).await.unwrap();

    Ok("")
}

#[cfg(test)]
pub mod test {
    use crate::connection::{Connection, ConnectionConfig, EthereumProvider};
    use crate::resolvers::call_contract_view;

    async fn get_test_connection() -> Connection {
        Connection::new(ConnectionConfig {
            provider: EthereumProvider::HttpUrl("http://127.0.0.1:7545".parse().unwrap()),
            signer: None
        }).await
    }

    #[actix_rt::test]
    async fn contract_call() {
        let connection = get_test_connection().await;

        let bytes = call_contract_view(
            "0xC36A0eF5874b401906BEf534cad48690D7eEE888",
            "function retrieve() public view returns (uint256)",
            "[]",
            connection
        ).await.unwrap();

        print!("{:?}",bytes)
    }
}