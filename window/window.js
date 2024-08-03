document.getElementById('add-todo').addEventListener('click', () => {
  const todoList = document.querySelector('.todo-list');
  const newTodo = addTodoItem(todoList, 'New Todo');
  makeDraggable(newTodo);
  addDeleteFunctionality(newTodo);
  addNoteFunctionality(newTodo);
});

function addTodoItem(todoList, text) {
  const newTodo = document.createElement('li');
  newTodo.className = 'todo-item';
  newTodo.textContent = text;
  newTodo.dataset.notes = '';

  const nestedList = document.createElement('ul');
  nestedList.className = 'todo-list nested-list';

  const addSubTodoButton = document.createElement('button');
  addSubTodoButton.textContent = 'Add Sub-Todo';
  addSubTodoButton.className = 'add-sub-todo';
  addSubTodoButton.addEventListener('click', () => {
      const newSubTodo = addTodoItem(nestedList, 'New Sub-Todo');
      makeDraggable(newSubTodo);
      addDeleteFunctionality(newSubTodo);
      addNoteFunctionality(newSubTodo);
  });

  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete';
  deleteButton.className = 'delete-todo';
  deleteButton.addEventListener('click', () => {
      newTodo.remove();
      clearNotesIfDeleted(newTodo);
  });

  newTodo.appendChild(nestedList);
  newTodo.appendChild(addSubTodoButton);
  newTodo.appendChild(deleteButton);
  todoList.appendChild(newTodo);
  return newTodo;
}

function makeDraggable(item) {
  item.draggable = true;
  item.addEventListener('dragstart', (e) => {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/html', item.outerHTML);
      item.classList.add('dragging');
  });

  item.addEventListener('dragend', () => {
      item.classList.remove('dragging');
  });

  item.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
  });

  item.addEventListener('drop', (e) => {
      e.preventDefault();
      e.stopPropagation();

      const draggingItem = document.querySelector('.dragging');
      const target = e.target.closest('.todo-item');
      const todoList = item.parentNode;

      if (draggingItem !== target && todoList.contains(target)) {
          todoList.insertBefore(draggingItem, target);
      }
  });
}

function addDeleteFunctionality(item) {
  const deleteButton = item.querySelector('.delete-todo');
  deleteButton.addEventListener('click', () => {
      item.remove();
      clearNotesIfDeleted(item);
  });
}

function addNoteFunctionality(item) {
  item.addEventListener('click', () => {
      const previouslySelected = document.querySelector('.todo-item.selected');
      if (previouslySelected) {
          previouslySelected.classList.remove('selected');
      }
      item.classList.add('selected');

      const todoTitleInput = document.getElementById('todo-title');
      todoTitleInput.value = item.textContent;
      todoTitleInput.oninput = () => {
          item.textContent = todoTitleInput.value;
      };

      const notesTextarea = document.getElementById('notes');
      notesTextarea.value = item.dataset.notes;
      notesTextarea.oninput = () => {
          item.dataset.notes = notesTextarea.value;
      };
  });
}

function clearNotesIfDeleted(item) {
  const notesTextarea = document.getElementById('notes');
  const todoTitleInput = document.getElementById('todo-title');
  if (todoTitleInput.value === item.textContent) {
      notesTextarea.value = '';
      todoTitleInput.value = '';
  }
}

// Function to handle the drag for resizing panes
const divider = document.querySelector('.divider');
let isDragging = false;

divider.addEventListener('mousedown', (e) => {
  isDragging = true;
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
});

function onMouseMove(e) {
  if (!isDragging) return;
  
  const containerWidth = document.querySelector('.container').offsetWidth;
  const leftPaneWidth = e.clientX;
  const rightPaneWidth = containerWidth - leftPaneWidth - divider.offsetWidth;

  if (leftPaneWidth < 100 || rightPaneWidth < 100) return; // Prevent too small panes

  document.querySelector('.left-pane').style.flex = `0 0 ${leftPaneWidth}px`;
  document.querySelector('.right-pane').style.flex = `0 0 ${rightPaneWidth}px`;
}

function onMouseUp() {
  isDragging = false;
  document.removeEventListener('mousemove', onMouseMove);
  document.removeEventListener('mouseup', onMouseUp);
}

document.querySelectorAll('.todo-item').forEach(item => {
  makeDraggable(item);
  addDeleteFunctionality(item);
  addNoteFunctionality(item);
});
