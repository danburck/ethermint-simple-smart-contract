# Tendermint

Find below the result of my research on the Tendermint protocol and related topics. The goal is to understand [Tendermint Core](https://docs.tendermint.com/) at a strong conceptual level. I cover the following topics:

- Why do we need consensus?
- State machine replication with BFT
- Instant finality
- Limitations of Safety and Liveness
- Why partially Asynchronous Consensus makes Tendermint more secure?
- How Tendermint Core and Applications communicate
- Cosmos & Cosmos SDK

TODO:
- [x] Review all References
- [x] High Level answer to each question (explain to a kid)
- [x] Find a story to tell => abstract for Tendermint noobs
- [x] Research Details
- [x] Suggest Improvements
- [x] Rewriting, and Formatting

## Intro/Abstract: Why do we need Consensus mechanisms like Tendermint: Consensus in distributed networks vs. Web applications**

Both in distributed networks and concurrent web applications we create requests or send messages over networks. As soon as we perform these requests/messages, we need to assume, that they can be delayed or fail because of network failures.

We, therefore, build asynchronous network mechanisms and idempotent operations to handle failed, malicious or several concurrent identical requests without causing network failures or changes beyond an expected state. This is because we decouple the what from the when.

Whereas many web applications use asynchronous mechanisms at a smaller scale, distributed networks use asynchronous mechanisms to upkeep a network of validators that agree on transactions and store critical business data on a ledger.

A secure consensus algorithm is required to ensure the correctness of the ledger's state amongst all participants in the network and protect the network from malicious attacks.

This is where Tendermint comes into play as a state replication machine that securely and consistently replicates an application on many machines through Byzantine Fault Tolerance (BFT).

## What is Byzantine Fault Tolerance (BFT)? Why is BFT relevant in the context of blockchains?

Byzantine Fault Tolerance (BFT) is the property of any group of people/processes that agrees on a decision (find consensus) even though they don't trust each other and almost 1/3 of them are dishonest.

Blockchains are distributed systems in which trustless nodes regularly need to find consensus on the system's state (State Machine Replication). They use consensus algorithms that are byzantine to reach consensus, even if there are faulty/malicious nodes. Tendermint is the state replication machine that enables the operation of blockchains through Byzantine Fault Tolerance (BFT).

In order to be byzantine:
- I have to decide yes or no and I can't change my decision.
- I have to have a mathematical guarantee that we all reach the same decision.
- I know I am going to reach a consensus, and I'll know I've reached consensus and I know that it's mathematically guaranteed that we all agree.

**Byzantine General's Problem**

BFT is an answer to the logical dilemma that demonstrates communication problems when a group of generals need to agree on the next move.

- Each general has to decide
- vote cannot be changed
- All generals need to agree on the same move
- They can only communicate through messages. Problem is, the messages can get delayed, destroyed or lost.
- Malicious messages could prevent the consensus

**Byzantine failure**
A Byzantine failure is the loss of a system service due to a Byzantine fault in systems that require consensus

## Understand what finality means in blockchains.

In blockchains, a transaction has reached finality if it is included in a block that is considered immutable. It is the guarantee that a transaction cannot be reversed, changed or cancelled after it has been executed.

For PoW chains, finality can be referred to as subjective/probabilistic. Nodes choose a block that is the computational most expensive. When the chain gets long enough, it becomes more and more unlikely that the block and the containing transaction will be reordered on the chain and at some point the transaction reaches finality.

Finality can also be understood as the time it takes for a transaction to be considered immutable. E.g. in Bitcoin, it takes a transaction up to 60 minutes (6 blocks in on the ledger) to reach finality. That means there is a timeframe in which a transaction might be vulnerable to attacks from bad actors trying to reorganize the last committed transactions.

**Instant finality** uses a pBFT protocol (practical BFT) where transactions are considered final immediately in the first block. The users can vote for a leader who approves a block. Then a committee of validators, who are also voted in, approve the decision and then add it to the block instantly. With Tendermint Core, a transaction is immediately finalized once it's included in a block and there is no need to wait for confirmations.

## Explain and understand the tradeoffs of safety over liveness (i.e BFT vs Nakamoto Consensus chains). Why does this matter and what are the restrictions for design?

Safety and liveness are properties that describe the correctness of consensus algorithms. Safety properties state that bad events never happen and liveness properties state that some good events should eventually happen.

Applied to distributed systems, consensus safety describes that consensus with different values cannot occur and consensus liveness guarantees that eventually, all nodes must come to a final agreement on the state and not fall under infinite loops.

The guarantees of these correctness properties have been proven to be impossible to achieve simultaneously if we consider a distributed system, in which at least one processor may have a crash failure (proven in April 1985 by Fischer, Lynch and Patterson in their short paper ‘Impossibility of Distributed Consensus with One Faulty Process’). This restriction of designing any deterministic consensus algorithm is known as the FLP impossibility. It describes the trade-off between safety and liveness.

If a safety or liveness guarantee is too strong, it is impossible to implement them and you need to consider weaker safety or liveness properties.

Today, there are multiple different implementations of consensus algorithms used in distributed systems. Let's look at two widely considered implementations where one correctness parameter is favoured of the other:

**Nakamoto Consensus**
- Proof of Work
- Bitcoin, Ethereum
- Allows malicious attack by a chain with at least 51% of the current chain's computing power, as its hashing power allows the creation of a longer chain than the current chain
- Therefore it guarantees liveness over safety and finality is not guaranteed.

**BFT style consensus**
- Proof of Stake
- Tendermint (used by Cosmos)
- Allows blocks to never be created because a consensus is not reached, due to an asynchronous network where messages are not guaranteed to arrive on time. Consensus happens in several voting rounds (propose, prevote, precommit) in which the last two stages require at least a `2/3 + 1` majority of votes.
- Therefore it guarantees safety over liveness.

Bitcoin's Nakamoto chain is regarded as one of the most secure implementations of blockchain networks as there are no commonly considered records of successful malicious attacks.

## What is Synchrony, Asynchrony, Partial Synchrony? Why is it relevant to Tendermint?

In distributed systems, the terms Synchrony, Asynchrony and Partial Synchrony describe whether a consensus algorithm is dependent on the time it takes a message to be sent from one node to another and the relative speeds of different nodes while finding consensus.

A distributed network is considered byzantine with total asynchrony if messages are not guaranteed to arrive within a defined time frame. The consensus algorithm doesn't make any assumptions based on time to ensure the consensus protocol's correctness.

Conversely, in a synchronous network, messages are guaranteed to be delivered within a specific time frame. As mentioned in the abstract, this is an unrealistic assumption if we consider that requests sent over any network may fail or be delayed.

Partial synchrony lies between the cases of a synchronous system and an asynchronous system where the time variables of the consensus are not known a priori. Messages are guaranteed to arrive in a set amount of time but it is not known what that set amount of time exactly is. Although partial synchronous network models guarantee that a consensus will be reached at some point in the future, in the worst case, a new block may not be created for a couple of rounds. This results in a decrease in TPS (transactions per second).

Tendermint uses a variant of the partial partially synchronous network model, where nodes communicate with each other over a peer-2-peer gossiping protocol, regardless of the actual values of any time bounds.

**Gossiping with Unknown apriori time constraints**

In all executions of the system, there is a bound ∆ and an instant GST (Global Stabilization Time). The communication between valid nodes is considered
- reliable after GST and
- to arrive timely before max{t, GST } + ∆, whereas t is the time it takes a message to be sent from one correct node to another.

The bound ∆ and GST are system parameters whose values are not required to be known for the safety of the algorithm. The termination of the algorithm is guaranteed within a bounded duration after GST.

## Explain how an application communicates with the Tendermint Consensus Engine (ABCI). How does it relate to Cosmos and the Cosmos SDK?

An application interacts with the Tendermint Core Consensus Engine over an Application Blockchain Interface (ABCI). Together, the application and Tendermint Core form the programs that run a complete blockchain and combine business logic with decentralized data storage.

Tendermint Core is a state-machine replication engine that ensures that the same transactions are recorded on every machine in the same order. Every time it receives a new transaction or a block is committed, it makes requests to the application (the actual state machine) through specific ABCI application functions. The application maintains four of these separate ABCI connections with Tendermint:

1) Mempool connection: `CheckTx` => validating new transactions before they're shared or included in a block.
2) Consensus connection at Commit: `InitChain`, `BeginBlock`, `DeliverTx`, `EndBlock`, `Commit` => responsible for block execution, where `InitChain` is only called the first time a new blockchain is started and `DeliverTx` is called for each transaction in the block.
3) Query connection: `Info`, `Query` => initialization and for queries from the user.
4) Snapshot connection: `ListSnapshots`, `LoadSnapshotChunk`, `OfferSnapshot`, `ApplySnapshotChunk` => serving and restoring state sync snapshots when new nodes join the network.

The application can be written in any programming language, due to the use of the ABCI's protocol buffers (protobufs), Google's language-neutral, platform-neutral, extensible mechanism for serializing structured data.

The ABCI is defined through a set of methods and types written in protobufs, each with a `Request` and `Response` message type. To perform a state-machine replication, Tendermint calls the ABCI methods on the ABCI application, sends `Request*` messages and receives `Response*` messages.

**State**
Since Tendermint maintains four concurrent ABCI connections, it is typical for an application to maintain a distinct state for each, and for the states to be synchronized during Commit.

**Transaction Results**
- Gas as an abstract representation of the cost of resources
- CheckTx, DeliverTx response codes
- Events

**Detailed Step-by-Step Communication**

                         +-------------------------------------+
                         v                                     |(Wait til `CommmitTime+timeoutCommit`)
                   +-----------+                         +-----+-----+
      +----------> |  Propose  +--------------+          | NewHeight |
      |            +-----------+              |          +-----------+
      |                                       |                ^
      |(Else, after timeoutPrecommit)         v                |
+-----+-----+                           +-----------+          |
| Precommit |  <------------------------+  Prevote  |          |
+-----+-----+                           +-----------+          |
      |(When +2/3 Precommits for block found)                  |
      v                                                        |
+--------------------------------------------------------------------+
|  Commit                                                            |
|                                                                    |
|  * Set CommitTime = now;                                           |
|  * Wait for block, then stage/save/commit block;                   |
+--------------------------------------------------------------------+
[=> Guiding illustration](https://docs.tendermint.com/master/spec/consensus/consensus.html)
A communication from application to Tendermint can look like this:

1) An application receives user input and pre-processes it into desired transactions that can be submitted to Tendermint.

2) Tendermint validates a transaction with CheckTx before adding to the Mempool. Invalid transactions are rejected and handled by the application.

3) Mempool: Each node maintains its own local instance of the mempool. When a new transaction is successfully applied to a local mempool, it is then broadcasted to all other mempools to declare that it is eligible for inclusion in a block.

4) Tendermint BFT consensus rounds: To determine the next block, Tendermint runs a round-based protocol, where each round has a dedicated proposer. A proceeding round is reached no matter the outcome of the current round, even when a proposer is faulty or suspected as being faulty by enough processes as in PBFT. Each round consists of a sequence of three communication steps:
   - Propose: The proposer selects transactions from the mempool for inclusion in the proposed block and broadcasts the proposed block.
   - Pre-vote: Each validator node broadcasts its prevote in the hope to vote for the block of majority and listens for pre-votes from other nodes (gossip). The resulting pre-vote contains either a valid pre-vote Block or an invalid vote (timeout reached).
   - Pre-commit: Nodes wait to hear pre-votes from >2/3 of other nodes. If >2/3 vote for the same block, they broadcast a pre-commit. Otherwise, they wait a little longer until they hear a >2/3 majority or else for nil. The same pattern is repeated for pre-commits. A >2/3 majority for pre-votes is called Polka and >2/3 majority of pre-commits for a block a Commit.

5) Commit: Once a block has been committed it is applied to the application in a series of ABCI messages, which the application can use to update its state (e.g. by changing the balance of an account). If there are not >2/3 pre-commits for the same block, the block failed to commit and a new round begins with a new proposer

Now consider, that just as Ethermint is a blockchain using Tendermint Core's BFT consensus algorithm, there are many other blockchains built on top of Tendermint. This group of ABCI applications can create a decentralized network of independent parallel blockchains, each powered by Tendermint, which is referred to as a **Cosmos hub**. In order for an ABCI application to be part of a Cosmos hub, it needs to follow the inter-blockchain communication protocol (IBC). The Cosmos SDK provides a framework for developers to easily build a blockchain that uses the Tendermint consensus engine and follows IBC.

At the current state, many applications are built with Tendermint. Even though Cosmos's $17 million ICO in April 2017 sparked a huge interest in blockchain interconnectivity, it is yet to be determined if there are enough interoperability use cases to verify the existence of the network or if the market still needs more time to feel the pains that are promised to be solved by Cosmos's value proposition.

## How can a consensus mechanism like Tendermint be improved?

We can differentiate between two types of consensus mechanism bottlenecks and their improvements: 1) factors that concern the environment in which a consensus is found and 2) the actual rules that define the logic of the consensus mechanism.

**Consensus environment improvements**
- network latency => How to make the network more reliable
- how nodes store information => We want to allow for as many validator nodes as possible, but it may be too costly to store every validator’s signature for every block.

**Consensus Mechanism improvements**
- Sybil resistant mechanisms (PoS, PoW etc.): Who gets to decide?
  - How do we make requirements so low for everyone to participate and increase decentralization but at the same time find a threshold high enough that prevents one actor to participate as multiple identities (proof of authentication)
  - We can lower requirements by decreasing the initial amount to stake
  - To prevent one actor to act as multiple identities when need to implement some kind of behaviour that is hard to replicate, but still accessible (such as authentication through phone numbers instead of an email, as everyone has a phone but the barrier for getting many sim cards is higher than creating several email addresses.)

- Consensus algorithms: How do we come to an agreement on info to get included in the chain?

---------------------------------------------

## Unordered Notes

### Tendermint Core Model

- System of nodes that communicate by exchanging messages
- Each node can be valid or faulty
- Each is connected to a subset of nodes called peers
- peer-2-peer communication between nodes through the gossip protocol
- all messages contain a digital signature, therefore a receiving node can verify who was the original sender of the message m and if the message signature is valid.

### State Machine Replication (SMR)

- Know from data centres running distributed systems with a small number of replicas to increase reliability and scalability.
- State machine replication (SMR) is a general approach for replicating services modelled as a deterministic state machine
- The key idea of this approach is to guarantee that all replicas start in the same state and then apply requests from clients in the same order, thereby guaranteeing that the replicas’ states will not diverge.

### Tendermint's novel Consensus**

Tendermint uses a novel termination mechanism at proposer change compared to traditional PBFT that
- runs in a single execution mode instead of separation between normal and recovery mode
- has a lower degree of message exchange, as it doesn't depend on the number of nodes (processes).

### pBFT
A **practical Byzantine Fault Tolerant (pBFT)** system can function on the condition that the maximum number of malicious nodes must not be greater than or equal to one-third of all the nodes in the system. As the number of nodes increase, the system becomes more secure.

Nodes in a pBFT enabled distributed system are sequentially ordered with one node being the primary (or the leader node) and others referred to as secondary (or the backup nodes). pBFT consensus rounds are broken into 4 phases:

1. The client sends a request to the primary (leader) node.
2. The primary (leader) node broadcasts the request to all the secondary (backup) nodes.
3. The nodes (primary and secondary) perform the service requested and then send back a reply to the client.
4. The request is served successfully when the client receives ‘m+1’ replies from different nodes in the network with the same result, where m is the maximum number of faulty nodes allowed.

The primary(leader) node is changed during every view (pBFT consensus rounds) and can be substituted by a view change protocol if a predefined quantity of time has passed without the leading node broadcasting a request to the backups(secondary). If needed, a majority of the honest nodes can vote on the legitimacy of the current leading node and replace it with the next leading node in line.

**Limitations of pBFT: Security vs. Scaling**
The pBFT mechanisms are susceptible to Sybil attacks, where one entity(party) controls many identities. As the number of nodes in the network increase, Sybil attacks become increasingly difficult to carry out. But the pBFT does not scale well because of its communication(with all the other nodes at every step) overhead. As the number of nodes in the network increase(increases as O(n^k), where n is the messages and k is the number of nodes), so does the time taken to respond to the request.

### Why 2/3 + 1

We denote with n the total voting power of nodes in the system and assume that the total voting power of faulty nodes in the system is f. The algorithm assumes that n > 3f, i.e., it requires that the total voting power of faulty nodes is smaller than one third of the total voting power. For simplicity, we present the algorithm for the case n = 3f + 1.

### Tendermint- Consensus without Mining
- how to measure security of extrinsic (mining) vs intrinsic (stake) power to achieve or disrupt consensus

### Consensus Comparison: Casper vs. Tendermint
Pitfalls of Proof-of-Stake

**Nothing at stake**
The problem presents this scenario: validators can effectively break safety by voting for multiple conflicting blocks at a given block height without incurring cost for doing so.
The economically optimal strategy becomes voting on as many forks as you can find in order to reap more block reward

**Long Range Attacks**
The long range attack draws from the right that users have to withdraw their security deposits.
When more than ⅔ of the validators have unbonded, they could maliciously create a second chain that included the past validator set, which could result in arbitrary alternative transactions.

Casper(s) and Tendermint adopt a simple locking mechanism (colloquially called ‘freezing’ in Tendermint) which “locks” stake for a certain period of time (weeks to months of ‘thawing’) in order to prevent any malicious coalition of validators from violating safety

**Cartel Formation**

**Casper: Chain-based Proof-of-Stake**
The protocol assigns the right to commit a single new block to a pseudorandomly-selected validator, where the new block is hash-linked to a parent block of the previously longest chain.
Chain-based PoS relies largely on synchronous networks, generally prioritizing availability over consistency.
Casper(s) is an adaptation of the core ideas of Tendermint to a setting that prefers liveness over safety.

### Protobufs

Protocol Buffers (protobufs) are Google's language-neutral, platform-neutral, extensible mechanism for serializing structured data.

- Message Format: The definition of data to be serialized is written in Proto files (.proto). Configuration as `messages`. The actual messages are just number encodings, where each number represents an alias that only the schema can use to decode the correct message.
- Binary Transfer format => improves the speed of transmission as it consumes less space and RAM than raw string transmission. Faster than json or xml. Don't need to be human-readable and therefore are especially used in server-to-server communication (distributed Systems, microservices)
- Separation of context & Data: Schemas are great to ensure that signals don't get lost between applications and to enforce business rules
- Easy language Interoperability
- Use JSON instead, when data should be human readable, directly consumed by a web browser, server-side application is written in JavaScript or the operation burden of running a different kind of network service is too great.

### Cosmos

**4 Elements in Cosmos**
Atoms - a license for holders to stake and vote
Validators - responsible for committing new blocks
Zones - blockchains that can exchange values through Hubs
Hubs - A blockchain that let Zones work together

**Positives for Cosmos**
- 10,000 TPS, 1 second finality
- You can simulate many blockchains on this (Ethereum, Bitcoin, etc) and replicate PoW blockchains with PoS.
- Energy Efficient compared to PoW

**Negatives for Cosmos**
- 1/3 validators go rogue is less than 51% needed for an attack on BTC?
- Been in development for almost 1 year, only 74% complete
- Lack of interest?

---------------------------------------------

## Challenge
The goal of this challenge is to see if you can grok protocols well enough to suggest improvements, push architectural decisions and see how well you work with new and lesser-known info. Feel free to poke us with questions or ask your friends to help teach you, we encourage resourcefulness.

## Deliverables
Write a Markdown file (.md ) in Hackmd or GitHub with your answers and any visuals and you are free to reference it while we discuss on a call.

We are mainly going to focus on your understanding versus the content but our experience is that it is very useful to be detailed with notes. We don't expect you to know everything and we try to give as many places to shine as possible.


## References:

Tendermint Core docs: https://docs.tendermint.com/
"The latest gossip on BFT consensus": https://arxiv.org/abs/1807.04938
"Tendermint: Consensus without mining": https://api.semanticscholar.org/CorpusID:52061503
Specification: https://docs.tendermint.com/master/spec/
Tendermint Core (Go): https://github.com/tendermint/tendermint
Safety and Liveness: https://medium.com/codechain/safety-and-liveness-blockchain-in-the-point-of-view-of-flp-impossibility-182e33927ce6
Casper vs Tendermint: https://blog.cosmos.network/consensus-compare-casper-vs-tendermint-6df154ad56ae
Tendermint in a Nutshell: https://docs.tendermint.com/master/assets/img/tm-transaction-flow.258ca020.png