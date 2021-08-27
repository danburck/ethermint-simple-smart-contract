
## Prep and Research

[TASK](https://tharsis.notion.site/Deploying-a-Simple-Smart-Contract-d6f0cc68610241a08d4fddeb49ce65e5)

Phase 1
- [x] Update Node/Deno and npm/yarn: https://nodejs.org/en/download/
- [ ] Language Choice:
  - [ ] Golang (recommended): [geth](https://geth.ethereum.org/)
  - [ ] JavaScript/TypeScript (recommended): [ethers.js](https://github.com/ethers-io/ethers.js/)/web3.js
- [x] Setup Ethermint node ethermintd
  - [x] Installed binaries
    - ethermintd: ethermint daemon/node
  - [x] Set [gas price](https://ethermint.dev/quickstart/binary.html#configuring-the-node) in app.toml
  - [x] set [Pruning of State](https://medium.com/codechain/ethereums-state-trie-pruning-45ea73ed2c78#:~:text=In%20state%20trie%20pruning%2C%20it,the%20DB%20are%20not%20pruned.)
  - [x] Set "chain-id" [ethermindcli config](https://ethermint.dev/quickstart/binary.html#client-configuration)
- [ ] Run Node
  - [x] Start daemon with `./init.sh`
  - [x] Create and add key to[Manage Key](https://ethermint.dev/quickstart/run_node.html#key-management)
- Interacting with the node
  - [https://ethermint.dev/quickstart/binary.html#command-list](https://ethermint.dev/quickstart/binary.html#command-list)

- [ ] Choose ERC20 token smart contract to compile
- [ ] Choose contract deployment framework like `Hardhat` or `Truffle`

Phase 2
- [ ] Choose Testing framework
- [ ] Plan out client-side program to query and transfer token balances on the deployed smart contract


## Architecture
- ethermintd: ethermint daemon/node
- Ethermint RPC Server (default port: 8545)



- truffle as daemon
- Geth: Ethereum client in Go is to interact with the blockchain.



## Bugs

## Learnings

- Adding binaries to $PATH: [https://golang.org/doc/gopath_code#GOPATH](https://golang.org/doc/gopath_code#GOPATH)
-
