let Web3 = require('web3');
let ethers = require('ethers');


//provider
let web3EthMain = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/v3/4b3c2c1c3be0462dbdc4afcfb20564a2"));
let ethersProviderMainNet = new ethers.providers.Web3Provider(web3EthMain.currentProvider);

let web3Kovan = new Web3(new Web3.providers.HttpProvider("https://kovan.infura.io/v3/4b3c2c1c3be0462dbdc4afcfb20564a2"));
let ethersProviderKovan = new ethers.providers.Web3Provider(web3Kovan.currentProvider);

let web3Goerli  = new Web3(new Web3.providers.HttpProvider("https://goerli.infura.io/v3/4b3c2c1c3be0462dbdc4afcfb20564a2"));
let ethersProviderGoerli  = new ethers.providers.Web3Provider(web3Goerli.currentProvider);

let web3OPKovan = new Web3(new Web3.providers.HttpProvider("https://kovan.optimism.io"));
let ethersProviderOPKovan = new ethers.providers.Web3Provider(web3OPKovan.currentProvider);

let web3ArbitrumRinkeby = new Web3(new Web3.providers.HttpProvider("https://rinkeby.arbitrum.io/rpc"));
let ethersProviderArbitrumRinkeby = new ethers.providers.Web3Provider(web3ArbitrumRinkeby.currentProvider);

let web3PolygonMumbai = new Web3(new Web3.providers.HttpProvider("https://rpc.ankr.com/polygon_mumbai"));
let ethersProviderPolygonMumbai = new ethers.providers.Web3Provider(web3PolygonMumbai.currentProvider);

//WETH-USDC
let WETHUSDC = {
    tokenAMainNet: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",//USDC MainNet
    tokenBMainNet: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",//WETH MainNet
    pairAddrMainNet: "0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc",//WETH-USDC MainNet
    pairTypeMainNet: "V3",
    tokenAKovan: "0x84936E82C93B35d71940F01aEbE15ccAaed62e9e",//USDC Kovan
    tokenBKovan: "0x366420fCd5Ff5Bd26bF737CeeE142C6e8DF4DC23",//WETH Kovan----动态操作该token的价格
    pairAddrKovan: "0xac4621e0a349a5c7cfde9cd29fab3c2dc6632e28",//WETH-USDC Kovan
    tokenAOptimismKovan: "0x48383b8FCEd68cB9d26516E14335Cb9081f50e5b",//USDC Goerli 
    tokenBOptimismKovan: "0x38a661A44Bdc3FB4071FCDa3C5EB3b266f4f680c",//WETH Goerli 
    pairAddrOptimismKovan: "0x3fb6CcFF07963E0a2d10C919f9C6B5416B4881D2",//WETH-USDC Goerli 
    vaultOptimismKovan: "",//generalVault Goerli 
    tokenAOptimismKovan: "0x48383b8FCEd68cB9d26516E14335Cb9081f50e5b",//USDC Optimism Kovan
    tokenBOptimismKovan: "0x38a661A44Bdc3FB4071FCDa3C5EB3b266f4f680c",//WETH Optimism Kovan
    pairAddrOptimismKovan: "0x3fb6CcFF07963E0a2d10C919f9C6B5416B4881D2",//WETH-USDC Optimism Kovan
    vaultOptimismKovan: "0x32451774392F7503d827f817E3A5B37da7Ad9f5f",//generalVault Optimism Kovan
    tokenAArbitrumRinkeby: "0x48383b8FCEd68cB9d26516E14335Cb9081f50e5b",//USDC Arbitrum Rinkeby
    tokenBArbitrumRinkeby: "0x38a661A44Bdc3FB4071FCDa3C5EB3b266f4f680c",//WETH Arbitrum Rinkeby
    pairAddrArbitrumRinkeby: "0x3fb6CcFF07963E0a2d10C919f9C6B5416B4881D2",//WETH-USDC Arbitrum Rinkeby
    vaultArbitrumRinkeby: "0xcAB6997b1070436a82E11e7c0BD8A37F68c99965",//generalVault Arbitrum Rinkeby
    specifiedPrice: 1900,  //本次手动设置的目标价格【syncToSpecifiedPrice脚本使用】
    priceChangeMax: 300,  //每次兑换的价格上下变化最大幅度//幅度不可过大，也不可过小,账户余额够可调大点
    threshold:10, //当前价格与策略区间的边界的最小距离，小于这个界限就自动调区间
    halfSection:50 //策略区间半径
}


let DAIUSDC = {
    tokenAMainNet: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",//USDC MainNet
    tokenBMainNet: "0x6B175474E89094C44Da98b954EedeAC495271d0F",//DAI MainNet
    pairAddrMainNet: "0x5777d92f208679db4b9778590fa3cab3ac9e2168",//DAI-USDC MainNet
    pairTypeMainNet: "V3",
    tokenAKovan: "0x84936E82C93B35d71940F01aEbE15ccAaed62e9e",//USDC Kovan
    tokenBKovan: "0x1A0e1e0E65531aA7Ebae21528437C80EeB098467",//DAI Kovan----动态操作该token的价格
    pairAddrKovan: "0xF061B13b2D0f3c50EAee679e399F34Db420E24AA",//DAI-USDC Kovan
    specifiedPrice: 1.00009,  //本次手动设置的目标价格【syncToSpecifiedPrice脚本使用】
    priceChangeMax: 0.00002, //每次兑换的价格上下变化最大幅度//幅度不可过大，也不可过小,账户余额够可调大点
    threshold:0.002, //当前价格与策略区间的边界的最小距离，小于这个界限就自动调区间
    halfSection:0.01 //策略区间半径
}

let WBTCWETH = {
    tokenAMainNet: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",//WETH MainNet
    tokenBMainNet: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",//WBTC MainNet
    pairAddrMainNet: "0x4585fe77225b41b697c938b018e2ac67ac5a20c0",//WBTC-WETH MainNet
    pairTypeMainNet: "V3",
    tokenAKovan: "0x366420fCd5Ff5Bd26bF737CeeE142C6e8DF4DC23",//WETH Kovan
    tokenBKovan: "0x0E92f9A897A4155b3df8608aD9a5B3118a5A2464",//WBTC Kovan----动态操作该token的价格
    pairAddrKovan: "0x1856E22f8e2b562F11D2b0A16b9D8D651814a675",//WBTC-WETH Kovan
    tokenAGoerli: "0x38a661A44Bdc3FB4071FCDa3C5EB3b266f4f680c",//WETH Goerli 
    tokenBGoerli: "0x4F0b613B5C51C7dFC91Cfb5C80b39965d7e512aD",//WBTC Goerli 
    pairAddrGoerli: "0xE3B19ced5F3ab36fb660c3885677321a75ED2eB8",//WBTC-WETH Goerli 
    vaultGoerli: "",//generalVault Goerli 
    tokenAOptimismKovan: "0x38a661A44Bdc3FB4071FCDa3C5EB3b266f4f680c",//WETH Optimism Kovan
    tokenBOptimismKovan: "0xFe79d6Fc0366C019D4F5c1B820a8B03Df1aD0f0D",//WBTC Optimism Kovan
    pairAddrOptimismKovan: "0x79CF439ADE64fDE74eE74B455743B1Bd52F1Bb0e",//WBTC-WETH Optimism Kovan
    vaultOptimismKovan: "",//generalVault Optimism Kovan
    tokenAPolygonMumbai: "0xAd1e52c83b1DB1f0Ad308612Ad772b4fd713cfBa",//WETH Polygon Mumbai
    tokenBPolygonMumbai: "0xB37CAA2F7ca24146b2146FEE2Dc10A81c469F8f5",//WBTC Polygon Mumbai
    pairAddrPolygonMumbai: "0xc2577F4fC30fe857402D1B9be300Bb33f1b7af1d",//WBTC-WETH Polygon Mumbai
    vaultPolygonMumbai: "",//generalVault Polygon Mumbai
    tokenAArbitrumRinkeby: "0x38a661A44Bdc3FB4071FCDa3C5EB3b266f4f680c",//WETH Arbitrum Rinkeby
    tokenBArbitrumRinkeby: "0xc91f85007E6428387748C6C03Ab4891B78AE2570",//WBTC Arbitrum Rinkeby
    pairAddrArbitrumRinkeby: "0x4B6aA90F7907f91258b7697D69f5573aAD735a27",//WBTC-WETH Arbitrum Rinkeby
    vaultArbitrumRinkeby: "",//generalVault Arbitrum Rinkeby
    specifiedPrice: 29941,  //本次手动设置的目标价格【syncToSpecifiedPrice脚本使用】
    priceChangeMax: 100,  //每次兑换的价格上下变化最大幅度//幅度不可过大，也不可过小,账户余额够可调大点
    threshold:2, //当前价格与策略区间的边界的最小距离，小于这个界限就自动调区间
    halfSection:50 //策略区间半径
}

let WMATICUSDC = {
    tokenAPolygonMumbai: "0x48383b8FCEd68cB9d26516E14335Cb9081f50e5b",//USDC Polygon Mumbai
    tokenBPolygonMumbai: "0x4F0b613B5C51C7dFC91Cfb5C80b39965d7e512aD",//WMATIC Polygon Mumbai
    pairAddrPolygonMumbai: "0x3Be3049c830A20a12aA6A96D64E7dcF0AE144AaD",//WMATIC-USDC Polygon Mumbai
    vaultPolygonMumbai: "",//generalVault Optimism Kovan
    specifiedPrice: 1900,  //本次手动设置的目标价格【syncToSpecifiedPrice脚本使用】
    priceChangeMax: 300,  //每次兑换的价格上下变化最大幅度//幅度不可过大，也不可过小,账户余额够可调大点
    threshold:10, //当前价格与策略区间的边界的最小距离，小于这个界限就自动调区间
    halfSection:50 //策略区间半径
}



module.exports = {
    pairData: WETHUSDC,//根据当前实际操作的token选择不同的交易对
    web3EthMain,
    web3Kovan,
    ethersProviderKovan,//根据当前实际操作选择对应的网络
    ethersProviderGoerli,
    ethersProviderOPKovan,
    ethersProviderMainNet,
    ethersProviderArbitrumRinkeby,
    ethersProviderPolygonMumbai,
    //兑换代币的接收地址
    signerAddress: "0x6144C24F9Ba385328553E39Fb659e12DB10F16aa",
    //交易签名用户私钥
    signerKey: "",
    //自动检测区间的间隔时间【changeConfigAuto脚本使用】
    autoSleepTime: 60 * 60 * 1000
}


