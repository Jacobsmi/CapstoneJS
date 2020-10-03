let dif = 0;
let type = 0;


function goback() {
  window.location.replace= "./homepage.html";
}

function submitted() {

  var typeOfActivity = type;
  var minutes = parseInt($("#X").val());
  var difficulty = dif;
  var user_id = $.cookie("id");
  if (isNaN(minutes)) {
      alert("Invalid Input");
      window.location.reload();
  } else {
      $.post(`http://cs.merrimack.edu:3100/addsurvey`, { id: user_id, q1: typeOfActivity, q2: minutes, q3: difficulty }, function (data) {
          var isError = parseInt(data)
          if (isError === 0) {
              console.log("There was an error inserting the data")
              window.location.replace(`./rpe_survey.html`)
          } else if (isError === 1) {
              $('#submitted').html('<h3>Survey submitted succesfully!</h3>')
              setTimeout(function () {
                  $('#submitted').html('')
              }, 3000);
              window.location.replace('./homepage.html')
          }
      });
  }
}
$(document).ready(function() {
  if ($.cookie("name") == undefined) {
    window.location = "./index.html";
  }
  $(".type a").click(function() {
    var typeText = $(this).text();
    if(typeText == "Practice"){
      type = 1;
    }else if(typeText == "Indy"){
      type = 3;
    }else if(typeText == "S&C"){
      type = 4;
    }else if(typeText == "Game/Play Day"){
      type = 2;
    }
  });
  $(".difficulty a").click(function() {
    var difText = $(this).text();
    dif = parseInt(difText);
  });
  $("#back").click(function() {
    window.location.replace("./homepage.html")
  });
});
