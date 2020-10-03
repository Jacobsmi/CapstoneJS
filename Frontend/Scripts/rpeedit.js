function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

$(document).ready(function(){
    //Populates the table by making a call to the API
    $.get(`http://cs.merrimack.edu:3100/rpesurveys/${$.cookie('id')}`, function( data){
        $("#table").html(data)
    })
    //The table is populated with delete class buttons so this tells what to do if any of the
    //delete buttons are clicked
    $(document).on('click', '.delete', function () {
        let id = $(this).attr('id')
        $.get(`http://cs.merrimack.edu:3100/deletesurvey/${id}`, function( data){
            $("#deleted").html(`<h1>Deleted Survey ${id}</h1>`)
            sleep(500).then(() => {
                window.location.reload();
            })
        })

    });
    //The table is populated with edit class buttons so this tells what to do if any of the
    //edit buttons are clicked
    $(document).on('click', '.edit', function () {
        let id = $(this).attr('id')
        let newans1 = document.getElementById (`${id}tableans1`).innerText
        let newans2 = document.getElementById (`${id}tableans2`).innerText
        let newans3 = document.getElementById (`${id}tableans3`).innerText
        if((newans1 < 1) || (newans1 > 4)){
          alert("Bad Value for Type of Activity");
          $.get(`http://cs.merrimack.edu:3100/rpesurveys/${$.cookie('id')}`, function( data){
              $("#table").html(data)
          })
        }else if((newans3 < 1) || (newans3 > 10)){
          alert("Bad Value for Difficulty");
          $.get(`http://cs.merrimack.edu:3100/rpesurveys/${$.cookie('id')}`, function( data){
              $("#table").html(data)
          })
        }else{
          $.post(`http://cs.merrimack.edu:3100/editSurvey`,{id: id, ans1:newans1,  ans2:newans2,  ans3:newans3}, function(data){
              $("#deleted").html(`<h1>Edited Survey ${id}</h1>`)
              sleep(500).then(() => {
                  window.location.reload();
              })
          });
        }

    });
});
