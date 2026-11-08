# Bot kit: perp-starter, perp-maker and perp-funding exit in DRY_RUN when the MarginBank is empty
Severity: normal
Area: SDK

## Steps to reproduce
1. Clone https://github.com/somnia-chain/dreamdex-bot-kit (commit 4e75896), run `npm ci`.
2. With a fresh key that has gas but no perps margin:
   ```
   NETWORK=hideki PRIVATE_KEY=0x... PERP_SYMBOL=ETH-PERP PERP_NOTIONAL_USDSO=20 DRY_RUN=true npm start -w perp-starter
   ```
   Repeat with `-w perp-maker` and `-w perp-funding`.

## Expected
The README says "Every strategy defaults to DRY_RUN=true: it logs exactly what it would do without sending anything. Watch it, then set DRY_RUN=false". A dry run sends nothing, so it should work before the account is funded and show what the bot would do. The bot-link check already behaves this way (`if (!link.ok && !ctx.config.dryRun) process.exit(1)`).

## Actual
All three exit straight away with status 1:
```
perp-starter on ETH-PERP (ETH/USDso:USDso) | long 20 USDso at 2x | take-profit 2% stop-loss 1% | dry-run true
MarginBank is empty for 0xF450770da5d06F04730d109773439B469Ff342D3. Deposit collateral before trading: every perp order locks from the bank, not from your wallet, so an unfunded account fails every order. Approve the MarginBank (0x478769e1177c0773c43a593dccc4ad15f15f1394) as spender on the collateral token, then deposit.
npm ERR! Lifecycle script `start` failed with error
```
The margin preflight in `strategies/perp-starter/src/index.ts` (`if (!check.ok) process.exit(1);`) ignores `dryRun`, unlike the link check a few lines above it. Message source: `packages/perp-core/src/margin.ts:122`.

The message also tells an unlinked key to "approve the MarginBank ... then deposit", but on the Tokyo testnet that key has no way to get USDso: there is no public mint, and the voucher self-claim reverts (see item 01).

Related: `packages/perp-core/package.json` uses `@somnia-chain/markets-sdk ^0.31.0`, which resolves to 0.31.0 in the lockfile. The developer docs build against 0.32.1, "the one the app runs".

## Evidence
Console output above for perp-starter. perp-maker and perp-funding print the same `MarginBank is empty` line and exit. perp-guard (no order sizing) keeps running.

## Environment
dreamdex-bot-kit 4e75896 (2026-10-30), Node 20.19.2, NETWORK=hideki (Tokyo testnet 50383), wallet 0xF450770da5d06F04730d109773439B469Ff342D3 (0.9997 STT, 0 USDso).
