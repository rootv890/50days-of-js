import questions from './question.json';

const questionEl = document.getElementById( 'question' );
const answersEl = document.getElementById( 'answers' );
const submitButtonEl = document.getElementById( 'submit-button' );
let scoreEl = document.getElementById( 'score' );
let currenQuestionEl = document.getElementById( 'current-question' );

const nextButton = document.getElementById( 'next-button' );
const previousButton = document.getElementById( 'previous-button' );
const finishButton = document.getElementById( 'finish-button' );
const finishEl = document.getElementById( 'finish-modal' );
// Score
let score = 0;

// Question and Answers
let currentQuestionNo = 0;
let userSelectedAnswer = null;


/**
 * Generates new Question
*/
function generateQuestion ( questionNo )
{
  let question = questions[questionNo].question;
  let options = questions[questionNo].answers;
  // Add new Question
  questionEl.textContent = question;

  // Clear Previous Options
  answersEl.innerHTML = '';
  userSelectedAnswer = null;

  // Map the Options into buttons
  options.map( option =>
  {
    const button = document.createElement( 'button' );
    button.classList.add( 'answer' );
    button.textContent = option.answer;

    // Event listener for buttons
    button.addEventListener( 'click', () => optionSelection( button ) );

    // Adding buttons to HTML
    answersEl.appendChild( button );
  } );
}

submitButtonEl.addEventListener( 'click', ( e ) =>
{
  let isCorrect = false;

  // Validate if answer selected
  if ( userSelectedAnswer === null )
  {
    alert( 'Please select answer to submit!' );
    return null;
  }

  // Clear Classes
  userSelectedAnswer.classList.remove( 'correct', 'incorrect' );

  questions[currentQuestionNo].answers.some( ( option ) =>
  {
    if ( option.answer === userSelectedAnswer.textContent && option.correct === true )
    {

      updateScore( 'inc' );
      userSelectedAnswer.classList.add( 'correct' );
      isCorrect = true;
      return true;
    }
  }
  );
  if ( isCorrect === false )
  {
    userSelectedAnswer.classList.add( 'incorrect' );
    updateScore( 'dec' );
  }
  updateQuestion();
  toggleSubmit( true );
} );

generateQuestion( currentQuestionNo );

// Option Selection
function optionSelection ( button )
{

  // Validation
  if ( userSelectedAnswer === button )
  {
    button.classList.remove( 'selected-answer' );
    userSelectedAnswer = null;

  }
  else
  {
    if ( userSelectedAnswer )
    {
      userSelectedAnswer.classList.remove( 'selected-answer' );
    }
    userSelectedAnswer = button;
    button.classList.add( 'selected-answer' );
  }

};


function updateQuestion ()
{
  currenQuestionEl.textContent = currentQuestionNo + 1;
}



function updateScore ( type = 'inc' )
{

  if ( type === 'inc' )
  {
    score++;
  }

  if ( type === 'dec' )
  {
    score--;
  }
  if ( type === 'reset' )
  {
    score = 0;
  }
  if ( type === 'show' )
  {
    console.log( 'Game Finshed, Your Score is', score );

  }
  scoreEl.textContent = score;
}

updateScore( 'reset' );

function toggleSubmit ( disabled = false )
{
  if ( disabled )
  {
    submitButtonEl.disabled = true;
    submitButtonEl.classList.add( 'inactive-button' );
  } else
  {
    submitButtonEl.disabled = false;
    submitButtonEl.classList.remove( 'inactive-button' );
  }
}

// Button Navigation
nextButton.addEventListener( 'click', () => nextQuestion() );
previousButton.addEventListener( 'click', () => previousQuestion() );
finishButton.addEventListener( 'click', () =>
{
  finishQuiz();
} );

const updateButtonState = () =>
{
  if ( currentQuestionNo === 0 )
  {
    previousButton.disabled = true;
    previousButton.classList.add( 'inactive-button' );
  } else
  {
    previousButton.disabled = false;
    previousButton.classList.remove( 'inactive-button' );
  }
  if ( currentQuestionNo === questions.length - 1 )
  {
    nextButton.disabled = true;
    nextButton.classList.add( 'inactive-button' );
  } else
  {
    nextButton.disabled = false;
    nextButton.classList.remove( 'inactive-button' );
  }


  // Finish button


  if ( currentQuestionNo < 10 )
  {
    finishButton.disabled = true;
    finishButton.classList.add( 'hidden' );
  }
  else
  {
    finishButton.disabled = false;
    finishButton.classList.remove( 'hidden' );
  }


};
updateButtonState();


function nextQuestion ()
{
  if ( currentQuestionNo < questions.length - 1 )
  {
    currentQuestionNo++;
    generateQuestion( currentQuestionNo );
    toggleSubmit( false );
    updateButtonState();
    updateQuestion();
  }
}

function previousQuestion ()
{
  if ( currentQuestionNo > 0 )
  {
    currentQuestionNo--;
    generateQuestion( currentQuestionNo );
    toggleSubmit( false );
    updateButtonState();
    updateQuestion();
  }
}

function finishQuiz ()
{
  // disable finish button
  finishButton.disabled = true;
  finishButton.classList.add( 'inactive-button' );
  updateScore( 'show' );
  // Remove all Question and options
  currentQuestionNo = 0;
  updateButtonState();
  updateQuestion();
  finishEl.classList.add( '!flex' );

  // Add P Tag with Score

  const scoreText = document.createElement( 'p' );
  scoreText.innerHTML = `
  <p class='mt-6'>You scored <span class=' font-bold text-2xl bg-black/30 p-4  rounded-full'> ${score}</span>  points</p>
  `;

  const restartButton = document.createElement( 'button' );
  restartButton.classList.add( 'button', 'mt-6' );
  restartButton.innerHTML = `Restart`;
  restartButton.addEventListener( 'click', () =>
  {
    window.location.reload();
  } );

  finishEl.appendChild( scoreText );
  finishEl.appendChild( restartButton );

  // Add restart Quiz
  // Reset Score
  resetScore();

}


function resetScore ()
{
  score = 0;

  updateScore( 'reset' );
}


function play ()
{
  // Initial Setup
  updateButtonState();
  updateQuestion();
  updateScore( 'reset' );

}
play();
