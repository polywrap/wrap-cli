use ethers::core::types::Chain;

#[derive(Clone, Debug)]
pub enum Networkish {
    String(String),
    Number(u32),
}

#[derive(Clone, Debug)]
pub struct Network(Chain);

impl TryFrom<&str> for Network {
    type Error = String;

    fn try_from(value: &str) -> Result<Self, Self::Error> {
        let result = match value.to_lowercase().as_str() {
            "homestead" => Network(Chain::Mainnet),
            "mainnet" => Network(Chain::Mainnet),
            "ropsten" => Network(Chain::Ropsten),
            "rinkeby" => Network(Chain::Rinkeby),
            "goerli" => Network(Chain::Goerli),
            "kovan" => Network(Chain::Kovan),
            "xdai" => Network(Chain::XDai),
            "polygon" => Network(Chain::Polygon),
            "polygonmumbai" => Network(Chain::PolygonMumbai),
            "avalanche" => Network(Chain::Avalanche),
            "avalanchefuji" => Network(Chain::AvalancheFuji),
            "sepolia" => Network(Chain::Sepolia),
            "moonbeam" => Network(Chain::Moonbeam),
            "moonbeamdev" => Network(Chain::MoonbeamDev),
            "moonriver" => Network(Chain::Moonriver),
            _ => panic!("Unknown network name: {}", value)
        };

        Ok(result)
    }
}

impl TryFrom<u32> for Network {
    type Error = String;

    fn try_from(value: u32) -> Result<Self, Self::Error> {
        let result = match value {
            1 => Network(Chain::Mainnet),
            3 => Network(Chain::Ropsten),
            4 => Network(Chain::Rinkeby),
            5 => Network(Chain::Goerli),
            42 => Network(Chain::Kovan),
            100 => Network(Chain::XDai),
            137 => Network(Chain::Polygon),
            80001 => Network(Chain::PolygonMumbai),
            43114 => Network(Chain::Avalanche),
            43113 => Network(Chain::AvalancheFuji),
            11155111 => Network(Chain::Sepolia),
            1287 => Network(Chain::Moonbeam),
            1281 => Network(Chain::MoonbeamDev),
            1285 => Network(Chain::Moonriver),
            _ => panic!("Unknown network name: {}", value)
        };

        Ok(result)
    }
}

impl TryFrom<Networkish> for Network {
    type Error = String;

    fn try_from(value: Networkish) -> Result<Self, Self::Error> {
        let result = match value {
            Networkish::String(name) => Network::try_from(name.as_str()).unwrap(),
            Networkish::Number(chain_id) => Network::try_from(chain_id).unwrap()
        };

        Ok(result)
    }
}