import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hardhat from "hardhat";
import { sha3 } from '@netgum/utils';

describe("ForwarderFactory", function () {
  async function deployFixture() {
    const [owner, otherAccount] = await hardhat.ethers.getSigners();

    // deploy the forwarder
    const ForwarderFactory = await hardhat.ethers.getContractFactory("ForwarderFactory");
    const forwarderFactory = await ForwarderFactory.deploy();
    const forwarderFactoryAddress = await forwarderFactory.getAddress()


    return { forwarderFactory, forwarderFactoryAddress, owner, otherAccount };
  }

  describe("computeAddress", function () {
    it("Should output the same result for the same salt", async function () {
      const { forwarderFactory, otherAccount } = await loadFixture(deployFixture);

      const salt = sha3(Date.now());
      expect(await forwarderFactory.computeAddress(otherAccount.address, salt)).to.equal(await forwarderFactory.computeAddress(otherAccount.address, salt));
    });
  });

  describe("createContract", function () {
    it("Should create contract", async function () {
      const { forwarderFactory, otherAccount } = await loadFixture(deployFixture);

      const salt = sha3(Date.now());
      try {

        const tx = await forwarderFactory.createForwarder(otherAccount.address, salt);
        const receipt = await tx.wait();
      } catch (error) {
        console.log(error);
      }
    });

    it("Should fail to create contract with the same salt and forwardTo", async function () {
      const { forwarderFactory, otherAccount } = await loadFixture(deployFixture);

      const salt = sha3(Date.now());
      await forwarderFactory.createForwarder(otherAccount.address, salt);
      await expect(forwarderFactory.createForwarder(otherAccount.address, salt)).to.be.reverted;
    });

    it("Should create the contract in the computed address", async function () {
      const { forwarderFactory, otherAccount } = await loadFixture(deployFixture);

      const salt = sha3(Date.now());
      const forwardTo = otherAccount.address;
      const computedAddress = await forwarderFactory.computeAddress(forwardTo, salt);
      await forwarderFactory.createForwarder(forwardTo, salt);

      // get events from forwarderFactory
      const events = await forwarderFactory.queryFilter(forwarderFactory.filters.ForwarderCreated())

      expect(events).to.have.lengthOf(1);
      expect(events[0].args[0]).to.equal(computedAddress);
      expect(events[0].args[1]).to.equal(forwardTo);
    })

    it("Should emit an event with the created contract address and the forwardTo", async function () {
      const { forwarderFactory, otherAccount } = await loadFixture(deployFixture);

      const salt = sha3(Date.now());
      const forwardTo = otherAccount.address;
      await forwarderFactory.createForwarder(forwardTo, salt);

      // get events from forwarderFactory
      const events = await forwarderFactory.queryFilter(forwarderFactory.filters.ForwarderCreated())

      expect(events).to.have.lengthOf(1);
      expect(events[0].args[0]).to.exist;
      expect(events[0].args[1]).to.equal(forwardTo);
    })
  });
});
