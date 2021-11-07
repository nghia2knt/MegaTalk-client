
function kichHoat() {
    var username = $('input[name="username"]').val()
    var code = $('input[name="code"]').val()
    $.ajax({
      type: 'POST',
      url: host + endpoint.activeUser,
      data: JSON.stringify({
        "username":username,
        "code":code       
        }),
      error: function(e) {
          alert(e.responseJSON);
      },
      success: function(data) {
          window.location.href = "/dangnhap";
      },
      dataType: "json",
      contentType: "application/json"
   });
    return false;
}

$(function () {
    if (localStorage.username) {
        document.getElementById("username").value = localStorage.username;
    }
  });
  