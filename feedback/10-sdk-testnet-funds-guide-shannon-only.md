# SDK "Get testnet funds" guide only covers Shannon and has no working route to perps collateral on Tokyo, where dreamDEX perps live
Severity: normal
Area: docs

## Steps to reproduce
1. Open https://somnia-platform-docs.vercel.app/markets/somnia-markets/typescript/how-to/get-testnet-funds. The faucet page links to it from "From a script ... the Markets SDK docs explain how to get testnet funds".
2. Follow it for the dreamDEX perps markets on the Tokyo testnet (chain 50383), which the dreamDEX developer docs and the bot kit use.

## Expected
A scriptable way for a bot key to get gas and perps collateral on the network where the dreamDEX perps markets and Perps Arena run.

## Actual
- The guide is written for Shannon only ("fund an account on the Shannon testnet"). It mints USDso at `0x9c32f3827a1a99f0cf9b213de8b53ec3d57bb171` ("USDso on Shannon") and then calls `exchange.depositMargin(...)`.
- On Tokyo the perps collateral is `0xed7993A74dAe1e6656B704A424DcD8711aAf4F72`. Simulating `mint(address,uint256)` on it reverts (`repro/05-mint-probe.ts`: `mint simulation reverted: The contract function "mint" reverted.`).
- The guide's gas section lists https://testnet.somnia.network/ and third-party faucets, but not the Tokyo faucet (https://explorer.testnet.somnia.network/tokyo/faucet). The Tokyo faucet did work for us.
- The voucher route from the dreamDEX developer docs reverts with `SelfClaimDisabled()` (item 01).

So after reading both doc sets, a bot developer has no documented way that works to fund perps margin from code on Tokyo. The only route left is the app (Perps Arena plus Link a Bot), which needs a browser wallet. A Tokyo section, or a pointer to it from the guide, would close the gap.

## Evidence
- `repro/05-mint-probe.ts` output: `USDso 18` / `mint simulation reverted: The contract function "mint" reverted.`
- Tokyo faucet tx that funded the test key: `0xe78fc2c6b986e3d187d140617b61b70e8339e6ccb7966c2277de3af57fc7fa3e`

## Environment
@somnia-chain/markets-sdk 0.32.1, viem 2.57.17, Somnia Tokyo testnet (50383), wallet 0xF450770da5d06F04730d109773439B469Ff342D3, 2026-11-08.
