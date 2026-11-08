# dreamDEX Perps Builder Bounty: feedback

Bug reports and feedback for the dreamDEX Perps Builder Bounty (Feedback track, DoraHacks), gathered by using the Somnia Markets SDK, the dreamDEX developer and trader docs, and the dreamDEX bot kit against the Somnia Tokyo testnet (chain 50383).

- `feedback/NN-*.md`: one report per issue, in the bounty's format.
- `repro/`: small scripts that reproduce the reports. Read-only unless stated otherwise.

## Running the repro scripts

```
npm install
cp .env.example .env    # only needed for 04-voucher.ts and the bot kit runs
NODE_OPTIONS="--dns-result-order=ipv4first" npx tsx repro/02-survey.ts
```

`NODE_OPTIONS` is only a workaround for a local IPv6 setup that made Node's fetch time out. It has nothing to do with dreamDEX.

| Script | What it shows | Report |
| --- | --- | --- |
| 01-connect.ts | Connect sample from the developer docs, verbatim | baseline |
| 02-survey.ts | Every perp market's risk params and feed status | 03, 04 |
| 03-tradeable.ts | Indexer markets vs factory tradeable pools | 06 |
| 04-voucher.ts | Voucher eligibility, and `claim` sends a claim tx | 01, 02 |
| 05-mint-probe.ts | Simulated USDso mint on Tokyo (eth_call only) | 01, 10 |
| 06-checks.ts | Statements on the developer page that check out | baseline |
| 07-adlt.ts | The undocumented ADLT market | 06 |
| 08-symbols.ts | Perp symbol spellings | 07 |
| 11-market-table.ts | Docs market table vs chain | 03, 04, 05 |
| 12-docs-samples-typecheck.ts | Docs samples under `tsc --strict` | 08 |

Testnet only. No real funds were used.
