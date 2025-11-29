let tasks = [];
let taskIdCounter = 1;

const createTaskBtn = document.getElementById("createTask");
const myTasksBtn = document.getElementById("myTasks");
const toolsDiv = document.querySelector(".tools");

// ===== SHOW CREATE FORM =====
function showTaskForm() {
    const existingForm = document.getElementById("taskForm");
    if (existingForm) existingForm.remove();

    const formDiv = document.createElement("div");
    formDiv.id = "taskForm";
    formDiv.style.backgroundColor = "rgb(230,230,250)";
    formDiv.style.padding = "20px";
    formDiv.style.borderRadius = "10px";
    formDiv.style.boxShadow = "0 4px 10px rgba(0,0,0,0.2)";
    formDiv.style.width = "320px";
    formDiv.style.marginTop = "20px";

    formDiv.innerHTML = `
        <h2 style="text-align:center; color:rgb(149,50,236);">Add New Task</h2>
        <label>Task Name:</label><br>
        <input type="text" id="taskName" placeholder="Enter task name" style="width:100%; padding:6px;"><br><br>
        <label>Category:</label><br>
        <input type="text" id="taskCategory" placeholder="Enter category" style="width:100%; padding:6px;"><br><br>
        <label>Deadline (Date & Time):</label><br>
        <input type="datetime-local" id="taskDeadline" style="width:100%; padding:6px;"><br><br>
        <button id="saveTaskBtn"
            style="width:100%; padding:8px; background-color:rgb(149,50,236);
                   color:white; border:none; border-radius:5px; cursor:pointer;">
            Save Task
        </button>
    `;
    toolsDiv.appendChild(formDiv);

    document.getElementById("saveTaskBtn").addEventListener("click", saveTask);
}

// ===== SAVE TASK =====
function saveTask() {
    const name = document.getElementById("taskName").value.trim();
    const category = document.getElementById("taskCategory").value.trim();
    const deadline = document.getElementById("taskDeadline").value;

    if (!name || !category || !deadline) {
        alert("⚠ Please fill all fields!");
        return;
    }

    const now = new Date();
    const deadlineDate = new Date(deadline);
    const status = (deadlineDate > now) ? "Remaining" : "Expired";

    const task = {
        id: taskIdCounter++,
        name,
        category,
        deadline,
        status
    };

    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    alert("✅ Task saved successfully!");
    document.getElementById("taskForm").remove();
}

// ===== SHOW MY TASKS =====
function showMyTasks() {
    const existingList = document.getElementById("taskList");
    if (existingList) existingList.remove();

    const taskListDiv = document.createElement("div");
    taskListDiv.id = "taskList";
    taskListDiv.style.backgroundColor = "white";
    taskListDiv.style.padding = "20px";
    taskListDiv.style.borderRadius = "10px";
    taskListDiv.style.width = "600px";
    taskListDiv.style.marginTop = "20px";
    taskListDiv.style.boxShadow = "0 4px 10px rgba(0,0,0,0.2)";

    taskListDiv.innerHTML = `
        <h2 style="color:rgb(149,50,236); text-align:center;">My Tasks</h2><br>

        <div style="display:flex; gap:10px; margin-bottom:15px;">
            <input type="text" id="taskSearch" placeholder="🔍 Search by name or category"
                style="flex:1; padding:8px; border-radius:6px; border:1px solid #ccc;">
            <select id="sortOption" style="padding:8px; border-radius:6px;">
                <option value="asc" selected>Sort by Deadline (Earliest First)</option>
                <option value="desc">Sort by Deadline (Latest First)</option>
            </select>
        </div>

        <div id="taskItems"></div>
    `;
    toolsDiv.appendChild(taskListDiv);

    renderTasks(tasks);

    // 🔍 Filter
    document.getElementById("taskSearch").addEventListener("input", (e) => {
        const q = e.target.value.toLowerCase();
        const filtered = tasks.filter(t =>
            t.name.toLowerCase().includes(q) || t.category.toLowerCase().includes(q)
        );
        renderTasks(filtered);
    });

    // 🔽 Sort
    document.getElementById("sortOption").addEventListener("change", (e) => {
        const val = e.target.value;
        if (val === "asc") {
            tasks.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
        } else {
            tasks.sort((a, b) => new Date(b.deadline) - new Date(a.deadline));
        }
        renderTasks(tasks);
    });
}

// ===== RENDER TASKS =====
function renderTasks(arr) {
    const div = document.getElementById("taskItems");
    if (!arr || arr.length === 0) {
        div.innerHTML = "<p>No tasks found!</p>";
        return;
    }

    // ✅ Always sort earliest first by default
    arr.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

    let html = "";
    arr.forEach((t) => {
        html += `
        <div style="border:1px solid #ccc; padding:10px; border-radius:8px; margin-bottom:10px;">
            <b>ID:</b> ${t.id}<br>
            <b>Name:</b> ${t.name}<br>
            <b>Category:</b> ${t.category}<br>
            <b>Deadline:</b> ${t.deadline}<br>
            <b>Status:</b> <span style="color:${t.status === "Expired" ? "red" : "green"};">${t.status}</span><br><br>
            <button onclick="deleteTask(${t.id})"
                style="padding:5px 10px; background-color:red; color:white; border:none; border-radius:5px; cursor:pointer;">
                Delete
            </button>
            <button onclick="editTask(${t.id})"
                style="padding:5px 10px; background-color:orange; color:white; border:none; border-radius:5px; cursor:pointer;">
                Update
            </button>
        </div>`;
    });

    div.innerHTML = html;
}

// ===== DELETE TASK =====
function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    alert("🗑 Task deleted!");
    showMyTasks();
}

// ===== EDIT TASK =====
function editTask(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return alert("⚠ Task not found!");

    const existingForm = document.getElementById("taskForm");
    if (existingForm) existingForm.remove();

    const formDiv = document.createElement("div");
    formDiv.id = "taskForm";
    formDiv.style.backgroundColor = "rgb(230,230,250)";
    formDiv.style.padding = "20px";
    formDiv.style.borderRadius = "10px";
    formDiv.style.width = "320px";
    formDiv.style.marginTop = "20px";

    formDiv.innerHTML = `
        <h2 style="text-align:center; color:rgb(149,50,236);">Update Task</h2>
        <label>Task Name:</label><br>
        <input type="text" id="taskName" value="${task.name}" style="width:100%; padding:6px;"><br><br>
        <label>Category:</label><br>
        <input type="text" id="taskCategory" value="${task.category}" style="width:100%; padding:6px;"><br><br>
        <label>Deadline (Date & Time):</label><br>
        <input type="datetime-local" id="taskDeadline" value="${task.deadline}" style="width:100%; padding:6px;"><br><br>
        <button id="updateTaskBtn"
            style="width:100%; padding:8px; background-color:orange; color:white; border:none; border-radius:5px; cursor:pointer;">
            Update Task
        </button>
    `;
    toolsDiv.appendChild(formDiv);

    document.getElementById("updateTaskBtn").addEventListener("click", function () {
        const newName = document.getElementById("taskName").value.trim();
        const newCat = document.getElementById("taskCategory").value.trim();
        const newDeadline = document.getElementById("taskDeadline").value;

        if (!newName || !newCat || !newDeadline) return alert("⚠ Please fill all fields!");

        const now = new Date();
        const dDate = new Date(newDeadline);
        task.name = newName;
        task.category = newCat;
        task.deadline = newDeadline;
        task.status = (dDate > now) ? "Remaining" : "Expired";

        localStorage.setItem("tasks", JSON.stringify(tasks));
        alert("✅ Task updated!");
        formDiv.remove();
        showMyTasks();
    });
}

// ===== EVENTS =====
createTaskBtn.addEventListener("click", showTaskForm);
myTasksBtn.addEventListener("click", showMyTasks);