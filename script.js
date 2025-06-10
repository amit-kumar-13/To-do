const btn = document.getElementById('add-btn');
const task_field = document.getElementById('task');
let tasks = [];

// Modal elements
const modal = document.getElementById('task-modal');
const confirmBtn = document.getElementById('confirm-btn');
const taskInput = document.getElementById('task-input');
const taskDate = document.getElementById('task-date');
const taskPriority = document.getElementById('task-priority');
const themeToggle = document.getElementById('theme-toggle');

// Theme Toggle Handler
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('light');
  localStorage.setItem('theme', document.body.classList.contains('light') ? 'light' : 'dark');
});

// Show Modal
btn.addEventListener('click', () => {
  modal.style.display = 'flex';
});

// Add Task
confirmBtn.addEventListener('click', () => {
  const task = taskInput.value.trim();
  const date = taskDate.value;
  const priority = taskPriority.value;

  if (task && date) {
    const taskObj = { task, date, priority };
    tasks.push(taskObj);
    sortAndSaveTasks();
    renderTasks();

    // Reset modal
    modal.style.display = 'none';
    taskInput.value = '';
    taskDate.value = '';
    taskPriority.value = 'medium';
  }
});

// Close Modal on Outside Click
window.addEventListener('click', (event) => {
  if (event.target === modal) {
    modal.style.display = 'none';
    taskInput.value = '';
    taskDate.value = '';
    taskPriority.value = 'medium';
  }
});

// Sort tasks by priority and date
function sortAndSaveTasks() {
  const priorityOrder = { high: 1, medium: 2, low: 3 };

  tasks.sort((a, b) => {
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return new Date(a.date) - new Date(b.date);
  });

  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Render task list
function renderTasks() {
  task_field.innerHTML = '';

  tasks.forEach(task => {
    if (!task || !task.task || !task.date || !task.priority) return;

    const li = document.createElement('li');
    li.setAttribute('data-priority', task.priority);
    li.innerHTML = `${task.task} <small>(${task.date})</small>`;

    const span = document.createElement('span');
    span.innerHTML = '\u00d7';
    li.appendChild(span);

    task_field.appendChild(li);
  });
}

// Load and display tasks from localStorage
function display_task() {
  const stored = localStorage.getItem('tasks');
  try {
    const parsed = JSON.parse(stored);
    if (Array.isArray(parsed)) {
      tasks = parsed.filter(t => t && t.task && t.date && t.priority);
      renderTasks();
    }
  } catch (e) {
    console.error("Failed to load tasks:", e);
    localStorage.removeItem('tasks'); // optional: clear corrupted data
  }
}

// Handle Task Check & Delete
task_field.addEventListener("click", function (e) {
  if (e.target.tagName === "LI") {
    e.target.classList.toggle("checked");
  } else if (e.target.tagName === "SPAN") {
    const li = e.target.parentElement;
    const content = li.textContent.replace('\u00d7', '').trim();
    const taskName = content.split(' (')[0];

    tasks = tasks.filter(t => t.task !== taskName);
    sortAndSaveTasks();
    renderTasks();
  }
});

// Initialize app
window.onload = function () {
  if (localStorage.getItem('theme') === 'light') {
    document.body.classList.add('light');
  }
  display_task();
};
