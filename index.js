let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let editId = null;

let taskList = document.getElementById("task-list");
let taskTitle = document.getElementById("task-title");
let taskPriority = document.getElementById("task-priority");
let taskDeadline = document.getElementById("task-deadline");
let addTaskBtn = document.getElementById("add-task");

let filterStatus = document.getElementById("filter-status");
let filterPriority = document.getElementById("filter-priority");

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString();
}

function getDaysLeft(deadline) {
  let diff = new Date(deadline) - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function renderTasks() {
  taskList.innerHTML = "";

  let filtered = tasks.filter(task => {
    let statusMatch = filterStatus.value === "all" || task.status === filterStatus.value;
    let priorityMatch = filterPriority.value === "all" || task.priority === filterPriority.value;
    return statusMatch && priorityMatch;
  });

  filtered.forEach((task, index) => {
    let card = document.createElement("div");
    card.className = "task-card";

    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.status === "completed";
    checkbox.onchange = () => toggleComplete(index);

    let title = document.createElement("div");
    title.className = `task-title ${task.status === "completed" ? "completed" : ""}`;
    title.textContent = task.title;

    let badge = document.createElement("span");
    badge.className = `badge ${task.priority}`;
    badge.textContent = task.priority;

    let deadline = document.createElement("span");
    deadline.innerHTML = `📅 ${formatDate(task.deadline)}`;

    let meta = document.createElement("div");
    meta.className = "task-meta";
    meta.appendChild(badge);
    meta.appendChild(deadline);

    let daysLeft = getDaysLeft(task.deadline);
    if (task.status === "pending") {
      let timeInfo = document.createElement("span");
      timeInfo.className = "countdown";
      timeInfo.textContent = daysLeft < 0
        ? "Overdue"
        : `Due in ${daysLeft} day${daysLeft !== 1 ? "s" : ""}`;
      if (daysLeft < 0) timeInfo.classList.add("overdue");
      meta.appendChild(timeInfo);
    }

    let details = document.createElement("div");
    details.className = "task-details";
    details.appendChild(title);
    details.appendChild(meta);

    let actions = document.createElement("div");
    actions.className = "task-actions";

    let editBtn = document.createElement("button");
    editBtn.innerHTML = "✏";
    editBtn.onclick = () => editTask(index);

    let deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = "🗑";
    deleteBtn.onclick = () => deleteTask(index);

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);

    card.appendChild(checkbox);
    card.appendChild(details);
    card.appendChild(actions);

    taskList.appendChild(card);
  });
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

addTaskBtn.onclick = () => {
  let title = taskTitle.value.trim();
  let priority = taskPriority.value;
  let deadline = taskDeadline.value;

  if (!title || !deadline) {
    alert("Title and deadline are required.");
    return;
  }

  let task = {
    title,
    priority,
    deadline,
    status: "pending"
  };

  if (editId !== null) {
    tasks[editId] = task;
    editId = null;
    addTaskBtn.textContent = "+ Add Task";
  } else {
    tasks.push(task);
  }

  saveTasks();
  renderTasks();

  taskTitle.value = "";
  taskDeadline.value = "";
};

function editTask(index) {
  let task = tasks[index];
  taskTitle.value = task.title;
  taskPriority.value = task.priority;
  taskDeadline.value = task.deadline;
  editId = index;
  addTaskBtn.textContent = "Update Task";
}

function deleteTask(index) {
  if (confirm("Delete this task?")) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
  }
}

function toggleComplete(index) {
  tasks[index].status = tasks[index].status === "pending" ? "completed" : "pending";
  saveTasks();
  renderTasks();
}

filterStatus.onchange = renderTasks;
filterPriority.onchange = renderTasks;

renderTasks();
