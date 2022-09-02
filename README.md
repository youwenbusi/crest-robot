
## Dependency library installation
Enter the project root directory and execute
```
npm install
```

## Script usage instructions

#### Automatic tuning interval `changeConfigAuto.js`
> Description: This script automatically detects whether the current price is close to the edge of the current strategy range or far beyond it, and automatically adjusts the range according to the configuration

* `config`

```
//==============================
//===Automatic tuning interval configuration=====
//==============================
//The interval of the automatic detection interval (default 1 hour)
autoSleepTime: 60 * 60 * 1000,
//pair（i.e: WETH-USDC）
pairData: WETHUSDC,


* script execution

```
node ./changeConfigAuto.js
```
