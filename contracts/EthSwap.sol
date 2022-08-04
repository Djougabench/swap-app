// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "./WariToken.sol";

contract EthSwap {
    string public name = "EthSwap Exchange";
    WariToken public token;
    uint256 public rate = 100;

    event TokensPurchased(
        address account,
        address token,
        uint256 amount,
        uint256 rate
    );

    event TokensSold(
        address account,
        address token,
        uint256 amount,
        uint256 rate
    );

    constructor(WariToken _token) {
        token = _token;
    }

    function buyTokens() public payable {
        // Redemption rate = # of tokens they receive for 1 ether
        // Amount of Ethereum * redemption rate

        //calculate the number of tokens to buyuint256
        uint256 tokenAmount = msg.value * rate;

        //require that EthSwap as enough tokens
        require(
            token.balanceOf(address(this)) >= tokenAmount,
            "Not enough tokens in the contract for the transaction"
        );

        //transfer token to the user
        token.transfer(msg.sender, tokenAmount);

        emit TokensPurchased(msg.sender, address(token), tokenAmount, rate);
    }

    function sellTokens(uint256 _amount) public {
        // User can't sell more tokens than they have
        require(
            token.balanceOf(msg.sender) >= _amount,
            "You don't have have enough token to sell"
        );

        // Calculate the amount of Ether to redeem
        uint256 etherAmount = _amount / rate;

        // Require that EthSwap has enough Ether
        require(
            address(this).balance >= etherAmount,
            "not enought ether in the contract for the transaction"
        );

        // Perform sale
        token.transferFrom(msg.sender, address(this), _amount);
        (bool sentSuccess, ) = payable(msg.sender).call{value: etherAmount}("");
        require(sentSuccess, "Failed to send Ether");

        // Emit an event
        emit TokensSold(msg.sender, address(token), _amount, rate);
    }
}
