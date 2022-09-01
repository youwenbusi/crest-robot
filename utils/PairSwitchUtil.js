let path = require('path');
let fs = require('fs');
let ethers = require('ethers');
let config = require("../config.js");
let v3PoolService = require("./PoolV3.js");
let ethersProvider = new ethers.providers.Web3Provider(config.web3Kovan.currentProvider);
let walletAdmin = new ethers.Wallet(config.signerKey, ethersProvider);


let 

function getAddressConfig() {
    let jsonFile = path.dirname(__filename) + "/../contractsArtifacts/UniswapV3Callee.json";
    let jsonArtifact = JSON.parse(fs.readFileSync(jsonFile, 'utf-8'));
    let contractObj = new ethers.Contract(config.v3CalleeAddrKovan, jsonArtifact.abi, ethersProvider);
    let ethersContractWithSigner = contractObj.connect(walletAdmin);
    return ethersContractWithSigner
}


module.exports = {
    swapTotargetPrice
}