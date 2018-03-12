pragma solidity ^0.4.11;

import "./KyberInterface.sol";
import "./ERC20Interface.sol";
import "./OnlyToken.sol";

contract SwapEth 
{
  event Swap(uint value, address kyberInterfaceAddress , address srcToken,
  uint srcAmount, address destToken, address thisAddress,address msgAddress, uint amountReturn );

  function swapEthOnKyber(address _kyberInterfaceAddress, ERC20 srcToken, uint srcAmount, ERC20 destToken, 
  uint maxDestAmount, uint minConversionRate, address walletId, address onlyTokenAddress)public payable 
  {
    KyberInterface aKyberInterface = KyberInterface(_kyberInterfaceAddress);
    OnlyToken aOnlyToken = OnlyToken(onlyTokenAddress);
    uint amountReturn = aKyberInterface.trade.value(msg.value)(
        srcToken,
        srcAmount,
        destToken,
        this,
        maxDestAmount,
        minConversionRate,
        walletId
    );  //https://github.com/KyberNetwork/smart-contracts/blob/master/integration.md
    aOnlyToken.deposit(amountReturn);
    Swap(msg.value, _kyberInterfaceAddress, srcToken,
    srcAmount, destToken, this, msg.sender, amountReturn);
  }

  function approveOnlyToken(address onlyTokenAddress, address destToken, uint maxDestAmount)
  {
    ERC20 omgToken = ERC20(destToken);
    require(omgToken.approve(onlyTokenAddress, maxDestAmount));
  }

  function() payable {} //Fallback Function
}
