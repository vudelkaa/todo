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

const listTodo = (tabs = 'allTabs') => {
  //all
  if (tabs === 'allTabs' || tabs !== 'all') {
    tabsTodoList[0].innerHTML = '';
    todos.forEach((todo) => {
      createTodo(todo.title, todo.completed, todo.id, tabsTodoList[0]);
    });
  }

  //active
  if (tabs === 'allTabs' || tabs !== 'active') {
    tabsTodoList[1].innerHTML = '';
    todos.filter((todo) => !todo.completed)
      .forEach((todo) => {
        createTodo(todo.title, todo.completed, todo.id, tabsTodoList[1]);
    });
  }
  //completed
  if (tabs === 'allTabs' || tabs !== 'completed') {
    tabsTodoList[2].innerHTML = '';
    todos.filter((todo) => todo.completed)
      .forEach((todo) => {
        createTodo(todo.title, todo.completed, todo.id, tabsTodoList[2]);
    });
  }

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

  // let input = document.createElement("input");
  // input.setAttribute("type", "checkbox");

  let input = document.createElement("img");
  input.classList.add('checked-img');

  if (completed) {
    input.setAttribute("src", "./src/assets/icons/checked.png");
  } else {
    input.setAttribute("src", "./src/assets/icons/no-checked.png");
  }

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

  // img.addEventListener('mousedown', deleteTodo);
};;

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
    const todoID = setID();

    createTodo(inputValue, false, todoID, tabsTodoList[0]);
    createTodo(inputValue, false, todoID, tabsTodoList[1]);

    todos.push({
      id: todoID,
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

    const tabName = event.target.closest('.todo-list--ul').dataset.tab;
    listTodo(tabName);
    event.target.closest(".todo-item").remove();

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
    console.log(input);

    if (
      !input.classList.contains('checked-img') ||
      input.classList.value.includes("input-edit")
    ) {
      return;
    }

    input.closest(".todo-item").classList.toggle("checked");
    
    if (input.closest(".todo-item").classList.contains('checked')) {
      input.setAttribute("src", "./src/assets/icons/checked.png");
    } else {
      input.setAttribute("src", "./src/assets/icons/no-checked.png");
    }

    const id = input.closest(".todo-item").dataset.id;
    todos.map((item) => {
      if (item.id == id) {
        item.completed = !item.completed;
      }
      return item;
    });

    localStorage.setItem("todos", JSON.stringify(todos));

    const tabName = event.target.closest(".todo-list--ul").dataset.tab;
    listTodo(tabName);
  };

  todoListContainer.addEventListener("click", checkedTodo);
};

// ++++++++++
const editingTodo = () => {
  const editTodo = (event) => {
    const elem = event.target.closest('.todo-item').querySelector('.todo-text');
    
    const imgArea = elem.closest('.todo-item').querySelector('.delete-img');
    let textarea = document.createElement("div");
    let firsValue = elem.textContent;
    const pencilImg = imgArea.parentNode.querySelector('.pencil-img');
    console.log(firsValue, elem.textContent);
    pencilImg.style.display = 'none';

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

        const tabName = elem.closest(".todo-list--ul").dataset.tab;
        listTodo(tabName);

        localStorage.setItem("todos", JSON.stringify(todos));


        console.log('now: ' + textarea.textContent + ' was: ' + firsValue);
      } else {
        elem.textContent = firsValue;
      }

      textarea.remove();
      closeEditTextarea();
    };

    const closeEditTextarea = () => {
      imgArea.classList.replace("edit-img", "delete-img");
      imgArea.setAttribute("src", "./src/assets/icons/close.png");

      if (screen.width <= 768) {
        pencilImg.style.display = "block";
      } else {
        pencilImg.style.display = "none";
      }

      document.removeEventListener("keyup", pressEnter);
      document.removeEventListener('mousedown', mouseDownListener);
      imgArea.removeEventListener("click", clickOnEditImg);
    }

    const pressEnter = (event) => {
      if (event.code !== "Enter") {
        return;
      }
      submitEditTodo();
    };
    document.addEventListener("keyup", pressEnter);

    const clickOnEditImg = (e) => {
      if (
        !e.target.classList.contains("edit-img") ||
        e.target.classList.contains("delete-img")
      ) {
        return;
      }
      submitEditTodo();
    }
    imgArea.addEventListener("click", clickOnEditImg);

    const mouseDownListener = (e) => {
       if (
         e.target.classList.contains("input-edit") ||
         e.target.classList.contains("edit-img")
       ) {
         return;
       }

       elem.textContent = firsValue;
       textarea.remove();

       closeEditTextarea();
    }
    document.addEventListener("mousedown", mouseDownListener);
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
