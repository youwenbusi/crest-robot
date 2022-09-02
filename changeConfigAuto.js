let moment = require('moment')
let poolV3Utils = require("./contractService/PoolV3.js");
let vaultService = require("./contractService/generalVault.js");
const { priceToSqrtPriceX96 } = require("./utils/utils.js");
const config = require('./config.js');

function sleep(ms) {
    // console.log(moment().format("YYYYMMDD HH:mm:ss"), 'DEBUG', 'sleep ms ' + ms);
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

let initStart = async () => {
    while (true) {
        try {
            //Get the current price of the Pool
            let v3priceRsp = await poolV3Utils.getPriceTokenB(config.ethersProviderOPKovan, config.pairData.pairAddrOptimismKovan, config.pairData.tokenAOptimismKovan, config.pairData.tokenBOptimismKovan);
            //Get strategy range
            let priceSection = await vaultService.getPriceSection(config.ethersProviderOPKovan, config.pairData.tokenAOptimismKovan, config.pairData.tokenBOptimismKovan);
            console.log("price section before, lowerPrice: " + priceSection.lowerPriceFixed.toString() + ", upPrice: " + priceSection.upPriceFixed.toString());
            let priceToLower = Math.abs(priceSection.lowerPriceFixed - v3priceRsp.priceFixed);
            let priceToUp = Math.abs(priceSection.upPriceFixed - v3priceRsp.priceFixed);
            if (priceToLower < parseFloat(config.pairData.threshold) && priceToLower < priceToUp) {
                //Determine if the price needs to be reversed
                if (!v3priceRsp.priceAlreadyReverse){
                    v3priceRsp.priceFixed = 1 / v3priceRsp.priceFixed;
                }
                //If the price is close to the left side of the range, you need to adjust the range
                let newLowerPrice = v3priceRsp.priceFixed - config.pairData.halfSection;
                let newUpPrice = v3priceRsp.priceFixed + config.pairData.halfSection;
                let lowerSqrPriceX96 = await priceToSqrtPriceX96(newLowerPrice);
                let upSqrPriceX96 = await priceToSqrtPriceX96(newUpPrice);
                await vaultService.changeConfig(config.ethersProviderOPKovan, upSqrPriceX96, lowerSqrPriceX96);
                console.log("The price is closed to the left boarder of price section before, change to lowerPrice: " + newLowerPrice + ", upPrice: " + newUpPrice);

            } else if (priceToUp < parseFloat(config.pairData.threshold) && priceToUp < priceToLower) {
                //Determine if the price needs to be reversed
                if (!v3priceRsp.priceAlreadyReverse){
                    v3priceRsp.priceFixed = 1 / v3priceRsp.priceFixed;
                }
                //If the price is close to the left side of the range, you need to adjust the range
                let newLowerPrice = v3priceRsp.priceFixed - config.pairData.halfSection;
                let newUpPrice = v3priceRsp.priceFixed + config.pairData.halfSection;
                let lowerSqrPriceX96 = await priceToSqrtPriceX96(newLowerPrice);
                let upSqrPriceX96 = await priceToSqrtPriceX96(newUpPrice);
                await vaultService.changeConfig(config.ethersProviderOPKovan, upSqrPriceX96, lowerSqrPriceX96);
                console.log("The price is closed to the right boarder of price section before, change to lowerPrice: " + newLowerPrice + ", upPrice: " + newUpPrice);

                
            } else if (priceSection.lowerPriceFixed < v3priceRsp.priceFixed < priceSection.upPriceFixed) {
                //The price is within the acceptable range of the range
                console.log("Nothing need to do");
            } else {
                //The price is far out of the range, and the range needs to be adjusted
                if (!v3priceRsp.priceAlreadyReverse){
                    v3priceRsp.priceFixed = 1 / v3priceRsp.priceFixed;
                }
                //If the price is close to the left side of the range, you need to adjust the range
                let newLowerPrice = v3priceRsp.priceFixed - config.pairData.halfSection;
                let newUpPrice = v3priceRsp.priceFixed + config.pairData.halfSection;
                let lowerSqrPriceX96 = await priceToSqrtPriceX96(newLowerPrice);
                let upSqrPriceX96 = await priceToSqrtPriceX96(newUpPrice);
                await vaultService.changeConfig(config.ethersProviderOPKovan, upSqrPriceX96, lowerSqrPriceX96);
                console.log("The price is extreamly out of the price section before, change to lowerPrice: " + newLowerPrice + ", upPrice: " + newUpPrice);
            }
        } catch (err) {
            console.log(moment().format("YYYYMMDD HH:mm:ss"), ' ERROR', 'change config error', err)
        } finally {
            await sleep(config.autoPriceSleepTime);
        }
    }
}

initStart()