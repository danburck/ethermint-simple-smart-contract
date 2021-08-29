## Prep and Research

[TASK](https://tharsis.notion.site/Deploying-a-Simple-Smart-Contract-d6f0cc68610241a08d4fddeb49ce65e5)

Phase 0 - prep
- [x] Update Node/Deno and npm/yarn: https://nodejs.org/en/download/
- [ ] Language Choice:
  - [ ] Golang (recommended): [geth](https://geth.ethereum.org/)
  - [ ] JavaScript/TypeScript (recommended): [ethers.js](https://github.com/ethers-io/ethers.js/)/web3.js
- [ ] Github repo


Phase 1 -  Node

- [x] Setup Ethermint node ethermintd
- [x] Run Single Testnet Node
- [x] Interacting with the node
  - [x] CLI [https://ethermint.dev/quickstart/binary.html#command-list](https://ethermint.dev/quickstart/binary.html#command-list)
  - [x] gRPC Services Protobuf
  - [x] REST Endpoints

Phase 2 - [RESEARCH] Deploy contract and interact
- [x] [Watch Cosmos](https://www.youtube.com/watch?v=4oCIMFekY_Q&t=1832s), [Notes](https://hackmd.io/@nZ-twauPRISEa6G9zg3XRw/HJvkzt5yD)

  ### Deploying a contract with an ethermint development environment using truffle
    1. Setup and Start Ethermint node
    2. Create Truffle Project
       1. Add & compile contract in `/contracts`
       2. Add test for contract in `/tests`
       3. init contract `before` each test
    3. Configure truffle config to connect to your ethereum     development client/node (EVM RPC HTTP server: "0.0.0.0:8545")
    4. [Deploy/Migrate](https://ethereum.org/en/developers/docs/smart-contracts/deploying/) contract to node network, in order for it to be available to users of an Ethereum network (testing and interacting with the contract).
    5. Run Tests

  ### Interacting with the Contract using web3js



- [x] Choose ERC20 token smart contract to compile
  => https://github.com/alesanro/ethereum-smart-contracts/blob/master/contracts/erc20/BasicToken.sol
- [x] Choose contract deployment framework like `Hardhat` or `Truffle`. Hardhat offersL
  => Hardhat offers: smart contract compilaton, write and run tests and contract deployment
- [x] Choose Testing framework
  => Waffle https://getwaffle.io/
  => Check out ERC20 example
- [ ] Plan out client-side program to query and transfer token balances on the deployed smart contract
  - [ ] Compile and deploy an ERC20 token smart contract
  - [ ] contract deployment Script to query and transfer token balances
  - [ ]


Phase 3 - Implement solution
- [ ] Compile and deploy an [ERC20 token smart contract](https://ethereum.org/en/developers/docs/standards/tokens/erc-20/) to the local network
- [ ] Small client-side program to query and transfer token balances on the deployed smart contract
- [ ] Unit tests




### Ethermintd Node
- ethermintd: ethermint daemon/node
- JSON-RPC server address=0.0.0.0:8545
- RPC HTTP server on 127.0.0.1:26657

  .                                   # ~/.ethermintd
    ├── data/                           # Contains the databases used by the node.
    └── config/
        ├── app.toml                   # Application-related configuration file.
        ├── config.toml                # Tendermint-related configuration file.
        ├── genesis.json               # The genesis file.
        ├── node_key.json              # Private key to use for node authentication in the p2p protocol.
        └── priv_validator_key.json    # Private key to use as a validator in the consensus protocol.


### Ethereum CLient

## Bugs

- On mac OS Catalina `make install` command doesn't run through and throws deprication errors
- [ethermintd config](https://ethermint.dev/quickstart/binary.html#client-configuration) seems outdated. Instead is available with `ethermintcli`
- [Key Management](https://ethermint.dev/quickstart/run_node.html#key-management) doc seems outdated. Instead use 'ethermintcli'
- [Using the CLI](https://ethermint.dev/quickstart/interact_node.html#using-the-cli) seems outdated. Instead use 'ethermintcli'
-


- ``ethermintd tx bank send``` dosnt work


## Learnings

- Adding binaries to $PATH: [https://golang.org/doc/gopath_code#GOPATH](https://golang.org/doc/gopath_code#GOPATH)
- Use grpcurl with `-plaintext` in front of ip when [inspecting gRPC services](https://ethermint.dev/quickstart/interact_node.html#grpcurl)
	Use plain-text HTTP/2 when connecting to server (no TLS)
