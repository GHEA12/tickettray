---
mode: testing
url: http://localhost:4173/
max_steps: 30
tags: [tickettray, smoke, hackathon]
---
# TicketTray: full board verification

Kane verifies TicketTray end to end in a real browser: the seeded board,
adding a ticket, form validation, working a ticket across the board,
priority filtering, and persistence across a reload. Every step ends in
an assertion about the visible page state.

## Reset to the demo data

Click the "Reset demo data" button. Verify the summary shows Open 1, In Progress 1, Done 1, and Open load 50 min. Verify the Open column contains a ticket titled "Cannot log in to the VPN", the In Progress column contains "Printer on floor 3 keeps jamming", and the Done column contains "Reset my design tool password".

## Add a new ticket

In the New ticket form, fill Requester with "Dewi from HR", fill Subject with "Replace my broken keyboard", select priority "High", and set Estimated minutes to 15. Click "Add ticket". Verify a confirmation message "Added TT-1004" is visible, verify the Open column now contains a ticket titled "Replace my broken keyboard" with a High badge, and verify the summary shows Open 2 and Open load 65 min.

## Reject an empty subject

Clear the Subject field in the New ticket form and click "Add ticket". Verify an error message "Subject is required." is visible, and verify the summary still shows Open 2, so no ticket was added.

## Work the new ticket to Done

On the ticket card titled "Replace my broken keyboard", click "Start work". Verify the card is now in the In Progress column and the summary shows In Progress 2. Then on the same card click "Resolve". Verify the card is now in the Done column and the summary shows Done 2 and Open load 50 min.

## Filter by priority

Set the "Filter by priority" dropdown to "High". Verify the ticket "Cannot log in to the VPN" is visible on the board, and verify the ticket "Printer on floor 3 keeps jamming" is not visible anywhere on the board. Then set the filter back to "All" and verify "Printer on floor 3 keeps jamming" is visible again.

## Board survives a reload

Reload the page. Verify the ticket "Replace my broken keyboard" is still on the board in the Done column, and verify the summary shows Open 1, In Progress 1, Done 2.
