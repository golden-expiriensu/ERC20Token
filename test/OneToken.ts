import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract, ContractFactory } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

let OneToken: ContractFactory;
let oneToken: Contract;
let addr: SignerWithAddress[];

const zeroAddress = "0x0000000000000000000000000000000000000000";

describe("Token test", function () {

  beforeEach(async function () {

    addr = await ethers.getSigners();

    OneToken = await ethers.getContractFactory("OneToken");
    oneToken = await OneToken.deploy(100, addr[0].address);
    await oneToken.deployed();
  });

  describe("totalSupply", function () {
    it("Should return the total supply equal to 100", async function () {
      expect(await oneToken.totalSupply()).to.equal(100);
    });
  });

  describe("balanceOf", function () {
    it("Should return the balance equal to 100", async function () {
      expect(await oneToken.balanceOf(addr[0].address)).to.equal(100);
    });
  });

  describe("transfer", function () {

    it("Should transfer 60 tokens",
      async function () {

        await oneToken.approve(addr[1].address, 999)
        await oneToken.transfer(addr[1].address, 60);
        expect(await oneToken.balanceOf(addr[1].address)).to.equal(60);
        expect(await oneToken.balanceOf(addr[0].address)).to.equal(40);
      })

    it("Should throw transaction failure due to insufficient balance",
      async function () {
        await oneToken.approve(addr[1].address, 999)
        expect(oneToken.transfer(addr[1].address, 600)).to.be.revertedWith("not enought tokens on balance");
      })

    it("Should throw transaction failture due to insufficient allowance",
      async function () {
        await expect(oneToken.transfer(addr[1].address, 1)).to.be.revertedWith('not enought allowed tokens')
      })

    it("Should throw transaction failture due to zero address",
      async function () {
        expect(oneToken.transfer(zeroAddress, 1)).to.be.revertedWith("zero address not allowed (address to)");
      })
  })

  describe("transferFrom", function () {
    it("Should transfer 40 tokens", async function () {

      await oneToken.approve(addr[1].address, 99999);

      await oneToken.transferFrom(addr[0].address, addr[1].address, 40);
      expect(await oneToken.balanceOf(addr[1].address)).to.equal(40);
      expect(await oneToken.balanceOf(addr[0].address)).to.equal(60);
    })
  })

  describe("approve", function () {
    it("Should approve 10101 tokens", async function () {

      await oneToken.approve(addr[6].address, 10101);
      expect(await oneToken.allowance(addr[0].address, addr[6].address)).to.equal(10101);
    })
  })

  describe("Increase/Deacrease allowance", function () {
    it("Should increase allowance by 100 and decrease on the same amount", async function () {

      await oneToken.increaseAllowance(addr[6].address, 100);
      expect(await oneToken.allowance(addr[0].address, addr[6].address)).to.equal(100);
      await oneToken.decreaseAllowance(addr[6].address, 100);
      expect(await oneToken.allowance(addr[0].address, addr[6].address)).to.equal(0);
    })
  })

  describe("allowance", function () {
    it("Should approve 100000 tokens", async function () {

      await oneToken.approve(addr[1].address, 100000);
      expect(await oneToken.allowance(addr[0].address, addr[1].address)).to.equal(100000);
    })
  })

  describe("mint and burn", function () {
    it("Should create new 100 tokens and then delete them", async function () {

      expect(await oneToken.totalSupply()).to.equal(100);
      await oneToken.mint(addr[0].address, 100);
      expect(await oneToken.totalSupply()).to.equal(200);
      await oneToken.burn(addr[0].address, 100);
      expect(await oneToken.totalSupply()).to.equal(100);
    })
  })
})
