import { task } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";

task("addMinter", "adds new minter from owner account")
    .addParam("account", "the account`s address")
    .setAction(async function (taskArgs, hre) {

        const addr = await hre.ethers.getSigners();
        const network = hre.network.name;

        const fs = require('fs');
        const dotenv = require('dotenv');

        const envConfig = dotenv.parse(fs.readFileSync(`.env-${network}`))
        for (const k in envConfig) {
            process.env[k] = envConfig[k]
        }
        const oneToken = await hre.ethers.getContractAt("OneToken", process.env.ADDR_DAO as string);
        
        oneToken.addMinter(taskArgs.account);
        
        console.log('addMinter Done!');
    });