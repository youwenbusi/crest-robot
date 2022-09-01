let path = require('path');
let fs = require('fs');
let ethers = require('ethers');
let config = require("../config.js");
let erc20Service = require("./ERC20Service.js");
const univ3prices = require('@thanpolas/univ3prices');


function getEthersContract(ethersProvider, pairAddress) {
    let jsonFile = path.dirname(__filename) + "/../contractsArtifacts/PoolV3ABI.json";
    let jsonArtifact = JSON.parse(fs.readFileSync(jsonFile, 'utf-8'));
    let contractObj = new ethers.Contract(pairAddress, jsonArtifact.abi, ethersProvider);
    return contractObj
}

let getPriceTokenB = async (ethersProvider, pairAddress, tokenA, tokenB) => {
    let pairContract = getEthersContract(ethersProvider, pairAddress);
    let token0 = await pairContract.token0();
    let token1 = await pairContract.token1();
    let decimalToken0 = await erc20Service.decimalOf(ethersProvider, token0);
    let decimalToken1 = await erc20Service.decimalOf(ethersProvider, token1);
    let slot0Rsp = await pairContract.slot0();
    let price = univ3prices([decimalToken0, decimalToken1], slot0Rsp.sqrtPriceX96); //reserve1/reserve0
    let priceTokenB;
    let priceAlreadyReverse;
    if (token0.toLowerCase() == tokenA.toLowerCase() && token1.toLowerCase() == tokenB.toLowerCase()) {
        priceAlreadyReverse = false;
        priceTokenB = price.toAuto({ reverse: false });
    } else if (token0.toLowerCase() == tokenB.toLowerCase() && token1.toLowerCase() == tokenA.toLowerCase()) {
        priceAlreadyReverse = true;
        priceTokenB = price.toAuto({ reverse: true });
    } else {
        throw new Error("check token config");
    }

    console.log("kovan net price", priceTokenB);
    return { "sqrtPriceX96": slot0Rsp.sqrtPriceX96, "priceFixed": parseFloat(priceTokenB), "priceAlreadyReverse": priceAlreadyReverse };
}


module.exports = {
    getPriceTokenB,
}