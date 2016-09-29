$(document).ready(function() {
	console.log("Game Ready");
// BACKGROUND MUSIC FOR PLAYER'S PLEASURE	
var getMoney = document.createElement("audio");
	getMoney.src="LoveMoney.mp3"
	getMoney.volume = .15;
	getMoney.autoPlay = false;
	getMoney.preLoad = false;
	getMoney.loop= true;

getMoney.play();

$("#moneyMoney").on('click', function() {
	getMoney.pause();
});
// SETTING THE CARDS UP 
var Card = function(suit, number) {
	this.cardValue = function() {
		return number;
	};
	// SETTING UP THE SUIT (RANDOM NUMBER WILL GIVE NUMBER 1-4 WHERE EACH NUMBER CORRESPONDS TO A SUIT)
	this.suitUp = function() {
		var suitName = '';
			if(suit == 1) {
				suitName = "&spades;";
			}else if(suit == 2 ) {
				suitName = "&diams;";
			}else if(suit == 3) {
				suitName = "&clubs;";
			}else {
				suitName = "&hearts;";
			}
			return suitName;
	};
	// SETTING THE VALUES OF THE FACE CARDS, 1 IS ACE, 11 JACK, ETC.
	this.getName = function() {
		var cardName = '';
			if(number == 1) {
				cardName = "A";
			}else if(number == 13) {
				cardName = "K";
			}else if(number == 12) {
				cardName = "Q";
			}else if(number == 11) {
				cardName = "J";
			}else {
				cardName = number;
			}
		return cardName + this.suitUp();	
	}
	// MAKING IT SO THAT ALL FACE CARDS HAVE A SCORE OF 10 AND ACE HAS A SCORE OF 11
	this.cardValue = function() {
		var value = number;
		if(number > 10) {
			value = 10;
		}
		if(number == 1) {
			value = 11;
		}
		return value;
	}; 	
};
// SETTING UP THE 'DECK' IT WILL DRAW A RANDOM CARD BASED ON SUIT(1-4) AND VALUE(1-13)
var Deck = function() {
	var newCards = function() {
		var suit = (Math.floor(Math.random() * 4) + 1);
		var number = (Math.floor(Math.random() * 13) + 1);
		return new Card(suit, number);
	}
	this.deal = function() {
		return newCards();
	}
};
// GETTING A HAND DEALT TO PLAYER
var Hand = function(deck) {
	var cards = [];
	cards.push(deck.deal());
	cards.push(deck.deal());
	this.getHand = function() {
		return cards;
	};
	// SETTING UP THE SCORING
	this.score = function(){
        var i,
            score = 0,
            cardVal = 0, 
            aces = 0; 

        for(i = 0; i < cards.length; i++){
            cardVal = cards[i].cardValue();
            if (cardVal == 11) {
                aces += 1;
            }
            score += cardVal;
        }
        // DECIDES THE VALUE OF ACES BASED ON THE HAND
        while (score > 21 && aces > 0){
            score -= 10;
            aces -=1;
        }
        return score;
    };
  
    this.displayHand = function(){
        var cardsInHand = [],
            i;

        for(i = 0; i < cards.length; i++){
            cardsInHand.push(cards[i].getName());
        }
        return cardsInHand.join();
    };
    // DEALS ANOTHER CARD
    this.hitMe = function(){
        if (cards.length < 5){
            cards.push(deck.deal());
        }
    };
    // PUTS THE CARDS ONTO THE TABLE, DISPLAY WILL SHOW THE CARD NUMBER AND SUIT
    this.insert = function(){
        var cardsInHand = [],
            i;
        for(i = 0; i < cards.length; i++){
        	var cardSuit = cards[i].suitUp();
 			var suitClass = cardSuit == "&diams;" ? "Diamonds" :cardSuit == "&hearts;" ? "Hearts" :"";     
            cardsInHand.push('<div class="card ',suitClass, " ",cardSuit,' ',cards[i].cardValue(),'">',cards[i].getName(),'</div>');
        }
        return cardsInHand.join('');
    };
};
var BlackJack = (function($){
    var deck = new Deck();
    var wins = 0;
    var losses = 0;

    // DETERMINING SCORE AND WINNER, 21 IS THE GOAL
    var winner = function(playerHand, dealerHand){
        var outcome = '',
            dealerScore = dealerHand.score(),
            playerScore = playerHand.score();
  
        if(playerScore > 21 && dealerScore <= 21){
            outcome = "Dealer Wins";
            losses++;
        }
        else if(playerScore <= 21 && playerHand.getHand().length >= 5){
            outcome = "Oh snap, 5 card TRICK YAAAA!";
            wins++;
        }
        else if((dealerScore > 21 && playerScore <= 21) ||
        	( dealerScore <= 21 && playerScore <= 21 && playerScore > dealerScore)){
            outcome = "You win this hand";
            wins++;
        }
        else if(dealerScore === playerScore || playerScore > 21 && dealerScore > 21){
            outcome = "Draw";
        }
        else if(dealerScore > playerScore){
            outcome = "Dealer Wins";
            losses++;
        }
        // DISPLAY THE RESULT TO THE USER
        return "<div class='Final'>" + outcome + "<br>Dealer: " + dealerScore + "<br>You: " + playerScore;
};

    // THE DEALER'S CARDS
    var dealerHand = function(){
        var dealer = new Hand(deck);
        return dealer;
    };
    // BUTTONS DISAPPEARING ON CLICKS AND REAPPEARING (MAGIC)
    var showDeal = function(){
        $("#hitMe").hide();
        $("#stand").hide();
        $("#deal").show();
    };

    var buttonVis = function(){
        $("#hitMe").show();
        $("#stand").show();
        $("#deal").hide();
    };

    var statsReload = function(){
        $('#yourHand').html(yourHand.insert());
        $("#yourScore").find(".digits").html(yourHand.score());
        $("#wins").text(wins);
        $("#losses").text(losses);
    };
  
    $("#deal").on('click', function(){
        yourHand = new Hand(deck);
        statsReload();
        buttonVis();
    });


    $("#hitMe").on('click', function(){
        yourHand.hitMe();
        if(yourHand.getHand().length >= 5 || yourHand.score() > 21){
        	statsReload();
            $("#stand").trigger('click');
        }else {
            statsReload();
        }
    });

    $("#stand").on('click', function(){
    	var dealer = dealerHand();
    	while(dealer.score() < 17 && dealer.getHand().length < 5){
            dealer.hitMe();
        }
        $('#yourHand').append(winner(yourHand, dealer));
        showDeal();
    });
}(jQuery));
});