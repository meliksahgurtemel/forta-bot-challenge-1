# Bot Deployment Tracker

## Description

This bot detects every new bot deployments by Nethermind

## Supported Chains

- Polygon

## Alerts

- NETHERMIND-BOT-DEPLOYMENT
  - Fired when a new bot deployed by Nethermind
  - Severity is always set to "info" (mention any conditions where it could be something else)
  - Type is always set to "info" (mention any conditions where it could be something else)
  - Metada field
    - `agentId` of the new deployed bot
    - `metadata` of the new deploeyd bot
    - `chainIds` of the new deployed bot

## Test Data

The bot behaviour can be verified with the following transactions:

- [0x8ef79a79f23aca68acf59055229d685d6a5137d6a2eebc9890a3fdeba358c737](https://polygonscan.com/tx/0x8ef79a79f23aca68acf59055229d685d6a5137d6a2eebc9890a3fdeba358c737) (`createAgent` function)
