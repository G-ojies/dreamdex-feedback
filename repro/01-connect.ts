// Verbatim "Connect" sample from https://app.testnet.dreamdex.io/docs/developers/perps-testnet
// (read-only: no PRIVATE_KEY), plus a dump of the BTC market row.
import {
  SOMNIA_HIDEKI_TESTNET_ADDRESSES,
  SomniaMarkets,
} from "@somnia-chain/markets-sdk"
import { hidekiTestnet } from "@somnia-chain/markets-sdk/chains"

const markets = new SomniaMarkets({
  chain: hidekiTestnet,
  indexerUrl: "https://hideki-dev.smk.somnia.host/v1/graphql",
  addresses: SOMNIA_HIDEKI_TESTNET_ADDRESSES,
  privateKey: process.env.PRIVATE_KEY as `0x${string}`, // leave out for read-only
})

const perps = await markets.client.listPerpMarkets()
const btc = perps.find((m) => m.baseSymbol === "BTC")!
console.log("perp markets:", perps.length)
console.log(btc)
process.exit(0)
