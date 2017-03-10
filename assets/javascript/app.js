var questions ={}; // holds question, use opentdb api to populate

var game ={
	results: [], //true/false array of player answers
	interval: {},

	//methods
	new: function(){
		//clear
		this.results = [];
		$('#question').empty();
		$('.choice').empty();

		//new questions from api
		getQuestions();

		//start timer
		$('#timer').slideDown(800);

		//show question
		nextQuestion();
	},
	resetTimer: function(seconds) {
		this.clearTimer();
		$('#timer p').text(seconds); //timer
		this.interval = setInterval(countdown, 1000);
	},
	clearTimer: function(){
		clearInterval(this.interval);
	},
	correct: function(){
		this.results.push(true);
	},
	incorrect: function(){
		this.results.push(false);
	}
};


$(document).ready(function(){

	//player clicks start
	$('#intro button').on('click', function(){
		$('#intro').fadeOut(200);
		game.new();
	});	
}); 



//==== FUNCTIONS ====

function getQuestions(){
	var url = 'https://opentdb.com/api.php?amount=10&category=23&difficulty=easy&type=multiple'

	$.ajax({
		url: url,
		method: 'GET'
	}).done(function(response){
		questions = response.results;
	});
}

function nextQuestion(){
	//hide
	$('#card').fadeOut();

	//populate next question

	//rest timer for question
	game.resetTimer(20);

}

function countdown(){
	var remaining = $('#timer p').text();

	if(remaining >= 1){
		remaining--;
	}
	$('#timer p').text(remaining);

	if(remaining <= 0){
		console.log(false); //out of time
		game.clearTimer();
	}
}