
let entries = JSON.parse(localStorage.getItem('salesJournalEntries')) || [];

const entriesDiv = document.getElementById('entries');
const modal = document.getElementById('modal');
const saveEntryBtn = document.getElementById('saveEntry');
const closeModalBtn = document.getElementById('closeModal');
const addEntryBtn = document.getElementById('addEntry');
const addPersonBtn = document.getElementById('addPerson');
const addTodoBtn = document.getElementById('addTodo');
const exportCsvBtn = document.getElementById('exportCsv');
const exportWhatsAppBtn = document.getElementById('exportWhatsApp');

function renderEntries() {
  entriesDiv.innerHTML = '';
  entries.forEach((entry, index) => {
    const div = document.createElement('div');
    div.className = 'bg-white p-4 rounded shadow';
    div.innerHTML = `
      <p><strong>Description:</strong> ${entry.description}</p>
      <p><strong>Date/Time:</strong> ${entry.dateTime}</p>
      <p><strong>Venue:</strong> ${entry.venue}</p>
      <p><strong>People:</strong> ${entry.people.map(p => p.name).join(', ')}</p>
      <p><strong>Closeness:</strong> ${entry.closeness}</p>
      <p><strong>Takeaways:</strong> ${entry.takeaways}</p>
      <p><strong>To-Dos:</strong> ${entry.todos.map(t => t.action).join(', ')}</p>
      <p><strong>Objective Met:</strong> ${entry.objective}</p>
    `;
    entriesDiv.appendChild(div);
  });
}

function openModal() {
  modal.classList.remove('hidden');
  resetForm();
}

function closeModal() {
  modal.classList.add('hidden');
}

function resetForm() {
  document.getElementById('description').value = '';
  document.getElementById('dateTime').value = '';
  document.getElementById('venue').value = '';
  document.getElementById('peopleList').innerHTML = '';
  document.getElementById('takeaways').value = '';
  document.getElementById('todoList').innerHTML = '';
  document.querySelector('input[name="objective"]:checked')?.checked = false;
}

function saveEntry() {
  const description = document.getElementById('description').value;
  const dateTime = document.getElementById('dateTime').value;
  const venue = document.getElementById('venue').value;
  const closeness = document.getElementById('closeness').value;
  const takeaways = document.getElementById('takeaways').value;
  const objective = document.querySelector('input[name="objective"]:checked')?.value || '';

  const peopleNodes = document.querySelectorAll('.person');
  const people = Array.from(peopleNodes).map(p => ({
    name: p.querySelector('.person-name').value,
    organisation: p.querySelector('.person-organisation').value,
    contact: p.querySelector('.person-contact').value
  }));

  const todoNodes = document.querySelectorAll('.todo');
  const todos = Array.from(todoNodes).map(t => ({
    action: t.querySelector('.todo-action').value,
    date: t.querySelector('.todo-date').value
  }));

  entries.push({ description, dateTime, venue, people, closeness, takeaways, todos, objective });
  localStorage.setItem('salesJournalEntries', JSON.stringify(entries));
  renderEntries();
  closeModal();
}

function addPersonField() {
  const div = document.createElement('div');
  div.className = 'person space-y-1';
  div.innerHTML = `
    <input type="text" class="person-name w-full border p-2 rounded" placeholder="Name">
    <input type="text" class="person-organisation w-full border p-2 rounded" placeholder="Organisation">
    <input type="text" class="person-contact w-full border p-2 rounded" placeholder="Contact">
  `;
  document.getElementById('peopleList').appendChild(div);
}

function addTodoField() {
  const div = document.createElement('div');
  div.className = 'todo space-y-1';
  div.innerHTML = `
    <input type="text" class="todo-action w-full border p-2 rounded" placeholder="Action Item">
    <input type="date" class="todo-date w-full border p-2 rounded">
  `;
  document.getElementById('todoList').appendChild(div);
}

function exportCsv() {
  let csv = "Description,DateTime,Venue,People,Closeness,Takeaways,Todos,Objective\n";
  entries.forEach(entry => {
    csv += `"${entry.description}","${entry.dateTime}","${entry.venue}","${entry.people.map(p => p.name).join(';')}","${entry.closeness}","${entry.takeaways}","${entry.todos.map(t => t.action).join(';')}","${entry.objective}"\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'sales_journal.csv';
  link.click();
}

function exportWhatsApp() {
  let text = 'Sales Journal Entries:\n';
  entries.forEach(entry => {
    text += `\n- ${entry.description} at ${entry.venue} (${entry.dateTime})`;
  });

  const url = 'https://wa.me/?text=' + encodeURIComponent(text);
  window.open(url, '_blank');
}

addEntryBtn.addEventListener('click', openModal);
closeModalBtn.addEventListener('click', closeModal);
saveEntryBtn.addEventListener('click', saveEntry);
addPersonBtn.addEventListener('click', addPersonField);
addTodoBtn.addEventListener('click', addTodoField);
exportCsvBtn.addEventListener('click', exportCsv);
exportWhatsAppBtn.addEventListener('click', exportWhatsApp);

renderEntries();
