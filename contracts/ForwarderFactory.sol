// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "./Forwarder.sol";

contract ForwarderFactory {
    event ForwarderCreated(address forwarder, address forwardTo);

    function createForwarder(
        address _forwardTo,
        bytes32 _salt
    ) public returns (address) {
        Forwarder _contract = new Forwarder{salt: _salt}(_forwardTo);

        emit ForwarderCreated(address(_contract), _forwardTo);

        return address(_contract);
    }

    function computeAddress(
        address _forwardTo,
        bytes32 _salt
    ) public view returns (address) {
        bytes memory bytecode = abi.encodePacked(type(Forwarder).creationCode, abi.encode(_forwardTo));
        bytes32 hash = keccak256(
            abi.encodePacked(
                bytes1(0xff), address(this), _salt, keccak256(bytecode)
            )
        );

        return address (uint160(uint(hash)));
    }
}
