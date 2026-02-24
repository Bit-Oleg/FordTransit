// ===== STATE =====
let data = {
  odo: null,
  repairs: [],
  fuels: [],
  expenses: [],
  reminders: []
};

function load() {
  try {
    const saved = localStorage.getItem('ford_transit_journal_v2');
    if (saved) data = JSON.parse(saved);
  } catch(e) {}
}

function save() {
  localStorage.setItem('ford_transit_journal_v2', JSON.stringify(data));
}

// ===== NAV =====
function showSection(id) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('sec-' + id).classList.add('active');
  document.getElementById('nav-' + id).classList.add('active');
  renderAll();
}

// ===== MODAL =====
function openModal(id) {
  // Set default date
  const today = new Date().toISOString().split('T')[0];
  const dateFields = document.querySelectorAll('#' + id + ' input[type="date"]');
  dateFields.forEach(f => { if (!f.value) f.value = today; });
  document.getElementById(id).classList.add('open');
}

function closeModal(id) {
  document.getElementById(id).classList.remove('open');
}

document.querySelectorAll('.modal-overlay').forEach(m => {
  m.addEventListener('click', e => { if (e.target === m) m.classList.remove('open'); });
});

// ===== CLOCK =====
function updateClock() {
  const now = new Date();
  const date = now.toLocaleDateString('uk-UA', { day:'2-digit', month:'2-digit', year:'numeric' });
  const time = now.toLocaleTimeString('uk-UA', { hour:'2-digit', minute:'2-digit', second:'2-digit' });
  document.getElementById('clockEl').innerHTML = date + '<br>' + time;
}
setInterval(updateClock, 1000);
updateClock();

// ===== ODOMETER =====
document.getElementById('headerOdo').addEventListener('click', () => {
  document.getElementById('odoInput').value = data.odo || '';
  openModal('odoModal');
});

function saveOdo() {
  const val = parseInt(document.getElementById('odoInput').value);
  if (val > 0) {
    data.odo = val;
    save();
    updateOdoDisplay();
    closeModal('odoModal');
    renderAll();
  }
}

function updateOdoDisplay() {
  const v = data.odo ? data.odo.toLocaleString('uk-UA') + ' км' : 'Вкажіть пробіг';
  document.getElementById('headerOdo').textContent = v;
  document.getElementById('dashOdo').textContent = data.odo ? data.odo.toLocaleString('uk-UA') : '—';
}

// ===== REPAIRS =====
function saveRepair() {
  const r = {
    id: Date.now(),
    date: document.getElementById('rDate').value,
    odo: parseInt(document.getElementById('rOdo').value) || 0,
    type: document.getElementById('rType').value,
    desc: document.getElementById('rDesc').value,
    cost: parseFloat(document.getElementById('rCost').value) || 0,
    place: document.getElementById('rPlace').value,
    notes: document.getElementById('rNotes').value
  };
  if (!r.date || !r.type) { alert('Вкажіть дату та тип роботи'); return; }
  data.repairs.unshift(r);
  save();
  // reset
  ['rDate','rOdo','rDesc','rCost','rPlace','rNotes'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('rType').value = '';
  closeModal('repairModal');
  renderAll();
}

function deleteRepair(id) {
  if (!confirm('Видалити запис?')) return;
  data.repairs = data.repairs.filter(r => r.id !== id);
  save(); renderAll();
}

// ===== FUEL =====
function saveFuel() {
  const f = {
    id: Date.now(),
    date: document.getElementById('fDate').value,
    odo: parseInt(document.getElementById('fOdo').value) || 0,
    liters: parseFloat(document.getElementById('fLiters').value) || 0,
    price: parseFloat(document.getElementById('fPrice').value) || 0,
    type: document.getElementById('fType').value,
    station: document.getElementById('fStation').value,
    full: document.getElementById('fFull').value === '1',
    notes: document.getElementById('fNotes').value,
    total: (parseFloat(document.getElementById('fLiters').value) || 0) * (parseFloat(document.getElementById('fPrice').value) || 0)
  };
  if (!f.date || !f.liters) { alert('Вкажіть дату та кількість літрів'); return; }
  data.fuels.unshift(f);
  save();
  ['fDate','fOdo','fLiters','fPrice','fStation','fNotes'].forEach(id => document.getElementById(id).value = '');
  closeModal('fuelModal');
  renderAll();
}

function deleteFuel(id) {
  if (!confirm('Видалити запис?')) return;
  data.fuels = data.fuels.filter(f => f.id !== id);
  save(); renderAll();
}

// ===== EXPENSES =====
function saveExpense() {
  const e = {
    id: Date.now(),
    date: document.getElementById('eDate').value,
    cat: document.getElementById('eCat').value,
    amount: parseFloat(document.getElementById('eAmount').value) || 0,
    desc: document.getElementById('eDesc').value
  };
  if (!e.date || !e.amount) { alert('Вкажіть дату та суму'); return; }
  data.expenses.unshift(e);
  save();
  ['eDate','eAmount','eDesc'].forEach(id => document.getElementById(id).value = '');
  closeModal('expenseModal');
  renderAll();
}

function deleteExpense(id) {
  if (!confirm('Видалити запис?')) return;
  data.expenses = data.expenses.filter(e => e.id !== id);
  save(); renderAll();
}

// ===== REMINDERS =====
function toggleRdFields() {
  const t = document.getElementById('rdType').value;
  document.getElementById('rdKmField').style.display = (t === 'date') ? 'none' : 'block';
  document.getElementById('rdDateField').style.display = (t === 'km') ? 'none' : 'block';
}

function saveReminder() {
  const r = {
    id: Date.now(),
    name: document.getElementById('rdName').value,
    type: document.getElementById('rdType').value,
    km: parseInt(document.getElementById('rdKm').value) || 0,
    date: document.getElementById('rdDate').value,
    icon: document.getElementById('rdIcon').value,
    notes: document.getElementById('rdNotes').value,
    done: false
  };
  if (!r.name) { alert('Вкажіть назву'); return; }
  data.reminders.push(r);
  save();
  ['rdName','rdKm','rdDate','rdNotes'].forEach(id => document.getElementById(id).value = '');
  closeModal('remindModal');
  renderAll();
}

function deleteReminder(id) {
  if (!confirm('Видалити нагадування?')) return;
  data.reminders = data.reminders.filter(r => r.id !== id);
  save(); renderAll();
}

function doneReminder(id) {
  const r = data.reminders.find(r => r.id === id);
  if (r) { r.done = !r.done; save(); renderAll(); }
}

// ===== HELPERS =====
function fmtDate(d) {
  if (!d) return '—';
  const [y,m,day] = d.split('-');
  return `${day}.${m}.${y}`;
}

function fmtNum(n) {
  return n ? n.toLocaleString('uk-UA') : '0';
}

function catLabel(c) {
  const map = { repair:'Ремонт/ТО', fuel:'Паливо', insurance:'Страхування', tax:'Документи', parking:'Штрафи', other:'Інше' };
  return map[c] || c;
}

function catTag(c) {
  const map = { repair:'tag-amber', fuel:'tag-blue', insurance:'tag-green', tax:'tag-green', parking:'tag-red', other:'tag-blue' };
  return map[c] || 'tag-blue';
}

// ===== RENDER =====
function renderAll() {
  updateOdoDisplay();
  renderDash();
  renderRepairs();
  renderFuels();
  renderFinance();
  renderReminders();
  updateRemindBadge();
}

function renderDash() {
  document.getElementById('dashRepairs').textContent = data.repairs.length;
  document.getElementById('dashFuels').textContent = data.fuels.length;
  const totalCosts = [...data.repairs, ...data.expenses].reduce((a,r) => a + (r.cost || r.amount || 0), 0)
    + data.fuels.reduce((a,f) => a + f.total, 0);
  document.getElementById('dashCosts').textContent = fmtNum(Math.round(totalCosts));

  // Last repairs
  const lr = document.getElementById('dashLastRepairs');
  if (!data.repairs.length) {
    lr.innerHTML = '<div class="empty"><div class="empty-icon">🔧</div><div class="empty-text">Записів немає</div></div>';
  } else {
    lr.innerHTML = data.repairs.slice(0,3).map(r => `
      <div class="cost-row">
        <div>
          <div class="cost-name">${r.type}</div>
          <div style="font-size:12px;color:var(--text-secondary)">${fmtDate(r.date)} · ${fmtNum(r.odo)} км</div>
        </div>
        <div class="cost-amount">${fmtNum(r.cost)} грн</div>
      </div>`).join('');
  }

  // Last fuels
  const lf = document.getElementById('dashLastFuels');
  if (!data.fuels.length) {
    lf.innerHTML = '<div class="empty"><div class="empty-icon">⛽</div><div class="empty-text">Записів немає</div></div>';
  } else {
    lf.innerHTML = data.fuels.slice(0,3).map(f => `
      <div class="cost-row">
        <div>
          <div class="cost-name">${f.type} · ${f.liters} л</div>
          <div style="font-size:12px;color:var(--text-secondary)">${fmtDate(f.date)} · ${f.station || '—'}</div>
        </div>
        <div class="cost-amount">${fmtNum(Math.round(f.total))} грн</div>
      </div>`).join('');
  }

  // Reminders dashboard
  const dr = document.getElementById('dashReminders');
  const urgent = data.reminders.filter(r => !r.done && getReminderStatus(r) !== 'ok').slice(0,3);
  if (!urgent.length) {
    dr.innerHTML = '<div class="empty"><div class="empty-icon">✅</div><div class="empty-text">Все в порядку</div></div>';
  } else {
    dr.innerHTML = urgent.map(r => {
      const st = getReminderStatus(r);
      const tagClass = st === 'overdue' ? 'tag-red' : 'tag-amber';
      const stLabel = st === 'overdue' ? 'Прострочено' : 'Незабаром';
      return `<div class="cost-row">
        <div><div class="cost-name">${r.icon} ${r.name}</div></div>
        <span class="tag ${tagClass}">${stLabel}</span>
      </div>`;
    }).join('');
  }
}

function renderRepairs() {
  const wrap = document.getElementById('repairsTableWrap');
  if (!data.repairs.length) {
    wrap.innerHTML = '<div class="empty"><div class="empty-icon">🔧</div><div class="empty-text">Поки що записів немає — додайте перший!</div></div>';
    return;
  }
  wrap.innerHTML = `<table class="data-table">
    <thead><tr>
      <th>Дата</th><th>Пробіг</th><th>Тип роботи</th><th>Опис</th><th>Місце</th><th>Вартість</th><th></th>
    </tr></thead>
    <tbody>
    ${data.repairs.map(r => `<tr>
      <td>${fmtDate(r.date)}</td>
      <td><span style="font-family:'Share Tech Mono',monospace;color:var(--ford-cyan)">${fmtNum(r.odo)}</span> км</td>
      <td><span class="tag tag-blue">${r.type}</span></td>
      <td style="max-width:220px;font-size:13px;color:var(--text-secondary)">${r.desc || '—'}</td>
      <td style="font-size:13px">${r.place || '—'}</td>
      <td style="font-family:'Share Tech Mono',monospace;color:var(--amber)">${fmtNum(r.cost)} грн</td>
      <td><button class="btn btn-danger btn-sm" onclick="deleteRepair(${r.id})">✕</button></td>
    </tr>`).join('')}
    </tbody>
  </table>`;
}

function renderFuels() {
  const totalL = data.fuels.reduce((a,f) => a + f.liters, 0);
  const totalCost = data.fuels.reduce((a,f) => a + f.total, 0);
  document.getElementById('statTotalFuel').textContent = totalL.toFixed(1);
  document.getElementById('statFuelCost').textContent = fmtNum(Math.round(totalCost));

  // Avg consumption
  const fullFuels = data.fuels.filter(f => f.full).sort((a,b) => a.odo - b.odo);
  let avgC = '—';
  if (fullFuels.length >= 2) {
    let totalLiters = 0, totalKm = 0;
    for (let i = 1; i < fullFuels.length; i++) {
      totalLiters += fullFuels[i].liters;
      totalKm += fullFuels[i].odo - fullFuels[i-1].odo;
    }
    if (totalKm > 0) avgC = (totalLiters / totalKm * 100).toFixed(1);
  }
  document.getElementById('statAvgConsump').textContent = avgC;

  const wrap = document.getElementById('fuelTableWrap');
  if (!data.fuels.length) {
    wrap.innerHTML = '<div class="empty"><div class="empty-icon">⛽</div><div class="empty-text">Поки що заправок немає</div></div>';
    return;
  }
  wrap.innerHTML = `<table class="data-table">
    <thead><tr>
      <th>Дата</th><th>Пробіг</th><th>Тип</th><th>Літрів</th><th>Ціна/л</th><th>Сума</th><th>Станція</th><th>Повний?</th><th></th>
    </tr></thead>
    <tbody>
    ${data.fuels.map(f => `<tr>
      <td>${fmtDate(f.date)}</td>
      <td style="font-family:'Share Tech Mono',monospace;color:var(--ford-cyan)">${fmtNum(f.odo)}</td>
      <td><span class="tag tag-blue">${f.type}</span></td>
      <td style="font-family:'Share Tech Mono',monospace">${f.liters}</td>
      <td>${f.price.toFixed(2)} грн</td>
      <td style="font-family:'Share Tech Mono',monospace;color:var(--amber)">${fmtNum(Math.round(f.total))}</td>
      <td style="font-size:13px">${f.station || '—'}</td>
      <td>${f.full ? '<span class="tag tag-green">Повний</span>' : '<span class="tag">Частково</span>'}</td>
      <td><button class="btn btn-danger btn-sm" onclick="deleteFuel(${f.id})">✕</button></td>
    </tr>`).join('')}
    </tbody>
  </table>`;
}

function renderFinance() {
  const repairTotal = data.repairs.reduce((a,r) => a + r.cost, 0)
    + data.expenses.filter(e => e.cat === 'repair').reduce((a,e) => a + e.amount, 0);
  const fuelTotal = data.fuels.reduce((a,f) => a + f.total, 0)
    + data.expenses.filter(e => e.cat === 'fuel').reduce((a,e) => a + e.amount, 0);
  const otherTotal = data.expenses.filter(e => !['repair','fuel'].includes(e.cat)).reduce((a,e) => a + e.amount, 0);

  document.getElementById('costRepair').textContent = fmtNum(Math.round(repairTotal));
  document.getElementById('costFuel').textContent = fmtNum(Math.round(fuelTotal));
  document.getElementById('costOther').textContent = fmtNum(Math.round(otherTotal));

  const wrap = document.getElementById('expenseTableWrap');
  const allExpenses = [
    ...data.expenses.map(e => ({ ...e, src: 'manual' })),
    ...data.repairs.filter(r => r.cost > 0).map(r => ({
      id: r.id + '_r', date: r.date, cat: 'repair', amount: r.cost, desc: r.type, src: 'repair'
    })),
    ...data.fuels.filter(f => f.total > 0).map(f => ({
      id: f.id + '_f', date: f.date, cat: 'fuel', amount: f.total, desc: `${f.type} ${f.liters}л @ ${f.price.toFixed(2)} грн/л`, src: 'fuel'
    }))
  ].sort((a,b) => new Date(b.date) - new Date(a.date));

  if (!allExpenses.length) {
    wrap.innerHTML = '<div class="empty"><div class="empty-icon">💳</div><div class="empty-text">Поки що записів немає</div></div>';
    return;
  }

  wrap.innerHTML = `<table class="data-table">
    <thead><tr>
      <th>Дата</th><th>Категорія</th><th>Опис</th><th>Сума (грн)</th><th></th>
    </tr></thead>
    <tbody>
    ${allExpenses.map(e => `<tr>
      <td>${fmtDate(e.date)}</td>
      <td><span class="tag ${catTag(e.cat)}">${catLabel(e.cat)}</span></td>
      <td style="font-size:13px;color:var(--text-secondary)">${e.desc || '—'}</td>
      <td style="font-family:'Share Tech Mono',monospace;font-size:16px;color:var(--amber)">${fmtNum(Math.round(e.amount))}</td>
      <td>${e.src === 'manual' ? `<button class="btn btn-danger btn-sm" onclick="deleteExpense(${e.id})">✕</button>` : '<span style="font-size:11px;color:var(--text-dim)">авто</span>'}</td>
    </tr>`).join('')}
    </tbody>
  </table>`;
}

function getReminderStatus(r) {
  const odo = data.odo || 0;
  const now = new Date();
  let overdue = false, soon = false;

  if ((r.type === 'km' || r.type === 'both') && r.km > 0) {
    const diff = r.km - odo;
    if (diff <= 0) overdue = true;
    else if (diff <= 2000) soon = true;
  }

  if ((r.type === 'date' || r.type === 'both') && r.date) {
    const d = new Date(r.date);
    const diffDays = (d - now) / 86400000;
    if (diffDays < 0) overdue = true;
    else if (diffDays <= 30) soon = true;
  }

  if (overdue) return 'overdue';
  if (soon) return 'soon';
  return 'ok';
}

function updateRemindBadge() {
  const urgent = data.reminders.filter(r => !r.done && getReminderStatus(r) !== 'ok').length;
  const badge = document.getElementById('remindBadge');
  badge.textContent = urgent;
  badge.style.display = urgent > 0 ? 'inline' : 'none';
}

function renderReminders() {
  const el = document.getElementById('remindersListEl');
  if (!data.reminders.length) {
    el.innerHTML = '<div class="empty"><div class="empty-icon">🔔</div><div class="empty-text">Нагадувань немає — додайте перше!</div></div>';
    return;
  }

  const odo = data.odo || 0;

  el.innerHTML = data.reminders.map(r => {
    const st = r.done ? 'done' : getReminderStatus(r);
    const statusColor = { done:'var(--green)', overdue:'var(--red)', soon:'var(--amber)', ok:'var(--text-dim)' }[st];
    const statusLabel = { done:'Виконано ✓', overdue:'Прострочено!', soon:'Незабаром', ok:'В нормі' }[st];

    let progress = 0, kmLeft = '', dateInfo = '';

    if ((r.type === 'km' || r.type === 'both') && r.km > 0) {
      const lastKm = r.km - 10000; // assume 10k interval
      progress = Math.min(100, Math.max(0, ((odo - lastKm) / (r.km - lastKm)) * 100));
      const diff = r.km - odo;
      kmLeft = diff > 0 ? `Залишилось ${fmtNum(diff)} км` : `Прострочено на ${fmtNum(Math.abs(diff))} км`;
    }

    if ((r.type === 'date' || r.type === 'both') && r.date) {
      dateInfo = `До: ${fmtDate(r.date)}`;
    }

    const progressColor = st === 'overdue' ? 'var(--red)' : st === 'soon' ? 'var(--amber)' : 'var(--ford-cyan)';

    return `<div class="reminder-item" style="opacity:${r.done ? 0.5 : 1}">
      <div class="reminder-icon">${r.icon}</div>
      <div class="reminder-info">
        <div class="reminder-name" style="text-decoration:${r.done ? 'line-through' : 'none'}">${r.name}</div>
        <div class="reminder-meta">
          ${kmLeft ? `<span>${kmLeft}</span>` : ''}
          ${dateInfo ? `<span style="margin-left:8px">${dateInfo}</span>` : ''}
          ${r.notes ? `<span style="margin-left:8px;color:var(--text-dim)">${r.notes}</span>` : ''}
        </div>
        ${r.type !== 'date' ? `<div class="progress-bar-wrap"><div class="progress-bar-fill" style="width:${progress}%;background:${progressColor}"></div></div>` : ''}
      </div>
      <div class="reminder-status">
        <div style="color:${statusColor};font-size:12px;font-weight:700;letter-spacing:1px;margin-bottom:8px">${statusLabel}</div>
        <div style="display:flex;gap:6px;justify-content:flex-end">
          <button class="btn btn-sm" style="background:rgba(0,230,118,0.1);color:var(--green);border:1px solid rgba(0,230,118,0.3)" onclick="doneReminder(${r.id})">${r.done ? '↩' : '✓'}</button>
          <button class="btn btn-danger btn-sm" onclick="deleteReminder(${r.id})">✕</button>
        </div>
      </div>
    </div>`;
  }).join('');
}

// ===== INIT =====
load();
renderAll();