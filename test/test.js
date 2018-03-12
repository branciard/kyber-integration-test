var SwapEth = artifacts.require("./SwapEth.sol");
var OnlyToken = artifacts.require("./OnlyToken.sol");
const Promise = require("bluebird");
const keccak256 = require("solidity-sha3");
//extensions.js : credit to : https://github.com/coldice/dbh-b9lab-hackathon/blob/development/truffle/utils/extensions.js
const Extensions = require("../utils/extensions.js");
const addEvmFunctions = require("../utils/evmFunctions.js");
addEvmFunctions(web3);
Promise.promisifyAll(web3.eth, {
  suffix: "Promise"
});
Promise.promisifyAll(web3.version, {
  suffix: "Promise"
});
Promise.promisifyAll(web3.evm, {
  suffix: "Promise"
});
Extensions.init(web3, assert);
contract('IexecHub', function(accounts) {
  console.log("accounts is " + accounts);

  let testeur;
  let amountGazProvided = 4000000;
  let isTestRPC;
  let testTimemout = 0;
  let aSwapEthInstance;
  let destToken =    '0x5b9a857e0C3F2acc5b94f6693536d3Adf5D6e6Be';
  let aOnlyTokenInstance;
  let _kyberInterfaceAddress = '0x0a56d8a49E71da8d7F9C65F95063dB48A3C9560B';
  let srcToken = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';
  let srcAmount = 1;
  let maxDestAmount = 8000000000000000000000000000000000000000000000000000000000000000;
  let minConversionRate = 1;
  let walletId =  '0x0000000000000000000000000000000000000000';

  before("should prepare accounts and check TestRPC Mode", async () => {
    assert.isAtLeast(accounts.length, 1, "should have at least 1 account");
    testeur = accounts[0];

    console.log("1");

    await Extensions.makeSureAreUnlocked(
      [testeur]);
    let balance = await web3.eth.getBalancePromise(testeur);
    console.log("testeur  " + testeur);

    assert.isTrue(
      web3.toWei(web3.toBigNumber(2), "ether").lessThan(balance),
      "dappProvider should have at least 2 ether, not " + web3.fromWei(balance, "ether"));

    let node = await web3.version.getNodePromise();
    isTestRPC = node.indexOf("EthereumJS TestRPC") >= 0;
    aOnlyTokenInstance = await OnlyToken.new(destToken,{
      from: testeur
    });
    console.log("aOnlyTokenInstance.address is");
    console.log(aOnlyTokenInstance.address);

    aSwapEthInstance = await SwapEth.new({
      from: testeur
    });
    console.log("aSwapEthInstance.address is");
    console.log(aSwapEthInstance.address);

    let balanceContract = await web3.eth.getBalancePromise(aSwapEthInstance.address);

    console.log("balanceContract initial is " + balanceContract);
  });


  it("swapEth", async function() {
    let txMined;
    let balance2 = await web3.eth.getBalancePromise(testeur);
    console.log("balance testeur is " + balance2);
    console.log("2");

    let balanceConBe = await web3.eth.getBalancePromise(aSwapEthInstance.address);
    console.log("balance contract before is " + balanceConBe);

    let txSent = await web3.eth.sendTransactionPromise({
      from: testeur,
      to: aSwapEthInstance.address,
      gas: amountGazProvided,
      value: srcAmount,
      gasPrice: 22000000000
    });

    txMined = await web3.eth.getTransactionReceiptMined(txSent);
    console.log("txMined" + txMined);

    let balanceConAf = await web3.eth.getBalancePromise(aSwapEthInstance.address);
    console.log("balance contract after is ");
    console.log(balanceConAf);
    txMined = await aSwapEthInstance.approveOnlyToken(aOnlyTokenInstance.address, destToken, maxDestAmount,{
      from: testeur,
      gas: amountGazProvided
    });

    console.log("3");

    txMined2 = await aSwapEthInstance.swapEthOnKyber(_kyberInterfaceAddress, srcToken,
    srcAmount, destToken, maxDestAmount, minConversionRate, walletId, aOnlyTokenInstance.address,{
      from: testeur,
      gas: amountGazProvided,
      value: srcAmount
    });

    console.log("4");

    let balance  = await aOnlyTokenInstance.showBalance.call({});
    console.log("balance of onlyToken is   "+balance);

    console.log("5");

    assert.isBelow(txMined.receipt.gasUsed, amountGazProvided, "should not use all gas");
                 console.log("txMined after swap");
                 console.log(txMined);

    assert.isBelow(txMined2.receipt.gasUsed, amountGazProvided, "should not use all gas");
                 console.log("txMined2 after swap");
                 console.log(txMined2);

    console.log("6");

    let events = await Extensions.getEventsPromise(aSwapEthInstance.Swap({})); //watch
//console.log("events[0]" + events[0]);
    assert.strictEqual(events[0].args.value.toNumber(), srcAmount, "check input");

  });
});
