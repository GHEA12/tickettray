# TicketTray

A tiny help-desk board that proves itself. Add a ticket, work it across
Open → In Progress → Done, filter and search the board, and watch the
summary numbers stay honest — all verified end to end in a real browser
by [Kane CLI](https://www.testmuai.com/support/docs/kane-cli-introduction/).

Built with an AI coding agent for the **Kane CLI Online Hackathon**
(TestMu AI). Category: *Apps that verify themselves.*

## What it does

- **New ticket form** — requester, subject, priority (Low / Normal /
  High / Urgent) and estimated minutes, with real validation: an empty
  subject, a missing requester, or non-positive minutes are rejected
  with an inline error and nothing is added.
- **Three-column board** — tickets move Open → In Progress → Done
  (with Send back and Reopen where they make sense). Illegal moves,
  like Open straight to Done, are rejected by the core logic.
- **Live summary** — counts per column, total open load in minutes,
  and how many Urgent tickets are still waiting.
- **Filter and search** — by priority, or by subject / requester / id.
- **Persistence** — state is kept in `localStorage`, so the board
  survives a reload. "Reset demo data" restores the seeded board.

## Run it (under 30 seconds)

```bash
npm start
# TicketTray running at http://localhost:4173/
```

No dependencies, no build step. Node 18+ is the only requirement.
(Opening `index.html` directly in a browser also works.)

## Test it

Unit tests for the core logic (the same `logic.js` the browser runs):

```bash
npm test
```

Browser verification with Kane CLI — six natural-language flows in
[`kane/tickettray_test.md`](kane/tickettray_test.md) cover the seeded
board, adding a ticket, form validation, working a ticket to Done,
priority filtering, and persistence across a reload:

```bash
npm install -g @testmuai/kane-cli
kane-cli login            # once, with a free TestMu AI account
npm start                 # in a second terminal
kane-cli testmd run kane/tickettray_test.md --headless --agent
```

Exit code 0 means every flow passed. Each run also produces a sealed
evidence pack (screenshots, logs, results) next to the test file.
[`kane/run-flows.sh`](kane/run-flows.sh) is the full runbook, including
the basic-auth option for headless machines.

## How it was built: the closed loop

An AI coding agent wrote the app, the unit tests, and the Kane flows.
The workflow, also written down in [`AGENTS.md`](AGENTS.md) so any
agent picking up this repo follows it:

1. Agent changes the code.
2. `npm test` checks the core logic.
3. Kane CLI runs the browser flows and returns a pass/fail verdict
   with evidence.
4. If a flow fails, the agent reads the failure, fixes the app (not
   the test's expectations), and re-runs until green.

Kane is the agent's second pair of eyes: the unit tests prove the
logic, Kane proves the product a user actually touches.

## Layout

| File | What it is |
| --- | --- |
| `index.html` | The page: summary, form, filters, board |
| `styles.css` | All styling, no framework |
| `logic.js` | Pure ticket logic — shared by the browser and the Node tests |
| `app.js` | DOM wiring: renders state, forwards actions to `logic.js` |
| `server.js` | Zero-dependency static server (port 4173) |
| `test/logic.test.js` | Unit tests (`node --test`) |
| `kane/tickettray_test.md` | Kane CLI verification flows (test.md format) |
| `kane/run-flows.sh` | Runbook for the Kane verification pass |

## License

MIT — see `LICENSE`.
