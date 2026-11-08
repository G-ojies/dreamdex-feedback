# Undocumented "ADLT-PERP" market with a frozen oracle and empty book is returned as a live, tradeable perp market
Severity: normal
Area: API

## Steps to reproduce
1. `npx tsx repro/07-adlt.ts` (read-only), or `NETWORK=hideki npm run perp:doctor` in dreamdex-bot-kit.
2. Compare the market list with the docs, which say "All 21 markets are margined in USDso".

## Expected
`listPerpMarkets()`, `listTradeablePerpPools()` and `loadMarkets()` return only the 21 documented markets, or a test market is clearly flagged as not tradeable.

## Actual
All three return 22 markets. The extra one is `ADLT` (pool `0xe3f6dcda98595764970e5a6ffd167af1d1b35123`, base token `0xe8ef985c4eae862eea600b08092bbd1b40f7d481`):
- `listTradeablePerpPools({ factory })` includes it (`tradeable: true`). `loadMarkets()` exposes `ADLT/USDso:USDso`.
- Created 2026-11-05T14:46:50Z. 31,250 trades until 2026-11-05T23:10:35Z, none since.
- `getPerpState`: markPrice = indexPrice = exactly 3450.000000, `markPriceOk: true`. The oracle `0x7433F272cDf65f7C2B819446EB6eD1ADE6CaCC83` reports a fixed price.
- Funding has not settled since `lastFundingUpdateAt` 2026-11-05T23:07:57Z, although `nextFundingAt` was 2026-11-06T00:07:57Z.
- 99 ADLT of open interest (about 341k USDso notional) is still open on it.
- The indexer row shows `markPrice` 3000 while the chain says 3450.
- The bot kit doctor prints it first in its list as a live market: `ADLT-PERP  mark=3450.00 · funding 10.950% (pays shorts) · book[bid=none ask=none]`.

The name and behaviour suggest an auto-deleveraging test market. A bot that iterates over "all live markets" (perp-guard with no PERP_SYMBOL, scanners, funding bots) picks it up as a normal market with a healthy-looking mark.

## Evidence
```
listPerpMarkets(): 22 ADLT,ZRO,LIT,VVV,1000PEPE,PUMP,ZEC,TAO,WLD,NEAR,XLM,AVAX,LINK,SUI,ADA,BNB,DOGE,XRP,HYPE,SOL,ETH,BTC
getPerpState {"markPrice":"3450000000000000000000","markPriceOk":true,"indexPrice":"3450000000000000000000",
  "lastFundingUpdateAt":"1793920077","nextFundingAt":"1793923677","openInterest":"99000000000000000000", ...}
tradeable pools include ADLT: true
```

## Environment
@somnia-chain/markets-sdk 0.32.1, dreamdex-bot-kit commit 4e75896, Somnia Tokyo testnet (50383), indexer https://hideki-dev.smk.somnia.host/v1/graphql, 2026-11-08 around 21:38 UTC.
