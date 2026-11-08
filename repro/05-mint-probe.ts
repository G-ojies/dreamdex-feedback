// Simulate (eth_call only, no tx) a public mint on the Hideki perps collateral.
import { createPublicClient, http, parseUnits, parseAbi } from "viem"
import { hidekiTestnet } from "@somnia-chain/markets-sdk/chains"
import "dotenv/config"
const pc = createPublicClient({ chain: hidekiTestnet, transport: http("https://api.hideki2.infra.testnet.somnia.network") })
const abi = parseAbi(["function mint(address,uint256)", "function symbol() view returns (string)", "function decimals() view returns (uint8)", "function balanceOf(address) view returns (uint256)"])
const token = "0xed7993A74dAe1e6656B704A424DcD8711aAf4F72"
console.log(await pc.readContract({ address: token, abi, functionName: "symbol" }), await pc.readContract({ address: token, abi, functionName: "decimals" }))
try {
  await pc.simulateContract({ account: process.env.ADDRESS as `0x${string}`, address: token, abi, functionName: "mint", args: [process.env.ADDRESS as `0x${string}`, parseUnits("1000", 18)] })
  console.log("mint simulation: OK")
} catch (e: any) { console.log("mint simulation reverted:", e.shortMessage, e.cause?.data ?? e.cause?.cause?.data ?? "") }
