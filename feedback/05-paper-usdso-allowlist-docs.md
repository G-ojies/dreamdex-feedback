# Paper USDso: docs say six markets are blocked, but the MarginBank allows the voucher on all 21 markets
Severity: normal
Area: docs

## Steps to reproduce
1. The trader market table (https://app.testnet.dreamdex.io/docs/trading/perps-testnet) marks 1000PEPE, LIT, PUMP, VVV, ZEC and ZRO as "Paper USDso: No". The margin page says "The six newest markets are not on that list". The developer page says "Paper USDso blocks some markets ... getMaxPerpOrderSize reports it as limitedBy: voucherBlocked".
2. Read `MarginBank.isVoucherMarketAllowed(pool)` on `0x478769E1177C0773c43A593DCCc4Ad15F15F1394` for every pool (`npx tsx repro/11-market-table.ts`, last column). This is the same read the SDK uses for its `voucherBlocked` verdict (`dist/perp/margin.js`).

## Expected
`isVoucherMarketAllowed` is false for the six markets the docs list as blocked.

## Actual
It returns `true` for all 21 documented markets, including the six marked "No". The only pool that returns `false` is ADLT, which is not in the docs (see item 06).
```
ZRO      | paper docs/chain: false / true <-
LIT      | false / true <-
VVV      | false / true <-
1000PEPE | false / true <-
PUMP     | false / true <-
ZEC      | false / true <-
```
Either the allowlist was opened up and the docs are stale, or the allowlist is wrong on chain. In both cases a voucher user or bot reads the wrong answer from the docs.

## Evidence
Output of `repro/11-market-table.ts` on 2026-11-08, around 21:40 UTC.

## Environment
@somnia-chain/markets-sdk 0.32.1, viem 2.57.17, Somnia Tokyo testnet (50383), read-only.
