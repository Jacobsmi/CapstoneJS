$(document).ready(function () {
    $.get(`http://cs.merrimack.edu:3100/editSports`, function( data){
        $("#table").html(data)
    })
    $(document).on('click', '.delete', function () {
        let id = $(this).attr('id');
        $.post(`http://cs.merrimack.edu:3100/deleteSport`,{id: id}, function(data){
          window.location.reload();
        })
    })
    $(document).on('click', '.edit', function () {
        let id = $(this).attr('id');
        let newans1 = document.getElementById (`${id}tableans1`).innerText;
        let newans2 = document.getElementById (`${id}tableans2`).innerText;
        let newans3 = document.getElementById (`${id}tableans3`).innerText;
        let newans4 = document.getElementById (`${id}tableans4`).innerText;
        $.post(`http://cs.merrimack.edu:3100/saveSports`,{id: id, startMonth: newans1,  startDay: newans2,  startYear: newans3, numWeeks: newans4}, function(data){
            $.get(`http://cs.merrimack.edu:3100/editSports`, function( data){
                $("#table").html(data)
            })
        });

    });
});
function addSport(){
  let name = $("#formName").val();
  let month = $("#formMonth").val();
  let day = $("#formDay").val();
  let year = $("#formYear").val();
  let weeks = $("#formWeeks").val();
  $.post(`http://cs.merrimack.edu:3100/addSport`,{name: name, startMonth: month,  startDay: day,  startYear: year, numWeeks: weeks}, function(data){
    window.location.reload();
  });
}
