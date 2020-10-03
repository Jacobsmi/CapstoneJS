$(document).ready(function() {
  $("#moodNum").text("5");
  $("#stressNum").text("5");
  $("#sleepNum").text("5");
  $("#energyNum").text("5");
  $("#sorenessNum").text("5")
})

function setMoodNum(val) {

  $("#moodNum").text(val);
}

function setStressNum(val) {
  $("#stressNum").text(val);
}

function setEnergyNum(val) {
  $("#energyNum").text(val);
}

function setSleepNum(val) {
  $("#sleepNum").text(val);
}

function setSorenessNum(val) {
  $("#sorenessNum").text(val);
}


function submit() {
  let id = $.cookie("id");
  let mood = $("#mood").val();
  let stress = $("#stress").val();
  let energy = $("#energy").val();
  let sleep = $("#sleep").val();
  let soreness = $.cookie("#soreness");
  let comment = $("#commentsSection").val();
  let soreGroups = [];
  $.each($("input[name='soreness']:checked"), function() {
    soreGroups.push($(this).val());
  });
  let soreGroupsString = soreGroups.toString()
  $.post( "http://cs.merrimack.edu:3100/addwellness", { mood: mood, stress: stress, sleep: sleep, energy: energy, soreness: soreness, sore: soreGroupsString, id:id, comment:comment}, function(data){
    window.location = "./homepage.html";
    window.location.replace("./homepage.html");

  });

}
