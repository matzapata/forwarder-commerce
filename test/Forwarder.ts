import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hardhat, { ethers } from "hardhat";

describe("Forwarder", function () {
  async function deployFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await hardhat.ethers.getSigners();

    // deploy the forwarder
    const Forwarder = await hardhat.ethers.getContractFactory("Forwarder");
    const forwarder = await Forwarder.deploy(otherAccount.address);
    const forwarderAddress = await forwarder.getAddress()

    // deploy an erc20
    const ERC20 = await hardhat.ethers.getContractFactory("TestToken");
    const erc20 = await ERC20.deploy(ethers.parseEther("1000"));
    const erc20Address = await erc20.getAddress()

    return { forwarder, forwarderAddress, owner, otherAccount, erc20, erc20Address };
  }

  describe("Deployment", function () {
    it("Should set the right forwardTo", async function () {
      const { forwarder, otherAccount } = await loadFixture(deployFixture);

      expect(await forwarder.forwardTo()).to.equal(otherAccount.address);
    });
  });

  describe("Flush native", function () {
    it("Should receive native funds", async function () {
      const { forwarderAddress, owner } = await loadFixture(
        deployFixture
      );

      // send some native to the forwarder
      expect(owner.sendTransaction({
        to: forwarderAddress,
        value: ethers.parseEther("1.0"),
      })).not.to.be.reverted;
    });

    it("Should transfer the funds to the forwardTo address no matter the sender", async function () {
      const { forwarder, forwarderAddress, owner, otherAccount } = await loadFixture(
        deployFixture
      );

      // send some native to the forwarder
      await owner.sendTransaction({
        to: forwarderAddress,
        value: ethers.parseEther("1.0"),
      });

      // forward the funds
      const tx = await forwarder.connect(owner).flushNative();

      // check the balances
      expect(tx).to.changeEtherBalances(
        [otherAccount, forwarder],
        [ethers.parseEther("1.0"), -ethers.parseEther("1.0")]
      );
    });
  })

  describe("Flush erc20", function () {
    it("Should transfer the funds to the forwardTo address no matter the sender", async function () {
      const { forwarder, forwarderAddress, owner, otherAccount, erc20, erc20Address } = await loadFixture(
        deployFixture
      );

      // send some erc20 to the forwarder
      await erc20.connect(owner).transfer(forwarderAddress, ethers.parseEther("1.0"));

      // forward the funds
      await forwarder.connect(owner).flushToken(erc20Address);

      // check the balances
      expect(await erc20.balanceOf(otherAccount.address)).to.equal(ethers.parseEther("1.0"));
      expect(await erc20.balanceOf(forwarderAddress)).to.equal(0);
    });
  })
});
