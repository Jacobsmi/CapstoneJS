$(document).ready(function () {
    $.get(`http://cs.merrimack.edu:3100/sports`, function (data) {
        $('#inputGroupSelect01').append(data);
    })
    $('#search').click(function () {
        let choice = $("input[name='search']:checked").val();
        let email = $("#email").val();
        if (choice == "email" && (email == "" || email == "Email")) {
            alert("Invalid Email");
        } else if (choice == "email") {
            window.location = `./displaygraphs.html?email=${$("#email").val()}`;
        }else if(choice == "sport"){
            let sportID = $("#inputGroupSelect01").val();
            window.location = `./displaygraphs.html?sportid=${sportID}`;
        }
    })
});
