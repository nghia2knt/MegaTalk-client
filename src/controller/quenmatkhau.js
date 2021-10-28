
    
    
    
    function clean(){
        document.getElementById("err").innerHTML = "";
  
      }
      function checkUser() {
  
  /////////////////////////////
        var validation=true;
        $(document).ready(function(){
          var $theForm = $('#form');
         $('#form').validate({
          rules: {
              'username': {
              required: true
            }
          },
          messages: {
              'username': {
              required: "Vui lòng nhập tài khoản!"
             
            }
          }
      })
  
      
      if(!($theForm.valid())) {
        validation=false;}
  });
  
     if(validation==false){return false;}
  
  //////////////////////////////////////
  
  
  
        var username = $('input[name="username"]').val()
      
        $.ajax({
          type: 'POST',
          url: host + endpoint.fogortPass,
          data: JSON.stringify({
            "username":username,       
            }),
          error: function(e) {
             /// console.log(e.responseJSON);
              //alert(e.responseJSON);
              document.getElementById("err").innerHTML=e.responseJSON;
  
          },
          success: function(data) {
             // localStorage.token = "JWT "+ data.data.accessToken;
              //console.log("JWT "+ data.data.accessToken);
              window.location.href = "/khoiphucmatkhau";
          },
          dataType: "json",
          contentType: "application/json"
       });
          return false;
      }