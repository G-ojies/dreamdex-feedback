// Which perp symbol spelling does the exchange API accept? Docs use both
// "BTC/USDso:USDso" (how-to/get-testnet-funds) and "BTC/USDSO:USDSO" (PERPS.md).
import { markets, j } from "./common.ts"
await markets.loadMarkets?.()
const syms = Object.keys((markets as any).markets ?? {}).filter((s) => s.startsWith("BTC") || s.startsWith("ETH"))
console.log("loaded symbols (BTC/ETH):", syms)
for (const s of ["BTC/USDso:USDso", "BTC/USDSO:USDSO", "BTC-PERP"]) {
  try { const r = await markets.fetchFundingRate(s); console.log(s, "-> fetchFundingRate OK", r.fundingRate) }
  catch (e: any) { console.log(s, "->", e.constructor.name, e.message.slice(0, 200)) }
  try { const r = await markets.fetchOrderBook(s, 2); console.log(s, "-> fetchOrderBook OK bids", j(r.bids)) }
  catch (e: any) { console.log(s, "-> fetchOrderBook", e.constructor.name, e.message.slice(0, 200)) }
}
process.exit(0)
