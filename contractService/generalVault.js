let path = require('path');
let fs = require('fs');
let ethers = require('ethers');
let config = require("../config.js");
let eRC20Service = require("./ERC20Service.js");
const univ3prices = require('@thanpolas/univ3prices');

function getEthersContract(ethersProvider) {
    let jsonFile = path.dirname(__filename) + "/../contractsArtifacts/GeneralVault.json";
    let jsonArtifact = JSON.parse(fs.readFileSync(jsonFile, 'utf-8'));
    let contractObj = new ethers.Contract(config.pairData.vaultOptimismKovan, jsonArtifact.abi, ethersProvider);
    return contractObj
}

let changeConfig = async (ethersProvider, upSqrPriceX96, lowerSqrPriceX96, reBalanceThreshold=10) => {
    let contract = getEthersContract(ethersProvider);
    let walletAdmin = new ethers.Wallet(config.signerKey, ethersProvider);
    let trans = await contract.connect(walletAdmin).changeConfig(upSqrPriceX96, lowerSqrPriceX96, reBalanceThreshold);
    let txReceipt = await trans.wait();
    console.log(txReceipt);
    console.log("changeConfig success");
}

let getPriceSection = async (ethersProvider, tokenA, tokenB) => {
    let contract = getEthersContract(ethersProvider);
    let priceSqrX96 = await contract.getPriceSection();
    let token0 = await contract.token0();
    let token1 = await contract.token1();
    let decimalToken0 = await eRC20Service.decimalOf(ethersProvider, token0);
    let decimalToken1 = await eRC20Service.decimalOf(ethersProvider, token1);
    let lowerPrice = univ3prices([decimalToken0, decimalToken1], priceSqrX96[0]);
    let upPrice = univ3prices([decimalToken0, decimalToken1], priceSqrX96[1]);
    let lowerPriceX96;
    let upPriceX96;
    let priceAlreadyReverse;
    if (token0.toLowerCase() == tokenA.toLowerCase() && token1.toLowerCase() == tokenB.toLowerCase()) {
        priceAlreadyReverse = false;
        lowerPriceX96 = lowerPrice.toAuto({ reverse: false });
        upPriceX96 = upPrice.toAuto({ reverse: false });
    } else if (token0.toLowerCase() == tokenB.toLowerCase() && token1.toLowerCase() == tokenA.toLowerCase()) {
        priceAlreadyReverse = true;
        lowerPriceX96 = lowerPrice.toAuto({ reverse: true });
        upPriceX96 = upPrice.toAuto({ reverse: true });
    } else {
        throw new Error("check token config");
    }
    return { "lowerPriceFixed": parseFloat(lowerPriceX96), "upPriceFixed": parseFloat(upPriceX96), "priceAlreadyReverse": priceAlreadyReverse };
}

module.exports = {
    changeConfig,
    getPriceSection
}