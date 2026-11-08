# SDK Perps and Exchange docs use the symbol "BTC/USDSO:USDSO", which the SDK rejects
Severity: normal
Area: docs

## Steps to reproduce
1. Open https://somnia-platform-docs.vercel.app/markets/somnia-markets/typescript/perps (same text in `node_modules/@somnia-chain/markets-sdk/docs/PERPS.md`). The quick reference uses:
   ```ts
   await exchange.depositMargin("BTC/USDSO:USDSO", 1_000);
   await exchange.createOrder("BTC/USDSO:USDSO", "limit", "buy", 0.001, 62_000);
   const { fundingRate, markPrice } = await exchange.fetchFundingRate("BTC/USDSO:USDSO");
   ```
   The Exchange page's symbol table (`docs/EXCHANGE.md` line 39) also lists `BTC/USDSO:USDSO` for perps.
2. Run `npx tsx repro/08-symbols.ts`. It calls `loadMarkets()` and then `fetchFundingRate` / `fetchOrderBook` with each spelling.

## Expected
The documented symbol works.

## Actual
```
BTC/USDso:USDso -> fetchFundingRate OK 0.001099938062072417
BTC/USDSO:USDSO -> InvalidInputError @somnia-chain/markets-sdk: unknown symbol BTC/USDSO:USDSO — call loadMarkets() first
```
Only the mixed-case `BTC/USDso:USDso` is accepted, which is the form `loadMarkets()` registers and the "Get testnet funds" how-to uses. Also:
- The error message says "call loadMarkets() first" even though `loadMarkets()` was just called, which sends people the wrong way. Suggesting the closest known symbol, or matching case-insensitively, would help.
- The first line of the same page says "Perps are live on testnet: BTC/USDSO:USDSO and ETH/USDSO:USDSO". There are 21 documented markets on Tokyo (22 returned) and 19 on Shannon.

## Evidence
Output of `repro/08-symbols.ts` above. `loadMarkets()` registers 22 perp symbols, all in the form `XXX/USDso:USDso`.

## Environment
@somnia-chain/markets-sdk 0.32.1, Somnia Tokyo testnet (50383), read-only, 2026-11-08.
