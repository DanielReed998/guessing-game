function Game() {
    this.playersGuess = null;
    this.pastGuesses = [];
    this.winningNumber = generateWinningNumber();
}

Game.prototype.playersGuessSubmission = function(input) {
    if (input >= 1 && input <= 100 && typeof input === 'number') {
        this.playersGuess = input;
        return this.checkGuess(input);
    } else {
        throw 'That is an invalid guess.';
    }
}

Game.prototype.checkGuess = function(input) {
    if (input === this.winningNumber) {
        return 'You Win!';
    }
    if (this.pastGuesses.indexOf(input) !== -1) {
        return 'You have already guessed that number.';
    }
    this.pastGuesses.push(input);
    if (this.pastGuesses.length >= 5) {
        return 'You Lose.'
    }

    var difference = this.difference();
    if (difference < 10) {
        return 'You\'re burning up!';
    }
    if (difference < 25) {
        return 'You\'re lukewarm.';
    }
    if (difference < 50) {
        return 'You\'re a bit chilly.';
    }
    return 'You\'re ice cold!';
}

Game.prototype.difference = function() {
    return Math.abs(this.playersGuess - this.winningNumber);
}

Game.prototype.isLower = function() {
    return (this.playersGuess - this.winningNumber) < 0;
}

Game.prototype.provideHint = function() {
    var hintArray = [this.winningNumber, generateWinningNumber(), generateWinningNumber()];
    return shuffle(hintArray);
}

var generateWinningNumber = function() {
    return Math.floor(Math.random() * 100) + 1;
}

var newGame = function() {
    return new Game();
}

var shuffle = function(arr) {
    //Original solution, but it shuffles in a different way than the 
    //provided Fullstack solution, so it doesn't pass the specs:
    // 
    // var temp = arr;
    // var sArr = [];
    // while (temp.length > 0) {
    //     var rIndex = Math.floor(Math.random() * temp.length);
    //     sArr.push(temp[rIndex]);
    //     temp.splice(rIndex, 1);
    // }
    // return sArr;

    for (var i = arr.length - 1; i > 0; i--) {
        var randomIndex = Math.floor(Math.random() * (i + 1));
        var temp = arr[i];
        arr[i] = arr[randomIndex];
        arr[randomIndex] = temp;
    }
    return arr;
}

$(document).ready(function() {
    $('#hint-box').hide();
    var hintButtonPressed = false;

    var game = new Game();
    var submission = 0;

    function submitValue() {
        $('#hint-box').hide();
        $('h2').hide();

        submission = +$('#player-input').val();
        var gameMessage = game.playersGuessSubmission(submission);
        $('h1').text(gameMessage);

        if (gameMessage !== 'You have already guessed that number.') {
            var liIndex = game.pastGuesses.length;
            $('#guesses li:nth-child(' + liIndex + ')').text(submission);

            var lowOrHigh = game.isLower() ? 'Guess higher!' :
                'Guess lower!';
            $('h2').show();
            $('h2').text(lowOrHigh);
        }

        if (gameMessage === 'You Lose.' || gameMessage === 'You Win!') {
            $('h2').show();
            $('h2').text('Hit the reset button to start over.');
            $('#submit-button, #hint-button').prop('disabled', true);
        }
    }

    $('#submit-button').on('click', submitValue);
    $('#player-input').keypress(function(e) {
        if (e.which === 13) {
            submitValue();
        }
    });

    $('#reset-button').on('click', function() {
        game = newGame();
        $('#headers').find('h1').text('Guessing Game!');
        $('#headers').find('h2').text('Guess a number between 1 and 100');
        $('#headers').find('h2').show();
        $('#guesses li').text('--');
        $('#player-input').val('');
        $('#submit-button, #hint-button').prop('disabled', false);
        $('#hint-button').text('Hint(1)');
    });

    $('#hint-button').on('click', function() {
        var hints = game.provideHint().join(', ');
        $('#hint-box').show();
        $('#hint-box').text(hints);
        $('#hint-box').fadeOut(4000);
        $('#hint-button').prop('disabled', true);
        $('#hint-button').text('Hint(0)');
    });
});