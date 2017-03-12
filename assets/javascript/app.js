
$(document).ready(function(){
	
	// Cache
	var $card = $('#card');
	var $question = $('#question');
	var $timer = $('#timer');
	var $reportCard = $("#reportCard");
	var $results = $("#results");
	var $choiceResult = $('#choiceResult'); 

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
			questionList = {};
			this.results = [];
			$('#question').empty();
			$('.choice').empty();

			//new questions from api
			getQuestions(nextQuestion);

			//show timer
			$timer.slideDown(800); //timer started within nextQuestion()
		},
		resetTimer: function(seconds) {
			this.clearTimer(); 
			$timer.removeClass()
			$timer.addClass('normal')
			$('#timer p').text(seconds); //timer text
			this.interval = setInterval(countdown, 1000);
		},
		clearTimer: function(){
			clearInterval(this.interval);
		},
	};

	//==== CLICK EVENTS ====

	//player clicks start on intro screen
	$('#startBtn').on('click', function(){
		$('#intro').fadeOut(200);
		game.new();
	});	

	//player picks an answer
	$(".choice").on('click',function(){
		var correctAnswer = questionList[ game.results.length ].correct_answer;
		var playerAnswer= $(this).text();

		//stop counting down
		game.clearTimer();

		//show choice result
		if(playerAnswer === correctAnswer){
			console.log("Correct");
			game.results.push(true);
			$choiceResult.text("Correct!").addClass("correctChoice");
		}else{
			console.log("Incorrect");
			game.results.push(false);
			$choiceResult.text("Incorrect.  ( Answer: " + correctAnswer + ")").addClass("incorrectChoice");
		}

		$choiceResult.fadeIn(200);

		//3 second timeout
		setTimeout(function(){
			nextQuestion();
		},3000)
	});

	//player clicks retry button on the results screen
	$('#retryBtn').on('click',function(){
		$reportCard.hide();
		$results.empty();
		game.new()
	});


	//==== FUNCTIONS ====

	function getQuestions(callback){ 

		//get 10 history questions from opentdb api
		var url = 'https://opentdb.com/api.php?amount=10&category=23&difficulty=easy&type=multiple'
		console.log('API URL Request:', url)
		
		$.ajax({
			url: url,
			method: 'GET'
		}).done(function(response){
			questionList = response.results;
			callback();
		});
	}

	function nextQuestion(){
		if(game.results.length >= 10){
			console.log('no more questions');
			reportCard();
		}

		//reset card
		$card.hide();
		$choiceResult.removeClass();
		$choiceResult.empty();
		$choiceResult.hide();
		

		if(game.results.length < 10){
			var answerList = [];
			var correctAnswer = questionList[game.currentQuestion()].correct_answer;
			var correctPosition = Math.floor(Math.random() * 4); //where correct answer goes

			//what question are we on - show on card header
			$('#card h2').text('Question #' + (game.results.length + 1));

			//populate next question
			$question.html( questionList[game.currentQuestion()].question);

			//add answers to answerList, with correct at answerList[3]
			for (var i = 0; i < 3; i++) {
				answerList.push(questionList[game.currentQuestion()].incorrect_answers[i]);
			}
			answerList.splice( correctPosition ,0, correctAnswer);

			//show choices
			for (var i = 0; i < 4; i++) {
				$("#" + i).html( answerList[i])
			}

			//add class to correct answer
			$("#" + correctPosition).addClass("correct");
			
			//show
			$('#card').slideDown();

			//rest timer for question
			game.resetTimer(15);
		}
	}

	function countdown(){
		var remaining = $('#timer p').text();

		if(remaining >= 1){
			remaining--;
		}
		$('#timer p').text(remaining);

		if(remaining == 11){
			$timer.removeClass();
			$timer.addClass('warning');
		}
		if(remaining == 6){
			$timer.removeClass();
			$timer.addClass('critical');
		}

		if(remaining <= 0){
			console.log('times up'); //out of time
			game.clearTimer();
			game.results.push(false);
			
			$choiceResult.text("Times Up.  ( Answer: " + questionList[ game.results.length - 1].correct_answer + ")")
			.addClass("incorrectChoice");;
			
			$choiceResult.fadeIn(200);

			//3 second timeout
			setTimeout(function(){
				nextQuestion();
			},3000)
		}
	}

	function reportCard(){
		game.clearTimer();
		$card.hide();
		$timer.hide();

		var correct = 0;
		var $total = $("<div>").addClass('total')

		for(var i = 0; i < game.results.length; i++){
			var $questionDiv = $("<div>").addClass('q' + (i+1)).addClass('questionResult');

			//build div for each question and if they answered correctly
			$questionDiv.html('<strong>Question #' + (i+1) + ":</strong> " 
				+  booleanToString( game.results[i] ) );

			$results.append($questionDiv);

			//track total correct/incorrect
			if(game.results[i] === true){
				correct++;
			};
		}

		$total.html('<strong>Grade:</strong> ' + ((correct / game.results.length)*100) + '%');
		$results.append($total);

		//show reportcard 
		$reportCard.slideDown();

	}

	//convert true/false to string of correct/incorrect
	function booleanToString(boolean){
		if(boolean === true){
			return 'Correct';
		}else{
			return 'Incorrect';
		}
	}
}); //.ready done













