var jsonScores = {};
var savedScores = JSON.parse(localStorage.getItem("jsonScores"));
var arrayInfoPlayer = savedScores ? savedScores.players : [];
var name = "";
var arraySelected = [];
var cardSelected =[];
var chances = 12;
var score = 0;

var cards = [ {
  img: "imgs/memo_card_0.jpg",
  id: "card_0"
},
{
  img: "imgs/memo_card_1.jpg",
  id: "card_1"
},
{
  img: "imgs/memo_card_2.jpg",
  id: "card_2"
},
{
  img: "imgs/memo_card_3.jpg",
  id: "card_3"
},
{
  img: "imgs/memo_card_4.jpg",
  id: "card_4"
},
{
  img: "imgs/memo_card_5.jpg",
  id: "card_5"
}];


// Initial Logo & Charging Bar Animation
function chargeBar() {
  let width = 1;
  let interval = setInterval(frame, 25);
  function frame() {
    if (width >= 100) {
      clearInterval(interval);
      activeToggle($('#logo'));
      activeToggle($('#progressBar'));
      activeToggle($('#dialogBox'));
      $('#name').focus();
    } else {
      width++;
      $('#bar').css('width', width + '%');
    }
  }
}

// AUXILIAR FUNCTIONS

// Make sure there are no html tags in user inputs. Prevents XSS hacking
function escapeHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
}

// Create an array of indexs where every one appear twice.
function listOfIndexs(size) {
  let list = [];
  for (let i = 0; i < size; i++) {
    list.push(i);
    list.push(i);
  };
  return list
}

// Return a new ARRAY with the elements of @param array list shuffled.
function shuffleArray(list) {
  var shuffleList = [];
  while (list.length != 0) {
    var randomIndex = Math.floor(Math.random() * list.length);
    shuffleList.push(list[randomIndex]);
    list.splice(randomIndex, 1);
  }
  return shuffleList;
}

// Change visible/invisible
function activeToggle(item) {
  item.toggleClass('hide');
  item.toggleClass('no-hide');
}

// Set New player in localStorage
function newPlayerInfo(userName, userScore) {
  let newPlayer = {
    player: userName,
    score: userScore
  };
  arrayInfoPlayer.push(newPlayer);
  sortArrayInfoPlayer = arrayInfoPlayer.sort((a, b) => b.score - a.score);
  jsonScores = {
    "players": sortArrayInfoPlayer,
    "total": arrayInfoPlayer.length
  };
  localStorage.setItem("jsonScores", JSON.stringify(jsonScores));
}

// Flip effect on cards
function flipCard(select) {
  select.children('.front').toggleClass("flip");
  select.children('.front').toggleClass("no-flip");
  select.children('.back').toggleClass("flip");
  select.children('.back').toggleClass("no-flip");
}

// Turn on/of listener when clicked
function unclickeable(select) {
  select.removeClass('card');
}

function clickeable(select) {
  select.addClass('card');
};

// Generate the board game with shuffled cards.
function start() {
  name = escapeHtml($('#name').val());
  activeToggle($('#dialogBox'));
  activeToggle($('.counter'));
  activeToggle($('.score'));
  $('#board').empty();
  $('#board').css('display', 'grid');
  var list = listOfIndexs(6);
  var shuffledList = shuffleArray(list);
  $.each(shuffledList, function (index, item) {
    let card = `<div id='card${index}' class='card styles click'>
                  <div class='front no-flip'><img class='imgFront' alt='card' src='imgs/back.jpg'></div>
                  <div class='back no-flip'><img class='imgBack' alt='card' src='${cards[item].img}' data-id='${cards[item].id}'></div>
                </div>`
    $('#board').append(card);
  });
};


// Click a card
function cardClick(item) {
  unclickeable(item);
  flipCard(item);
  cardSelected.push(item.attr('id'));
  var idSelected = item.find('.imgBack').data('id');
  arraySelected.push(idSelected);
  if (arraySelected.length == 2) {
    chances--;
    $('#counter').html(chances);
    if (arraySelected[0] == arraySelected[1]) {
      score += 100;
      item.removeClass('click');
      $('#'+cardSelected[0]).removeClass('click');
      $('#score').html(score);
      arraySelected = [];
      cardSelected = [];
      if ($('.click').length === 0 ) {
        newPlayerInfo(name, $('#score').text());
        activeToggle($('.counter'));
        activeToggle($('.score'));
        $('.styles').addClass('hide');
        youWin();
      }
    } else {
      score -= 10;
      $('#score').html(score);
      unclickeable($('.card'));
      setTimeout(flipCard, 1000, item);
      setTimeout(flipCard, 1000, $('#'+cardSelected[0]));
      setTimeout(clickeable, 1500, $('.click'));
      arraySelected = [];
      cardSelected = [];
    }
    console.log($('.click').length)
    if (chances === 0 && $('.click').length != 0) {
      activeToggle($('.counter'));
      activeToggle($('.score'));
      $('.styles').addClass('hide');
      youLoose();
    }
  }
}

// Loose Function
function youLoose() {
  activeToggle($('#dialogResult'));
  $('#board').css('display', 'none');
  let message = `<p id='result'>You ran out of moves!</p>
  <button id="playAgain" type="button" name="playAgain">PLAY AGAIN</button>`;
  $('#textResult').html(message);
  $('#positionGrid').css('display', 'none');
}

// Win function
function youWin() {
  activeToggle($('#dialogResult'));
  $('#board').css('display', 'none');
  let message = `<p id='result'>Congrats ${name}! You win with ${$('#score').text()} pts!</p>
                  <button id="playAgain" type="button" name="playAgain">PLAY AGAIN</button>
                  <p class='bestScores'>BEST SCORES:</p>`;
  $('#textResult').html(message);
  $('#positionGrid').css('display', 'grid');
  loadScores();
}

// Load Best Scores
function loadScores() {
  let secondName = sortArrayInfoPlayer[1] ? sortArrayInfoPlayer[1].player : "-";
  let secondScore = sortArrayInfoPlayer[1] ? sortArrayInfoPlayer[1].score : "-";
  let thirdName = sortArrayInfoPlayer[2] ? sortArrayInfoPlayer[2].player : "-";
  let thirdScore = sortArrayInfoPlayer[2] ? sortArrayInfoPlayer[2].score : "-";
  let positionGrid = `<p class='grid'>1.</p>
                      <p class='grid center'>${sortArrayInfoPlayer[0].player}</p>
                      <p class='grid center'>${sortArrayInfoPlayer[0].score}</p>
                      <p class='grid'>2.</p>
                      <p class='grid center'>${secondName}</p>
                      <p class='grid center'>${secondScore}</p>
                      <p class='grid'>3.</p>
                      <p class='grid center'>${thirdName}</p>
                      <p class='grid center'>${thirdScore}</p>`
  $('#positionGrid').html(positionGrid)
}

// Reset all values
function reset() {
  chances = 12;
  score = 0;
  $('#counter').html(chances)
  $('#score').html(score);
  activeToggle($('#dialogResult'));
  activeToggle($('#dialogBox'));
  $('#name').focus();
  $('#name').select();
}

// Event on start button
$('#start').on('click', function() {
  if (name = $('#name').val()) {
    start();
  } else {
    activeToggle($("#error"));
  }
});

$('#name').on('keypress', function(event) {
  if (event.keyCode === 13) {
    if (name = $('#name').val()) {
      start();
    } else {
      activeToggle($("#error"));
    }
  }
});

// Event on every card
$('#board').on('click', '.card', function() {
  cardClick($(this))
});

// Play Again event
$('#dialogResult').on('click','#playAgain',function() {
  reset()
})

chargeBar();
