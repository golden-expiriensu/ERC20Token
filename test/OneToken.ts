import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract, ContractFactory } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { parseEther } from "@ethersproject/units";

let OneToken: ContractFactory;
let oneToken: Contract;
let addr: SignerWithAddress[];

const zeroAddress = "0x0000000000000000000000000000000000000000";

describe("Token test", function () {

  beforeEach(async function () {

    addr = await ethers.getSigners();

    OneToken = await ethers.getContractFactory("OneToken");
    oneToken = await OneToken.deploy(parseEther('100'), addr[0].address);
    await oneToken.deployed();
  });

  describe("1) totalSupply", function () {
    it("Should return the total supply equal to 100", async function () {
      expect(await oneToken.totalSupply()).to.equal(parseEther('100'));
    });
  });

  describe("2) balanceOf", function () {
    it("Should return the balance equal to 100", async function () {
      expect(await oneToken.balanceOf(addr[0].address)).to.equal(parseEther('100'));
    });
  });

  describe("3) transfer", function () {

    it("Should transfer 60 tokens",
      async function () {

        await oneToken.approve(addr[1].address, parseEther('999'))
        await oneToken.transfer(addr[1].address, parseEther('60'));
        expect(await oneToken.balanceOf(addr[1].address)).to.equal(parseEther('60'));
        expect(await oneToken.balanceOf(addr[0].address)).to.equal(parseEther('40'));
      })
  })

  describe("4) transferFrom", function () {

    it("a) Should transfer 40 tokens", async function () {

      await oneToken.approve(addr[1].address, parseEther('999'));

      await oneToken.transferFrom(addr[0].address, addr[1].address, parseEther('40'));
      expect(await oneToken.balanceOf(addr[1].address)).to.equal(parseEther('40'));
      expect(await oneToken.balanceOf(addr[0].address)).to.equal(parseEther('60'));
    })

    it("b) Should throw transaction failure due to insufficient balance",
      async function () {
        await oneToken.connect(addr[4]).approve(addr[1].address, parseEther('999'))
        expect(oneToken.transferFrom(addr[4].address, addr[1].address, parseEther('100'))).to.be.revertedWith("not enought tokens on balance");
      })

    it("c) Should throw transaction failture due to insufficient allowance",
      async function () {
        await expect(oneToken.transferFrom(addr[0].address, addr[1].address, parseEther('100'))).to.be.revertedWith('not enought allowed tokens')
      })

    it("d) Should throw transaction failture due to zero address",
      async function () {
        expect(oneToken.transferFrom(addr[0].address, zeroAddress, parseEther('100'))).to.be.revertedWith("zero address not allowed (address to)");
      })
  })

  describe("5) approve", function () {
    it("Should approve 100 tokens", async function () {

      await oneToken.approve(addr[6].address, parseEther('100'));
      expect(await oneToken.allowance(addr[0].address, addr[6].address)).to.equal(parseEther('100'));
    })
  })

  describe("6) Increase/Deacrease allowance", function () {
    it("Should increase allowance by 100 and decrease on the same amount", async function () {

      await oneToken.increaseAllowance(addr[6].address, parseEther('100'));
      expect(await oneToken.allowance(addr[0].address, addr[6].address)).to.equal(parseEther('100'));
      await oneToken.decreaseAllowance(addr[6].address, parseEther('100'));
      expect(await oneToken.allowance(addr[0].address, addr[6].address)).to.equal(0);
    })
  })

  describe("7) allowance", function () {
    it("Should return allowance equal to 100 tokens", async function () {

      await oneToken.approve(addr[1].address, parseEther('100'));
      expect(await oneToken.allowance(addr[0].address, addr[1].address)).to.equal(parseEther('100'));
    })
  })

  describe("8) mint and burn", function () {
    it("a) Should create new 100 tokens and then delete them", async function () {

      expect(await oneToken.totalSupply()).to.equal(parseEther('100'));
      await oneToken.mint(addr[0].address, parseEther('100'));
      expect(await oneToken.totalSupply()).to.equal(parseEther('200'));
      await oneToken.burn(addr[0].address, parseEther('100'));
      expect(await oneToken.totalSupply()).to.equal(parseEther('100'));
    })

    it("b) Should throw transaction failture due to account has not minter/burner permissions", async function () {

      await expect(oneToken.connect(addr[4]).mint(addr[0].address, parseEther('100'))).to.be.revertedWith("mint allowed only for minter");
      await expect(oneToken.connect(addr[4]).burn(addr[0].address, parseEther('100'))).to.be.revertedWith("burn allowed only for burner");
    })
  })
})
