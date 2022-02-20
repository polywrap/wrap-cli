use serde::{Deserialize, Serialize};
use std::convert::TryFrom;
use std::{collections::HashMap, str::FromStr};
use web3::{Web3, ethabi};
use web3::api::{Accounts};
use web3::contract::Contract;
use web3::transports::{Either, Http, ws::WebSocket, eip_1193::{Eip1193, Provider} };
use web3::types::{Address, H160};
use core::result::Result;

// pub type EitherTransport = Either<Eip1193, Http>;
#[derive(Clone, Debug)]
pub enum EthereumProvider {
    HttpUrl(String),
    // Eip1193(Provider)
}

#[derive(Clone, Debug)]
pub enum EthereumSigner {
    AccountIndex(usize),
    AddressString(String),
    Address(Address)
}

#[derive(Clone, Debug)]
pub struct ConnectionConfig {
    pub provider: EthereumProvider,
    pub signer: Option<EthereumSigner>,
}

#[derive(Clone, Debug, Default)]
pub struct Config {
    pub signer: Address,
}

#[derive(Clone, Debug, Default)]
pub struct ConnectionConfigs {
    pub networks: HashMap<String, ConnectionConfig>,
}

#[derive(Clone, Debug, Default)]
pub struct Connections {
    pub networks: HashMap<String, Connection>,
}

#[derive(Clone, Debug)]
pub struct Connection {
    pub client: Web3<Http>,
    pub config: Config,
    pub accounts: Vec<Address>
}

impl Connection {
    pub async fn new(config: ConnectionConfig) -> Self {
        let transport = match config.provider {
            EthereumProvider::HttpUrl(url) => match Http::new(&url) {
                Ok(http) => http,
                Err(_) => panic!("Error creating HTTP transport with: {}", &url)
            },
            // EthereumProvider::Eip1193(ethereum) =>
            //     // web3::transports::Either::Left(
            //     Eip1193::new(ethereum)
            // // )
        };

        let client = Web3::new(transport);

        let accounts = match client.eth().accounts().await {
            Ok(a) => a,
            Err(error) => panic!("Could not retrieve accounts: {:?}", error)
        };

        let signer = match config.signer {
            Some(ethereum_signer) => {
                match ethereum_signer {
                    EthereumSigner::AddressString(address_str) => {
                        let parsed_address = Address::from_str(&address_str);

                        if parsed_address.is_err() {
                            panic!("Invalid signer address: {}", &address_str)
                        }

                        parsed_address.unwrap()
                    }
                    EthereumSigner::AccountIndex(index) => accounts[index],
                    EthereumSigner::Address(address) => address
                }
            },
            _ => accounts[0]
        };


        Self {
            // client,
            client,
            config: Config {
                signer
            },
            accounts
        }
    }

    pub async fn from_configs(configs: ConnectionConfigs) -> Connections {
        let mut connections = Connections::default();

        for network in configs.networks.keys() {
            let connection = Self::new(configs.networks[network].clone()).await;
            let network_str = network.to_ascii_lowercase();

            connections
                .networks
                .insert(network_str.clone(), connection);
        }

        connections
    }

    pub fn get_contract(&self, address: &str, abi_str: &str) -> Result<Contract<Http>, &'static str> {
        let parsed_address = match Address::from_str(address) {
            Ok(a) => a,
            Err(_) => { panic!("Invalid contract address: {}", address)}
        };

        let abi: ethabi::Contract = serde_json::from_str(abi_str).unwrap();

        Ok(Contract::new(self.client.eth(), parsed_address, abi))
    }
}

#[cfg(test)]
pub mod test {
    use crate::connection::{Connection, ConnectionConfig, EthereumProvider};

    async fn get_test_connection() -> Connection {
        Connection::new(ConnectionConfig {
            provider: EthereumProvider::HttpUrl("http://127.0.0.1:7545".parse().unwrap()),
            signer: None
        }).await
    }

    fn get_storage_abi() -> &'static str {
        r#"
        [
            {
                "inputs": [],
                "name": "retrieve",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "num",
                        "type": "uint256"
                    }
                ],
                "name": "store",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            }
        ]
        "#
    }

    #[actix_rt::test]
    async fn creates_connection_with_no_signer() {
        let connection = get_test_connection().await;
        let accounts = connection.accounts;

        assert_eq!(accounts.len(), 10);
        assert_eq!(connection.config.signer, accounts[0])
    }

    #[actix_rt::test]
    async fn gets_contract_from_str() {
        let connection = get_test_connection().await;

        let contract = connection.get_contract(
            r#"0xC36A0eF5874b401906BEf534cad48690D7eEE888"#,
            get_storage_abi()
        ).unwrap();
    }
}