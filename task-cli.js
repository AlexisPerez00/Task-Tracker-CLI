const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "tasks.json");

function getTasks() {
  if (!fs.existsSync(filePath)) {
    return [];
  }
  const data = fs.readFileSync(filePath, "utf-8");
  return data ? JSON.parse(data) : [];
}

function saveTasks(tasks) {
  fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2));
}

function getNow() {
  return new Date().toISOString();
}

function addTask(description) {
  if (!description) {
    console.error("Error: Please provide a description for the task.");
    return;
  }
  const tasks = getTasks();
  const id =
    tasks.length > 0 ? Math.max(...tasks.map((task) => task.id)) + 1 : 1;
  const now = getNow();

  const newTask = {
    id,
    description,
    status: "todo",
    createdAt: now,
    updatedAt: now,
  };
  tasks.push(newTask);
  saveTasks(tasks);
  console.log(`Task added successfully (ID: ${id})`);
}

function updateTask(id, newDescription) {
  if (!id || !newDescription) {
    console.error("Error: Please provide an ID and a new description.");
    return;
  }
  const tasks = getTasks();
  const taskIndex = tasks.findIndex((t) => t.id === parseInt(id));
  if (taskIndex === -1) {
    console.error(`Error: Task with ID ${id} not found.`);
    return;
  }
  tasks[taskIndex].description = newDescription;
  tasks[taskIndex].updatedAt = getNow();
  saveTasks(tasks);
  console.log(`Task ${id} updated successfully.`);
}

function deleteTask(id) {
  if (!id) {
    console.error("Error: Please provide a task ID to delete.");
    return;
  }
  let tasks = getTasks();
  const initialLength = tasks.length;
  tasks = tasks.filter((t) => t.id !== parseInt(id));

  if (tasks.length === initialLength) {
    console.error(`Error: Task with ID ${id} not found.`);
    return;
  }

  saveTasks(tasks);
  console.log(`Task ${id} deleted successfully.`);
}

function updateStatus(id, status) {
  if (!id) {
    console.error("Error: Please provide a task ID.");
    return;
  }
  const tasks = getTasks();
  const taskIndex = tasks.findIndex((t) => t.id === parseInt(id));

  if (taskIndex === -1) {
    console.error(`Error: Task with ID ${id} not found.`);
    return;
  }

  tasks[taskIndex].status = status;
  tasks[taskIndex].updatedAt = getNow();
  saveTasks(tasks);
  console.log(`Task ${id} marked as ${status}.`);
}

function listTasks(statusFilter) {
  const tasks = getTasks();
  let filteredTasks = tasks;

  if (statusFilter) {
    filteredTasks = tasks.filter((t) => t.status === statusFilter);
  }

  if (filteredTasks.length === 0) {
    console.log("No tasks found.");
    return;
  }

  console.log("--- Tasks ---");
  filteredTasks.forEach((task) => {
    console.log(
      `[${task.id}] ${task.description} | Status: ${task.status} | Created: ${task.createdAt}`,
    );
  });
}

const command = process.argv[2];
const args = process.argv.slice(3);

switch (command) {
  case "add":
    addTask(args.join(" "));
    break;
  case "update":
    updateTask(args[0], args.slice(1).join(" "));
    break;
  case "delete":
    deleteTask(args[0]);
    break;
  case "mark-in-progress":
    updateStatus(args[0], "in-progress");
    break;
  case "mark-done":
    updateStatus(args[0], "done");
    break;
  case "list":
    listTasks(args[0]);
    break;
  default:
    console.log("Usage:");
    console.log('  node task-cli.js add "Task description"');
    console.log('  node task-cli.js update <id> "New description"');
    console.log("  node task-cli.js delete <id>");
    console.log("  node task-cli.js mark-in-progress <id>");
    console.log("  node task-cli.js mark-done <id>");
    console.log("  node task-cli.js list [status]");
}
