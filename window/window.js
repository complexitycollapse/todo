document.getElementById('add-todo').addEventListener('click', () => {
  const todoList = document.querySelector('.todo-list');
  const newTodo = addTodoItem(todoList, 'New Todo');
  makeDraggable(newTodo);
  addNoteFunctionality(newTodo);
  addCheckboxFunctionality(newTodo);
});

document.getElementById('add-sub-todo').addEventListener('click', () => {
  const previouslySelected = document.querySelector('.todo-item.selected');
  const nestedList = previouslySelected.querySelector('ul');
  const newSubTodo = addTodoItem(nestedList, 'New Sub-Todo');
  makeDraggable(newSubTodo);
  addNoteFunctionality(newSubTodo);
});

document.getElementById('delete-todo').addEventListener('click', () => {
  const previouslySelected = document.querySelector('.todo-item.selected');
  previouslySelected.remove();
  clearNotesIfDeleted(previouslySelected);
});

function addTodoItem(todoList, text) {
  const newTodo = document.createElement('li');
  newTodo.className = 'todo-item';
  newTodo.dataset.notes = '';

  const span = document.createElement('span');
  span.textContent = text;
  span.className = "todo-text";

  const checkbox = document.createElement('input');
  checkbox.type = "checkbox";
  checkbox.className = 'todo-checkbox';

  const nestedList = document.createElement('ul');
  nestedList.className = 'todo-list nested-list';

  newTodo.appendChild(checkbox);
  newTodo.appendChild(span);
  newTodo.appendChild(nestedList);
  todoList.appendChild(newTodo);
  return newTodo;
}

function addCheckboxFunctionality(item) {
  const checkbox = item.querySelector('.todo-checkbox');
  checkbox.addEventListener('change', () => {
      if (checkbox.checked) {
          item.classList.add('completed');
          item.dataset.prev = Array.from(item.parentElement.children).indexOf(item);
          item.parentElement.appendChild(item);
      } else {
          item.classList.remove('completed');
          moveItemToActivePosition(item);
          delete item.dataset.prev;
      }
  });
}

function moveItemToActivePosition(item) {
  const todoList = item.parentElement;
  const items = Array.from(todoList.children);

  let i = item.dataset.prev;
  while (i > 0 && items[i].classList.contains('completed')) {
      i--;
  }
  todoList.insertBefore(item, items[i]);
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

function addNoteFunctionality(item) {
  item.addEventListener('click', () => {
    if (event.target.classList.contains('todo-checkbox')) {
      return; // Don't select item when clicking on checkbox
    }

    const previouslySelected = document.querySelector('.todo-item.selected');
 
    if (previouslySelected) {
      previouslySelected.classList.remove('selected');
    }
    item.classList.add('selected');

    const todoTitleInput = document.getElementById('todo-title');
    todoTitleInput.value = item.querySelector('.todo-text').textContent.trim();
    todoTitleInput.oninput = () => {
      item.querySelector('.todo-text').textContent = todoTitleInput.value.trim();
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
}

function onMouseUp() {
  isDragging = false;
  document.removeEventListener('mousemove', onMouseMove);
  document.removeEventListener('mouseup', onMouseUp);
}

document.querySelectorAll('.todo-item').forEach(item => {
  makeDraggable(item);
  addNoteFunctionality(item);
  addCheckboxFunctionality(item);
});
