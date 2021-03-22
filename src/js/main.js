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

const closeButtons = document.querySelectorAll(".delete-todo"),
  todoListContainer = document.querySelector(".todo-list"),
  tabsTodoList = document.querySelectorAll("ul");

// ======= ID =======

const createID = () => {
  let id = +localStorage.getItem("idTodo");
  return function () {
    id++;
    localStorage.setItem("idTodo", id.toString());
    return id;
  };
};

const setID = createID();

// ======= WORKING WITH TODOS =======

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
  let img = document.createElement("img"),
    pencilImg = document.createElement("img");

  deleteDiv.classList.add("delete-todo");
  img.classList.add("delete-img");
  img.setAttribute("src", "./src/assets/icons/close.png");

  pencilImg.classList.add("pencil-img");
  pencilImg.setAttribute("src", "./src/assets/icons/pencil.png");

  elemUl.prepend(li);
  li.prepend(containerDiv);
  containerDiv.append(div, span, deleteDiv);
  div.append(input);
  deleteDiv.append(pencilImg);
  deleteDiv.append(img);
};

const countTodos = () => {
  let countElement = document.querySelector(".ltd-button");

  if (count === 1) {
    countElement.textContent = count + " todo item";
  } else {
    countElement.textContent = count + " todo items";
  }
};

// +++++++++
const addingTodo = () => {
  const input = document.querySelector(".input"),
    inputIcon = document.querySelector('.input-add-img');

  const addTodo = (event) => {
    event.preventDefault();

    let inputValue = event.target.closest('form').querySelector("input").value;

    createTodo(inputValue, false, todos.length + 1, tabsTodoList[0]);
    createTodo(inputValue, false, todos.length + 1, tabsTodoList[1]);

    todos.push({
      id: setID(),
      title: inputValue,
      completed: false,
    });

    event.target.closest("form").querySelector("input").value = "";
    localStorage.setItem("todos", JSON.stringify(todos));

    count++;
    countTodos();
  };

  input.addEventListener("submit", addTodo);
  inputIcon.addEventListener('click', addTodo);
};

// +++++++++
const deletingTodo = () => {
  const deleteTodo = (event) => {
    if (!event.target.classList.contains("delete-img")) {
      return;
    }

    todos = todos.filter(
      (todo) => todo.id != event.target.closest(".todo-item").dataset.id
    );

    tabsTodoList.forEach((list) => (list.innerHTML = ""));
    listTodo(todos);

    localStorage.setItem("todos", JSON.stringify(todos));

    count--;
    if (todos.length === count) {
      countTodos();
    } else {
      count++;
    }
  };

  todoListContainer.addEventListener("mousedown", deleteTodo);
};

// +++++++++
const checkingTodo = () => {
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

  todoListContainer.addEventListener("change", checkedTodo);
};

// ++++++++++
const editingTodo = () => {
  const editTodo = (event) => {
    const elem = event.target.closest('.todo-item').querySelector('.todo-text');
    
    const imgArea = elem.closest('.todo-item').querySelector('.delete-img');
    let textarea = document.createElement("div");
    const firsValue = elem.textContent;
    const pencilImg = imgArea.parentNode.querySelector('.pencil-img');

    pencilImg.style.display = 'none';

    console.log(imgArea, firsValue);

    textarea.textContent = elem.textContent;
    textarea.classList.add("input-edit", "todo-text-input");
    textarea.setAttribute("contenteditable", "true");

    elem.textContent = "";
    elem.append(textarea);

    imgArea.classList.replace("delete-img", "edit-img");
    imgArea.setAttribute("src", "./src/assets/icons/edit.png");

    const submitEditTodo = () => {
      if (textarea.textContent !== firsValue) {
        elem.textContent = textarea.textContent;

        todos.map((todo) => {
          if (todo.id == elem.closest(".todo-item").dataset.id) {
            todo.title = textarea.textContent;
          }
        });

        tabsTodoList.forEach((todoList) => (todoList.innerHTML = ""));
        listTodo(todos);

        localStorage.setItem("todos", JSON.stringify(todos));
      } else {
        elem.textContent = firsValue;
      }

      textarea.remove();
      imgArea.classList.replace("edit-img", "delete-img");
      imgArea.setAttribute("src", "./src/assets/icons/close.png");

      imgArea.addEventListener("click", null);
      pencilImg.style.display = 'block';
    };

    const pressEnter = (event) => {
      if (event.code !== "Enter") {
        return;
      }
      console.dir(event);
      submitEditTodo();
      document.removeEventListener("keyup", pressEnter);
    };

    document.addEventListener("keyup", pressEnter);

    imgArea.addEventListener("click", (e) => {
      if (
        !e.target.classList.contains("edit-img") ||
        e.target.classList.contains("delete-img")
      ) {
        return;
      }

      submitEditTodo();
      pencilImg.style.display = "block";
      document.removeEventListener("keyup", pressEnter);
    });

    document.body.addEventListener("mousedown", (e) => {
      if (
        e.target.classList.contains("input-edit") ||
        e.target.classList.contains("edit-img")
      ) {
        return;
      }

      elem.textContent = firsValue;
      textarea.remove();

      imgArea.classList.replace("edit-img", "delete-img");
      imgArea.setAttribute("src", "./src/assets/icons/close.png");

      document.removeEventListener("keyup", pressEnter);
      pencilImg.style.display = "block";
    });
  };

  todoListContainer.addEventListener("dblclick", (event) => {
    if (event.target.tagName !== "SPAN") {
      return;
    }
    editTodo(event);
  });

  todoListContainer.addEventListener('touchend', (event) => {
    if(event.target.classList.contains('pencil-img')) {
      event.preventDefault();
      editTodo(event);
    }
  });
};

// tabs
// +++++++++
const tabs = () => {
  const tabsButtonsContainer = document.querySelector(".ltd-button-tabs"),
    tabsButtons = document.querySelectorAll(".button");

  const createTabs = (event) => {
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

  tabsButtonsContainer.addEventListener("click", createTabs);
};

window.addEventListener("DOMContentLoaded", () => {
  listTodo();
  addingTodo();
  deletingTodo();
  checkingTodo();
  editingTodo();
  tabs();
});
