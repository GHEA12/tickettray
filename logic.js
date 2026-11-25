'use strict';

/*
 * TicketTray core logic.
 * Pure functions only: no DOM, no storage. The same file runs in the
 * browser (window.TicketTrayLogic) and in Node for the unit tests
 * (module.exports), so the logic Kane verifies in the browser is the
 * exact logic the tests cover.
 */

var PRIORITIES = ['Low', 'Normal', 'High', 'Urgent'];
var STATUSES = ['open', 'progress', 'done'];

// Allowed status transitions. Anything else is rejected.
var TRANSITIONS = {
  open: ['progress'],
  progress: ['done', 'open'],
  done: ['open']
};

function seedTickets() {
  return [
    { id: 'TT-1001', requester: 'Ana from Finance', subject: 'Cannot log in to the VPN', priority: 'High', minutes: 20, status: 'open' },
    { id: 'TT-1002', requester: 'Bimo from Ops', subject: 'Printer on floor 3 keeps jamming', priority: 'Normal', minutes: 30, status: 'progress' },
    { id: 'TT-1003', requester: 'Citra from Design', subject: 'Reset my design tool password', priority: 'Low', minutes: 10, status: 'done' }
  ];
}

function createState() {
  return { nextId: 1004, tickets: seedTickets() };
}

function validateInput(input) {
  if (!input || typeof input.subject !== 'string' || input.subject.trim() === '') {
    return 'Subject is required.';
  }
  if (typeof input.requester !== 'string' || input.requester.trim() === '') {
    return 'Requester is required.';
  }
  if (PRIORITIES.indexOf(input.priority) === -1) {
    return 'Priority must be one of: ' + PRIORITIES.join(', ') + '.';
  }
  var minutes = Number(input.minutes);
  if (!isFinite(minutes) || minutes <= 0 || Math.floor(minutes) !== minutes) {
    return 'Estimated minutes must be a positive whole number.';
  }
  return null;
}

function addTicket(state, input) {
  var error = validateInput(input);
  if (error) {
    return { ok: false, error: error };
  }
  var ticket = {
    id: 'TT-' + state.nextId,
    requester: input.requester.trim(),
    subject: input.subject.trim(),
    priority: input.priority,
    minutes: Number(input.minutes),
    status: 'open'
  };
  state.nextId += 1;
  state.tickets.push(ticket);
  return { ok: true, ticket: ticket };
}

function moveTicket(state, id, toStatus) {
  var ticket = null;
  for (var i = 0; i < state.tickets.length; i++) {
    if (state.tickets[i].id === id) { ticket = state.tickets[i]; break; }
  }
  if (!ticket) {
    return { ok: false, error: 'Ticket ' + id + ' not found.' };
  }
  var allowed = TRANSITIONS[ticket.status] || [];
  if (allowed.indexOf(toStatus) === -1) {
    return { ok: false, error: 'Cannot move a ticket from ' + ticket.status + ' to ' + toStatus + '.' };
  }
  ticket.status = toStatus;
  return { ok: true, ticket: ticket };
}

function deleteTicket(state, id) {
  var before = state.tickets.length;
  state.tickets = state.tickets.filter(function (t) { return t.id !== id; });
  return { ok: state.tickets.length < before };
}

function filterTickets(tickets, priority, query) {
  var q = (query || '').trim().toLowerCase();
  return tickets.filter(function (t) {
    if (priority && priority !== 'All' && t.priority !== priority) { return false; }
    if (q && (t.subject + ' ' + t.requester + ' ' + t.id).toLowerCase().indexOf(q) === -1) { return false; }
    return true;
  });
}

function summarize(tickets) {
  var s = { open: 0, progress: 0, done: 0, openLoadMinutes: 0, urgentOpen: 0 };
  tickets.forEach(function (t) {
    s[t.status] += 1;
    if (t.status !== 'done') {
      s.openLoadMinutes += t.minutes;
      if (t.priority === 'Urgent') { s.urgentOpen += 1; }
    }
  });
  return s;
}

var api = {
  PRIORITIES: PRIORITIES,
  STATUSES: STATUSES,
  TRANSITIONS: TRANSITIONS,
  createState: createState,
  validateInput: validateInput,
  addTicket: addTicket,
  moveTicket: moveTicket,
  deleteTicket: deleteTicket,
  filterTickets: filterTickets,
  summarize: summarize
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = api;
}
if (typeof window !== 'undefined') {
  window.TicketTrayLogic = api;
}
