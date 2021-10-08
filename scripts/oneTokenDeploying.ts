// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat"

async function main() {
   
  const [deployer] = await ethers.getSigners();

  const OneToken = await ethers.getContractFactory("OneToken");
  console.log("Deploying the OneToken...")

  const oneToken = await OneToken.deploy(100000, deployer.address);
  await oneToken.deployed();
  console.log("OneToken deployed to: ", oneToken.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
