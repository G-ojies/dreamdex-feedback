// "Paper USDso" sample from the developer perps page, verbatim apart from setup.
import { markets, j } from "./common.ts"
const perps = await markets.client.listPerpMarkets()
const btc = perps.find((m) => m.baseSymbol === "BTC")!
const account = markets.walletAddress!
console.log("account", account)
const eligibility = await markets.client.getPerpVoucherEligibility(btc.marginBank, account)
console.log("eligibility", j(eligibility))
console.log("campaign", j(await markets.client.getPerpVoucherCampaign(btc.marginBank as any)))
if (eligibility.eligible && process.argv[2] === "claim") {
  const r = await markets.trader.claimPerpVoucher({ marginBank: btc.marginBank })
  console.log("claim", j(r))
  console.log("voucher", j(await markets.client.getPerpVoucher(btc.marginBank as any, account)))
  console.log("margin", j(await markets.client.getMarginAccount(btc.marginBank as any, account)))
}
process.exit(0)
