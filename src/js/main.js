// import listTodo from './modules/list'
let todos; 
if (localStorage.getItem("todos")) {
  todos = JSON.parse(localStorage.getItem("todos"));
} else {
  todos = [];
  localStorage.setItem("idTodo", "0");
}

let count = 0;
count = todos.length;

const input = document.querySelector(".input"),
  closeButtons = document.querySelectorAll(".delete-todo"),
  tabsButtons = document.querySelectorAll(".button"),
  todoListContainer = document.querySelector(".todo-list"),
  tabsButtonsContainer = document.querySelector(".ltd-button-tabs"),
  tabsTodoList = document.querySelectorAll("ul");

// ======= ID =======

const createID = () => {
  let id = +localStorage.getItem('idTodo');
  return function() {
    id++;
    localStorage.setItem('idTodo', id.toString());
    return id;
  }
};

const setID = createID();


// ======= WORKING WITH TODOS =======

const createTodo = (title, completed, id, elemUl) => {

  let li = document.createElement("li");
  li.classList.add("todo-item");
  li.setAttribute("data-id", id);

  let containerDiv = document.createElement("div");
  containerDiv.classList.add("todo-item--inner");

  let div = document.createElement("div");
  div.classList.add("todo-icon");

  let span = document.createElement("span");
  span.classList.add("todo-text", "flex-grow");
  span.innerHTML = title;

  let input = document.createElement("input");
  input.setAttribute("type", "checkbox");

  input.checked = completed;
  if (completed) {
    li.classList.add("checked");
  }

  let deleteDiv = document.createElement("div");
  let img = document.createElement('img');
  deleteDiv.classList.add("delete-todo");
  img.classList.add('delete-img');
  img.setAttribute("src", "./assets/icons/close.svg");

  elemUl.prepend(li);
  li.prepend(containerDiv);
  containerDiv.append(div, span, deleteDiv);
  div.append(input);
  deleteDiv.append(img);
};

const checkedTodo = (event) => {
  const input = event.target;
  if (
    input.tagName !== "INPUT" ||
    input.classList.value.includes("input-edit")
  ) {
    return;
  }

  input.closest(".todo-item").classList.toggle("checked");

  const id = input.closest(".todo-item").dataset.id;
  todos.map((item) => {
    if (item.id == id) {
      item.completed = !item.completed;
    }
    return item;
  });

  tabsTodoList.forEach((list) => (list.innerHTML = ""));

  localStorage.setItem("todos", JSON.stringify(todos));
  listTodo(todos);
};

const countTodos = () => {
  let countElement = document.querySelector(".ltd-button");

  if (count === 1) {
    countElement.textContent = count + " item left";
  } else {
    countElement.textContent = count + " items left";
  }
};

const addTodo = (event) => {
  event.preventDefault();

  let inputValue = event.target.querySelector("input").value;
  createTodo(inputValue, false, todos.length + 1, tabsTodoList[0]);
  createTodo(inputValue, false, todos.length + 1, tabsTodoList[1]);
  event.target.querySelector("input").value = "";

  todos.push({
    id: setID(),
    title: inputValue,
    completed: false,
  });

  localStorage.setItem('todos', JSON.stringify(todos));

  count++;
  countTodos();
};

const deleteTodo = (event) => {
  if (event.target.classList.value === "delete-img") {
    todos = todos.filter(
      (todo) => todo.id != event.target.closest(".todo-item").dataset.id
    );

    tabsTodoList.forEach((list) => list.innerHTML = "");
    listTodo(todos);

    localStorage.setItem('todos', JSON.stringify(todos));
    count--;
    countTodos();
  }
};

const listTodo = () => {
  //all
  todos.forEach((todo) => {
    createTodo(todo.title, todo.completed, todo.id, tabsTodoList[0]);
  });

  //active
  todos
    .filter((todo) => !todo.completed)
    .forEach((todo) => {
      createTodo(todo.title, todo.completed, todo.id, tabsTodoList[1]);
    });

  //completed
  todos
    .filter((todo) => todo.completed)
    .forEach((todo) => {
      createTodo(todo.title, todo.completed, todo.id, tabsTodoList[2]);
    });

  countTodos();
};

const editTodo = (event) => {
  const elem = event.target;
  if (elem.tagName !== "SPAN") {
    return;
  }

  let form = document.createElement("form"),
    input = document.createElement("input");

  input.value = elem.textContent;
  input.classList.add('input-edit', 'todo-text-input');
  input.setAttribute("type", "text");

  elem.textContent = "";
  elem.append(form);
  form.append(input);

  form.addEventListener("submit", (e) => {
    if (e.target.tagName !== "FORM") {
      return;
    }

    e.preventDefault();
    elem.textContent = input.value;
    form.remove();

    todos.map(todo => {
      if (todo.id == event.target.closest('.todo-item').dataset.id) {
        todo.title = input.value;

        tabsTodoList.forEach(todoList => todoList.innerHTML = '');
        listTodo(todos);
      }
    });

    localStorage.setItem('todos', JSON.stringify(todos));
  });

  document.body.addEventListener('click', (e) => {
    if (e.target.classList.value.includes('input-edit')) {
      return;
    }
    elem.textContent = input.value;
    form.remove();
  })
};

// tabs
const tabDone = (event) => {
  if (event.target.tagName !== "BUTTON") {
    return;
  }

  tabsButtons.forEach((button) => {
    button.classList.remove("button-active");
  });
  event.target.classList.add("button-active");

  tabsTodoList.forEach((item) => (item.hidden = true));

  const buttonType = event.target.dataset.buttonType;

  tabsTodoList.forEach((item) => {
    if (buttonType == item.dataset.tab) {
      item.hidden = false;
    }
  });
};

window.addEventListener("DOMContentLoaded", () => {
  listTodo();

  input.addEventListener("submit", addTodo);
  todoListContainer.addEventListener("click", deleteTodo);
  todoListContainer.addEventListener("change", checkedTodo);
  todoListContainer.addEventListener("dblclick", editTodo);
  tabsButtonsContainer.addEventListener("click", tabDone);
});

