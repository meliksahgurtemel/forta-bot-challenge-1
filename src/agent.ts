import { Finding, HandleTransaction, TransactionEvent, FindingSeverity, FindingType } from "forta-agent";
import { FUNCTION_ABI, PROXY_ADDRESS, BOT_DEPLOYER_ADDRESS } from "./constants";

export function provideHandleTransaction(functionAbi: string, proxy: string, deployer: string): HandleTransaction {
  return async (txEvent: TransactionEvent) => {
    const findings: Finding[] = [];

    if (txEvent.from !== deployer.toLowerCase()) {
      return findings;
    }

    const createBotTx = txEvent.filterFunction(functionAbi, proxy);

    createBotTx.forEach((transaction) => {
      const { agentId, metadata, chainIds } = transaction.args;
      findings.push(
        Finding.fromObject({
          name: "Bot Deployment",
          description: "New Bot is deployed by Nethermind",
          alertId: "NETH-1",
          severity: FindingSeverity.Info,
          type: FindingType.Info,
          protocol: "Nethermind",
          metadata: {
            agentId: agentId.toString(),
            metadata,
            chainIds: chainIds.toString(),
          },
        })
      );
    });

    return findings;
  };
}

export default {
  handleTransaction: provideHandleTransaction(FUNCTION_ABI, PROXY_ADDRESS, BOT_DEPLOYER_ADDRESS),
};
