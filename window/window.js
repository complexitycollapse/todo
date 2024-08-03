document.getElementById("add-todo").addEventListener("click", () => {
  const todoList = document.querySelector(".todo-list");
  const newTodo = document.createElement("li");
  newTodo.className = "todo-item";
  newTodo.contentEditable = "true";
  newTodo.textContent = "New Todo";
  todoList.appendChild(newTodo);
  makeDraggable(newTodo);
});

function makeDraggable(item) {
  item.draggable = true;
  item.addEventListener("dragstart", (e) => {
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/html", item.outerHTML);
      item.classList.add("dragging");
  });

  item.addEventListener("dragend", () => {
      item.classList.remove("dragging");
  });

  item.addEventListener("dragover", (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
  });

  item.addEventListener("drop", (e) => {
      e.preventDefault();
      e.stopPropagation();

      const todoList = document.querySelector(".todo-list");
      const draggingItem = document.querySelector(".dragging");
      const target = e.target.closest(".todo-item");
      
      if (draggingItem !== target) {
          todoList.insertBefore(draggingItem, target);
      }
  });
}

document.querySelectorAll(".todo-item").forEach(item => {
  makeDraggable(item);
});
