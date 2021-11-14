    function clean(){
      document.getElementById("err").innerHTML = "";

    }
    function dangNhap() {

/////////////////////////////
      var validation=true;
      $(document).ready(function(){
        var $theForm = $('#formDangNhap');
       $('#formDangNhap').validate({
        rules: {
            'username': {
            required: true
          },
          'password': {
            required: true
          }
        },
        messages: {
            'username': {
            required: "Vui lòng nhập tài khoản!"
           
          },
          'password': {
            required: "Vui lòng nhập mật khẩu!"
       
          }
        }
    })

    
    if(!($theForm.valid())) {
      validation=false;}
});

   if(validation==false){return false;}

//////////////////////////////////////



      var username = $('input[name="username"]').val()
      var password = $('input[name="password"]').val()
      $.ajax({
        type: 'POST',
        url: host + endpoint.login,
        data: JSON.stringify({
          "username":username,
          "password":password       
          }),
        error: function(e) {
            //console.log(e.responseJSON);
            //alert(e.responseJSON);
            document.getElementById("err").innerHTML = e.responseJSON;

        },
        success: function(data) {
            localStorage.clear();
            localStorage.token = "JWT "+ data.data.accessToken;
            console.log("JWT "+ data.data.accessToken);
            localStorage.username = data.data.username;
            window.location.href = "/";
        },
        dataType: "json",
        contentType: "application/json"
     });
        return false;
    }

    $(function () {
      if (localStorage.username) {
          document.getElementById("txtus").value = localStorage.username;
      }
      if (localStorage.password) {
        document.getElementById("txtpw").value = localStorage.password;
    }

    });