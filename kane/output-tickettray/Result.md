---
test: ../tickettray_test.md
status: passed
started: 2026-11-25T23:18:48.098Z
duration_s: 292
session_id: 6959d500-040e-425d-8db0-3afb26fc4997
---

# TicketTray: full board verification — Result

## Reset to the demo data ✓ passed (35.1s)
md5: b648808f1ffa3d85dd4ce702ff6bbe3a
Click the "Reset demo data" button. Verify the summary shows Open 1, In Progress 1, Done 1, and Open load 50 min. Verify the Open column contains a ticket titled "Cannot log in to the VPN", the In Progress column contains "Printer on floor 3 keeps jamming", and the Done column contains "Reset my design tool password".

## Add a new ticket ✓ passed (51.3s)
md5: e7b44b704e31667167e533accd2fce9c
In the New ticket form, fill Requester with "Dewi from HR", fill Subject with "Replace my broken keyboard", select priority "High", and set Estimated minutes to 15. Click "Add ticket". Verify a confirmation message "Added TT-1004" is visible, verify the Open column now contains a ticket titled "Replace my broken keyboard" with a High badge, and verify the summary shows Open 2 and Open load 65 min.

## Reject an empty subject ✓ passed (38.9s)
md5: 95b1591796e00472a2a07e201c17d4aa
Clear the Subject field in the New ticket form and click "Add ticket". Verify an error message "Subject is required." is visible, and verify the summary still shows Open 2, so no ticket was added.

## Work the new ticket to Done ✓ passed (80.8s)
md5: e626109b8c8d56db03f1a6957e2af399
On the ticket card titled "Replace my broken keyboard", click "Start work". Verify the card is now in the In Progress column and the summary shows In Progress 2. Then on the same card click "Resolve". Verify the card is now in the Done column and the summary shows Done 2 and Open load 50 min.

## Filter by priority ✓ passed (43s)
md5: 87c5540a60ffa706886e4255499ff3d0
Set the "Filter by priority" dropdown to "High". Verify the ticket "Cannot log in to the VPN" is visible on the board, and verify the ticket "Printer on floor 3 keeps jamming" is not visible anywhere on the board. Then set the filter back to "All" and verify "Printer on floor 3 keeps jamming" is visible again.

## Board survives a reload ✓ passed (30.1s)
md5: da7d2f46e30ee02aef194bb94bfe8fd3
Reload the page. Verify the ticket "Replace my broken keyboard" is still on the board in the Done column, and verify the summary shows Open 1, In Progress 1, Done 2.
