function checkAccount(name, email){
    console.log("Checking account");
    var search_URL = `http://cs.merrimack.edu:3100/useremail/${email}`;
    $.get(search_URL, function(data){
        console.log("DATA" + data)
        if(data == "undefined"){
            console.log("Redirecting to create account page");
            window.location = `./createAccount.html`;
        }else{
            $.cookie("type",data.type,{path:'/'});
            $.cookie("id",data.rowid,{path:'/'});
            //Signs the user out of google oauth after cookies are set
            //Prevents default login, makes sure user can select proper account
            gapi.auth2.getAuthInstance().signOut();
            window.location.href = './homepage.html';
            window.location.replace('./homepage.html');
        }
    })
}
function onSignIn(googleUser) {
    console.log("Signing in...")
    var profile = googleUser.getBasicProfile();
    var name = profile.getName();
    var email = profile.getEmail();
    if(email !== ""){
        if(!(email.includes('@merrimack.edu') || email.includes('jacobsm84'))){
            alert('Must be a Merrimack Email');
        }else{
            //var fixed_name = name.replace(/ /g, "_");
            $.cookie("name", name,{path: '/'});
            $.cookie("email", email,{path:'/'});
            checkAccount(name,email);
        }
    }
    else{
        alert("Account is not valid ");
    }
}
