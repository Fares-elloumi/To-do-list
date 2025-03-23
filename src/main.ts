import './style.css'

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

const todoListElement = document.getElementById('todo-list') as HTMLUListElement;
const todoInputElement = document.getElementById('todo-input') as HTMLInputElement;
const addButtonElement = document.getElementById('add-button') as HTMLButtonElement;
const clearButtonElement = document.getElementById('clear-button') as HTMLButtonElement;

let todos: Todo[] = [];


function loadTodos(): void {
  const storedTodos = localStorage.getItem('todos');
  if (storedTodos) {
      todos = JSON.parse(storedTodos);
  }
}

// Spara todos till LocalStorage
function saveTodos(): void {
  localStorage.setItem('todos', JSON.stringify(todos));
}

// Rendera todos i listan
function renderTodos(): void {
  todoListElement.innerHTML = '';
  todos.forEach(todo => {
    const li = document.createElement('li');
    li.classList.add('todo-item'); 
    if (todo.completed) {
      li.classList.add('completed');
    }
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.completed;
    
    checkbox.addEventListener('click', () => {
      todo.completed = checkbox.checked;
      // if (todo.completed) {
      //   li.classList.add('completed');
      // }else {
      //   li.classList.remove('completed');
      // }
      saveTodos();
      renderTodos();
    });

    
    const textNode = document.createTextNode(todo.text);

    // Skapa en container för text och checkbox
    const textContainer = document.createElement('div');
    textContainer.classList.add('todo-text-container');
    textContainer.appendChild(checkbox);
    textContainer.appendChild(textNode);

    li.appendChild(textContainer);

    // Skapa en container för ikoner
    const iconContainer = document.createElement('div');
    iconContainer.classList.add('icon-container');

    const pencilIcon = document.createElement('img');
    pencilIcon.src = 'pencil.svg'; 
    pencilIcon.alt = 'Ändra';
    
    pencilIcon.addEventListener('click', () => {
      const newText = prompt('Ändra uppgiften:', todo.text);
      if (newText !== null) {
        todo.text = newText;
        saveTodos();
        renderTodos();
        updateProgressBar();
      }
    });
    iconContainer.appendChild(pencilIcon);

    const trashIcon = document.createElement('img');
    trashIcon.src = 'trash.svg'; 
    trashIcon.alt = 'Ta bort';
    
    trashIcon.addEventListener('click', () => {
      todos = todos.filter(t => t.id !== todo.id);
      saveTodos();
      renderTodos();
      updateProgressBar();
    });
    iconContainer.appendChild(trashIcon);

    li.appendChild(iconContainer);
    todoListElement.appendChild(li);
  });
updateProgressBar();
}

// Lägg till en ny todo
function addTodo(): void {
  const text = todoInputElement.value.trim();
  if (text) {
      const newTodo: Todo = {
          id: Date.now(), 
          text: text,
          completed: false
      };
      todos.push(newTodo);
      saveTodos();
      renderTodos();
      updateProgressBar();
      todoInputElement.value = ''; 
  }
}

// Rensa hela listan
function clearTodos(): void {
  todos = [];
  saveTodos();
  renderTodos();
  updateProgressBar();
}


addButtonElement.addEventListener('click', addTodo);
clearButtonElement.addEventListener('click', clearTodos);



function updateProgressBar() {
  const totalTodos = todos.length; 
  const completedTodos = todos.filter(todo => todo.completed).length; 
  const progressContainer = document.getElementById('progress-container') as HTMLElement;
  const progressBar = document.getElementById('progress-bar') as HTMLElement;
  const progressText = document.getElementById('progress-text') as HTMLElement;

  // Visa progressbaren bara om det finns uppgifter
  if (totalTodos > 0) {
    progressContainer.style.display = 'block'; 
    const progressPercentage = (completedTodos / totalTodos) * 100;
    progressBar.style.width = `${progressPercentage}%`;
    progressText.textContent = `${completedTodos} av ${totalTodos} slutförda`;
  } else {
    progressContainer.style.display = 'none'; 
  }
}
// Ladda och rendera todos 
loadTodos();
renderTodos();