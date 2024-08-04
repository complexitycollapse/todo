document.getElementById('add-todo').addEventListener('click', () => {
  const previouslySelected = document.querySelector('.todo-item.selected');
  const todoList = (parentTodo(previouslySelected) ?? document).querySelector('.todo-list');
  const newTodo = addTodoItem(todoList, '');
  makeDraggable(newTodo);
  addNoteFunctionality(newTodo);
  addCheckboxFunctionality(newTodo);
  addCollapseFunctionality(newTodo);
  document.getElementById('todo-title').focus();
});

const parentTodo = (item) => item?.parentElement?.closest('.todo-item');

document.getElementById('add-sub-todo').addEventListener('click', () => {
  const previouslySelected = document.querySelector('.todo-item.selected');
  if (!previouslySelected) return;

  const nestedList = previouslySelected.querySelector('ul');
  const newSubTodo = addTodoItem(nestedList, '');
  makeDraggable(newSubTodo);
  addNoteFunctionality(newSubTodo);
  addCheckboxFunctionality(newSubTodo);
  addCollapseFunctionality(newSubTodo);
  setChildControlsVisibility(newSubTodo);
  setChildControlsVisibility(previouslySelected);
  document.getElementById('todo-title').focus();
});

document.getElementById('delete-todo').addEventListener('click', () => {
  const previouslySelected = document.querySelector('.todo-item.selected');
  if (!previouslySelected) return;

  const parent = parentTodo(previouslySelected);
  previouslySelected.remove();
  clearNotesIfDeleted(previouslySelected);

  if (parent) setChildControlsVisibility(parent);
});

document.getElementById('todo-filter').addEventListener('input', () => {
  const filterString = document.getElementById('todo-filter').value;
  Array.from(document.getElementById('main-list').children).forEach(item => {
    recursiveFilter(filterString, item);
  });
});

function recursiveFilter(filter, item) {
  const title = item.querySelector('.todo-text').textContent;
  const notes = item.dataset.notes;
  const childItems = findTopLevelTodoItems(item);

  let visible = false, childrenVisible = false;
  childItems.forEach(i => childrenVisible |= recursiveFilter(filter, i));

  if (!filter || filter.trim() === "" || title.includes(filter) || notes.includes(filter)) {
    visible = true;
  } else {
    visible = childrenVisible;
  }

  if (childrenVisible && filter) {
    expandAncestry(item, true);
  } else {
    unpeek(item);
  }

  if (visible) {
    item.classList.remove('filter-excluded');
  } else {
    item.classList.add('filter-excluded');
  }

  return visible;
}

function setChildControlsVisibility(parent) {
  if (!parent) return;

  const collapseButton = parent.querySelector('.collapse-button');
  const nestedList = parent.querySelector('.nested-list');
  const counter = parent.querySelector('.todo-count');

  if (nestedList.children.length > 0) {
      collapseButton.classList.remove('invisible');
      counter.classList.remove('invisible');
  } else {
    collapseButton.classList.add('invisible');
    counter.classList.add('invisible');
  }

  const children = Array.from(parent.querySelector('ul').children);
  const complete = children.filter(c => c.querySelector('.todo-checkbox')?.checked);

  counter.textContent = complete.length.toString() + "/" + children.length.toString();
}

function addTodoItem(todoList, text) {
  const newTodo = document.createElement('li');
  newTodo.className = 'todo-item';
  newTodo.dataset.notes = '';

  const collapseButton = document.createElement('button');
  collapseButton.className = 'collapse-button invisible';
  collapseButton.textContent = '-';

  const counter = document.createElement('span');
  counter.className = 'todo-count invisible';

  const headline = document.createElement('div');
  headline.className = "todo-headline";

  const span = document.createElement('span');
  span.textContent = text;
  span.className = "todo-text";

  const checkbox = document.createElement('input');
  checkbox.type = "checkbox";
  checkbox.className = 'todo-checkbox';

  const nestedList = document.createElement('ul');
  nestedList.className = 'todo-list nested-list';

  headline.appendChild(collapseButton);
  headline.appendChild(checkbox);
  headline.appendChild(span);
  headline.appendChild(counter);
  newTodo.appendChild(headline);
  newTodo.appendChild(nestedList);

  const items = Array.from(todoList.children);
  let i = todoList.children.length - 1;
  while (i > 0 && items[i].classList.contains('completed')) {
    i--;
}
  todoList.insertBefore(newTodo, items[i]?.nextSibling);
  selectTodo(newTodo);
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

      setChildControlsVisibility(parentTodo(item));
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
  item.querySelector(".todo-headline").addEventListener('dragstart', (e) => {
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
  item.addEventListener('click', e => {
    if (event.target.classList.contains('todo-checkbox')) {
      return; // Don't select item when clicking on checkbox
    }

    e.stopPropagation();

    selectTodo(item);
  });
}

function selectTodo(item) {
  const previouslySelected = document.querySelector('.todo-item.selected');
 
    if (previouslySelected) {
      previouslySelected.classList.remove('selected');
    }

    item.classList.add('selected');
    expandAncestry(item.parentElement.closest('.todo-item'));

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

function addCollapseFunctionality(item) {
  item.querySelector('.collapse-button').addEventListener('click', () => {
      if (item.querySelector('.nested-list').classList.contains('collapsed')) {
          expandAncestry(item);
      } else {
          collapse(item);
      }
  });
}

function collapse(item) {
  item.querySelector('.nested-list').classList.add('collapsed');
  item.querySelector('.collapse-button').textContent = '+';
}

function expand (item, peek) {
  if (peek) {
    item.querySelector('.nested-list').classList.add('peek');
    return;
  }
  item.querySelector('.nested-list').classList.remove('collapsed');
  item.querySelector('.collapse-button').textContent = '-';
}

function unpeek(item) {
  item.querySelector('.nested-list').classList.remove('peek');
}

function expandAncestry(item, peek) {
  if (!item) return;
  expand(item, peek);
  expandAncestry(item.parentElement.closest('.todo-item'));
}

document.querySelectorAll('.todo-item').forEach(item => {
  makeDraggable(item);
  addNoteFunctionality(item);
  addCheckboxFunctionality(item);
  addCollapseFunctionality(item);
});

function findTopLevelTodoItems(item) {
  // Select all elements with the class 'todo-item' within the given element
  const allTodoItems = item.querySelectorAll('.todo-item');
  
  // Filter out nested todo-items
  const topLevelTodoItems = Array.from(allTodoItems).filter(childItem => {
      // Check if the closest ancestor with the class 'todo-item' is the current element itself
      return childItem.parentElement.closest('.todo-item') === item;
  });
  
  return topLevelTodoItems;
}
