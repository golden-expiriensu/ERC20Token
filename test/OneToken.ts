import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract, ContractFactory } from "ethers";
const defaultOwner = "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266";
const randomAddress = "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65";

let OneToken: ContractFactory;
let oneToken: Contract;

describe("Token test", function () {
  beforeEach(async function() {
    OneToken = await ethers.getContractFactory("OneToken");
    oneToken = await OneToken.deploy(100, randomAddress);
    await oneToken.deployed();
  });
  describe("totalSupply", function () {
    it("Should return the total supply equal to 100", async function () {
      expect(await oneToken.totalSupply()).to.equal(100);
    });
  });

  describe("balanceOf", function () {
    it("Should return the balance equal to 100", async function () {
      expect(await oneToken.balanceOf(randomAddress)).to.equal(100);
    });
  });

  describe("transfer", function () {
    it("Should transfer 60 tokens with the following transaction failure due to insufficient balance",
      async function () {

        OneToken = await ethers.getContractFactory("OneToken");
        oneToken = await OneToken.deploy(100, "0x0000000000000000000000000000000000000000");
        await oneToken.deployed();

        await oneToken.approve(randomAddress, 101)

        await oneToken.transfer(randomAddress, 60);
        expect(await oneToken.balanceOf(randomAddress)).to.equal(60);
        await expect(oneToken.transfer(randomAddress, 60)).to.be.revertedWith('error');

      })
  })

  describe("transferFrom", function () {
    it("Should return 400 tokens on spender and 600 on owner", async function () {

      OneToken = await ethers.getContractFactory("OneToken");
      oneToken = await OneToken.deploy(1000, defaultOwner);
      await oneToken.deployed();

      await oneToken.approve(randomAddress, 99999);

      await oneToken.transferFrom(defaultOwner, randomAddress, 400);
      expect(await oneToken.balanceOf(randomAddress)).to.equal(400);
      expect(await oneToken.balanceOf(defaultOwner)).to.equal(600);
    })
  })

  describe("allowance", function () {
    it("Should return 100000 allowed tokens after approve(100000)", async function () {
      await oneToken.approve(randomAddress, 100000);
      expect(await oneToken.allowance(defaultOwner, randomAddress)).to.equal(100000);
    })
  })

  describe("mint and burn", function () {
    it("Should create new 100 tokens and then delete them", async function () {

      expect(await oneToken.totalSupply()).to.equal(100);
      await oneToken.mint(defaultOwner, 100);
      expect(await oneToken.totalSupply()).to.equal(200);
      await oneToken.burn(defaultOwner, 100);
      expect(await oneToken.totalSupply()).to.equal(100);
    })
  })
})
