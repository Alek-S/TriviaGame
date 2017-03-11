//==== GLOBAL VARIABLES ====

//==== MAIN ====
$(document).ready(function(){
	// cache
	$card = $('#card');
	$question = $('#question');

	var questionList = {}; // use opentdb api to populate with history questions, see getQuestions()

	var game ={
		results: [], // A true/false array of player answer history, true - answered right, false - for wrong
		interval: {}, //used for interval timer
		currentQuestion: function(){
			return this.results.length
		},

		//methods
		new: function(){
			//clear
			this.results = [];
			$('#question').empty();
			$('.choice').empty();

			//new questions from api
			getQuestions(nextQuestion);

			//show timer
			$('#timer').slideDown(800); //timer started within nextQuestion()

			//show question
			// nextQuestion();
		},
		resetTimer: function(seconds) {
			this.clearTimer(); 
			$('#timer p').text(seconds); //timer text
			this.interval = setInterval(countdown, 1000);
		},
		clearTimer: function(){
			clearInterval(this.interval);
		},
	};

	//player clicks start
	$('#intro button').on('click', function(){
		$('#intro').fadeOut(200);
		game.new();
	});	




	//==== FUNCTIONS ====

	function getQuestions(callback){ //get 10 history questions from opentdb api
		var url = 'https://opentdb.com/api.php?amount=10&category=23&difficulty=easy&type=multiple'

		$.ajax({
			url: url,
			method: 'GET'
		}).done(function(response){
			questionList = response.results;
			callback();
		});
	}

	function nextQuestion(){
		var answerList = [];
		var correctAnswer = questionList[game.currentQuestion()].correct_answer;
		var correctPosition = Math.floor(Math.random() * 4); //where correct answer goes

		//hide
		$card.hide();

		//what question are we on - show on card header
		$('h2').text('Question #' + (game.results.length + 1));

		//populate next question
		$question.text( questionList[game.currentQuestion()].question);

		//add answers to answerList, with correct at answerList[3]
		for (var i = 0; i < 3; i++) {
			answerList.push(questionList[game.currentQuestion()].incorrect_answers[i]);
		}
		answerList.splice( correctPosition ,0, correctAnswer);
		console.log(answerList);

		//show choices
		for (var i = 0; i < 4; i++) {
			$("#" + i).text( answerList[i])
		}

		//add class to correct answer
		$("#" + correctPosition).addClass("correct");
		
		//show
		$('#card').slideDown();

		//rest timer for question
		game.resetTimer(15);

	}

	function countdown(){
		var remaining = $('#timer p').text();

		if(remaining >= 1){
			remaining--;
		}
		$('#timer p').text(remaining);

		if(remaining <= 0){
			console.log('times up'); //out of time
			game.clearTimer();
		}
	}

}); //.ready done