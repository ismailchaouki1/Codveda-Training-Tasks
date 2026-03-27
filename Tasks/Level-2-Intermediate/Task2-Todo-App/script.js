const KEY = 'taskr_v2_chaouki';

let tasks = [];
let filter = 'all';

function load() {
  try {
    tasks = JSON.parse(localStorage.getItem(KEY)) || seed();
  } catch {
    tasks = seed();
  }
}

function save() {
  localStorage.setItem(KEY, JSON.stringify(tasks));
}

function seed() {
  return [
    {
      id: uid(),
      text: 'Complete Level 2 Task 2 — To-Do App',
      prio: 'high',
      done: false,
      at: Date.now() - 4000,
    },
    {
      id: uid(),
      text: 'Push all tasks to GitHub',
      prio: 'medium',
      done: true,
      at: Date.now() - 3000,
    },
    {
      id: uid(),
      text: 'Review React hooks documentation',
      prio: 'low',
      done: false,
      at: Date.now() - 2000,
    },
  ];
}

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function filtered() {
  if (filter === 'active') return tasks.filter((t) => !t.done);
  if (filter === 'done') return tasks.filter((t) => t.done);
  return tasks;
}

function add(text, prio) {
  text = text.trim();
  if (!text) {
    toast('⚠ Write something first');
    return false;
  }
  tasks.unshift({ id: uid(), text, prio, done: false, at: Date.now() });
  save();
  render();
  toast('✓ Added');
  return true;
}

function toggle(id) {
  const t = tasks.find((t) => t.id === id);
  if (t) {
    t.done = !t.done;
    save();
    render();
  }
}

function del(id) {
  const li = document.querySelector(`[data-id="${id}"]`);
  if (!li) return;
  li.classList.add('removing');
  li.addEventListener(
    'animationend',
    () => {
      tasks = tasks.filter((t) => t.id !== id);
      save();
      render();
    },
    { once: true },
  );
  toast('🗑 Removed');
}

function startEdit(id) {
  const t = tasks.find((t) => t.id === id);
  const li = document.querySelector(`[data-id="${id}"]`);
  if (!t || !li) return;

  const textEl = li.querySelector('.task-text');
  const editBtn = li.querySelector('.icon-btn.edit');

  const inp = document.createElement('input');
  inp.className = 'task-edit-input';
  inp.value = t.text;
  inp.maxLength = 100;
  textEl.replaceWith(inp);
  inp.focus();
  inp.select();
  editBtn.textContent = '✓';
  editBtn.classList.add('edit-save');

  const commit = () => {
    const v = inp.value.trim();
    if (!v) {
      toast('⚠ Cannot be empty');
      inp.focus();
      return;
    }
    t.text = v;
    save();
    render();
    toast('✏ Updated');
  };

  editBtn.onclick = commit;
  inp.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') commit();
    if (e.key === 'Escape') render();
  });
}

function clearDone() {
  const n = tasks.filter((t) => t.done).length;
  if (!n) {
    toast('Nothing to clear');
    return;
  }
  tasks = tasks.filter((t) => !t.done);
  save();
  render();
  toast(`🗑 Cleared ${n} task${n > 1 ? 's' : ''}`);
}

function render() {
  const list = document.getElementById('taskList');
  const empty = document.getElementById('emptyState');
  const items = filtered();

  list.innerHTML = '';
  empty.classList.toggle('show', !items.length);

  items.forEach((t) => {
    const li = document.createElement('li');
    li.className = `task-item prio-${t.prio}${t.done ? ' done' : ''}`;
    li.dataset.id = t.id;

    li.innerHTML = `
      <button class="check-btn" data-action="toggle" title="Toggle">${t.done ? '✓' : ''}</button>
      <div class="task-text-wrap">
        <div class="task-text">${esc(t.text)}</div>
      </div>
      <div class="prio-dot ${t.prio}"></div>
      <div class="task-actions">
        <button class="icon-btn edit" data-action="edit" title="Edit">✏</button>
        <button class="icon-btn del"  data-action="del"  title="Delete">✕</button>
      </div>
    `;

    li.addEventListener('click', (e) => {
      const a = e.target.closest('[data-action]')?.dataset.action;
      if (a === 'toggle') toggle(t.id);
      if (a === 'edit') startEdit(t.id);
      if (a === 'del') del(t.id);
    });

    list.appendChild(li);
  });

  updateStats();
}

function updateStats() {
  const total = tasks.length;
  const done = tasks.filter((t) => t.done).length;
  const pct = total ? Math.round((done / total) * 100) : 0;

  const countEl = document.getElementById('bigCount');
  countEl.textContent = filtered().length;
  countEl.classList.remove('count-pop');
  void countEl.offsetWidth;
  countEl.classList.add('count-pop');

  document.getElementById('doneBadge').textContent = `${done} done`;
  document.getElementById('progressFill').style.width = pct + '%';
  document.getElementById('progressPct').textContent = pct + '%';

  const left = tasks.filter((t) => !t.done).length;
  document.getElementById('footerNote').textContent = left
    ? `${left} task${left > 1 ? 's' : ''} remaining`
    : total
      ? '🎉 All done!'
      : 'No tasks yet';
}

function esc(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function toast(msg) {
  const wrap = document.getElementById('toasts');
  const el = document.createElement('div');
  el.className = 'toast success';
  el.textContent = msg;
  wrap.appendChild(el);
  setTimeout(() => {
    el.classList.add('out');
    el.addEventListener('animationend', () => el.remove(), { once: true });
  }, 2500);
}

document.getElementById('addBtn').addEventListener('click', () => {
  const inp = document.getElementById('taskInput');
  const prio = document.getElementById('prioSelect').value;
  if (add(inp.value, prio)) inp.value = '';
});

document.getElementById('taskInput').addEventListener('keydown', (e) => {
  if (e.key !== 'Enter') return;
  const prio = document.getElementById('prioSelect').value;
  if (add(e.target.value, prio)) e.target.value = '';
});

document.querySelectorAll('.filter').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    filter = btn.dataset.filter;
    render();
  });
});

document.getElementById('clearBtn').addEventListener('click', clearDone);

document.getElementById('dateLabel').textContent = new Date().toLocaleDateString('en-US', {
  weekday: 'short',
  month: 'short',
  day: 'numeric',
});

load();
render();
