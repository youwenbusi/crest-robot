let bn = require('bignumber.js');
const { ethers } = require('ethers');
const JSBI = require('jsbi');

//通过两个token的储备金份额计算V3的价格【returns the sqrt price as a 64x96】
let reservesToSqrtPriceX96 = async (reserve1, reserve0) => {
    let priceNumber = new Number(
        new bn(reserve1.toString())
            .div(reserve0.toString())
            .sqrt()
            .multipliedBy(new bn(2).pow(96))
            .integerValue(3)
            .toString()
    );
    let priceBigInt = BigInt(priceNumber);
    let priceBigNumber = ethers.BigNumber.from(priceBigInt);
    console.log("priceBigNumber", priceBigNumber);
    return priceBigNumber;
}


//通过市场价计算V3的价格【returns the sqrt price as a 64x96】
//如：
let priceToSqrtPriceX96 = async (price) => {
    let priceNumber = new Number(
        new bn(price.toString())
            .sqrt()
            .multipliedBy(new bn(2).pow(96))
            .integerValue(3)
            .toString()
    );
    let priceBigInt = BigInt(priceNumber);
    let priceBigNumber = ethers.BigNumber.from(priceBigInt);
    console.log("priceBigNumber", priceBigNumber);
    return priceBigNumber;
}




module.exports = {
    reservesToSqrtPriceX96,
    priceToSqrtPriceX96

}