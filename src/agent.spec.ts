import { FindingType, FindingSeverity, Finding, HandleTransaction, TransactionEvent } from "forta-agent";
import { FUNCTION_ABI, PROXY_ADDRESS, BOT_DEPLOYER_ADDRESS } from "./constants";
import { provideHandleTransaction } from "./agent";
import { createAddress } from "forta-agent-tools";
import { TestTransactionEvent } from "forta-agent-tools/lib/test";
import { Interface } from "ethers/lib/utils";

const TEST_ADDRESS = createAddress("0x123abc");

const MOCK_METADATA = {
  agentId: "123",
  metadata: "abcd",
  chainIds: "137",
};

const MOCK_METADATA2 = {
  agentId: "12345678",
  metadata: "abcdefg",
  chainIds: "137",
};

const MOCK_FINDING = (agentId: string, metadata: string, chainIds: string): Finding => {
  return Finding.fromObject({
    name: "Bot Deployment",
    description: "New Bot is deployed by Nethermind",
    alertId: "NETHERMIND-BOT-DEPLOYMENT",
    severity: FindingSeverity.Info,
    type: FindingType.Info,
    protocol: "Nethermind",
    metadata: {
      agentId: agentId,
      metadata: metadata,
      chainIds: chainIds,
    },
  });
};

describe("Bot deployment tracker Agent", () => {
  let handleTransaction: HandleTransaction;
  let proxy = new Interface([FUNCTION_ABI]);
  let findings: Finding[];

  beforeAll(() => {
    handleTransaction = provideHandleTransaction(FUNCTION_ABI, PROXY_ADDRESS, BOT_DEPLOYER_ADDRESS);
  });

  it("should return no Findings if no bots deployed", async () => {
    const mockTxEvent: TransactionEvent = new TestTransactionEvent();
    findings = await handleTransaction(mockTxEvent);
    expect(findings).toStrictEqual([]);
  });

  it("should return no Findings if tx is not sent from the deployer", async () => {
    const mockTxEvent: TransactionEvent = new TestTransactionEvent()
      .setFrom(TEST_ADDRESS)
      .setTo(PROXY_ADDRESS)
      .addTraces({
        to: PROXY_ADDRESS,
        function: proxy.getFunction("createAgent"),
        arguments: [MOCK_METADATA.agentId, TEST_ADDRESS, MOCK_METADATA.metadata, [MOCK_METADATA.chainIds]],
      });

    findings = await handleTransaction(mockTxEvent);

    expect(findings).toStrictEqual([]);
  });

  it("should return Findings if tx is sent from the deployer", async () => {
    const mockTxEvent: TransactionEvent = new TestTransactionEvent()
      .setFrom(BOT_DEPLOYER_ADDRESS)
      .setTo(PROXY_ADDRESS)
      .addTraces({
        to: PROXY_ADDRESS,
        function: proxy.getFunction("createAgent"),
        arguments: [MOCK_METADATA.agentId, TEST_ADDRESS, MOCK_METADATA.metadata, [MOCK_METADATA.chainIds]],
      });

    findings = await handleTransaction(mockTxEvent);

    expect(findings).toStrictEqual([
      MOCK_FINDING(MOCK_METADATA.agentId, MOCK_METADATA.metadata, MOCK_METADATA.chainIds),
    ]);
  });

  it("should return Findings if there are multiple calls to createAgent function", async () => {
    const mockTxEvent: TransactionEvent = new TestTransactionEvent()
      .setFrom(BOT_DEPLOYER_ADDRESS)
      .setTo(PROXY_ADDRESS)
      .addTraces({
        to: PROXY_ADDRESS,
        function: proxy.getFunction("createAgent"),
        arguments: [MOCK_METADATA.agentId, TEST_ADDRESS, MOCK_METADATA.metadata, [MOCK_METADATA.chainIds]],
      })
      .addTraces({
        to: PROXY_ADDRESS,
        function: proxy.getFunction("createAgent"),
        arguments: [MOCK_METADATA2.agentId, TEST_ADDRESS, MOCK_METADATA2.metadata, [MOCK_METADATA2.chainIds]],
      });

    findings = await handleTransaction(mockTxEvent);

    expect(findings).toStrictEqual([
      MOCK_FINDING(MOCK_METADATA.agentId, MOCK_METADATA.metadata, MOCK_METADATA.chainIds),
      MOCK_FINDING(MOCK_METADATA2.agentId, MOCK_METADATA2.metadata, MOCK_METADATA2.chainIds),
    ]);
  });
});
