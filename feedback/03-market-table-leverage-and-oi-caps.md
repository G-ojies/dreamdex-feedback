# Perps market table and margin page: leverage tiers, margins and open interest caps do not match the live contracts
Severity: normal
Area: docs

## Steps to reproduce
1. Open https://app.testnet.dreamdex.io/docs/trading/perps-testnet (Markets table) and https://app.testnet.dreamdex.io/docs/trading/perps-testnet/margin-and-liquidations (Margin thresholds).
2. Run `npx tsx repro/11-market-table.ts`. It reads `getPerpRiskParams(pool)` (initialMarginBps, maintenanceMarginBps, maxOpenInterest) for every pool and prints docs value / chain value.

## Expected
The docs say these figures "are read from the live markets", so they should match the contracts. The margin page says the testnet tiers are 20x, 10x and 5x.

## Actual
- BTC, ETH, SOL, HYPE: docs 20x, 5% / 2.5%. Chain: initialMarginBps 250, maintenanceMarginBps 125, so 40x, 2.5% / 1.25%. `getMaxPerpOrderSize` for BTC also returns `effectiveImfBps: "250"`, and `getPerpSystemConfig` returns `maxLeverageLimit: 40`.
- 1000PEPE, LIT, PUMP, TAO, VVV, WLD, ZEC, ZRO: docs 5x, 20% / 10%. Chain: 1000 / 500 bps, so 10x, 10% / 5%. No market on chain is at 5x.
- Open interest caps: 20 of 21 differ, by 2x to 4x. Examples, docs / chain: BTC 246.81545 / 493.6309, ETH 3,995.6125 / 7,991.225, XRP 344,632 / 1,378,528, ZEC 420 / 1,680, ZRO 250,599.5 / 1,002,398. Only TAO matches.
- The margin page table (20x / 10x / 5x columns) and the sentence "20x, 10x or 5x on testnet" are wrong in the same way. The 2.5% move to liquidation example at 20x no longer applies to the 40x markets, where maintenance is 1.25%.

## Evidence
Output of `repro/11-market-table.ts` on 2026-11-08 (abridged, `<-` marks a mismatch):
```
market   | maxLev docs/chain | IM% docs/chain | MM% docs/chain | OI cap docs/chain
ZRO      | 5x / 10x <-  | 20 / 10 <- | 10 / 5 <-     | 250599.5 / 1002398 <-
TAO      | 5x / 10x <-  | 20 / 10 <- | 10 / 5 <-     | 2185.491 / 2185.491
ADA      | 10x / 10x    | 10 / 10    | 5 / 5         | 2254678 / 9018712 <-
XRP      | 20x / 20x    | 5 / 5      | 2.5 / 2.5     | 344632 / 1378528 <-
SOL      | 20x / 40x <- | 5 / 2.5 <- | 2.5 / 1.25 <- | 47654.44 / 95308.88 <-
BTC      | 20x / 40x <- | 5 / 2.5 <- | 2.5 / 1.25 <- | 246.81545 / 493.6309 <-
```
The voucher leverage cap is 20x (`getPerpVoucherCampaign().leverageCapX`). That may be why the table shows 20x for BTC, but the table also gives 5% initial margin, which only holds for a voucher account, and it does not say so.

## Environment
@somnia-chain/markets-sdk 0.32.1, Somnia Tokyo testnet (50383), read-only (no wallet needed), 2026-11-08 around 21:40 UTC.
