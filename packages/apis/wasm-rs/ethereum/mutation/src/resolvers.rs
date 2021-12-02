//! This module executes all async operations (returning types that implement the `Future` trait) for the `Mutation` module,
//! allowing their non-async (or synchronous) counterparts (in `/mutation/src/lib.rs`) to return the desired types.

use crate::w3::*;
use ethers::{
    contract::{Contract, ContractFactory},
    core::{
        abi::Abi,
        types::{Address, TransactionReceipt, H256},
    },
    middleware::SignerMiddleware,
    providers::{Http, Middleware, Provider},
    signers::{LocalWallet, Signer},
};
use polywrap_wasm_rs::JSON;
use query;
use std::convert::TryFrom;

pub async fn resolve_call_contract_method(input: InputCallContractMethod) -> TransactionReceipt {
    let provider =
        Provider::<Http>::try_from(input.connection.clone().provider.unwrap().as_str()).unwrap();
    let signer: LocalWallet = input
        .connection
        .signer
        .clone()
        .unwrap()
        .as_str()
        .parse()
        .unwrap();
    let client = SignerMiddleware::new(provider, signer);

    let address = Address::from_slice(input.address.as_bytes());
    let abi: Abi = JSON::from_value(JSON::json!(input.clone())).unwrap();
    let contract = Contract::new(address, abi, client);

    let call = contract
        .method::<_, H256>(&input.method, input.args.unwrap())
        .unwrap();
    call.send().await.unwrap().await.unwrap().unwrap()
}

pub async fn resolve_call_contract_method_and_wait(
    input: InputCallContractMethodAndWait,
) -> TransactionReceipt {
    let provider =
        Provider::<Http>::try_from(input.connection.clone().unwrap().provider.unwrap().as_str())
            .unwrap();
    let signer: LocalWallet = input
        .connection
        .clone()
        .unwrap()
        .signer
        .unwrap()
        .as_str()
        .parse()
        .unwrap();
    let client = SignerMiddleware::new(provider, signer);

    let address = Address::from_slice(input.address.as_bytes());
    let abi: Abi = JSON::from_value(JSON::json!(input.clone())).unwrap();
    let contract = Contract::new(address, abi, client);

    let call = contract
        .method::<_, H256>(&input.method, input.args.unwrap())
        .unwrap();
    call.send().await.unwrap().await.unwrap().unwrap()
}

pub async fn resolve_send_transaction(input: InputSendTransaction) -> TransactionReceipt {
    let provider =
        Provider::<Http>::try_from(input.connection.clone().unwrap().provider.unwrap().as_str())
            .unwrap();
    let signer: LocalWallet = input
        .connection
        .clone()
        .unwrap()
        .signer
        .unwrap()
        .as_str()
        .parse()
        .unwrap();
    let client = SignerMiddleware::new(provider, signer);

    let tx_request = query::mapping::from_tx_request(input.tx);
    client
        .send_transaction(tx_request, None)
        .await
        .unwrap()
        .await
        .unwrap()
        .unwrap()
}

pub async fn resolve_send_transaction_and_wait(
    input: InputSendTransactionAndWait,
) -> TransactionReceipt {
    let provider =
        Provider::<Http>::try_from(input.connection.clone().unwrap().provider.unwrap().as_str())
            .unwrap();
    let signer: LocalWallet = input
        .connection
        .clone()
        .unwrap()
        .signer
        .unwrap()
        .as_str()
        .parse()
        .unwrap();
    let client = SignerMiddleware::new(provider, signer);

    let tx_request = query::mapping::from_tx_request(input.tx);
    client
        .send_transaction(tx_request, None)
        .await
        .unwrap()
        .await
        .unwrap()
        .unwrap()
}

pub async fn resolve_deploy_contract(input: InputDeployContract) -> String {
    // let provider = Provider::<Http>::try_from(input.connection.clone().provider.as_str()).unwrap();
    // let signer: LocalWallet = input.connection.signer.as_str().parse().unwrap();
    // let client = SignerMiddleware::new(provider, signer);

    // let abi: Abi = JSON::from_str(&input.abi).unwrap();
    // // let address = Address::from_slice(input.bytecode.as_bytes()); // TODO: Refactor
    // let factory = ContractFactory::new(abi, input.bytecode, client);

    // contract
    //     .method::<_, String>(&input.bytecode, input.args.unwrap())
    //     .unwrap()
    //     .call()
    //     .await
    //     .unwrap()
    todo!()
}

pub async fn resolve_sign_message(input: InputSignMessage) -> String {
    let provider =
        Provider::<Http>::try_from(input.connection.clone().unwrap().provider.unwrap().as_str())
            .unwrap();
    let signer: LocalWallet = input
        .connection
        .clone()
        .unwrap()
        .signer
        .unwrap()
        .clone()
        .as_str()
        .parse()
        .unwrap();
    let client = SignerMiddleware::new(provider, signer.clone());
    client
        .sign(input.message.as_bytes().to_vec(), &signer.address())
        .await
        .unwrap()
        .to_string()
}

pub async fn resolve_send_rpc(input: InputSendRpc) -> Option<String> {
    // let provider = Provider::<Http>::try_from(input.connection.clone().provider.as_str()).unwrap();
    // let signer: LocalWallet = input.connection.signer.clone().as_str().parse().unwrap();
    // let client = SignerMiddleware::new(provider, signer.clone());

    todo!()
}

// fn example(input: InputSendTransaction) -> TransactionReceipt {
//     tokio::runtime::Builder::new_current_thread()
//         .build()
//         .unwrap()
//         .block_on(resolve_send_transaction(input))
// }

// fn use_example(input: InputSendTransaction) -> TransactionReceipt {
//     example(input)
// }
