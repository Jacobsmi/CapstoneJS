//Runs when the document loads
$(document).ready(function() {
  let name = $.cookie("name");
  let email = $.cookie("email");
  //if($.cookie("name") == undefined){
  //        window.location="./index.html";
  //    }
  $.get(`http://cs.merrimack.edu:3100/sports`, function (data) {
      $('#sportSelect1').append(data);
  });
  //Setting the text at the top of the page with user info
  let info_text = ("Email: " + email + "<br>Name: " + name);
  $("#info").html(info_text);

  //Defines what happens when the submit button is clicked
  //Uses jQuery to send relevant information to the backend
  $("#submit_form").click(function() {
    var isError = false
    let sport_int = parseInt($("#sportSelect1").find('option:selected').val());
    var type_int = 2;
    $.post(`http://cs.merrimack.edu:3100/adduser`, {
      send_name: name,
      send_email: email,
      type: type_int,
      sport: sport_int
    },function(data) {
      var isError = parseInt(data)
      if (isError === 0) {
        console.log("There was an error inserting the data")
        window.location = `./index.html`;
      } else if (isError === 1) {
        console.log(data);
        $.get(`http://cs.merrimack.edu:3100/id/${email}`, function(data){
            $.cookie("id", data.rowid, { path: '/'});
            $.cookie("type", 2, { path: '/'});
            window.location = './homepage.html';
        });
      }

    });
  });
});
