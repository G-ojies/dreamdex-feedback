// The 22nd perp market returned by the SDK: ADLT-PERP. Not in the docs' 21-market table.
import { markets, j } from "./common.ts"
const c = markets.client
const perps = await c.listPerpMarkets()
console.log("listPerpMarkets():", perps.length, perps.map((m) => m.baseSymbol).join(","))
const m = perps.find((x) => x.baseSymbol === "ADLT")!
console.log("row", j({ pool: m.poolAddress, baseToken: m.baseToken, createdAt: new Date(Number(m.createdAtTimestamp) * 1000).toISOString(), lastTradeAt: m.lastTradeAt && new Date(Number(m.lastTradeAt) * 1000).toISOString(), tradeCount: m.tradeCount, markPrice: m.markPrice, markPriceUpdatedAt: m.markPriceUpdatedAt && new Date(Number(m.markPriceUpdatedAt) * 1000).toISOString(), openInterest: m.openInterest }))
console.log("getPerpState", j(await c.getPerpState(m.poolAddress as any)))
console.log("tradeable pools include ADLT:", (await c.listTradeablePerpPools({ factory: m.marginBank && (await c.getPerpSystemConfig(m.marginBank as any)).perpPoolFactory })).map((a) => a.toLowerCase()).includes(m.poolAddress.toLowerCase()))
const top = await c.getBookTopsOnchain([{ pool: m.poolAddress, kind: "spot" } as any]).catch((e: any) => e.message)
console.log("book tops", j(top))
process.exit(0)
