// Compare indexer listPerpMarkets() against the factory's tradeable list, and
// check getPerpMaxLeverage / getPerpState for a few pools.
import { SOMNIA_HIDEKI_TESTNET_ADDRESSES as A, SomniaMarkets } from "@somnia-chain/markets-sdk"
import { hidekiTestnet } from "@somnia-chain/markets-sdk/chains"
const m = new SomniaMarkets({ chain: hidekiTestnet, indexerUrl: "https://hideki-dev.smk.somnia.host/v1/graphql", addresses: A })
const c = m.client
const perps = await c.listPerpMarkets()
const statuses = await c.listPerpPoolStatuses({ factory: A.perpPoolFactory as `0x${string}` })
console.log("statuses", JSON.stringify(statuses, (_, v) => typeof v === "bigint" ? v.toString() : v))
const tradeable = (await c.listTradeablePerpPools({ factory: A.perpPoolFactory as `0x${string}` })).map((x) => x.toLowerCase())
console.log("indexer rows:", perps.length, "tradeable pools:", tradeable.length)
for (const p of perps) if (!tradeable.includes(p.poolAddress.toLowerCase())) console.log("NOT tradeable but listed:", p.baseSymbol, p.poolAddress)
const acct = "0x000000000000000000000000000000000000dEaD" as const
for (const sym of ["BTC", "ETH", "ZRO", "ADA"]) {
  const p = perps.find((x) => x.baseSymbol === sym)!
  const lev = await c.getPerpMaxLeverage({ pool: p.poolAddress as any, marginBank: p.marginBank as any, account: acct })
  const st = await c.getPerpState(p.poolAddress as any)
  console.log(sym, "maxLev", lev, "state", JSON.stringify(st, (_, v) => typeof v === "bigint" ? v.toString() : v))
}
process.exit(0)
