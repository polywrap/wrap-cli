//! This module contains the main `ConnectionInfo` struct for managing
//! `signer` and `provider` information provided by the user.

// NOTE: We may not need this

use std::collections::HashMap;
use std::str::FromStr;
use std::sync::Arc;
// use std::convert::TryFrom;

use ethers::{
    contract::Contract,
    core::{abi::Abi, types::Address},
    providers::{JsonRpcClient, Middleware, Provider},
    signers::LocalWallet,
};

pub type EthereumClient<P> = Arc<Provider<P>>;
pub type Connections<P> = HashMap<String, EthereumClient<P>>;

#[derive(Clone, Debug)]
pub struct ConnectionInfo<P: JsonRpcClient + Clone + FromStr> {
    client: EthereumClient<P>,
}

impl<P: JsonRpcClient + Clone + FromStr> ConnectionInfo<P> {
    pub fn new(config: ConnectionConfig<P>) -> Self {
        let ConnectionConfig { provider, signer } = config;

        // sanitize `provider` and `signer`
        Self::set_provider(&provider, &signer);
        Self {
            client: Arc::new(provider),
        }
    }

    pub fn from_configs(configs: ConnectionConfigs<P>) -> Connections<P> {
        let mut connections: HashMap<String, EthereumClient<P>> = Connections::new();

        for network in configs.networks.keys() {
            // create the connection
            let connection = Self::new(configs.networks[network].clone());
            let network_str = network.to_ascii_lowercase();

            let _ = connections.insert(network_str.clone(), connection.client);

            // handle the case where `network` is a number
            let network_num = network_str.parse::<u32>();

            if network_num.is_ok() {
                // TODO: let named_network = get_network(network_num);
                // TODO: let _ = connections.insert(named_network.name, connection.client);
            }
        }
        connections
    }

    pub fn from_network(network: Provider<P>) -> Self {
        let config = ConnectionConfig {
            provider: network,
            signer: None,
        };
        Self::new(config)
    }

    pub fn from_node(node: &str) -> Self {
        todo!()
    }

    pub fn set_provider(provider: &Provider<P>, signer: &Option<LocalWallet>) {
        todo!()
    }

    pub fn get_provider(&self) -> EthereumClient<P> {
        self.client.clone()
    }

    pub fn set_signer(signer: LocalWallet) {
        todo!()
    }

    pub fn get_signer(&self) -> LocalWallet {
        todo!()
    }

    pub fn get_contract<M: Middleware>(
        &self,
        address: Address,
        abi: Abi,
        signer: bool,
    ) -> Contract<M> {
        todo!()
    }
}

#[derive(Clone, Debug)]
pub struct ConnectionConfig<P: JsonRpcClient + Clone + FromStr> {
    pub provider: Provider<P>,
    pub signer: Option<LocalWallet>,
}

#[derive(Clone, Debug)]
pub struct ConnectionConfigs<P: JsonRpcClient + Clone + FromStr> {
    pub networks: HashMap<String, ConnectionConfig<P>>,
}
