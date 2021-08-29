# Prep, Research & Implementation

[TASK](https://tharsis.notion.site/Deploying-a-Simple-Smart-Contract-d6f0cc68610241a08d4fddeb49ce65e5)

## Phase 0 - prep

- [x] Update Node/Deno and npm/yarn: https://nodejs.org/en/download/
- [ ] Language Choice:
  - [ ] Golang (recommended): [geth](https://geth.ethereum.org/)
  - [ ] JavaScript/TypeScript (recommended): [ethers.js](https://github.com/ethers-io/ethers.js/)/web3.js
- [ ] Github repo


## Phase 1 -  Node

- [x] Setup Ethermint node ethermintd
- [x] Run Single Testnet Node
- [x] Interacting with the node
  - [x] CLI [https://ethermint.dev/quickstart/binary.html#command-list](https://ethermint.dev/quickstart/binary.html#command-list)
  - [x] gRPC Services Protobuf
  - [x] REST Endpoints

## Phase 2 - RESEARCH frameworks and how to deploy contract and interact
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
    0. install [web3js](https://web3js.readthedocs.io/en/v1.4.0/getting-started.html)
    1. Create a script with web3.js that deploys the contract and interacts with it
    2. Run the script with `node ecr20.js`

  ### Make transfer using geth console
    1. Setup and Start Ethermintd node
    2. Start geth console `geth attach http://localhost:8545`
    3. Use [eth JSON-RPC API](https://eth.wiki/json-rpc/API) to interact with the blockchain
       1. `eth.getBlock(60)` for block information
       2. `eth.accounts` get account hex
       3. 'eth.getBalance(eth.accounts[0])' get balance
       4. `tx = eth.sendTransaction({from: eth.accounts[0], to: "0x0000000000000000000000000000000000000000", value: "0x1"})` to initiate transaction
          1.
       5. `eth.getTransactionReceipt(tx)`


  ### Implementation PLanning

  - [x] Choose ERC20 token smart contract to compile
    => https://github.com/alesanro/ethereum-smart-contracts/blob/master/contracts/erc20/BasicToken.sol
  - [x] Choose contract deployment framework like `Hardhat` or `Truffle`. Hardhat offersL
    => Hardhat offers: smart contract compilaton, write and run tests and contract deployment
  - [x] Choose Testing framework
    => Waffle https://getwaffle.io/
    => Check out ERC20 example
  - [ ] Plan out client-side program to query and transfer token balances on the deployed smart contract


## Phase 3 - Implement solution
- [x] Compile and deploy an [ERC20 token smart contract](https://ethereum.org/en/developers/docs/standards/tokens/erc-20/) to the local network using truffle
- [ ] Write unit tests for the contract
- [ ] Write a small client-side program to query and transfer token balances on the deployed smart contract using web3
- [ ] Fix style and write comments




## Learnings

- Adding binaries to $PATH: [https://golang.org/doc/gopath_code#GOPATH](https://golang.org/doc/gopath_code#GOPATH)
- Use grpcurl with `-plaintext` in front of ip when [inspecting gRPC services](https://ethermint.dev/quickstart/interact_node.html#grpcurl)
	Use plain-text HTTP/2 when connecting to server (no TLS)
