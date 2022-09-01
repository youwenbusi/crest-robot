let moment = require('moment')
let poolV3Utils = require("./contractService/PoolV3.js");
let vaultService = require("./contractService/generalVault.js");
const { priceToSqrtPriceX96 } = require("./utils/utils.js");
const config = require('./config.js');

//@brief 睡眠指定时长
function sleep(ms) {
    // console.log(moment().format("YYYYMMDD HH:mm:ss"), 'DEBUG', 'sleep ms ' + ms);
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

let initStart = async () => {
    while (true) {
        try {
            //获取Pool当前的价格
            let v3priceRsp = await poolV3Utils.getPriceTokenB(config.ethersProviderOPKovan, config.pairData.pairAddrOptimismKovan, config.pairData.tokenAOptimismKovan, config.pairData.tokenBOptimismKovan);
            //获取策略区间
            let priceSection = await vaultService.getPriceSection(config.ethersProviderOPKovan, config.pairData.tokenAOptimismKovan, config.pairData.tokenBOptimismKovan);
            console.log("price section before, lowerPrice: " + priceSection.lowerPriceFixed.toString() + ", upPrice: " + priceSection.upPriceFixed.toString());
            let priceToLower = Math.abs(priceSection.lowerPriceFixed - v3priceRsp.priceFixed);
            let priceToUp = Math.abs(priceSection.upPriceFixed - v3priceRsp.priceFixed);
            if (priceToLower < parseFloat(config.pairData.threshold) && priceToLower < priceToUp) {
                //判断价格是否需要倒转
                if (!v3priceRsp.priceAlreadyReverse){
                    v3priceRsp.priceFixed = 1 / v3priceRsp.priceFixed;
                }
                //如果价格接近了区间左边，则需要调区间
                let newLowerPrice = v3priceRsp.priceFixed - config.pairData.halfSection;
                let newUpPrice = v3priceRsp.priceFixed + config.pairData.halfSection;
                let lowerSqrPriceX96 = await priceToSqrtPriceX96(newLowerPrice);
                let upSqrPriceX96 = await priceToSqrtPriceX96(newUpPrice);
                await vaultService.changeConfig(config.ethersProviderOPKovan, upSqrPriceX96, lowerSqrPriceX96);
                console.log("The price is closed to the left boarder of price section before, change to lowerPrice: " + newLowerPrice + ", upPrice: " + newUpPrice);

            } else if (priceToUp < parseFloat(config.pairData.threshold) && priceToUp < priceToLower) {
                //判断价格是否需要倒转
                if (!v3priceRsp.priceAlreadyReverse){
                    v3priceRsp.priceFixed = 1 / v3priceRsp.priceFixed;
                }
                //如果价格接近了区间左边，则需要调区间
                let newLowerPrice = v3priceRsp.priceFixed - config.pairData.halfSection;
                let newUpPrice = v3priceRsp.priceFixed + config.pairData.halfSection;
                let lowerSqrPriceX96 = await priceToSqrtPriceX96(newLowerPrice);
                let upSqrPriceX96 = await priceToSqrtPriceX96(newUpPrice);
                await vaultService.changeConfig(config.ethersProviderOPKovan, upSqrPriceX96, lowerSqrPriceX96);
                console.log("The price is closed to the right boarder of price section before, change to lowerPrice: " + newLowerPrice + ", upPrice: " + newUpPrice);

                
            } else if (priceSection.lowerPriceFixed < v3priceRsp.priceFixed < priceSection.upPriceFixed) {
                //价格在区间可以接受的波动范围内
                console.log("Nothing need to do");
            } else {
                //价格远远跑出区间，也需要调区间
                //判断价格是否需要倒转
                if (!v3priceRsp.priceAlreadyReverse){
                    v3priceRsp.priceFixed = 1 / v3priceRsp.priceFixed;
                }
                //如果价格接近了区间左边，则需要调区间
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