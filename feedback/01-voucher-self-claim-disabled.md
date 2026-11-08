# Paper USDso voucher: getPerpVoucherEligibility says eligible, but claimPerpVoucher always reverts with SelfClaimDisabled()
Severity: major
Area: contracts

## Steps to reproduce
1. Generate a fresh key, fund it with 1 STT from https://explorer.testnet.somnia.network/tokyo/faucet.
2. Run the "Get test funds" sample from https://app.testnet.dreamdex.io/docs/developers/perps-testnet with `@somnia-chain/markets-sdk@0.32.1` (repro script: `repro/04-voucher.ts`):
   ```
   NODE_OPTIONS="--dns-result-order=ipv4first" npx tsx repro/04-voucher.ts claim
   ```
   The script calls `client.getPerpVoucherEligibility(btc.marginBank, account)` and, if eligible, `trader.claimPerpVoucher({ marginBank: btc.marginBank })`, exactly as the docs do.

## Expected
The developer docs say: "Any address can claim the 1,000 USDso perps credit once, as long as it holds no perp positions or orders". The SDK says `eligible: true` means "A claim sent now would succeed, unless state changes before it lands", and that the ineligibility reasons "are checked in the order VoucherDistributor.claim() checks them". So the claim should credit 1,000 USDso to the MarginBank.

## Actual
`getPerpVoucherEligibility` returns:
```
{ "eligible": true, "grantAmount": "1000000000000000000000" }
```
`getPerpVoucherCampaign` shows an open campaign (startsAt 1790553600, endsAt 1798477478, claimsRemaining 70884, leverageCapX 20).

The claim transaction is mined and reverts (status 0, gasUsed 22781). Replaying it with eth_call returns revert data `0x3e31dcc2`, which is the selector of `SelfClaimDisabled()` (keccak256("SelfClaimDisabled()")[0:4] = 0x3e31dcc2). The selector is present in the VoucherDistributor implementation bytecode (`0x9657f0fd53efc01cd108d93c835bb4b517732b43`, behind proxy `0x2ACD9EFdA721450906bfE1bef3edE269636E42C4`), right after a check on a boolean flag in the distributor config.

So direct claims from a key are switched off on chain, while:
- the developer docs still document `claimPerpVoucher` as the way to get paper USDso,
- `getPerpVoucherEligibility` does not check this flag and reports `eligible: true`, which costs the caller a reverted transaction.

Result for bot builders: a bot key cannot get perps collateral on its own on the Tokyo testnet. The USDso collateral `0xed7993A74dAe1e6656B704A424DcD8711aAf4F72` has no public mint either (eth_call of `mint(address,uint256)` reverts, `repro/05-mint-probe.ts`), so the only route left is the app (Perps Arena plus Link a Bot).

## Evidence
- Reverted claim tx 1: `0xc827300161845f06903dd8f8faa0c67d7158a59c1ba886f6ae44afca37bbf49a` (block 45194009)
- Reverted claim tx 2: `0x2338bb2b1c706f4cade58372cb67ac3f413ced226d5e67f5617cb0b8d208ce51` (block 45194140)
- Explorer: https://explorer.testnet.somnia.network/tokyo/tx/0xc827300161845f06903dd8f8faa0c67d7158a59c1ba886f6ae44afca37bbf49a
- eth_call replay: `{"data":"0x4e71d92d","from":"0xF450770da5d06F04730d109773439B469Ff342D3","to":"0x2ACD9EFdA721450906bfE1bef3edE269636E42C4"}` returns `execution reverted`, data `0x3e31dcc2`.

Suggested fix: either re-enable self-claim, or have `getPerpVoucherEligibility` read the flag and return a reason such as `selfClaimDisabled`, and update the "Get test funds" section to say how a bot key should get paper USDso.

## Environment
@somnia-chain/markets-sdk 0.32.1, viem 2.57.17, Node 20.19.2, Somnia Tokyo testnet (chain 50383, RPC https://api.hideki2.infra.testnet.somnia.network), wallet 0xF450770da5d06F04730d109773439B469Ff342D3, 2026-11-08.
