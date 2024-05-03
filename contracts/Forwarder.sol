// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Forwarder {
    address public forwardTo;

    // events
    event ForwarderFlushedNative(address to, uint value);
    event ForwarderFlushedToken(address to, address token, uint value);

    constructor(address _forwardTo) {
        forwardTo = _forwardTo;
    }

    function flushNative() public {
        // Forward all funds to parent address
        (bool success, ) = forwardTo.call{value: address(this).balance}("");
        require(success, "Flush failed");

        emit ForwarderFlushedNative(forwardTo, address(this).balance);
    }

    function flushToken(address token) public {
        // Forward all tokens to parent address
        IERC20 tokenInstance = IERC20(token);
        uint256 balance = tokenInstance.balanceOf(address(this));
        if (balance == 0) {
            return;
        }
        tokenInstance.transfer(forwardTo, balance);

        emit ForwarderFlushedToken(forwardTo, token, balance);
    }

    //  Default function; Gets called when native is deposited, and forwards it to the parent address
    receive() external payable {}
}
