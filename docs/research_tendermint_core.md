# Tendermint

Find below the result of my research on the Tendermint protocol and related topics. The goal is to understand [Tendermint Core](https://docs.tendermint.com/) at a strong conceptual level.

- State machine replication with BFT
- instant finality
- Limitations of Safety and Liveness
- Why Asynchronous Consensus makes Tendermint more secure
- Using ABCI to work with state machines written in any programming language
- Connection to Cosmos & Cosmos SDK


<!-- TODO to complete the research -->
[ ] Review all References
[x] High Level answer to each question (explain to a kid)
[x] Find a story to tell => abstract for Tendermint noobs
[ ] Research Details
[ ] Rewriting, and Formatting


## Intro/Abstract: Why do we need Consensus mechanisms like Tendermint: Consensus in distributed networks vs. Web applications**

Both in distributed networks and concurrent web applications we create requests or send messages over networks. As soon as we perform these requests/messages, we need to assume, that they can be delayed or fail because of network failures.

We, therefore, build asynchronous network mechanisms and idempotent operations to handle failed, malicious or several concurrent identical requests without causing network failures or changes beyond an expected state. This is because we decouple the what from the when.

Whereas many web applications use asynchronous mechanisms at a smaller scale, distributed networks use asynchronous mechanisms to upkeep a network of validators that agree on transactions and store critical business data on a ledger.

A secure consensus algorithm is required to ensure the correctness of the ledger's state amongst all participants in the network and protect the network from malicious attacks.

This is where Tendermint comes into play as a state replication machine that securely and consistently replicates an application on many machines through Byzantine Fault Tolerance (BFT).

## What is Byzantine Fault Tolerance (BFT)? Why is BFT relevant in the context of blockchains?

Byzantine Fault Tolerance (BFT) is the property of any group of people/machines that agree on a decision (find consensus) even though they don't trust each other. Blockchains are distributed systems in which nodes regularly need to find consensus on the system's state. They can use consensus algorithms that are byzantine to reach consensus even if there are faulty/malicious nodes.


<!-- TODO Organize details -->
- BFT is a property of a consensus algorithm that tries to prevent malicious attacks.
- Consensus algorithms are used in distributed systems that regularly need to agree on values.
- and BFT describes how

**Byzantine General's Problem**: Logical dilemma that demonstrates communication problems when a group of generals need to agree on the next move.

- Each general has to decide
- vote cannot be changed
- All generals need to agree on the same move
- They can only communicate through messages. Problem is, the messages can get delayed, destroyed or lost.
- Malicious messages could prevent the consensus

**Byzantine Fault Tolerance** is the property of a system, in which multiple trustless participants find agreement on the same value (reach a consensus) and continue to operate, even if some of the participants fail to communicate or act maliciously.

A bunch of people, none of whom trust each other are all trying to come to an agreement on a yes or no question and we have to come to a moment where I know we have reached a decision.

A system can be called byzantine. In order to be byzantine:
- I have to decide yes or no and I can't change my decision.
- I have to have a mathematical guarantee that we all reach the same decision.
- I know I am going to reach a consensus, and I'll know I've reached consensus and I know that I know and I know that it's mathematically guaranteed that we all agree.

A BFT We want to prove it even if almost 1/3 of us are dishonest.

A **practical Byzantine Fault Tolerant (pBFT)** system can function on the condition that the maximum number of malicious nodes must not be greater than or equal to one-third of all the nodes in the system. As the number of nodes increase, the system becomes more secure.

Nodes in a pBFT enabled distributed system are sequentially ordered with one node being the primary (or the leader node) and others referred to as secondary (or the backup nodes). pBFT consensus rounds are broken into 4 phases:

1. The client sends a request to the primary (leader) node.
2. The primary (leader) node broadcasts the request to the all the secondary (backup) nodes.
3. The nodes (primary and secondaries) perform the service requested and then send back a reply to the client.
4. The request is served successfully when the client receives ‘m+1’ replies from different nodes in the network with the same result, where m is the maximum number of faulty nodes allowed.

The primary(leader) node is changed during every view(pBFT consensus rounds) and can be substituted by a view change protocol if a predefined quantity of time has passed without the leading node broadcasting a request to the backups(secondary). If needed, a majority of the honest nodes can vote on the legitimacy of the current leading node and replace it with the next leading node in line.

**Limitations of pBFT: Security vs. Scaling**
The pBFT mechanisms are susceptible to Sybil attacks, where one entity(party) controls many identities. As the number of nodes in the network increase, sybil attacks become increasingly difficult to carry out. But the pBFT does not scale well because of its communication(with all the other nodes at every step) overhead. As the number of nodes in the network increase(increases as O(n^k), where n is the messages and k is the number of nodes), so does the time taken to respond to the request.


## Understand what finality means in blockchains.

In blockchains, a transaction has reached finality if it is included in a block that is considered immutable. It is the guarantee that a transaction cannot be reversed, changed or cancelled after it has been executed.

Often finality is referred to as the time it takes for a transaction to be considered immutable. E.g. in Bitcoin, it takes a transaction up to 60 minutes (6 blocks in on the ledger) to reach finality. That means there is a timeframe in which a transaction might be vulnerable to attacks from bad actors trying to take advantage of blockchains with weak finality.

<!-- TODO Details: Does Tendermint or Ethermint or Ethermint through Tenermint  achieve instant finality?  -->

**Instant finality** uses a pBFT protocol (a voting-based consensus algorithm) where transactions are considered final immediately in the first block. The users can vote for a leader who approves a block. Then a committee of validators, who are also voted in, approve the decision and then add it to the block instantly.


## Explain and understand the tradeoffs of safety over liveness (i.e BFT vs Nakamoto Consensus chains). Why does this matter and what are the restrictions for design?

Safety and liveness are properties that describe the correctness of consensus algorithms. Safety properties state that bad events never happen and liveness properties state that some good events should eventually happen.

Applied to distributed systems, consensus safety describes that consensus with different values cannot occur and consensus liveness guarantees that eventually, all nodes must come to a final agreement on the state and not fall under infinite loops.

The guarantees of these correctness properties have been proven to be impossible to achieve simultaneously if we consider a distributed system, in which at least one processor may have a crash failure (proven in April 1985 by Fischer, Lynch and Patterson in their short paper ‘Impossibility of Distributed Consensus with One Faulty Process’). This inability of any deterministic consensus algorithm is known as the FLP impossibility and describes the tradeoff between safety and liveness.

If a safety or liveness guarantee is too strong, it is impossible to implement them and you need to consider weaker safety or liveness properties.

<!-- TODO => Add overview of mathmatical intersections of corecctness properties -->

Today, there are multiple different implementations of consensus algorithms used in distributed systems. Let's look at two widely considered implementations where one correctness parameter is favoured of the other:

**Nakamoto Consensus**
- Proof of Work
- Bitcoin, Ethereum
- Allows malicious attack by a chain with at least 51% of the current chains computing power, as its hashing power allows the creation of a longer chain than the current chain
- Therefore it guarantees liveness over safety and finality is not guaranteed.

**BFT style consensus**
- Proof of Stake
- Tendermint (used by Cosmos)
- Allows blocks to never be created because a consensus is not reached, due to an asynchronous network where messages are not guaranteed to arrive on time. Consensus happens in several voting rounds (propose, provote, precommit) in which the last two stages require at least a `2/3 + 1` majority of votes.
- Therefore it guarantees safety over liveness.

Bitcoin's Nakamoto chain is regarded as one of the most secure implementations of blockchain networks as there are no commonly considered records of successful malicious attacks.

<!-- TODO Details: Why does this matter and what are the restrictions for design? -->
<!-- What is considered a byzantine failure? -->

## What is Synchrony, Asynchrony, Partial Synchrony? Why is it relevant to Tendermint?

In distributed systems, the terms Synchrony, Asynchrony and Partial Synchrony describe whether a consensus algorithm is dependent on the time it takes a message to be sent from one node to another and the relative speeds of different nodes while finding consensus.

A distributed network is considered byzantine with total asynchrony if messages are not guaranteed to arrive within a defined time frame. The consensus algorithm doesn't make any assumptions based on time to ensure the consensus protocol's correctness.

Conversely, in a synchronous network, messages are guaranteed to be delivered within a specific time frame. As mentioned in the abstract, this is an unrealistic assumption if we consider that requests sent over any network may fail or be delayed.

Partial synchrony lies between the cases of a synchronous system and an asynchronous system where the time variables of the consensus are not known a priori. Messages are guaranteed to arrive in a set amount of time but it is not known what that set amount of time exactly is.
Although partial synchronous network models guarantee that a consensus will be reached at some point in the future, in the worst case, a new block may not be created for a couple of rounds. This results in a decrease in TPS (transactions per second).

Tendermint uses the partial synchronous network model as it is a very realistic model and networks mostly guarantee to have messages arrive if there are no omission failures.

<!-- TODO Details Why is it relevant to Tendermint?  -->


**Design Problems of Partial Synchrony**

The problem is to design protocols that work correctly in the partially synchronous system regardless of the actual values of the bounds Δ and Φ.
In another version of partial synchrony, the bounds are known, but are only guaranteed to hold starting at some unknown time T, and protocols must be designed to work correctly regardless of when time T occurs.
Fault-tolerant consensus protocols are given for various cases of partial synchrony and various fault models. Lower bounds that show in most cases that our protocols are optimal with respect to the number of faults tolerated are also given. Our consensus protocols for partially synchronous processors use new protocols for fault-tolerant “distributed clocks” that allow partially synchronous processors to reach some approximately common notion of time.

Asynchronous Byzantine means that I make no assumptions based on time. If attackers control the whole internet and the only rule is: If I keep sending you messages and they can delete as many messages as they want but eventually one of them has to get through, then we have reached asynchronous byzantine.

Partial synchrony exists in a system where the consensus of messages is expected within a specific timeframe (need to make assumptions about timing).

The problem of many deployed systems is that they give you strong guarantees as long as there are no organized malicious attacks (e.g. botnets).


## Explain how an application communicates with the Tendermint Consensus Engine (ABCI). How does it relate to Cosmos and the Cosmos SDK?

An application interacts with the Tendermint Core Consensus Engine over ABCI (Application Blockchain Interface). Together, the application and Tendermint Core form the programs to run a complete blockchain that combines business logic with decentralized data storage.

The application can be written in any programming language, due to the use of the ABCI's protocol buffers (protobufs), Google's language-neutral, platform-neutral, extensible mechanism for serializing structured data.

Tendermint Core is a state-machine replication engine that makes requests to the application (the actual state machine) every time a new transaction is received or a block is committed.

The ABCI is defined through a set of methods written in protobufs, each with a `Request` and `Response`message type. To perform a state-machine replication, Tendermint calls the ABCI methods on the ABCI application, sends `Request*` messages and receives `Response*` messages.

Now consider, that just as Ethermint is a blockchain using Tendermint Core's BFT consensus algorithm, there are many other blockchains built on top of Tendermint. This group of ABCI applications creates a decentralized network of independent parallel blockchains, each powered by Tendermintm, which is referred to as the Cosmos network.



<!-- TODO Details: What are the steps and components during the communication: https://docs.tendermint.com/master/assets/img/tm-transaction-flow.258ca020.png-->

A communication from application to Tendermint can look like this:
- Transaction submission: Applications pre-process user input into desired commands for submission to tendermint.
- Transaction validation with CheckTx before adding the tx to mempool
- Mempool: Transactions in the mempool are broadcasted
...

**Protocol Buffers** (a.k.a., protobufs) are Google's language-neutral, platform-neutral, extensible mechanism for serializing structured data.

- Message Format: The definition of data to be serialized is written in Proto files (.proto). Configuration as `messages`. The actual messages are just number encodings, where each number represents an alias that only the schema can use to decode the correct message.
- Binary Transfer format => improves speed of transmission as it consumes less space and RAM than raw string transmission. Faster than json or xml. Don't need to by human readable and therfore are especially used in server-to-server communication (distributed Systems, micro services)
- Separation of context & Data: Schemas are great to ensure that signals don't get lost between applications and to enforce business rules
- Easy langage Interoperability
- Use json instead, when data should be human readable, directly consumed by a web browser, server side application is written in JavaScript or the operation burden of running a different kind of network service is too great.


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
- 1/3 validators goes rogue is less than 51% needed for attack on BTC?
- Been in development for almost 1 year, only 74% complete
- Lack of interest?






---------------------------------------------

## Challenge
The goal of this challenge is to see if you can grok protocols well enough to suggest improvements, push architectural decisions and see how well you work with new and lesser-known info. Feel free to poke us with questions or ask your friends to help teach you, we encourage resourcefulness.

## Deliverables
Write a Markdown file (.md ) in Hackmd or GitHub with your answers and any visuals and you are free to reference it while we discuss on a call.

We are mainly going to focus on your understanding versus the content but our experience is that it is very useful to be detailed with notes. We don't expect you to know everything and we try to give as many places to shine as possible.



### References:

Tendermint Core docs: https://docs.tendermint.com/
"The latest gossip on BFT consensus": https://arxiv.org/abs/1807.04938
"Tendermint: Consensus without mining": https://api.semanticscholar.org/CorpusID:52061503
Specification: https://docs.tendermint.com/master/spec/
Tendermint Core (Go): https://github.com/tendermint/tendermint
Safety and Liveness: https://medium.com/codechain/safety-and-liveness-blockchain-in-the-point-of-view-of-flp-impossibility-182e33927ce6
Casper vs Tendermint: https://blog.cosmos.network/consensus-compare-casper-vs-tendermint-6df154ad56ae