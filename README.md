# MissionControl Finder
[<img src="https://mcontrol.ml/banner.png" width="500px"></img>](https://finder.mcontrol.ml/)

An open-source explorer built for Terra 2.0

# How to contribute
## Add a CW20 or IBC token

To add a token make a PR on the Terra asset list:

- IBC: [https://github.com/terra-money/assets/blob/master/ibc/tokens.js](https://github.com/terra-money/assets/blob/master/ibc/tokens.js)
- CW20: [https://github.com/terra-money/assets/blob/master/cw20/tokens.js](https://github.com/terra-money/assets/blob/master/cw20/tokens.js)

## Add an LP contract address

Make a PR on the Terra asset repo: [https://github.com/terra-money/assets/blob/master/cw20/pairs.dex.js](https://github.com/terra-money/assets/blob/master/cw20/pairs.dex.js)

Make sure that both the token in the pair are already listed

## Add a custom contract address/known address

Make a PR in our asset repo: [https://github.com/mcontrolml/assets/blob/main/contracts.json](https://github.com/mcontrolml/assets/blob/main/contracts.json)

## Contribute on the webapp code

Fork this repo and make a PR