# Aave v4 Dashboards

Live dashboards for Aave v4 and the DEX Spoke initiative. Everything is read client-side in the
browser — no backend, no API keys, nothing cached server-side. Each page recomputes every derived
number from raw inputs on refresh, and labels which of its figures are read from source (`R`),
derived (`D`), or not confirmable (`NA`).

**[Open the dashboards →](https://marcusblabs.github.io/aave-dashboards/)**

- **[Tokenization Spoke Caps](https://marcusblabs.github.io/aave-dashboards/spoke-caps/)** —
  deposit-cap headroom on the `waCore*` ERC-4626 wrappers across the Ethereum and Avalanche
  Core Hubs (cap, supplied, available per wrapper, with fill bands and halt/freeze state).
  Reads `getSpokeConfig`, `totalAssets` and `maxDeposit` directly from the hubs over public RPC.
- **[Correlated-Pair Loop Economics](https://marcusblabs.github.io/aave-dashboards/vault-economics.html)** —
  Fluid's correlated-pair loop vaults decomposed into four APR engines, ranked, and torn down
  vault by vault; then the same loop structures evaluated against Aave v4 hub liquidity.
  Every row in the ranked board expands into its full decomposition.

## Data sources

| Source | Used for | Notes |
| --- | --- | --- |
| `api.aave.com/graphql` | Aave v4 hub rates, borrowable depth, collateral factors, borrowable/frozen flags | Aave's own public API — no key, CORS-open. Rates come back as decimal fractions. Collateral factor is **spoke-scoped**, not hub-wide. |
| Public RPC (`publicnode`, `drpc`, `api.avax.network`) | Spoke configs, caps, supply; Ethereum block height | `eth_call` at `latest` |
| `api.fluid.instadapp.io` | Fluid per-token rates, staking APR, rewards, pool reserves, prices | |
| `api.merkl.xyz` | Live incentive campaigns and their end dates | Rejects plain `http://localhost` origins (works over `https` and `file://`), and rate-limits bursts |

If a source cannot be reached, the affected panel keeps its last good value and is marked
**STALE**, or falls back to a dated snapshot and says so. No figure is presented as live when
it is not — the freshness bar under the header always shows which sources actually landed.

## Layout

```
index.html             landing page
spoke-caps/index.html  spoke deposit caps
vault-economics.html   loop economics
nav.js                 shared top nav + theme toggle, injected into every page
```

`nav.js` derives its base path from its own `src`, so the nav works under the
`/aave-dashboards/` GitHub Pages prefix, on a local static server, and over `file://`
without changes. Add a page to the `ITEMS` list once and every page picks it up.

Unofficial community dashboards, not affiliated with Aave. Public data may lag or rate-limit.
Nothing here is financial advice.
