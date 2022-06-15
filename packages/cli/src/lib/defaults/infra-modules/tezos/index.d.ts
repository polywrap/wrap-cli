declare module '@blockwatch-cc/tezos-test-env' {
    interface Node {
        url: string
        protocol: string
    }

    interface DeployResponse {
        storageLimit: number
        gasLimit: number
        contractAddress: string
        storageSize: number
        consumedGas: number
        fee: number
        hash: string    
    }

    interface Account {
        name: string
        publicKey: string
        address: string
        secretKey: string
    }

    interface UpResponse {
        node: Node
        accounts: Account[]
    }

    interface ContractInfo {
        code: string
        init?: string | object
        storage?: unknown
    }

    function up(quiet?: boolean): Promise<UpResponse>
    function down(quiet?: boolean): Promise<void>
    function sleep(timeout: number): Promise<void>
    function deployContract(account: Account, contractInfo: ContractInfo, confirmations?: number): Promise<DeployResponse>
}

