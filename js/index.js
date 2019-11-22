function onAddTodo() {
    let todoText = document.getElementById("todo-input").value;
    if (!todoText) return;
    let todoItem = {
        text: todoText,
        userName: 'Pallavi'
    };

    let xhr = new XMLHttpRequest();

    xhr.onload = function () {
        document.getElementById("todo-input").value = '';
        getTodos();
    };

    xhr.open('POST', 'http://localhost:8080/api/todo');
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(todoItem));
}

function onCompleteTodo(todoItemId) {
    let todoPost = new XMLHttpRequest();

    todoPost.onload = function () {
        getTodos();
    };

    let url = 'http://localhost:8080/api/todo/complete?id=' + todoItemId;

    todoPost.open('POST', url);
    todoPost.send();
}

function onUncompleteTodo(todoItemId) {
    let todoPost = new XMLHttpRequest();

    todoPost.onload = function () {
        getTodos();
    };

    let url = 'http://localhost:8080/api/todo/uncomplete?id=' + todoItemId;

    todoPost.open('POST', url);
    todoPost.send();
}

function onDeleteTodo(todoItemId) {
    let todoDelete = new XMLHttpRequest();

    todoDelete.onload = function () {
        getTodos();
    };

    let url = 'http://localhost:8080/api/todo/delete?id=' + todoItemId;

    todoDelete.open('POST', url);
    todoDelete.send();
}

function removeChildren(elem) {
    while (elem.firstChild) {
        elem.removeChild(elem.firstChild);
    }
}

function addCompleteButton(todoItem, td) {
    let doneButton;

    if (todoItem.done) {
        doneButton = document.createElement("button");
        doneButton.appendChild(document.createTextNode("Completed"));
        doneButton.className = "button complete-button";
        doneButton.addEventListener("click", () => onUncompleteTodo(todoItem.id), false);

    } else {
        doneButton = document.createElement("button");
        doneButton.appendChild(document.createTextNode("Complete"));
        doneButton.className = "button incomplete-button";
        doneButton.addEventListener("click", () => onCompleteTodo(todoItem.id), false);
    }

    td.appendChild(doneButton);
}

function addDeleteButton(todoItem, td) {
    let deleteButton = document.createElement("button");
    deleteButton.appendChild(document.createTextNode("Delete"));
    deleteButton.className = "button delete-button";
    deleteButton.addEventListener("click", () => onDeleteTodo(todoItem.id), false);

    td.appendChild(deleteButton);
}

function humantime(unix_time) {
    let dt = new Date(unix_time * 1000);
    let hr = dt.getHours();
    let m = "0" + dt.getMinutes();
    let s = "0" + dt.getSeconds();
    return hr + ':' + m.substr(-2) + ':' + s.substr(-2);
}

function getTodos() {
    let todoGet = new XMLHttpRequest();

    todoGet.onload = function () {
        if (todoGet.status >= 200 && todoGet.status < 300) {

            let response = JSON.parse(todoGet.response);

            let table = document.getElementById("todo-table");
            removeChildren(table);

            response.forEach(function (todoItem) {

                let tr = document.createElement("tr");
                let td = document.createElement("td");
                let firstdiv = document.createElement("div");
                firstdiv.className = "spread wraptext";

                let textDiv = document.createElement("div");
                textDiv.className = "maxit";
                textDiv.appendChild(document.createTextNode(todoItem.text));
                firstdiv.appendChild(textDiv);

                let buttons = document.createElement("div");
                firstdiv.appendChild(buttons);


                addCompleteButton(todoItem, buttons);
                addDeleteButton(todoItem, buttons);

                let details = document.createElement("div");
                details.className ="details";
                let created = document.createElement("time");
                created.appendChild(document.createTextNode(humantime(todoItem.created)));
                details.appendChild(created);

                let username = document.createElement("div");
                username.className = "username";
                username.appendChild(document.createTextNode(todoItem.userName));
                details.append(username);

                td.appendChild(firstdiv);
                td.appendChild(details);

                tr.appendChild(td);

                table.appendChild(tr);
            });


        } else {
            console.log('The request failed!');
        }
    };

    todoGet.open('GET', 'http://localhost:8080/api/todos');
    todoGet.send();
}

document.addEventListener('DOMContentLoaded', (event) => {
    getTodos();
});
