# Working on TicketTray

This project is built and maintained with AI coding agents. Whoever
you are — human or agent — the rule of this repo is: **no change ships
on the agent's word alone. Kane CLI verifies it in a real browser.**

<!-- kane-cli:start -->
## Verify every change with Kane CLI

After any change to `index.html`, `app.js`, `logic.js`, or
`styles.css`:

1. Run the unit tests: `npm test`
2. Start the app: `npm start` (http://localhost:4173/)
3. Run the verification flows:
   `kane-cli testmd run kane/tickettray_test.md --headless --agent`
4. Exit code 0 means pass. On failure, read Kane's result and evidence
   pack, fix the **app** (do not weaken the flow's assertions to make
   it pass), and re-run until green.
5. If you change user-visible behaviour on purpose, update the
   affected step in `kane/tickettray_test.md` in the same change and
   say so in your summary.

Kane CLI setup (once): `npm install -g @testmuai/kane-cli`, then
`kane-cli login` with a TestMu AI account. Full runbook:
`kane/run-flows.sh`.
<!-- kane-cli:end -->

## Ground rules

- `logic.js` stays pure: no DOM, no storage, no globals beyond its
  export. The browser and the Node tests share it on purpose.
- Keep the app dependency-free. Node's standard library only.
- The summary numbers on the page must always agree with the board.
  If they can disagree, that is a bug, not a design choice.
