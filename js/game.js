const question = document.getElementById('question');
const choices = Array.from(document.getElementsByClassName('choice-text'));
const progressText = document.getElementById('progressText');
const scoreText = document.getElementById('score');;
const progressBarFull = document.getElementById('progressBarFull');
const loader = document.getElementById('loader');
const game = document.getElementById('game');
const choiceContainer = document.querySelector(".choice-container").children;


let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];

let questions = [];
fetch("json/question.json").then(res =>{
    return res.json();
})
.then(loadedQuestions =>{
    console.log(loadedQuestions);
    questions = loadedQuestions;
    startGame();
})
.catch(err =>{
    console.error(err);
});


//CONSTANTS
const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 6;

//set all fields to 0 at start of game
//use spread operator ()...) take the array spread ut each of its item into a new array
startGame = () => {
    questionCounter = 0;
    score = 0;
    availableQuestions = [...questions];
    // console.log(availableQuestions);
    getNewQuestion();
}

getNewQuestion = () => {
    if(availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS){
        localStorage.setItem('mostRecentScore', score);
        //go to the end page
        return window.location.assign("/end.html");
    }
    questionCounter++;
    progressText.innerText = `Question ${questionCounter}/ ${MAX_QUESTIONS}`;

    //Update the progress bar
    progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];
    question.innerText = currentQuestion.question;

//fetch choices -- iterate 
    choices.forEach(choice => {
        const number = choice.dataset["number"];
        choice.innerText = currentQuestion["choice" + number];
    });

    //this gets rid of questions weve already used
    availableQuestions.splice(questionIndex, 1);

    acceptingAnswers = true;
};
//getting random questions using the math.random & math.floor
//asign question inerhtml to current question

choices.forEach(choice => {
    choice.addEventListener("click", e => {
        if(!acceptingAnswers) return;

        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset["number"];
       //const correctAns = dataset["number"];


        // const classToApply = 'incorrect';

        // if(selectedAnswer == currentQuestion.answer){
        //     classToApply = 'correct';
        // }
        
       


        //console.log(classToApply);
         const classToApply = selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect';

       
       //console.log(classToApply);

     
       
        
        
         //if answer is correct increase the life score
        if (classToApply === 'correct') {
            incrementScore(CORRECT_BONUS);
        }
        else if(classToApply === 'incorrect'){
            console.log('Wrong answer');
           alert(`${currentQuestion.answer} is the correct answer`);
           currentQuestion.answer.value;

           
        }

        selectedChoice.parentElement.classList.add(classToApply);
        

        // const ans = document.getElementById('ans');
        // ans.parentElement.classList.add(classToApply);

        setTimeout( () => {
             
        selectedChoice.parentElement.classList.remove(classToApply);
        getNewQuestion();
        }, 1000);

        

       
    });
});

//increment the life level
incrementScore = num => {
    score +=num;
    scoreText.innerText = score;
}
