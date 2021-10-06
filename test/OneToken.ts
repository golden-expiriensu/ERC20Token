import { expect } from "chai";
import { ethers } from "hardhat";
const defaultOwner = "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266";
const randomAddress = "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65";

describe("totalSupply", function () {
  it("Should return the total supply equal to 100", async function () {
    
    const OneToken = await ethers.getContractFactory("OneToken");
    const oneToken = await OneToken.deploy(100, randomAddress);
    await oneToken.deployed();

    expect(await oneToken.totalSupply()).to.equal(100);
  });
});

describe("balanceOf", function () {
  it("Should return the balance equal to 100", async function () {
    
    const OneToken = await ethers.getContractFactory("OneToken");
    const oneToken = await OneToken.deploy(100, randomAddress);
    await oneToken.deployed();
    
    expect(await oneToken.balanceOf(randomAddress)).to.equal(100);
  });
});

describe("transfer", function () {
  it("Should return 60 tokens, 60 tokens and 100 tokens on spender and after all transactions owner must have 0 tokens",
   async function (){

    const OneToken = await ethers.getContractFactory("OneToken");
    const oneToken = await OneToken.deploy(100, "0x0000000000000000000000000000000000000000");
    await oneToken.deployed();

    oneToken.approve(randomAddress, 101)

    oneToken.transfer(randomAddress, 60);
    expect(await oneToken.balanceOf(randomAddress)).to.equal(60);
    oneToken.transfer(randomAddress, 60);
    expect(await oneToken.balanceOf(randomAddress)).to.equal(60);
    oneToken.transfer(randomAddress, 40);
    expect(await oneToken.balanceOf(randomAddress)).to.equal(100);
  })
})

describe("transferFrom", function () {
  it("Should return 400 tokens on spender and 600 on owner", async function (){

    const OneToken = await ethers.getContractFactory("OneToken");
    const oneToken = await OneToken.deploy(1000, defaultOwner);
    await oneToken.deployed();

    await oneToken.approve(randomAddress, 99999);

    oneToken.transferFrom(defaultOwner, randomAddress, 400);
    expect(await oneToken.balanceOf(randomAddress)).to.equal(400);
    expect(await oneToken.balanceOf(defaultOwner)).to.equal(600);
  })
})

describe("allowance", function () {
  it("Should return 100000 allowed tokens after approve(100000)", async function (){

    const OneToken = await ethers.getContractFactory("OneToken");
    const oneToken = await OneToken.deploy(1000, "0x0000000000000000000000000000000000000000");
    await oneToken.deployed();

    await oneToken.approve(randomAddress, 100000);    
    expect(await oneToken.allowance(defaultOwner, randomAddress)).to.equal(100000);
  })
})
