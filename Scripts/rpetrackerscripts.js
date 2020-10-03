$(document).ready(function(){
    $.get(`http://cs.merrimack.edu:3100/sports`, function( data){
        $("#dropdown").html(data)
    })
    $('#search').click(function(){
        //Set the values to search for from text boxes
        let name = $("#name").val();
        let username = $("#email").val();
        //Set a variable for the ID
        var id;
        if((name === "Name" && email === "E-Mail")||(name === "" && email === "")){
            alert("Please enter values to search for!")
        }else if(name !== "" && name !== "Name"){
            console.log(name)
        }else if(email !== "" && email !== "E-Mail"){
            var email = username.concat('@merrimack.edu')
            search_URL = `http://cs.merrimack.edu:3100/getIDE/${email}`
            $.get(search_URL,function(data){
                $("#results").html(JSON.stringify(data))
            })
        }
        $("#name").val("Name")
        $("#email").val("Merrimack Username")
    })
});