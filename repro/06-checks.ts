// Read-only checks of statements on the developer perps page.
import { parseUnits, parseAbi, formatUnits } from "viem"
import { markets, j } from "./common.ts"
const c = markets.client
const pc = c.getViemClient()
const perps = await c.listPerpMarkets()
const btc = perps.find((m) => m.baseSymbol === "BTC")!
const account = markets.walletAddress!

// 1. getOrderBookParameters() "returns the raw tickSize, minQuantity and lotSize, in that order"
const abi = parseAbi(["function getOrderBookParameters() view returns (uint256,uint256,uint256)"])
for (const sym of ["BTC", "ETH", "SOL"]) {
  const m = perps.find((x) => x.baseSymbol === sym)!
  const r = await pc.readContract({ address: m.poolAddress as `0x${string}`, abi, functionName: "getOrderBookParameters" })
  console.log(sym, "getOrderBookParameters()", r.map(String), "| row tickSize", m.tickSize, "minQuantity", m.minQuantity, "lotSize", m.lotSize)
}
// 2. OperatorPermissionsRegistry address
console.log("operator registry (BTC pool):", await c.getOperatorPermissionsRegistry(btc.poolAddress as `0x${string}`))
// 3. Stop order deposit
console.log("perp stop SOMI payment:", formatUnits(await c.getPerpStopOrderSomiPayment(btc.stopRegistry as `0x${string}`), 18), "STT")
// 4. "Size and place an order" sample, read-only part
const price = parseUnits("100000", btc.quoteDecimals)
const max = await c.getMaxPerpOrderSize({ pool: btc.poolAddress, marginBank: btc.marginBank, account, isBid: true, price } as any)
console.log("getMaxPerpOrderSize", j(max))
process.exit(0)
