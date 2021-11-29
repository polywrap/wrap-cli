use ethers_contract::Contract;
use ethers_middleware::signer::SignerMiddleware;
use ethers_providers::{Http, Middleware, Provider};
use std::collections::HashMap;

pub type EthereumProvider<P> = Provider<P>;
pub type EthereumSigner<M, S> = SignerMiddleware<M, S>;

pub enum EthereumClient<P> {
    Web3Provider,
    JsonRpcProvider(Provider<P>),
}

pub struct ConnectionConfig<P, M, S> {
    pub provider: EthereumProvider<P>,
    pub signer: Option<EthereumSigner<M, S>>,
}

pub struct ConnectionConfigs<P, M, S> {
    pub network: HashMap<String, ConnectionConfig<P, M, S>>,
}

pub struct Connections<P> {
    pub network: HashMap<String, Connection<P>>,
}

pub struct Connection<P> {
    client: EthereumClient<P>,
}
