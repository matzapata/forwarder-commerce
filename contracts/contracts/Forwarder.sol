// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Forwarder {
    address public forwardTo;

    event ForwarderFlushed(address to, address flusher, address token, uint value);

    constructor(address _forwardTo) {
        forwardTo = _forwardTo;
    }

    function flush(address token) public {
        if (token == address(0)) {
            flushNative();
        } else {
            flushToken(token);
        }
    }

    function flushNative() private {
        // Forward all funds to parent address
        uint256 balance = address(this).balance;
        (bool success, ) = forwardTo.call{value: balance}("");
        require(success, "Flush failed");

        emit ForwarderFlushed(forwardTo, msg.sender, address(0), balance);
    }

    function flushToken(address token) private {
        // Forward all tokens to parent address
        IERC20 tokenInstance = IERC20(token);
        uint256 balance = tokenInstance.balanceOf(address(this));
        if (balance == 0) {
            return;
        }
        tokenInstance.transfer(forwardTo, balance);

        emit ForwarderFlushed(forwardTo, msg.sender, token, balance);
    }

    //  Default function; Gets called when native is deposited, and forwards it to the parent address
    receive() external payable {}
}
