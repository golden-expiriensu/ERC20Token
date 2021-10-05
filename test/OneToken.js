const { expect } = require("chai");
const { ethers } = require("hardhat");
const defaultOwner = "0xcd3B766CCDd6AE721141F452C550Ca635964ce71";
const defaultSpender = "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65";

describe("totalSupply", function () {
  it("Should return the total supply equal to 100", async function () {
    
    const OneToken = await ethers.getContractFactory("OneToken");
    const oneToken = await OneToken.deploy(100, defaultOwner);
    await oneToken.deployed();

    expect(await oneToken.totalSupply()).to.equal(100);
  });
});

describe("getBalance", function () {
  it("Should return the balance equal to 100", async function () {
    
    const OneToken = await ethers.getContractFactory("OneToken");
    const oneToken = await OneToken.deploy(100, defaultOwner);
    await oneToken.deployed();

    expect(await oneToken.getBalance(defaultOwner)).to.equal(100);
  });
});

describe("transfer", function () {
  it("After tranfer 40 tokens should return 40 tokens on spender", async function (){

    const OneToken = await ethers.getContractFactory("OneToken");
    const oneToken = await OneToken.deploy(100, "0x0000000000000000000000000000000000000000");
    await oneToken.deployed();

    oneToken.approve(defaultSpender, 100)
    oneToken.transfer(defaultSpender, 40);

    expect(await oneToken.getBalance(defaultSpender)).to.equal(40);
  })
})
