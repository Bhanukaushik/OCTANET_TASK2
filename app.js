// app.js

function updateLocalStorage(tasks) {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Function to load tasks from local storage
function loadTasks() {
  const taskList = document.getElementById('task-list');
  taskList.innerHTML = '';

  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

  tasks.forEach((task, index) => {
    addTaskToDOM(task, index);
  });
}

function addTask() {
  const title = document.getElementById('title').value;
  const category = document.getElementById('category').value;
  const deadline = document.getElementById('deadline').value;
  const priority = document.getElementById('priority').value;
  const label = document.getElementById('label').value;

  const task = {
    title,
    category,
    deadline,
    priority,
    label,
    completed: false,
    progress: 0,
  };

   const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.push(task);

  updateLocalStorage(tasks); // Store updated tasks in local storage

  loadTasks();
  clearForm();
}

function editTask(index) {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  const taskToEdit = tasks[index];

  // Display a form for editing the task
  const editForm = `
    <label for="edit-title">Title:</label>
    <input type="text" id="edit-title" value="${taskToEdit.title}" required>

    <label for="edit-category">Category:</label>
    <input type="text" id="edit-category" value="${taskToEdit.category}" required>

    <label for="edit-deadline">Deadline (optional):</label>
    <input type="datetime-local" id="edit-deadline" value="${taskToEdit.deadline || ''}">

    <label for="edit-priority">Priority:</label>
    <select id="edit-priority" required>
      <option value="low" ${taskToEdit.priority === 'low' ? 'selected' : ''}>Low</option>
      <option value="medium" ${taskToEdit.priority === 'medium' ? 'selected' : ''}>Medium</option>
      <option value="high" ${taskToEdit.priority === 'high' ? 'selected' : ''}>High</option>
    </select>

    <label for="edit-label">Label:</label>
    <select id="edit-label">
      <option value="" ${taskToEdit.label === '' ? 'selected' : ''}>None</option>
      <option value="work" ${taskToEdit.label === 'work' ? 'selected' : ''}>Work</option>
      <option value="personal" ${taskToEdit.label === 'personal' ? 'selected' : ''}>Personal</option>
      <!-- Add more label options as needed -->
    </select>

    <button class="edit-button" onclick="updateTask(${index})">Update Task</button>
  `;

  // Replace the task details with the edit form
  const taskItem = document.getElementById(`task-${index}`);
  taskItem.innerHTML = editForm;
}

function updateTask(index) {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  const taskToEdit = tasks[index];

  // Update the task with the new values
  taskToEdit.title = document.getElementById('edit-title').value;
  taskToEdit.category = document.getElementById('edit-category').value;
  taskToEdit.deadline = document.getElementById('edit-deadline').value;
  taskToEdit.priority = document.getElementById('edit-priority').value;
  taskToEdit.label = document.getElementById('edit-label').value;

  // Save the updated tasks back to local storage
  localStorage.setItem('tasks', JSON.stringify(tasks));

  // Reload tasks after updating
  loadTasks();
}

function deleteTask(index) {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

  // Remove the task from the array
  tasks.splice(index, 1);

  // Save the updated tasks back to local storage
  localStorage.setItem('tasks', JSON.stringify(tasks));

  // Reload tasks after deleting
  loadTasks();
}

function completeTask(index) {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

  if (index >= 0 && index < tasks.length) {
    tasks[index].completed = true;
    tasks[index].progress = 100; // Mark progress as 100 when completed

    // Hide "Edit" and "Complete" buttons
    const taskItem = document.getElementById(`task-${index}`);
    const buttons = taskItem.querySelectorAll('button');
    buttons.forEach(button => (button.style.display = 'none'));

    updateLocalStorage(tasks); // Store updated tasks in local storage

    loadTasks();
  } else {
    console.error('Invalid index:', index);
  }
}

function getTaskStatusClass(task) {
  if (task.completed) {
    return 'completed';
  } else if (task.deadline && new Date(task.deadline) < new Date()) {
    return 'deadline-not-met';
  } else {
    return 'in-progress';
  }
}



function formatDeadline(deadline) {
  if (!deadline) return '';
  const date = new Date(deadline);
  const formattedDate = date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  return formattedDate;
}

function addTaskToDOM(task, index) {
  const taskList = document.getElementById('task-list');

  const taskItem = document.createElement('li');
  taskItem.id = `task-${index}`;
  taskItem.className = `task-item ${getTaskStatusClass(task)}`;

  // Determine the completion status text based on the task's status
  const completionStatusText = task.completed
    ? 'Completed'
    : task.deadline && new Date(task.deadline) < new Date()
    ? 'Deadline Missed'
    : 'In Progress';

  const taskDetails = `
    <strong>${task.title}</strong>
    <div>Category: ${task.category}</div>
    <div>Deadline: ${formatDeadline(task.deadline) || 'None'}</div>
    <div class="priority-icon">${getPriorityIcon(task.priority)} Priority: ${task.priority}</div>
    <div class="label-icon">${getLabelIcon(task.label)} Label: ${task.label}</div>
    <div class="completion-status">${completionStatusText}</div>
    <progress value="${task.progress}" max="100"></progress>
    <div class="button-container">
      <button class="edit-button" onclick="editTask(${index})">Edit</button>
      <button class="delete-button" onclick="deleteTask(${index})">Delete</button>
      <button class="complete-button" onclick="completeTask(${index})"><i class="fas fa-check"></i> Complete</button>
    </div>
  `;

  taskItem.innerHTML = taskDetails;
  taskList.appendChild(taskItem);
  const completionStatusElement = taskItem.querySelector('.completion-status');
  if (task.completed) {
    completionStatusElement.style.backgroundColor = 'green';
  } else if (task.deadline && new Date(task.deadline) < new Date()) {
    completionStatusElement.style.backgroundColor = 'red';
  } else {
    completionStatusElement.style.backgroundColor = '#FFA500'; // Orange for in-progress
  }

  completionStatusElement.style.textAlign = 'center';
  completionStatusElement.style.fontSize = '18px';
  completionStatusElement.style.padding = '10px 0';
  completionStatusElement.style.color = '#fff';
  completionStatusElement.style.borderRadius = '5px';
  completionStatusElement.style.marginBottom = '10px';
  
  // Hide "Complete" button if task is completed
  if (task.completed) {
    const completeButton = taskItem.querySelector('.complete-button');
    if (completeButton) {
      completeButton.style.display = 'none';
    }
  }
}

function clearForm() {
  document.getElementById('title').value = '';
  document.getElementById('category').value = '';
  document.getElementById('deadline').value = '';
  document.getElementById('priority').value = '';
  document.getElementById('label').value = '';
}

function getPriorityIcon(priority) {
  switch (priority) {
    case 'low':
      return '<i class="fas fa-arrow-down"></i>';
    case 'medium':
      return '<i class="fas fa-flag"></i>';
    case 'high':
      return '<i class="fas fa-exclamation-circle"></i>';
    default:
      return '';
  }
}

function getLabelIcon(label) {
  switch (label) {
    case 'work':
      return '<i class="fas fa-tag"></i>';
    case 'personal':
      return '<i class="fas fa-tag"></i>';
    // Add more cases as needed
    default:
      return '';
  }
}

loadTasks();

