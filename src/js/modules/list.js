const listTodo = (todos) => {
  const ul = document.querySelector('ul');
  for(let todo of todos) {
    let li = document.createElement('li');
    li.classList.add("todo-item");

    let span = document.createElement('span');
    span.classList.add('todo-text', 'flex-grow');
    span.innerHTML = todo.title;

    let div = document.createElement("div");
    div.classList.add('todo-icon');

    let deleteDiv = document.createElement("div");
    div.classList.add("delete-todo");
    
    

    ul.append(li);
    li.append(div, span, deleteDiv);
  }
};

export default listTodo