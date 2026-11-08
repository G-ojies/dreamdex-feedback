// Read-only survey of every perp market on the Hideki (Tokyo) testnet.
import { SOMNIA_HIDEKI_TESTNET_ADDRESSES, SomniaMarkets } from "@somnia-chain/markets-sdk"
import { hidekiTestnet } from "@somnia-chain/markets-sdk/chains"
import { formatUnits } from "viem"

const markets = new SomniaMarkets({
  chain: hidekiTestnet,
  indexerUrl: "https://hideki-dev.smk.somnia.host/v1/graphql",
  addresses: SOMNIA_HIDEKI_TESTNET_ADDRESSES,
})
const c = markets.client
const perps = await c.listPerpMarkets()
const sys = await c.getPerpSystemConfig(perps[0].marginBank as `0x${string}`)
console.log("systemConfig", sys)
const rows: any[] = []
for (const m of perps) {
  let risk: any = {}, feed: any = {}
  try { risk = await c.getPerpRiskParams(m.poolAddress as `0x${string}`) } catch (e: any) { risk = { err: e.message.slice(0, 120) } }
  try { feed = await c.getPerpFeedStatus(m.poolAddress as `0x${string}`) } catch (e: any) { feed = { err: e.message.slice(0, 120) } }
  rows.push({
    sym: m.baseSymbol, pool: m.poolAddress, dec: m.baseDecimals,
    tick: formatUnits(BigInt(m.tickSize), m.quoteDecimals),
    min: formatUnits(BigInt(m.minQuantity), m.baseDecimals),
    lot: formatUnits(BigInt(m.lotSize), m.baseDecimals),
    imBpsRow: m.initialMarginBps, oi: formatUnits(BigInt(m.openInterest ?? 0), m.baseDecimals),
    mark: m.markPrice && formatUnits(BigInt(m.markPrice), 18),
    markAgeS: m.markPriceUpdatedAt ? Math.round(Date.now() / 1000 - Number(m.markPriceUpdatedAt)) : null,
    risk, feed,
  })
}
console.log(JSON.stringify(rows, (_, v) => typeof v === "bigint" ? v.toString() : v, 1))
process.exit(0)
