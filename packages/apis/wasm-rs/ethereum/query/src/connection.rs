use serde::{Deserialize, Serialize};
use std::convert::TryFrom;
use std::{collections::HashMap, str::FromStr};
use web3::{Web3, Transport, api::{Accounts}, ethabi};
use web3::contract::Contract;
use web3::types::{Address, H160};

pub enum EthereumProvider<T: Transport> {
    Url(String),
    Transport(T)
}

pub enum EthereumSigner {
    AccountIndex(usize),
    AddressString(String),
    Address(Address)
}

#[derive(Clone, Debug, Default, Deserialize, Serialize)]
pub struct ConnectionConfig<T: Transport> {
    pub provider: EthereumProvider<T>,
    pub signer: Option<EthereumSigner>,
}

#[derive(Clone, Debug, Default, Deserialize, Serialize)]
pub struct Config<T: Transport> {
    pub provider: T,
    pub signer: Address,
}

#[derive(Clone, Debug, Default, Deserialize, Serialize)]
pub struct ConnectionConfigs<T: Transport> {
    pub networks: HashMap<String, ConnectionConfig<T>>,
}

#[derive(Clone, Debug, Default, Deserialize, Serialize)]
pub struct Connections<T: Transport> {
    pub networks: HashMap<String, Connection<T>>,
}

#[derive(Clone, Debug, Default, Deserialize, Serialize)]
pub struct Connection<T: Transport> {
    client: Web3<T>,
    config: Config<T>,
    accounts: Vec<Address>
}

impl<T: Transport> Connection<T> {
    pub async fn new(config: ConnectionConfig<T>) -> Self {
        let provider = match config.provider {
            EthereumProvider::Url(url) => match web3::transports::Http::new(&url) {
                Ok(p) => p,
                Err(error) => panic!("Could not instantiate HTTP provider: {:?}", error)
            },
            EthereumProvider::Transport(transport) => match web3::transports::ws::WebSocket::new(&url) {
                Ok(p) => p,
                Err(error) => panic!("Could not instantiate HTTP provider: {:?}", error)
            }
        };

        let client = Web3::new(provider.clone());
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
            client,
            config: Config {
                provider,
                signer
            },
            accounts
        }
    }

    pub fn from_configs(configs: ConnectionConfigs<T>) -> Connections<T> {
        let mut connections = Connections::default();

        for network in configs.networks.keys() {
            let connection = Self::new(configs.networks[network].clone());
            let network_str = network.to_ascii_lowercase();

            connections
                .networks
                .insert(network_str.clone(), connection);
        }

        connections
    }

    pub fn get_contract(&self, address: &str, abi: &str) -> Contract<T> {
        let parsed_address = match Address::from_str(address) {
            Ok(a) => a,
            Err(_) => { panic!("Invalid contract address: {}", address)}
        };

        //TODO: Convert ABI here

        Contract::new(self.client.eth(), parsed_address, abi)
    }
}