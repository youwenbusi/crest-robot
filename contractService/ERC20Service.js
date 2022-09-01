let path = require('path');
let fs = require('fs');
let ethers = require('ethers');
let config = require("../config.js");

function getEthersContract(ethersProvider, addrErc20) {
    let jsonFile = path.dirname(__filename) + "/../contractsArtifacts/ERC20.json";
    let jsonArtifact = JSON.parse(fs.readFileSync(jsonFile, 'utf-8'));
    let contractObj = new ethers.Contract(addrErc20, jsonArtifact.abi, ethersProvider);
    return contractObj
}


let approve = async (ethersProvider, addrErc20, spender) => {
    let contract = getEthersContract(ethersProvider, addrErc20);
    let walletAdmin = new ethers.Wallet(config.signerKey, ethersProvider);

    let allowanceValue = await contract.allowance(walletAdmin.address, spender);
    if (allowanceValue > 0) return;

    let trans = await contract.connect(walletAdmin).approve(spender, ethers.constants.MaxUint256);
    await trans.wait();
    console.log("approve success");
}


let decimalOf = async (ethersProvider, addrErc20) => {
    let contract = getEthersContract(ethersProvider, addrErc20);
    return await contract.decimals();
}



module.exports = {
    approve,
    decimalOf
}

