function sportDate(week, month, day, year, emonth, eday, eyear) {
  this.week = week;
  this.month = month;
  this.year = year;
  this.day = day;
  this.emonth = emonth;
  this.eday = eday;
  this.eyear = eyear;
  this.ans1 = new Array();
  this.ans2 = new Array();
  this.ans3 = new Array();
}

$(document).ready(function() {
  let query = window.location.search;
  let email = "";
  let sportID = 999999999;
  if (query.includes("email")) {
    let emailparts = query.split("=")
    email = emailparts[1];
  }
  if (query.includes("sport")) {
    let sportparts = query.split("=")
    sportID = sportparts[1];
  }
  if (email != "") {
    $.get(`http://cs.merrimack.edu:3100/useremail/${email}`, function(data) {
      let id = data.rowid;
      let sportInt = data.sport;
      let sore = "";
      $.get(`http://cs.merrimack.edu:3100/getWellnessSurvey/${id}`, function(wellnessSurvey) {
        if (!wellnessSurvey) {

        } else {
          let table_string = '<table class="table"><tr><th>Mood</th><th>Stress</th><th>Energy</th><th>Sleep</th><th>Sore Muscles</th></tr>';
          if (!wellnessSurvey.soregroups) {
            console.log("EMPTY SORE GROUPS")
          } else {
            if (wellnessSurvey.soregroups.includes("1")) {
              sore = sore + " Arms "
            }
            if (wellnessSurvey.soregroups.includes("2")) {
              sore = sore + " Legs "
            }
          }
          table_string = table_string + `<tr><td>${wellnessSurvey.mood}</td><td>${wellnessSurvey.stress}</td><td>${wellnessSurvey.energy}</td><td>${wellnessSurvey.sleep}</td><td>${sore}</td></tr>`;
          table_string = table_string + '</table>';
          $("#table").html(table_string);
        }
      })
      $.get(`http://cs.merrimack.edu:3100/getUserData/${id}`, function(user_data) {
        getDates(sportInt, function(dates) {
          dates.forEach(function(item) {
            user_data.rows.forEach(function(row) {
              processData(item, row);
            })
          })
          display(dates);
        });
        $("#results").text(user_data.name);
      });
    });
  } else if (sportID !== 999999999) {
    var seasonArray = new Array();
    $.get(`http://cs.merrimack.edu:3100/sportplayers/${sportID}`, function(playerArray) {
      getDates(sportID, function(dates) {
        console.log("Getting Dates");
        //Set the season array equal to the array created by getDates
        seasonArray = dates;
        addTeamData(seasonArray, playerArray, function(sArray) {
          console.log("CALLING DISPLAY")
          display(sArray)
        })
      });
    });
  }
  $('#backButton').click(function() {
    window.location = './graphs.html';
  })

  $("#email").val("Email")
  //makeTeamGraph();
});

function addTeamData(seasonArray, playerArray, callback) {

  if(playerArray.length === 0){
    callback(seasonArray);
  }
  let table_string = '<table class="table"><tr><th>Name</th><th>Mood</th><th>Stress</th><th>Energy</th><th>Sleep</th><th>Sore Muscles</th><th>Comments</th></tr>';
  for (let i = 0; i < playerArray.length; i = i + 1) {
    //GET THE PLAYERS DATA
    var player = playerArray[i];
    let name = "";
    $.get(`http://cs.merrimack.edu:3100/getNameByID/${player}`, function(result) {
      name = result[0].name;
    })
    $.get(`http://cs.merrimack.edu:3100/getWellnessSurvey/${player}`, function(wellnessSurvey) {
      if (!wellnessSurvey) {
        console.log("Nothing here")
      } else {
        let sore = "";
        if (wellnessSurvey.soregroups.includes("1")) {
          sore = sore + " Arms "
        }
        if (wellnessSurvey.soregroups.includes("2")) {
          sore = sore + " Legs "
        }
        table_string = table_string + `<tr><td>${name}</td><td>${wellnessSurvey.mood}</td><td>${wellnessSurvey.stress}</td><td>${wellnessSurvey.energy}</td><td>${wellnessSurvey.sleep}</td><td>${sore}</td><td>${wellnessSurvey.comment}</td></tr>`;
      }
      if (i === playerArray.length - 1) {
        table_string = table_string + '</table>';
        $("#table").html(table_string);
      }
    });
    $.get(`http://cs.merrimack.edu:3100/getUserData/${player}`, function(user_data) {
      //FOR EACH WEEK IN THE SEASON
      seasonArray.forEach(function(item) {
        //FOR EACH ROW IN THE DATA
        user_data.rows.forEach(function(row) {
          //PROCESS AND ADD IF IT FITS
          processData(item, row);
        });
      });
      if (i === playerArray.length - 1) {
        callback(seasonArray)
      }
    })
  }
}

function processData(item, row) {
  //IF YEAR IS EQUAL
  if (row.year == item.year || row.year == item.eyear) {
    //IF MONTH IS EQUAL
    if (row.month == item.month || row.month == item.emonth) {
      //IF THE MONTH CHANGES IN THE MIDDLE OF THE WEEK
      if (item.month != item.emonth) {
        if ((row.month == item.month && row.dayOfMonth >= item.day) || (row.month == item.emonth && row.dayOfMonth <= item.eday)) {
          //GETS THE DATA FOR WEEKS WHERE THE MONTH CHANGES
          //ADDS DATA
          item.ans1.push(row.answer1);
          item.ans2.push(row.answer2);
          item.ans3.push(row.answer3);
        }
        //IF THE MONTH IS THE SAME AND THE DAY OF THE WEEK IS WITHIN THE TIME
      } else if (item.month == item.emonth && (row.dayOfMonth >= item.day && row.dayOfMonth <= item.eday)) {
        //ADD DATA
        item.ans1.push(row.answer1);
        item.ans2.push(row.answer2);
        item.ans3.push(row.answer3);
      }
    }
  }
}

/*Get dates takes the given start date and creates a schedule for the graph to display.  It stores the number of the week in the
season the start month, start day, end month and end day of each week in a custom datatype that we refer to as sportWeek(also represented
as a function). An array of these sportDate objects is created and returned through the callback. So, these objects represent
weeks in the sport season and the array represents the whole season.*/

function getDates(sportInt, callback) {
  var startMonth, startDay, endMonth, endDay;
  $.get(`http://cs.merrimack.edu:3100/sportdates/${sportInt}`, function(data) {
    var array = [];
    startMonth = data.startMonth - 1;
    startDay = data.startDay;
    startYear = data.startYear;
    var numWeeks = data.numWeeks;
    var DoS = new Date();
    DoS.setMonth(startMonth);
    DoS.setDate(startDay);
    DoS.setFullYear(startYear);
    var endWeek = new Date();
    endWeek.setMonth(startMonth);
    endWeek.setDate(DoS.getDate() + 6);
    endWeek.setFullYear(startYear);
    array.push(new sportDate(1, (DoS.getMonth() + 1), DoS.getDate(), DoS.getFullYear(), (endWeek.getMonth() + 1), endWeek.getDate(), endWeek.getFullYear()));
    for (i = 2; i <= numWeeks; i++) {
      DoS.setDate(DoS.getDate() + 7);
      if (endWeek.getDate() == 31) {
        endWeek.setMonth(endWeek.getMonth() + 1);
        endWeek.setMonth(endWeek.getMonth() - 1);
      }
      endWeek.setDate(DoS.getDate() + 6);


      array.push(new sportDate(i, (DoS.getMonth() + 1), DoS.getDate(), DoS.getFullYear(), (endWeek.getMonth() + 1), endWeek.getDate(), endWeek.getFullYear()));
    }
    callback(array);
  })
}


function display(DATES) {
  console.log("In display");
  var all_date_strings = new Array();
  var practice = new Array();
  var game = new Array();
  var individual = new Array();
  var s_c = new Array();
  //FOR EACH WEEK IN THE SPORTS YEAR
  DATES.forEach(function(d) {
    var date_string = `${d.month}/${d.day}/${d.year}-${d.emonth}/${d.eday}/${d.eyear}`
    all_date_strings.push(date_string);
    var rpe1 = 0;
    var rpe2 = 0;
    var rpe3 = 0;
    var rpe4 = 0;
    for (i = 0; i < d.ans1.length; i++) {
      if (d.ans1[i] == 1) {
        rpe1 = rpe1 + (d.ans2[i] * d.ans3[i])
      } else if (d.ans1[i] == 2) {
        rpe2 = rpe2 + (d.ans2[i] * d.ans3[i])
      } else if (d.ans1[i] == 3) {
        rpe3 = rpe3 + (d.ans2[i] * d.ans3[i])
      } else if (d.ans1[i] == 4) {
        rpe4 = rpe4 + (d.ans2[i] * d.ans3[i])
      }
    }
    practice.push(rpe1);
    game.push(rpe2);
    individual.push(rpe3);
    s_c.push(rpe4);

  }, makeChart(all_date_strings, practice, game, individual, s_c))

}

function makeChart(date_strings, practice, game, individual, s_c) {
  console.log(date_strings);
  var ctx = document.getElementById('myChart').getContext('2d');
  var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: date_strings,
      datasets: [{
          label: 'Practice',
          data: practice,
          backgroundColor: '#0000ff' //blue
        },
        {
          label: 'Game',
          data: game,
          backgroundColor: '#FFFF00' //black
        },
        {
          label: 'Individual',
          data: individual,
          backgroundColor: '#808080' //gray
        },
        {
          label: 'S & C',
          data: s_c,
          backgroundColor: '#000000' //black

        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      scales: {
        xAxes: [{
          stacked: true
        }],
        yAxes: [{
          stacked: true,
          ticks: {
            beginAtZero: true
          }
        }],
      }
    }
  });
  //myChart.canvas.parentNode.style.height = '';
  myChart.canvas.parentNode.style.width = '80%';
}
