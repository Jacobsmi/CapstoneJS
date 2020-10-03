function signOut() {
  $.removeCookie('name', {
    path: '/'
  });
  $.removeCookie('email', {
    path: '/'
  });
  $.removeCookie('id', {
    path: '/'
  });
  $.removeCookie('type', {
    path: '/'
  });
  window.location = './index.html';
}

$(document).ready(function() {
  //Ensure that the user is logged in and session cookies have been set
  if ($.cookie("name") == undefined) {
    window.location = "./index.html";
    window.location.replace("./index.html");
  }
  //Sets vairiables according to the session cookie
  let name = $.cookie("name");
  let email = $.cookie("email");
  let type = $.cookie("type");
  //Sets the ID cookie for new accounts
  if ($.cookie("id") == null) {
    var search_URL = `http://cs.merrimack.edu:3100/useremail/${email}`
    $.get(search_URL, function(data) {
      console.log(data);
      if (data === undefined) {
        alert("Error setting the id");
      } else {
        $.cookie("id", data.rowid, {
          path: '/'
        });
        console.log("ID set as " + data.rowid);
      }
    });
  }
  if (type == 1) {
    $("#welcome").text("Hello Coach " + name);
    $("#athleteLinks").hide();
  } else if (type == 2) {
    $("#welcome").text("Hello Athlete " + name);
    $("#coachLinks").hide();
  }else{
    $("#athleteLinks").hide();
    $("#coachLinks").hide();
  }
});
