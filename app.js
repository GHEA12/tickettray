'use strict';

/* TicketTray browser wiring. All rules live in logic.js; this file only
 * renders state and forwards user actions to it. */

(function () {
  var L = window.TicketTrayLogic;
  var STORAGE_KEY = 'tickettray-state-v1';

  function loadState() {
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.tickets) && typeof parsed.nextId === 'number') {
          return parsed;
        }
      }
    } catch (e) { /* fall through to seed */ }
    return L.createState();
  }

  var state = loadState();

  function saveState() {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) { /* storage unavailable; board still works in memory */ }
  }

  var els = {
    form: document.getElementById('ticket-form'),
    requester: document.getElementById('requester'),
    subject: document.getElementById('subject'),
    priority: document.getElementById('priority'),
    minutes: document.getElementById('minutes'),
    error: document.getElementById('form-error'),
    ok: document.getElementById('form-ok'),
    filterPriority: document.getElementById('filter-priority'),
    search: document.getElementById('search'),
    reset: document.getElementById('reset-button'),
    statOpen: document.getElementById('stat-open'),
    statProgress: document.getElementById('stat-progress'),
    statDone: document.getElementById('stat-done'),
    statLoad: document.getElementById('stat-load'),
    statUrgent: document.getElementById('stat-urgent'),
    cols: {
      open: document.getElementById('col-open'),
      progress: document.getElementById('col-progress'),
      done: document.getElementById('col-done')
    },
    counts: {
      open: document.getElementById('count-open'),
      progress: document.getElementById('count-progress'),
      done: document.getElementById('count-done')
    }
  };

  var NEXT_ACTION = {
    open: [{ to: 'progress', label: 'Start work' }],
    progress: [{ to: 'done', label: 'Resolve' }, { to: 'open', label: 'Send back' }],
    done: [{ to: 'open', label: 'Reopen' }]
  };

  function cardFor(ticket) {
    var card = document.createElement('article');
    card.className = 'card';
    card.setAttribute('data-ticket-id', ticket.id);

    var head = document.createElement('div');
    head.className = 'card-head';
    var id = document.createElement('span');
    id.className = 'ticket-id';
    id.textContent = ticket.id;
    var badge = document.createElement('span');
    badge.className = 'badge badge-' + ticket.priority.toLowerCase();
    badge.textContent = ticket.priority;
    head.appendChild(id);
    head.appendChild(badge);

    var subject = document.createElement('p');
    subject.className = 'card-subject';
    subject.textContent = ticket.subject;

    var meta = document.createElement('p');
    meta.className = 'card-meta';
    meta.textContent = ticket.requester + ' · ' + ticket.minutes + ' min';

    var actions = document.createElement('div');
    actions.className = 'card-actions';
    NEXT_ACTION[ticket.status].forEach(function (a) {
      var b = document.createElement('button');
      b.type = 'button';
      b.textContent = a.label;
      b.setAttribute('data-move-to', a.to);
      b.setAttribute('data-ticket-id', ticket.id);
      actions.appendChild(b);
    });
    var del = document.createElement('button');
    del.type = 'button';
    del.className = 'danger';
    del.textContent = 'Delete';
    del.setAttribute('data-delete-id', ticket.id);
    actions.appendChild(del);

    card.appendChild(head);
    card.appendChild(subject);
    card.appendChild(meta);
    card.appendChild(actions);
    return card;
  }

  function render() {
    var visible = L.filterTickets(state.tickets, els.filterPriority.value, els.search.value);
    L.STATUSES.forEach(function (status) {
      var col = els.cols[status];
      col.innerHTML = '';
      visible.filter(function (t) { return t.status === status; })
        .forEach(function (t) { col.appendChild(cardFor(t)); });
    });
    var counts = { open: 0, progress: 0, done: 0 };
    state.tickets.forEach(function (t) { counts[t.status] += 1; });
    L.STATUSES.forEach(function (status) {
      els.counts[status].textContent = String(counts[status]);
    });
    var s = L.summarize(state.tickets);
    els.statOpen.textContent = String(s.open);
    els.statProgress.textContent = String(s.progress);
    els.statDone.textContent = String(s.done);
    els.statLoad.textContent = String(s.openLoadMinutes);
    els.statUrgent.textContent = String(s.urgentOpen);
  }

  els.form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    var result = L.addTicket(state, {
      requester: els.requester.value,
      subject: els.subject.value,
      priority: els.priority.value,
      minutes: els.minutes.value
    });
    if (!result.ok) {
      els.error.textContent = result.error;
      els.error.hidden = false;
      els.ok.hidden = true;
      return;
    }
    els.error.hidden = true;
    els.ok.textContent = 'Added ' + result.ticket.id + ': ' + result.ticket.subject;
    els.ok.hidden = false;
    els.subject.value = '';
    saveState();
    render();
  });

  document.getElementById('board').addEventListener('click', function (ev) {
    var target = ev.target;
    if (!(target instanceof window.Element)) { return; }
    var moveTo = target.getAttribute('data-move-to');
    var ticketId = target.getAttribute('data-ticket-id');
    var deleteId = target.getAttribute('data-delete-id');
    if (moveTo && ticketId) {
      var r = L.moveTicket(state, ticketId, moveTo);
      if (r.ok) { saveState(); render(); }
    } else if (deleteId) {
      var d = L.deleteTicket(state, deleteId);
      if (d.ok) { saveState(); render(); }
    }
  });

  els.filterPriority.addEventListener('change', render);
  els.search.addEventListener('input', render);
  els.reset.addEventListener('click', function () {
    state = L.createState();
    saveState();
    els.error.hidden = true;
    els.ok.hidden = true;
    render();
  });

  saveState();
  render();
})();
