
    
    
    
    function clean(){
        document.getElementById("err").innerHTML = "";
  
      }
      function resetPassword() {
  
  /////////////////////////////
        var validation=true;
  
        jQuery.validator.addMethod('valid_username', function (value) {
      var regex = /^[A-Za-z0-9]+$/;
      return value.match(regex);
      });
  
      jQuery.validator.addMethod('valid_code', function (value) {
      var regex = /^[0-9]+$/;
      return value.match(regex);
      });
  
      jQuery.validator.addMethod('valid_password', function (value) {
      var regex = /^[A-Za-z0-9]+$/;
      return value.match(regex);
      });
  
  
        $(document).ready(function(){
          var $theForm = $('#form');
         $('#form').validate({
          rules: {
              'username': {
              required: true,
              valid_username:true
            },
            'code': {
              required: true,
              valid_code:true
            },
            'password': {
              required: true,
              valid_password:true
            }
          },
          messages: {
              'username': {
              required: "Vui lòng nhập tài khoản!",
              valid_username:"Tài khoản không hợp lệ!"
             
            },
            'code': {
              required: "Vui lòng nhập code!",
              valid_code:"Code không hợp lệ"
         
            },
            'password': {
              required: "Vui lòng nhập mật khẩu!",
              valid_password:"Mật khẩu không hợp lệ!"
         
            }
          }
      })
  
      
      if(!($theForm.valid())) {
        validation=false;}
  });
  
     if(validation==false){return false;}
        var username = $('input[name="username"]').val()
        var code = $('input[name="code"]').val()
        var password = $('input[name="password"]').val()
        $.ajax({
          type: 'POST',
          url: host+endpoint.resetPass,
          data: JSON.stringify({
            "username":username,
            "code":code,
            "password":password       
            }),
          error: function(e) {
              //console.log(e.responseJSON);
              //alert(e.responseJSON);
              document.getElementById("err").innerHTML = e.responseJSON;
  
          },
          success: function(data) {
             // localStorage.token = "JWT "+ data.data.accessToken;
              //console.log("JWT "+ data.data.accessToken);
              alert("Khôi phục mật khẩu thành công!");
              window.location.href = "/dangnhap";
          },
          dataType: "json",
          contentType: "application/json"
       });
          return false;
      }
  