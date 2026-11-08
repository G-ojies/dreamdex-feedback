# The developer docs "Connect" sample fails to type-check on a fresh install: hidekiTestnet type is incompatible with viem 2.57.17
Severity: normal
Area: SDK

## Steps to reproduce
1. In an empty project: `npm i @somnia-chain/markets-sdk@0.32.1 viem typescript@5 @types/node@20`. The SDK's peer range is `viem: ^2.18.5`, so npm installs viem 2.57.17, the current `latest` tag.
2. Paste the samples from https://app.testnet.dreamdex.io/docs/developers/perps-testnet into a file (`repro/12-docs-samples-typecheck.ts`) and run `npx tsc -p repro/tsconfig.json` (`strict: true`, `skipLibCheck: true`).

## Expected
The documented sample compiles.

## Actual
```
repro/12-docs-samples-typecheck.ts(10,3): error TS2322: Type '{ ...; blockTime: 10; ... }' is not assignable to type 'Chain'.
  ... Types of property 'prepareTransactionRequest' are incompatible.
  ... Type 'PrepareTransactionRequestPhase' is not assignable to type '"beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters"'.
  Type '"afterFillTransactionError"' is not assignable to type '"beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters"'.
```
Line 10 is `chain: hidekiTestnet,`. The same file has 0 errors with viem 2.57.16.

Cause: `dist/chains/definitions/hidekiTestnet.d.ts` declares `hidekiTestnet` with viem's whole chain shape copied inline, including a literal union for the `prepareTransactionRequest` phase, instead of the `Chain` type. viem 2.57.17 added `'afterFillTransactionError'` to `PrepareTransactionRequestPhase`, so the frozen copy no longer matches. Annotating the exported chains as `Chain` (or pinning the tested viem range) would avoid this. The other chain definitions in `dist/chains/definitions/` likely have the same problem.

The code still runs (tsx strips types), so this only hits TypeScript users, but that is the audience of the SDK docs.

## Evidence
- `npm view viem dist-tags.latest` returns `2.57.17` (published 2026-11-08T18:09Z).
- viem 2.57.16: 0 errors. viem 2.57.17: 1 error (TS2322 above).
- `node_modules/viem/_types/types/chain.d.ts:55`: `type PrepareTransactionRequestPhase = 'beforeFillTransaction' | 'afterFillTransactionError' | 'beforeFillParameters' | 'afterFillParameters';`
- `node_modules/@somnia-chain/markets-sdk/dist/chains/definitions/hidekiTestnet.d.ts:84`: `phase: "beforeFillTransaction" | "beforeFillParameters" | "afterFillParameters";`

## Environment
@somnia-chain/markets-sdk 0.32.1, viem 2.57.17, TypeScript 5.9.3, Node 20.19.2, Linux. No network or wallet needed.
