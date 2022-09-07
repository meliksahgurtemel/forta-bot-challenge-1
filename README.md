# Bot Deployment Tracker

## Description

This bot detects every new bot deployments by Nethermind

## Supported Chains

- Polygon

## Alerts

- NETHERMIND-BOT-DEPLOYMENT
  - Fired when a new bot deployed by Nethermind
  - Severity is always set to "Info"
  - Type is always set to "Info"
  - Metadata field
    - `agentId`: agentId of the deployed bot
    - `metadata`: metedata of the deployed bot
    - `chainIds`: supported chains of the bot

## Test Data

The bot behaviour can be verified with the following transactions:

- [0x8ef79a79f23aca68acf59055229d685d6a5137d6a2eebc9890a3fdeba358c737](https://polygonscan.com/tx/0x8ef79a79f23aca68acf59055229d685d6a5137d6a2eebc9890a3fdeba358c737) (`createAgent` function)
