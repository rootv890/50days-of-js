// Get the todos list and count display
const todos = document.querySelector( '.todos' );
const totalTodos = document.querySelector( '.total-todos' );
const completedTodos = document.querySelector( '.completed-todos' );

const addBtn = document.querySelector( '.add-btn' );
const todoForm = document.querySelector( '#todo-form' );

function generateTodo ( task )
{
  const li = document.createElement( 'li' );
  li.classList.add( 'todo' );

  // Create and append label, input (checkbox), and delete button
  const label = document.createElement( 'label' );
  label.innerText = task;

  const checkbox = document.createElement( 'input' );
  checkbox.type = 'checkbox';

  const deleteBtn = document.createElement( 'button' );
  deleteBtn.innerHTML = `<span><img src='/delete.svg' alt='delete icon'/></span>`;
  deleteBtn.classList.add( 'delete-btn', 'btn' );

  checkbox.onchange = ( event ) =>
  {
    completedTodosCount();

    if ( event.target.matches( 'input[type="checkbox"]' ) )
    {
      const checkbox = event.target;
      if ( checkbox.checked )
      {
        label.classList.add( 'todo-complete' );
        moveTodoToEnd( li );
      } else
      {
        label.classList.remove( 'todo-complete' );
      }
    }
    saveToLocalStorage(); // Save on checkbox change
  };

  deleteBtn.addEventListener( 'click', () =>
  {
    console.log( 'Delete button clicked for:', label.innerText );
    li.remove();
    updateCount();
    saveToLocalStorage(); // Update localStorage when deleting
  } );

  // Append all elements to the li
  li.appendChild( label );
  li.appendChild( checkbox );
  li.appendChild( deleteBtn );

  // Insert the new li at the top of the todo list
  todos.insertBefore( li, todos.firstChild );
}

// Event listener to handle the add button click
function addTodo ( e )
{
  e.preventDefault();

  const todo = todoForm.elements['task'].value.trim();

  if ( !todo )
  {
    alert( 'Todo can\'t be empty' );
    return;
  }

  // Create the new todo item
  generateTodo( todo );
  saveToLocalStorage(); // Save to localStorage after adding
  updateCount();
}

addBtn.addEventListener( 'click', ( e ) => addTodo( e ) );

function updateCount ()
{
  const currTodos = document.querySelectorAll( '.todo' );
  console.log( currTodos.length );
  totalTodos.textContent = `${currTodos.length}`;
}

function completedTodosCount ()
{
  const checkedCheckboxes = document.querySelectorAll( '.todo input[type="checkbox"]:checked' );
  completedTodos.innerHTML = checkedCheckboxes.length;
}

function moveTodoToEnd ( todoItem )
{
  todos.appendChild( todoItem );
}

// Initialize count and load existing todos
loadTodosFromLocalStorage();
updateCount();

// LocalStorage todo
function saveToLocalStorage ()
{
  const todoElements = document.querySelectorAll( '.todo' );
  const todoArray = Array.from( todoElements ).map( todo =>
  {
    // Store name and checked status
    const label = todo.querySelector( 'label' ).innerText;
    const checkbox = todo.querySelector( 'input[type="checkbox"]' ).checked;
    return { label, completed: checkbox };
  } );

  localStorage.setItem( 'todos', JSON.stringify( todoArray ) );
}

function loadTodosFromLocalStorage ()
{
  const todosFromStorage = localStorage.getItem( 'todos' );
  if ( todosFromStorage )
  {
    const todosArray = JSON.parse( todosFromStorage );
    todosArray.forEach( todo =>
    {
      generateTodo( todo.label );
      // Set checkbox state
      if ( todo.completed )
      {
        const checkbox = todos.querySelector( 'input[type="checkbox"]' );
        checkbox.checked = true;
        checkbox.onchange( { target: checkbox } ); // Trigger change event
      }
    } );
    updateCount();
  }
}
