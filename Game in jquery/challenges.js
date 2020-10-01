/*
YOUR 3 CHALLENGES
Change the game to follow these rules:

1. A player looses his ENTIRE score when he rolls two 6 in a row. After that, it's the next player's turn. (Hint: Always save the previous dice roll in a separate variable)
2. Add an input field to the HTML where players can set the winning score, so that they can change the predefined score of 100. (Hint: you can read that value with the .value property in JavaScript. This is a good oportunity to use google to figure this out :)
3. Add another dice to the game, so that there are two dices now. The player looses his current score when one of them is a 1. (Hint: you will need CSS to position the second dice, so take a look at the CSS code for the first one.)
*/

var score,roundDice1,roundDice2,activePlayer,gamePlay,winnerScore,win=100,lastdice1=0,lastdice2=0;

init();

$(".btn-roll").click(function(){
    if (gamePlay){
        displayActive()
        dice1=Math.floor(Math.random()*6)+1;
        dice2=Math.floor(Math.random()*6)+1;
        roundDice1+=dice1
        roundDice2+=dice2
        if(dice1==lastdice2 && dice2==lastdice1){
            score[activePlayer]=0;
            nextPlayer();
        }
        else if(dice1!=1 && dice2!=1){
            $("#dice-0").attr("src","dice-"+dice1+".png")
            $("#dice-1").attr("src","dice-"+dice2+".png")
            $("#current-"+activePlayer).text(roundDice1+roundDice2)
        }
        else{
            nextPlayer()
        }
        lastdice1=dice1;
        lastdice2=dice2;
    }
})
$(".btn-hold").click(function(){
    if (gamePlay){
        score[activePlayer]+=roundDice1+roundDice2;
        $("#score-"+activePlayer).text(score[activePlayer])
        scoreWinner=$(".input-box").val()
        if(scoreWinner){
            win=scoreWinner
        }
        if(score[activePlayer]>=win){
            $(".player-"+activePlayer+"-panel").addClass("winner");
            $(".player-"+activePlayer+"-panel").removeClass("active");
            $("#name-"+activePlayer).text("winner!");
            gamePlay=false
            $(".input-box").attr("disabled","true")
            displayNone();
        }
        else{
            nextPlayer();
        }
    }
})
$(".btn-new").click(function(){
    init();
})


function init(){
    score=[0,0]
    activePlayer=Math.floor(Math.random()*2);
    $(".player-0-panel").removeClass("active");
    $(".player-0-panel").removeClass("winner");
    $(".player-1-panel").removeClass("active");
    $(".player-1-panel").removeClass("winner");
    $("#name-0").text("Player 1");
    $("#name-1").text("Player 2");
    $(".player-"+activePlayer+"-panel").addClass("active");
    roundDice1=0;
    roundDice2=0;
    gamePlay=true;
    displayNone()
    $(".input-box").removeAttr("disabled");
    $("#current-0").text("0")
    $("#current-1").text("0")
    $("#score-0").text("0")
    $("#score-1").text("0")
}
function nextPlayer(){
    displayNone();
    roundDice1=0
    roundDice2=0
    $("#current-"+activePlayer).text("0")
    activePlayer==0 ? activePlayer=1 : activePlayer=0
    $(".player-0-panel,.player-1-panel").toggleClass("active")    
}
function displayNone(){
    $("#dice-0").css("display","none")
    $("#dice-1").css("display","none")
}
function displayActive(){
    $("#dice-0").css("display","Block")
    $("#dice-1").css("display","Block")
}