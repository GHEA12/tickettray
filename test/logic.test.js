'use strict';

var test = require('node:test');
var assert = require('node:assert/strict');
var L = require('../logic.js');

test('seed state has one ticket per column and a summary that matches', function () {
  var s = L.createState();
  assert.equal(s.tickets.length, 3);
  var sum = L.summarize(s.tickets);
  assert.equal(sum.open, 1);
  assert.equal(sum.progress, 1);
  assert.equal(sum.done, 1);
  // Open load = open 20 min + in-progress 30 min; done ticket excluded.
  assert.equal(sum.openLoadMinutes, 50);
  assert.equal(sum.urgentOpen, 0);
});

test('addTicket accepts a valid ticket and assigns the next id', function () {
  var s = L.createState();
  var r = L.addTicket(s, { requester: 'Dewi from HR', subject: 'Replace my broken keyboard', priority: 'High', minutes: 15 });
  assert.equal(r.ok, true);
  assert.equal(r.ticket.id, 'TT-1004');
  assert.equal(r.ticket.status, 'open');
  assert.equal(s.tickets.length, 4);
  var sum = L.summarize(s.tickets);
  assert.equal(sum.open, 2);
  assert.equal(sum.openLoadMinutes, 65);
});

test('addTicket rejects an empty subject and adds nothing', function () {
  var s = L.createState();
  var r = L.addTicket(s, { requester: 'Dewi from HR', subject: '   ', priority: 'High', minutes: 15 });
  assert.equal(r.ok, false);
  assert.equal(r.error, 'Subject is required.');
  assert.equal(s.tickets.length, 3);
});

test('addTicket rejects a missing requester', function () {
  var s = L.createState();
  var r = L.addTicket(s, { requester: '', subject: 'Something broke', priority: 'Low', minutes: 5 });
  assert.equal(r.ok, false);
  assert.equal(r.error, 'Requester is required.');
});

test('addTicket rejects non-positive or fractional minutes', function () {
  var s = L.createState();
  assert.equal(L.addTicket(s, { requester: 'A', subject: 'B', priority: 'Low', minutes: 0 }).ok, false);
  assert.equal(L.addTicket(s, { requester: 'A', subject: 'B', priority: 'Low', minutes: -5 }).ok, false);
  assert.equal(L.addTicket(s, { requester: 'A', subject: 'B', priority: 'Low', minutes: 2.5 }).ok, false);
  assert.equal(L.addTicket(s, { requester: 'A', subject: 'B', priority: 'Low', minutes: 'abc' }).ok, false);
  assert.equal(s.tickets.length, 3);
});

test('addTicket rejects an unknown priority', function () {
  var s = L.createState();
  var r = L.addTicket(s, { requester: 'A', subject: 'B', priority: 'Whenever', minutes: 5 });
  assert.equal(r.ok, false);
});

test('moveTicket follows the allowed transitions only', function () {
  var s = L.createState();
  // open -> done directly is not allowed
  var bad = L.moveTicket(s, 'TT-1001', 'done');
  assert.equal(bad.ok, false);
  // open -> progress -> done is the happy path
  assert.equal(L.moveTicket(s, 'TT-1001', 'progress').ok, true);
  assert.equal(L.moveTicket(s, 'TT-1001', 'done').ok, true);
  var sum = L.summarize(s.tickets);
  assert.equal(sum.done, 2);
  assert.equal(sum.open, 0);
  // done -> open (reopen) is allowed
  assert.equal(L.moveTicket(s, 'TT-1001', 'open').ok, true);
  // unknown ticket
  assert.equal(L.moveTicket(s, 'TT-9999', 'open').ok, false);
});

test('deleteTicket removes exactly the named ticket', function () {
  var s = L.createState();
  assert.equal(L.deleteTicket(s, 'TT-1002').ok, true);
  assert.equal(s.tickets.length, 2);
  assert.equal(L.deleteTicket(s, 'TT-1002').ok, false);
});

test('filterTickets filters by priority and by search text', function () {
  var s = L.createState();
  var high = L.filterTickets(s.tickets, 'High', '');
  assert.equal(high.length, 1);
  assert.equal(high[0].id, 'TT-1001');
  var vpn = L.filterTickets(s.tickets, 'All', 'vpn');
  assert.equal(vpn.length, 1);
  var none = L.filterTickets(s.tickets, 'Urgent', '');
  assert.equal(none.length, 0);
});

test('an urgent open ticket shows up in the summary', function () {
  var s = L.createState();
  L.addTicket(s, { requester: 'Eko from Sales', subject: 'Email is down for the whole team', priority: 'Urgent', minutes: 45 });
  var sum = L.summarize(s.tickets);
  assert.equal(sum.urgentOpen, 1);
  assert.equal(sum.openLoadMinutes, 95);
});
