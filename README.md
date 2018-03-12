The propose of these two contracts is to exchange from any kind of token to a specific kind of token(at this moment it is OMG, but in time it will be changed to RLC) on using the KyberNetwork.

The KyberNetwork provides the means to exchange the tokens from one to another, and their contracts have already been deployed on the ropsten. You need to deploy our contract on the ropsten as well, however, you need to have a node in the ropsten so that you can watch the events of the contracts.  What we did was to build a node on the server of the amazon web service (aws), and to include our computer as an account in the authorized list of the server. This requires the use of the secure shell (ssh).

Then you need to configure the truffle.js and add the network ropsten like this:

ropsten: {
      host: 'SERVER_IP_ADDRESS',
      port: 8545,
      network_id: "3",
      gas: 4400000,
      gasPrice: 22000000000,
      from: 'YOUR_WALLET_PUBLIC_KEY',
},

Then, you need to open a terminal, type in the following command so that you can execute your commands remotely on the server:

ssh ubuntu@"ip_address"

Then, type in the following command to acquire the id of the container that holds the image of the running node, the container is using the port configured in the truffle.js, then the next command allows you to get into the container:

docker ps

docker exec -it <container-id> sh

Then, type in the following command to go to the certain direction. Your account (included in the authorized list of the server) is normally locked, so by the time you are ready to deploy the contract, unlock the account by typing in the next command. Every time you unlock the account it will only last for a limited period of time, so you might need to unlock the account from time to time if the deploying takes a long time.

cd /root/.ethereum/testnet/keystore/

geth --testnet --exec "personal.unlockAccount('YOUR_WALLET_PUBLIC_KEY')" attach http://localhost:8545

These are the preparations of the deployment. Then you are going to see the description of the contract.

SwapEth.sol
The SwapEth is the contract which execute the exchange, inside it there is an event Swap which contains all the relevant variables of the function swapEthOnKyber, this is just for the test and you can always add or delete any variable. However, the maximum amount of variables in the contract is about 16.  

The function swapEthOnKyber uses the function trade in the interface KyberInterFace, this is the main function of our contract, it includes another contracct OnlyToken which will be introduced later and it includes the event Swap.

The function approveOnlyToken uses the function approve in the interface ERC20, this function gets the approval for the contract OnlyToken which sets a certain amount of transfer the contract can receive, without it the functoin deposit in the contract OnlyToken (to be specific the transferFrom) won't work.

The unnamed function is called the fallback function, One contract can have one at most. This function have no arguments and return nothing. It is executed on a call to the contract if none of the other functions match the given function identifier (or if no data was supplied at all). You need to first transfer token to the contract then to exchange it with the desired token, they can't be done simultaneously.

OnlyToken.sol
The function OnlyToken is the constructor, it gives the object token an address so that locally it represents the token and have the functions of the interface ERC20.

The function deposit uses the function transferFrom in the interface ERC20 in the ERC20Interface, and it creates the event Deposits.

The functions showBalance returns the balance of the contract OnlyToken.

Test.js

This part is for testing the functionality of the contract, in the meantime it demonstrates how the contract works as well.

First you need to prepare the variables and the contract instances aSwapEthInstance and aOnlyTokenInstance, these 2 instances will receive tokens and pass to other contracts. As for the variables, the destToken should be the address of the token you want, in order to get the correct address, go to https://kyber.network/ and make an exchange so that you will be able to find the address in the event; the _kyberInterfaceAddress is the address of the kyber; the srcToken is the token you have, the testeur will be your wallet's public key. The web3.eth package allows you to interact with an Ethereum blockchain and Ethereum smart contracts. we can get the balance of the contract and send token from one address to another. Then use the function approveOnlyToken to get approval and swapEthOnKyber to exchange the token. Remember to include the necessary variable, like the address of the wallet and the gas.

Assert is for assessing if the outcome is what you want.

In order to run the test, first, unlock your account at the node as instructed before. At the root folder, open a terminal, type in the following command to run the test:

truffle test --network ropsten

Wait and you shall see the result of the test, you can see the logs like the following at the end:

logs:
 [ { address: '0x69648561a31d6e45ce8bbaeb0026fb48bae8fd09',
     blockNumber: 2788527,
     transactionHash: '0x0edb152aba0167c1453585a6198a53487363b61340a96a7273c984a4eb0a4876',
     transactionIndex: 2,
     blockHash: '0xba94612478ebd525dff5b05ac01066ec3357c3e984d41926773259cd4692756b',
     logIndex: 6,
     removed: false,
     event: 'Swap',
     args: [Object] } ] }

You can go to https://ropsten.etherscan.io/ and type in the transactionHash to find the transaction of the test you have just made.

In order to deploy the contract, type in the following command:

truffle migrate --network ropsten

Since the kyber is deployed on the ropsten, this contract can only be deployed on the ropsten as well.
