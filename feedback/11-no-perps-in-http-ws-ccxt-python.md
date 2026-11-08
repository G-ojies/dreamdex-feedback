# Missing feature: perps are not available through the HTTP API, WebSocket API, CCXT or the bot kit's Python core
Severity: normal
Area: API

## Steps to reproduce
1. `curl -s https://stg.api.dreamdex.io/v0/markets | jq '[.markets[].kind] | unique'`
2. Read the HTTP API, WebSocket API and CCXT pages under https://app.testnet.dreamdex.io/docs/developers/. None of them mention perps outside the navigation menu.
3. `grep -ril perp packages/core-py` in dreamdex-bot-kit (commit 4e75896).

## Expected
Perps can be reached through the same integration paths as spot (REST market data, WebSocket feed, CCXT), or the docs say clearly that perps are SDK-only for now.

## Actual
- The HTTP API lists only `["spot"]` markets (3 markets). No perp markets, funding, positions or margin endpoints.
- The WebSocket and CCXT docs cover spot only.
- The bot kit's Python core (`packages/core-py`) has no perp code. The perp strategies are TypeScript only, while the README sells "TypeScript and Python".
- The developer perps page only documents `@somnia-chain/markets-sdk` and raw contract calls. It does not say that the REST, WS and CCXT paths do not cover perps.

Bot builders who use Python or CCXT, or who can't hold a WebSocket open to the RPC (the SDK needs it, see "genesis check failed" in Common pitfalls), have to write raw contract calls for perps. A short "Perps support by integration" table on the developer page would save that discovery work, and REST or WS perp market data would cover most bots.

## Evidence
```
$ curl -s https://stg.api.dreamdex.io/v0/markets | python3 -c 'import sys,json;d=json.load(sys.stdin)["markets"];print(len(d),sorted({m["kind"] for m in d}))'
3 ['spot']
```

## Environment
dreamDEX staging API https://stg.api.dreamdex.io/v0, dreamdex-bot-kit 4e75896, 2026-11-08.
