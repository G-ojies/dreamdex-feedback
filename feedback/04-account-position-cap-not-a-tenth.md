# Docs say the per-account position cap is "a tenth" of the open interest cap; on chain it is 1/20 or 1/40 on most markets
Severity: normal
Area: docs

## Steps to reproduce
1. Read the statement on https://app.testnet.dreamdex.io/docs/developers/perps-testnet (Common pitfalls): "Each account has a position cap per market, a tenth of the market's open interest cap on most markets." The trader page says the same: "A single account is capped at a tenth of it on most markets."
2. Run `npx tsx repro/11-market-table.ts` and look at the `acct cap = OI/x` column (maxOpenInterest / maxPositionSize from `getPerpRiskParams`).

## Expected
maxPositionSize is about maxOpenInterest / 10 on most markets.

## Actual
Only TAO (and the unlisted ADLT test market) are at 1/10. Of the 21 documented markets:
- 1/40: ZRO, LIT, VVV, 1000PEPE, PUMP, WLD
- about 1/20: NEAR, XLM, AVAX, LINK, SUI, ADA, BNB (1/19.8), DOGE, XRP, SOL, ETH
- other: BTC 1/4.9 (100 BTC of 493.63), ZEC 1/4 (420 of 1,680), HYPE 1/7.9 (6,000 of 47,625.44)

A bot that sizes from the "a tenth" rule overestimates its cap by 2x to 4x on most markets and gets `MaxPositionSizeExceeded()`. `getMaxPerpOrderSize().maxPositionSize` returns the right value (for BTC: `10000000000` = 100 BTC), so the docs could point there instead of giving a ratio.

## Evidence
```
ZRO  OIcap=1,002,398  posCap=25,059.9  ratio=40.0
SOL  OIcap=95,308.9   posCap=4,765.44  ratio=20.0
BTC  OIcap=493.631    posCap=100       ratio=4.9
TAO  OIcap=2,185.49   posCap=218.549   ratio=10.0
```
(from `repro/02-survey.ts` / `repro/11-market-table.ts`)

## Environment
@somnia-chain/markets-sdk 0.32.1, Somnia Tokyo testnet (50383), read-only, 2026-11-08.
