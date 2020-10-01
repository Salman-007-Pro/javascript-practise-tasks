/*
GAME RULES:

- The game has 2 players, playing in rounds
- In each turn, a player rolls a dice as many times as he whishes. Each result get added to his ROUND score
- BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLBAL score. After that, it's the next player's turn
- The first player to reach 100 points on GLOBAL score wins the game

*/
var activePlayer,score,gamePlay,roundScore;
initialize();

$(".btn-roll").click(function(){
    if (gamePlay){
        $(".dice").css("display","block");
        diceRoll=Math.floor(Math.random()*6)+1
        console.log(diceRoll)
        if(diceRoll!=1){
            roundScore+=diceRoll
            $("#current-"+activePlayer).text(roundScore);
            $(".dice").attr("src","dice-"+diceRoll+".png") 
        }
        else{
            nextPlayer();
        }
    }
})
$(".btn-hold").click(function(){
    if(gamePlay){
        score[activePlayer]+=roundScore;
        $("#score-"+activePlayer).text(score[activePlayer])
        if(score[activePlayer]>=10){
            gamePlay=false
            $(".player-"+activePlayer+"-panel").removeClass("active")
            $(".player-"+activePlayer+"-panel").addClass("winner")
            $("#name-"+activePlayer).text("WINNER!")
            $(".dice").css("display","none");
        }
        else{
            nextPlayer();
        }    
    }
})
$(".btn-new").click(function(){
    initialize();
})
function nextPlayer(){
    roundScore=0;
    $("#current-"+activePlayer).text("0");
    activePlayer==0 ? activePlayer=1 : activePlayer=0
    $(".player-0-panel,.player-1-panel").toggleClass("active");
    $(".dice").css("display","none");
}
function initialize(){
    score=[0,0]
    activePlayer=Math.floor(Math.random()*2)
    $(".player-0-panel").removeClass("active")
    $(".player-1-panel").removeClass("active")
    $(".player-0-panel").removeClass("winner")
    $(".player-1-panel").removeClass("winner")
    $(".player-"+activePlayer+"-panel").addClass("active")
    $(".dice").css("display","none");
    $("#current-0").text("0");
    $("#current-1").text("0");
    $("#score-0").text("0")
    $("#score-1").text("0")
    $("#name-0").text("Player 1")
    $("#name-1").text("Player 2")
    roundScore=0
    gamePlay=true
}