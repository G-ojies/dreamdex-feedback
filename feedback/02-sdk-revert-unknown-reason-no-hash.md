# SDK reports the voucher claim revert as "for an unknown reason" and the error carries no transaction hash
Severity: normal
Area: SDK

## Steps to reproduce
1. With a funded key on Tokyo testnet, run `npx tsx repro/04-voucher.ts claim` (calls `trader.claimPerpVoucher`, see item 01).
2. Inspect the thrown `ContractRevertError`.

## Expected
- The revert is decoded by name (`SelfClaimDisabled()`), like the other VoucherDistributor errors (`AlreadyClaimed`, `ClaimantNotFlat`, `BudgetExhausted`, ...), which the SDK already ships in `contractErrorsAbi`.
- The error tells the caller which transaction failed, so a bot can log it and look it up on the explorer.

## Actual
```
ContractRevertError: @somnia-chain/markets-sdk: claim reverted: for an unknown reason.
  errorName: undefined,
  args: undefined,
  reason: 'for an unknown reason.',
  data: '0x3e31dcc2',
  address: '0x2ACD9EFdA721450906bfE1bef3edE269636E42C4',
  functionName: 'claim',
```
- `0x3e31dcc2` (`SelfClaimDisabled()`) is not among the 546 errors in `dist/contractErrorsAbi.js` of 0.32.1, and is also missing from the newest canary `0.32.2-canary.42234160381.g04c4cef7358c`.
- `ContractRevertError` has no `hash` / `transactionHash` field (see `dist/errors.d.ts`). In `dist/writer.js` (`revertErrorForReceipt`) the hash only appears inside the message text when no revert data could be recovered. When the replay decodes something, the hash is dropped, although a transaction was mined and paid for.

## Evidence
Mined, reverted transactions that produced this error: `0xc827300161845f06903dd8f8faa0c67d7158a59c1ba886f6ae44afca37bbf49a`, `0x2338bb2b1c706f4cade58372cb67ac3f413ced226d5e67f5617cb0b8d208ce51`. The hash had to be found on the explorer address page, because the error does not include it.

## Environment
@somnia-chain/markets-sdk 0.32.1, Somnia Tokyo testnet (50383), wallet 0xF450770da5d06F04730d109773439B469Ff342D3.
