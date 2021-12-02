//! This module contains the main `ConnectionInfo` struct for managing
//! `signer` and `provider` information provided by the user.

use polywrap_wasm_rs::JSON;
use serde::{Deserialize, Serialize};
use std::convert::TryFrom;
use std::{collections::HashMap, str::FromStr};

use ethers::{
    contract::Contract,
    core::{abi::Abi, types::Address},
    providers::{Http, JsonRpcClient, Middleware, Provider},
    signers::Signer,
};

use crate::{Connection, Network};

#[derive(Clone, Debug, Default, Deserialize, Serialize)]
pub struct EthereumConfig {
    pub networks: ConnectionConfigs,
    pub default_network: Option<String>,
}

#[derive(Clone, Debug, Default, Deserialize, Serialize)]
pub struct EthereumWrapper {
    connections: Connections,
    default_network: String,
}

impl EthereumWrapper {
    pub fn ctor(config: EthereumConfig) -> Self {
        let mut connections = ConnectionInfo::from_configs(config.networks);
        let default_network;

        // assign the default network (mainnet if not provided)
        if config.default_network.is_some() {
            default_network = config.default_network.unwrap();
        } else {
            default_network = "mainnet".to_string();
        }

        // create a connection for the default network if none exists
        if connections.networks.get(&default_network).is_none() {
            let _ = connections.networks.insert(
                default_network.clone(),
                ConnectionInfo::from_network(default_network.clone()),
            );
        }

        Self {
            connections,
            default_network,
        }
    }

    pub fn get_connection(&self, connection: Option<Connection>) -> ConnectionInfo {
        if connection.is_none() {
            return self
                .connections
                .networks
                .get(&self.default_network)
                .unwrap()
                .to_owned();
        }

        let Connection {
            node,
            network_name_or_chain_id,
        } = connection.unwrap();
        let mut result = ConnectionInfo::default();

        // if a custom network is provided, either get an already-established connection,
        // or create a new one
        if network_name_or_chain_id.is_some() {
            let network_str = network_name_or_chain_id.unwrap().to_ascii_lowercase();
            if self.connections.networks.get(&network_str).is_some() {
                result = self
                    .connections
                    .networks
                    .get(&network_str)
                    .unwrap()
                    .to_owned();
            } else {
                let chain_id = network_str.parse::<u32>();

                if chain_id.is_ok() {
                    result = ConnectionInfo::from_network(chain_id.unwrap().to_string())
                } else {
                    result = ConnectionInfo::from_network(network_str);
                }
            }
        } else {
            result = self
                .connections
                .networks
                .get(&self.default_network)
                .unwrap()
                .to_owned();
        }

        // if a custom node endpoint is provided,
        // create a combined connection with the node's endpoint
        // and a connection's signer (if one exists)
        if node.is_some() {
            // TODO:
            // let _node_connection = ConnectionInfo::from_node(node.unwrap());
            // let node_network = node_connection.get_provider().get_network();
            // let established_connection = match node_network {
            //
            // };
            //
            // ...
        }

        result
    }
}

#[derive(Clone, Debug, Default, Deserialize, Serialize)]
pub struct ConnectionConfig {
    pub provider: String,
    pub signer: Option<String>,
}

#[derive(Clone, Debug, Default, Deserialize, Serialize)]
pub struct ConnectionConfigs {
    pub networks: HashMap<String, ConnectionConfig>,
}

#[derive(Clone, Debug, Default, Deserialize, Serialize)]
pub struct Connections {
    pub networks: HashMap<String, ConnectionInfo>,
}

#[derive(Clone, Debug, Default, Deserialize, Serialize)]
pub struct ConnectionInfo {
    client: String,
    config: ConnectionConfig,
}

impl ConnectionInfo {
    pub fn ctor(config: ConnectionConfig) -> Self {
        Self {
            client: config.provider.clone(),
            config,
        }
    }

    pub fn from_configs(configs: ConnectionConfigs) -> Connections {
        let mut connections = Connections::default();

        for network in configs.networks.keys() {
            // create the connection
            let connection_info = Self::ctor(configs.networks[network].clone());
            let network_str = network.to_ascii_lowercase();

            let _ = connections
                .networks
                .insert(network_str.clone(), connection_info);

            // handle the case where `network` is a number
            let network_number = network_str.parse::<u32>();

            if network_number.is_ok() {
                // TODO: let named_network = get_network(network_number);
                // TODO: let _ = connections.insert(named_network.name, connection.client);
            }
        }
        connections
    }

    pub fn from_network(network: String) -> Self {
        Self {
            client: network.to_ascii_lowercase(),
            config: ConnectionConfig::default(),
        }
    }

    pub fn from_node(node: String) -> Self {
        Self {
            client: node,
            config: ConnectionConfig::default(),
        }
    }

    pub fn set_provider(&mut self, provider: String, signer: Option<String>) {
        self.config.provider = provider;

        if signer.is_some() {
            self.set_signer(signer.unwrap());
        }
    }

    pub fn get_provider(&self) -> String {
        self.client.clone()
    }

    pub fn set_signer(&mut self, signer: String) {
        todo!()
    }

    pub fn get_signer(&self) -> String {
        match &self.config.signer {
            None => {
                panic!("Signer is undefined, this should never happen")
            }
            Some(s) => s.to_owned(),
        }
    }

    pub fn get_contract(
        &self,
        address: String,
        abi: &[u8],
        signer: bool,
    ) -> Contract<Provider<Http>> {
        let address = address.parse::<Address>().unwrap();
        let abi: Abi = JSON::from_slice(abi).unwrap();

        if signer {
            let client = Provider::<Http>::try_from(self.get_signer()).unwrap();
            Contract::new(address, abi, client)
        } else {
            let client = Provider::<Http>::try_from(self.client.clone()).unwrap();
            Contract::new(address, abi, client)
        }
    }
}

// #[derive(Clone, Debug)]
// pub enum Networkish {
//     Network(Network),
//     String(String),
//     Number(i32)
// }

// #[derive(Clone, Debug, Default)]
// pub struct EthereumSigner<S: Signer + Default + Clone>(S);

// #[derive(Clone, Debug, Default)]
// pub struct EthereumProvider<M: Middleware + Default + Clone>(M);

// #[derive(Clone, Debug, Default)]
// pub struct EthereumClient<J: JsonRpcClient + Default + Clone>(J);

// #[derive(Clone, Debug, Default)]
// pub struct ConnectionConfig<M, S>
// where
//     M: Middleware + Default + Clone,
//     S: Signer + Default + Clone,
// {
//     pub provider: EthereumProvider<M>,
//     pub signer: Option<EthereumSigner<S>>,
// }

// impl<M, S> ConnectionConfig<M, S>
// where
//     M: Middleware + Default + Clone,
//     S: Signer + Default + Clone,
// {
//     pub fn new() -> Self {
//         Self {
//             provider: EthereumProvider::default(),
//             signer: None,
//         }
//     }
// }

// #[derive(Clone, Debug, Default)]
// pub struct ConnectionConfigs<M, S>
// where
//     M: Middleware + Default + Clone,
//     S: Signer + Default + Clone,
// {
//     pub networks: HashMap<String, ConnectionConfig<M, S>>,
// }

// impl<M, S> ConnectionConfigs<M, S>
// where
//     M: Middleware + Default + Clone,
//     S: Signer + Default + Clone,
// {
//     pub fn new() -> Self {
//         Self {
//             networks: HashMap::new(),
//         }
//     }
// }

// #[derive(Clone, Debug, Default)]
// pub struct Connections<M, J, S>
// where
//     M: Middleware + Default + Clone,
//     J: JsonRpcClient + Default + Clone,
//     S: Signer + Default + Clone,
// {
//     pub networks: HashMap<String, ConnectionInfo<M, J, S>>,
// }

// impl<M, J, S> Connections<M, J, S>
// where
//     M: Middleware + Default + Clone,
//     J: JsonRpcClient + Default + Clone,
//     S: Signer + Default + Clone,
// {
//     pub fn new() -> Self {
//         Self {
//             networks: HashMap::new(),
//         }
//     }
// }

// #[derive(Clone, Debug, Default)]
// pub struct ConnectionInfo<M, J, S>
// where
//     M: Middleware + Default + Clone,
//     J: JsonRpcClient + Default + Clone,
//     S: Signer + Default + Clone,
// {
//     client: EthereumClient<J>,
//     config: ConnectionConfig<M, S>,
// }

// impl<M, J, S> ConnectionInfo<M, J, S>
// where
//     M: Middleware + Default + Clone,
//     J: JsonRpcClient + Default + Clone,
//     S: Signer + Default + Clone,
// {
//     pub fn ctor(config: ConnectionConfig<M, S>) -> Self {
//         let ConnectionConfig { provider, signer } = config;

//         // sanitize `provider` and `signer`
//         Self::set_provider(provider, signer)
//     }

//     pub fn from_configs(configs: ConnectionConfigs<M, S>) -> Connections<M, J, S> {
//         let mut connections = Connections::new();

//         for network in configs.networks.keys() {
//             // create the connection
//             let connection_info = Self::ctor(configs.networks[network].clone());
//             let network_str = network.to_ascii_lowercase();

//             let _ = connections.networks.insert(network_str.clone(), connection_info.clone());

//             // handle a case where `network` is a number
//             let network_number = network_str.parse::<i32>();

//             if network_number.is_ok() {
//                 // TODO: let named_network = get_network(network_number);
//                 // TODO: let _ = connections.insert(named_network.name, connection.client);
//             }
//         }
//         connections
//     }

//     pub fn from_network(networkish: Networkish) -> Self {
//         todo!()
//     }

//     pub fn from_node(node: String) -> Self {
//         todo!()
//     }

//     pub fn set_provider(provider: EthereumProvider<M>, signer: Option<EthereumSigner<S>>) -> Self {
//         todo!()
//     }
// }
