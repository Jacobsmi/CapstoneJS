$(document).ready(function(){
    //Makes sure the user is logged in
    if($.cookie("name") == undefined){
      window.location="./index.html";
    }
    if($.cookie("type") == 2){
      window.location="./index.html";
    }
    $("#submit").click(function(){
        let name = $("#name").val();
        let email = $("#email").val();
        if(email.includes("merrimack") && name != ""){
          $.post(`http://cs.merrimack.edu:3100/addcoach`,{name: name, email:email, type: 1}, function(data){
                var isError = parseInt(data)
                if(isError === 0){
                    alert("Error adding the coach")
                }else if(isError === 1){
                    alert("Coach added successfully")
                    window.location = './homepage.html';
                }
            });
            window.location = './homepage.html'
        }else{
            $("#email").val('E-Mail');
            $("#name").val('Name');
            alert("Error with coach data");
        }
    });
});
