use std::collections::HashMap;
use ethers::providers::{Http, Provider};
use ethers::core::types::Chain;
use crate::network::{Network, Networkish};

#[derive(Clone, Debug)]
enum ProviderConfig {
  Url(String),
}

#[derive(Clone, Debug)]
struct ConnectionConfig {
  provider: ProviderConfig,
  network: String
}

#[derive(Clone, Debug)]
struct ConnectionConfigs {
  configs: HashMap<String, ConnectionConfig>
}

#[derive(Clone, Debug)]
struct Connection {
  _provider: Provider<Http>,
  _network: String
}

#[derive(Clone, Debug)]
struct Connections {
  connections: Vec<Connection>
}

fn parse_provider(provider: ProviderConfig) -> Provider<Http> {
  match provider {
    ProviderConfig::Url(url) => Provider::<Http>::try_from(url).unwrap(),
  }
}

impl Connection {
  pub fn new(config: ConnectionConfig) -> Self {
    let parsed_provider = parse_provider(config.provider);

    Self {
      _provider: parsed_provider,
      _network: config.network
    }
  }

  pub fn provider(self) -> Provider<Http> {
    self._provider
  }

  pub fn set_provider(&mut self, provider: ProviderConfig) {
    self._provider = parse_provider(provider)
  }
}

impl TryFrom<ConnectionConfigs> for Connections {
  type Error = ();

  fn try_from(configs: ConnectionConfigs) -> Result<Connections, Self::Error> {
      let mut connections = Vec::new();

      for network_name in configs.configs.keys() {
        let network= Network::try_from( network_name.as_str()).unwrap();

        connections.push(Connection::new(
          ConnectionConfig {
            provider: configs.configs.get(network_name).unwrap().clone().provider,
            network: network_name.clone()
          }
        ));
      }

      Ok(Connections {
        connections
      })
    }
}

#[cfg(test)]
mod tests {
  use super::*;

  #[test]
  fn creates_connection() {
    let connection = Connection::new(ConnectionConfig {
      provider: ProviderConfig::Url("http://127.0.0.1:7545".to_string()),
      network: String::from("mainnet")
    });

    print!("{:?}", connection)
  }
}