const todoList = document.querySelector('.todo-list');
const buttonAdd = document.querySelector('.button-add');
const emptyState = document.querySelector('.empty-state');
const todoCreateForm = document.querySelector('.todo-create-form');

function createTodoItem(todoItemObj) {
    if (!todoItemObj.text) return;

    let todoItem = document.createElement('div');
    todoItem.classList.add('todo-item');
    if (todoItemObj.checked) {
        todoItem.classList.add('selected');
    }

    todoItem.innerHTML = `
        <button type="button" class="button-select">
            <img src="images/Check1.svg" alt="Выбрать">
        </button>
        <div class="todo-item__text">${todoItemObj.text}</div>
        <button type="button" class="button-delete">
            <img src="images/Cross.svg" alt="Удалить задачу">
        </button>
    `;
    todoList.append(todoItem);

    checkViewTodoList();
    saveToLocalStorage();
}

todoList.addEventListener('click', (event) => {
    let target = event.target;

    let selectButton = target.closest('.button-select');
    let deleteButton = target.closest('.button-delete');

    if (selectButton) {
        let todoItem = selectButton.closest('.todo-item');
        todoItem.classList.toggle('selected');
        saveToLocalStorage();
    }

    if (deleteButton) {
        let todoItem = deleteButton.closest('.todo-item');
        todoItem.remove();
        checkViewTodoList();
        saveToLocalStorage();
    }
});

todoCreateForm.addEventListener('submit', (event) => {
    event.preventDefault();
    let inputTaskArea = todoCreateForm.querySelector('#input-task-area');
    let todoText = inputTaskArea.value.trim();

    if (todoText) {
        let todoItemObj = createTodoItemObj(todoText);
        createTodoItem(todoItemObj);
        inputTaskArea.value = '';
        todoCreateForm.style.display = 'none';
        checkViewTodoList();
    }
});

buttonAdd.addEventListener('click', () => {
    todoList.style.display = 'none';
    emptyState.style.display = 'none';
    todoCreateForm.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
    todoCreateForm.querySelector('#input-task-area').focus();
});

function createTodoItemObj(todoText, checked = false) {
    return {
        text: todoText,
        checked
    };
}

function checkStatus(todoItem) {
    return todoItem.classList.contains('selected');
}

function saveToLocalStorage() {
    let todoItems = Array.from(todoList.children).map(todoItem => {
        return {
            text: todoItem.querySelector('.todo-item__text').textContent,
            checked: checkStatus(todoItem)
        };
    });
    localStorage.setItem('todoItems', JSON.stringify(todoItems));
}

function loadFromLocalStorage() {
    let todoItemsString = localStorage.getItem('todoItems');
    if (todoItemsString) {
        let todoItems = JSON.parse(todoItemsString);
        todoItems.forEach(todoItemObj => {
            createTodoItem(todoItemObj);
        });
    }
}

function checkViewTodoList() {
    if (todoList.children.length === 0) {
        emptyState.style.display = 'flex';
        todoList.style.display = 'none';
    } else {
        emptyState.style.display = 'none';
        todoList.style.display = 'flex';
    }
}

loadFromLocalStorage();
checkViewTodoList();
