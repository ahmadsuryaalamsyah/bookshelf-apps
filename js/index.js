const todos = JSON.parse(localStorage.getItem('todos')) || [];
const RENDER_EVENT = 'render-todo';
const localStorageKey = 'todos';

const generateId = () => {
  return +new Date();
};

const generateBookObject = (id, title, author, year, isComplete) => {
  return {
    id,
    title,
    author,
    year: Number(year),
    isComplete,
  };
};

const saveToLocalStorage = () => {
  localStorage.setItem(localStorageKey, JSON.stringify(todos));
};

const addBook = () => {
  const title = document.getElementById('inputJudul').value;
  const author = document.getElementById('inputPenulis').value;
  const year = document.getElementById('inputTahun').value;
  const isComplete = document.getElementById('checkbox').checked;
  const generatedID = generateId();
  const bookObject = generateBookObject(generatedID, title, author, year, isComplete);
  const existingBookIndex = todos.findIndex((todo) => todo.id === generatedID);

  if (existingBookIndex !== -1) {
    todos[existingBookIndex] = bookObject;
  } else {
    todos.push(bookObject);
  }

  saveToLocalStorage();
  document.dispatchEvent(new Event(RENDER_EVENT));
};

document.addEventListener('DOMContentLoaded', () => {
  const submit = document.getElementById('form');

  document.getElementById('menu').onclick = () => {
    document.getElementById('menu-main').classList.toggle('hidden');
  };

  submit.addEventListener('submit', function (e) {
    e.preventDefault();
    addBook();
    document.getElementById('inputJudul').value = '';
    document.getElementById('inputPenulis').value = '';
    document.getElementById('inputTahun').value = '';
    document.getElementById('checkbox').checked = false;
    console.log(todos);
    searchUncompletedBooks();
  });
  searchUncompletedBooks();
});

const makeTodo = (todo) => {
  const textTitle = document.createElement('h2');
  textTitle.innerText = todo.title;

  const textAuthor = document.createElement('p');
  textAuthor.innerText = todo.author + ', ';

  const textYear = document.createElement('p');
  textYear.innerText = todo.year;

  const textContainer = document.createElement('div');
  const title = document.createElement('p');
  title.classList.add('text-xl', 'font-Poppins', 'font-semibold');
  title.append(textTitle);
  textContainer.classList.add('flex', 'flex-col', 'mb-2', 'border', 'border-neutral-700', 'p-4', 'rounded-lg');
  const text = document.createElement('div');
  text.classList.add('flex');
  text.append(textAuthor, textYear);
  const textFull = document.createElement('div');
  textFull.append(title, text);

  const container = document.createElement('div');
  container.classList.add('item');
  container.append(textContainer);
  container.setAttribute('id', `todo-${todo.id}`);
  const checkButton = document.createElement('button');
  checkButton.classList.add('check-button', 'py-2', 'px-4', 'rounded-lg', 'bg-green-500', 'hover:bg-green-600', 'text-white');
  const removeButton = document.createElement('button');
  removeButton.classList.add('remove-button', 'py-2', 'px-4', 'rounded-lg', 'bg-red-500', 'hover:bg-red-600', 'text-white');
  const editButton = createEditButton(todo);

  if (todo.isComplete) {
    checkButton.innerText = 'Belum dibaca';
    checkButton.addEventListener('click', function () {
      undoBookFromCompleted(todo.id);
    });

    removeButton.innerText = 'Hapus Buku';
    removeButton.addEventListener('click', function () {
      removeBookFromCompleted(todo.id);
    });
    editButton.addEventListener('click', function () {
      editBook(todo);
    });
    const fullContainer = createFullContainer(textFull, checkButton, removeButton, editButton);
    textContainer.append(fullContainer);
    document.getElementById('completed-todos').appendChild(textContainer);
  } else {
    checkButton.innerText = 'Sudah dibaca';
    checkButton.addEventListener('click', function () {
      addBookToCompleted(todo.id);
    });

    removeButton.innerText = 'Hapus Buku';
    removeButton.addEventListener('click', function () {
      removeBookFromCompleted(todo.id);
    });
    editButton.addEventListener('click', function () {
      editBook(todo);
    });
    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('flex', 'gap-2');
    buttonContainer.append(checkButton, removeButton, editButton);
    const finalContainer = document.createElement('div');
    finalContainer.classList.add('flex', 'justify-between');
    finalContainer.append(textFull, buttonContainer);
    textContainer.append(finalContainer);
    document.getElementById('todos').appendChild(container);
  }

  return container;
};

const addBookToCompleted = (todoId) => {
  const todoTarget = findTodo(todoId);
  if (todoTarget == null) return;
  todoTarget.isComplete = true;
  saveToLocalStorage();
  document.dispatchEvent(new Event(RENDER_EVENT));
};

const undoBookFromCompleted = (todoId) => {
  const todoTarget = findTodo(todoId);
  if (todoTarget == null) return;
  todoTarget.isComplete = false;
  saveToLocalStorage();
  document.dispatchEvent(new Event(RENDER_EVENT));
};

const removeBookFromCompleted = (todoId) => {
  const index = todos.findIndex((todo) => todo.id === todoId);
  if (index !== -1) {
    todos.splice(index, 1);
    saveToLocalStorage();
    document.dispatchEvent(new Event(RENDER_EVENT));
  }
};

const findTodo = (todoId) => {
  return todos.find((todo) => todo.id === todoId);
};

document.addEventListener(RENDER_EVENT, function () {
  const uncompletedTODOList = document.getElementById('todos');
  uncompletedTODOList.innerHTML = '';

  const completedTODOList = document.getElementById('completed-todos');
  completedTODOList.innerHTML = '';

  for (const todoItem of todos) {
    const todoElement = makeTodo(todoItem);
  }
});

function createEditButton(todo) {
  const editButton = document.createElement('button');
  editButton.classList.add('edit-button', 'py-2', 'px-4', 'rounded-lg', 'bg-white', 'border', 'border-neutral-700', 'hover:bg-gray-200', 'text-black');
  editButton.innerText = 'Edit';
  editButton.todoData = todo;
  return editButton;
}

function createFullContainer(textFull, checkButton, removeButton, editButton) {
  const fullContainer = document.createElement('div');
  fullContainer.classList.add('flex', 'justify-between');
  const buttonContainer = document.createElement('div');
  buttonContainer.classList.add('flex', 'gap-2');
  buttonContainer.append(checkButton, removeButton, editButton);
  fullContainer.append(textFull, buttonContainer);
  return fullContainer;
}

function editBook(todo) {
  const editedTitle = prompt('Masukkan Judul Baru:', todo.title);
  const editedAuthor = prompt('Masukkan Penulis Baru:', todo.author);
  const editedYear = prompt('Masukkan Tahun Baru:', todo.year);
  if (editedTitle === null || editedAuthor === null || editedYear === null) {
    return;
  }

  todo.title = editedTitle;
  todo.author = editedAuthor;
  todo.year = editedYear;

  document.dispatchEvent(new Event(RENDER_EVENT));
}

function searchUncompletedBooks() {
  const searchInput = document.getElementById('searchUncompletedInput').value.toLowerCase();
  const filteredUncompletedTodos = todos.filter((todo) => !todo.isComplete && todo.title.toLowerCase().includes(searchInput));

  document.getElementById('todos').innerHTML = '';

  for (const todoItem of filteredUncompletedTodos) {
    const todoElement = makeTodo(todoItem);
    document.getElementById('todos').appendChild(todoElement);
  }
}
