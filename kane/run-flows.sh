#!/usr/bin/env bash
# TicketTray — Kane CLI verification runbook.
#
# Run this AFTER the one missing ingredient exists: Karis's TestMu AI
# account credentials (see ../SUBMISSION.md, checklist item 1).
# Nothing in this file contains a real credential.
#
# What you need before running:
#   1. A TestMu AI account (https://www.testmuai.com/register/) — every new
#      account gets 10,000 free Kane CLI credits, valid one month.
#   2. The account username + access key, from
#      https://accounts.lambdatest.com/security/username-accesskey
#      (sign in, then Profile > Account Settings > Password & Security).
#
# Two ways to give the CLI the credentials — pick ONE:
#
#   A) One-time login (saves a profile under ~/.testmuai/kaneai/profiles/,
#      file mode 0600; later runs need no flags):
#        kane-cli login --username <USERNAME> --access-key <ACCESS_KEY>
#      (On a machine with a browser, `kane-cli login --oauth` also works.)
#
#   B) Per-run environment variables (what the commands below use):
#        export TESTMU_USERNAME='<username from the page above>'
#        export TESTMU_ACCESS_KEY='<access key from the page above>'
#
# Exit codes from Kane CLI: 0 = pass, 1 = a flow assertion failed,
# 2 = auth/setup error, 3 = timeout or cancelled.

set -euo pipefail
cd "$(dirname "$0")/.."   # project root

echo "== 1/3  Start the app (skip if already running on :4173) =="
# In a second terminal:  npm start
# Then check:            curl -s http://localhost:4173/ | head -1

echo "== 2/3  Confirm identity and credit balance =="
if [ -n "${TESTMU_USERNAME:-}" ]; then
  kane-cli whoami || true
  kane-cli balance --username "$TESTMU_USERNAME" --access-key "$TESTMU_ACCESS_KEY" || true
else
  kane-cli whoami
  kane-cli balance
fi

echo "== 3/3  Run the TicketTray verification flows =="
if [ -n "${TESTMU_USERNAME:-}" ]; then
  kane-cli testmd run kane/tickettray_test.md --headless --agent \
    --username "$TESTMU_USERNAME" --access-key "$TESTMU_ACCESS_KEY"
else
  kane-cli testmd run kane/tickettray_test.md --headless --agent
fi

echo
echo "On success, Kane prints a Test Manager share link and writes a sealed"
echo "evidence pack next to the test file (output-tickettray/). Paste the"
echo "share link into ../SUBMISSION.md and keep the evidence pack for the"
echo "submission form's verification-evidence field."
