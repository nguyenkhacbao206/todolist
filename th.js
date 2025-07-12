const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const daySelect = document.getElementById("todo-day");
const timeInput = document.getElementById("todo-time");
const timetableBody = document.getElementById("timetable-body");

const days = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
let times = [];

const todos = JSON.parse(localStorage.getItem("tkbTodos")) || [];

function saveTodos() {
  localStorage.setItem("tkbTodos", JSON.stringify(todos));
}

function sortTimes(timesArray) {
  return timesArray.sort((a, b) => {
    const [ah, am] = a.split(":").map(Number);
    const [bh, bm] = b.split(":").map(Number);
    return ah * 60 + am - (bh * 60 + bm);
  });
}

function renderTable() {
  // Lấy lại các giờ đang được dùng từ todos
  times = Array.from(new Set(todos.map(t => t.time)));
  times = sortTimes(times);

  timetableBody.innerHTML = "";

  times.forEach(time => {
    const tr = document.createElement("tr");
    const timeTd = document.createElement("td");
    timeTd.textContent = time;
    tr.appendChild(timeTd);

    days.forEach(day => {
      const td = document.createElement("td");
      const task = todos.find(t => t.day === day && t.time === time);
      if (task) {
        td.textContent = task.text;
        td.classList.add("task");

        td.addEventListener("click", () => {
          const confirmDelete = confirm("Xóa công việc này?");
          if (confirmDelete) {
            const index = todos.findIndex(t => t.day === day && t.time === time);
            todos.splice(index, 1);
            saveTodos();
            renderTable();
          }
        });
      }
      tr.appendChild(td);
    });

    timetableBody.appendChild(tr);
  });
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = input.value.trim();
  const day = daySelect.value;
  const time = timeInput.value;

  if (text && day && time) {
    // Xoá task cũ nếu trùng thứ + giờ
    const existingIndex = todos.findIndex(t => t.day === day && t.time === time);
    if (existingIndex !== -1) todos.splice(existingIndex, 1);

    todos.push({ text, day, time });
    saveTodos();
    renderTable();
    form.reset();
  }
});

renderTable();
