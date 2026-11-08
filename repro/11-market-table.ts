// Compare the "Markets" table on https://app.testnet.dreamdex.io/docs/trading/perps-testnet
// (copied below as published on 2026-11-08) with the live contracts on chain 50383.
import { parseAbi, formatUnits } from "viem"
import { markets } from "./common.ts"
const c = markets.client
const pc = c.getViemClient()
// sym: [maxLev, IM%, MM%, tick, minSize, OI cap, paperUSDso]
const DOCS: Record<string, [number, number, number, string, string, string, boolean]> = {
  BTC: [20, 5, 2.5, "0.1", "0.00013", "246.81545", true], ETH: [20, 5, 2.5, "0.01", "0.004", "3995.6125", true],
  HYPE: [20, 5, 2.5, "0.01", "0.12", "23812.72", true], SOL: [20, 5, 2.5, "0.01", "0.1", "47654.44", true],
  XRP: [20, 5, 2.5, "0.0001", "6.9", "344632", true], ADA: [10, 10, 5, "0.0001", "46", "2254678", true],
  AVAX: [10, 10, 5, "0.001", "1.4", "66672.2", true], BNB: [10, 10, 5, "0.001", "0.014", "693.975", true],
  DOGE: [10, 10, 5, "0.00001", "120", "5613590", true], LINK: [10, 10, 5, "0.001", "0.9", "42643.6", true],
  NEAR: [10, 10, 5, "0.0001", "5.1", "250410", true], SUI: [10, 10, 5, "0.0001", "13", "635009", true],
  XLM: [10, 10, 5, "0.0001", "54", "2677780", true], "1000PEPE": [5, 20, 10, "0.0000001", "2700", "130285600", false],
  LIT: [5, 20, 10, "0.0001", "2.8", "138896.6", false], PUMP: [5, 20, 10, "0.000001", "1800", "87993700", false],
  TAO: [5, 20, 10, "0.001", "0.044", "2185.491", true], VVV: [5, 20, 10, "0.001", "0.44", "21786.14", false],
  WLD: [5, 20, 10, "0.0001", "26", "1264000", true], ZEC: [5, 20, 10, "0.001", "0.009", "420", false],
  ZRO: [5, 20, 10, "0.0001", "5.1", "250599.5", false],
}
const bankAbi = parseAbi(["function isVoucherMarketAllowed(address) view returns (bool)"])
const rows = await c.listPerpMarkets()
console.log("docs: 21 markets | chain/indexer:", rows.length, "markets")
console.log("market   | maxLev docs/chain | IM% docs/chain | MM% docs/chain | OI cap docs/chain | acct cap = OI/x | paper docs/chain")
for (const m of rows) {
  const d = DOCS[m.baseSymbol!]
  const r = await c.getPerpRiskParams(m.poolAddress as `0x${string}`)
  const allowed = await pc.readContract({ address: m.marginBank as `0x${string}`, abi: bankAbi, functionName: "isVoucherMarketAllowed", args: [m.poolAddress as `0x${string}`] })
  const im = Number(r.initialMarginBps) / 100, mm = Number(r.maintenanceMarginBps) / 100
  const oi = formatUnits(r.maxOpenInterest, m.baseDecimals), cap = formatUnits(r.maxPositionSize, m.baseDecimals)
  const ratio = (Number(oi) / Number(cap)).toFixed(1)
  if (!d) { console.log(`${m.baseSymbol} | NOT IN DOCS | IM ${im}% MM ${mm}% OI ${oi} cap ${cap} paper ${allowed}`); continue }
  const flag = (a: unknown, b: unknown) => (String(a) === String(b) ? "" : " <-")
  console.log(`${m.baseSymbol.padEnd(8)} | ${d[0]}x / ${100 / im}x${flag(d[0], 100 / im)} | ${d[1]} / ${im}${flag(d[1], im)} | ${d[2]} / ${mm}${flag(d[2], mm)} | ${d[5]} / ${oi}${flag(Number(d[5]), Number(oi))} | 1/${ratio}${ratio === "10.0" ? "" : " <-"} | ${d[6]} / ${allowed}${flag(d[6], allowed)}`)
}
process.exit(0)
