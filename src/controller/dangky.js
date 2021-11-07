


      


     function dangKy() {
        var validation=true;
        var today=new Date();
  
      jQuery.validator.addMethod('valid_username', function (value) {
      var regex = /^[A-Za-z0-9]+$/;
      return value.match(regex);
      });
  
  
      jQuery.validator.addMethod('valid_password', function (value) {
      var regex = /^[A-Za-z0-9]+$/;
      return value.match(regex);
      });
  
  
      jQuery.validator.addMethod('email', function (value) {
      var regex = /^[a-zA-Z0-9]+([._-]?[a-zA-Z0-9]+)*@[a-zA-Z0-9]+([.][a-zA-z0-9]+)+$/;
      return value.match(regex);
      });
  
      jQuery.validator.addMethod('valid_name', function (value) {
      var regex = /^[aAàÀảẢãÃáÁạẠăĂằẰẳẲẵẴắẮặẶâÂầẦẩẨẫẪấẤậẬbBcCdDđĐeEèÈẻẺẽẼéÉẹẸêÊềỀểỂễỄếẾệỆfFgGhHiIìÌỉỈĩĨíÍịỊjJkKlLmMnNoOòÒỏỎõÕóÓọỌôÔồỒổỔỗỖốỐộỘơƠờỜởỞỡỠớỚợỢpPqQrRsStTuUùÙủỦũŨúÚụỤưƯừỪửỬữỮứỨựỰvVwWxXyYỳỲỷỶỹỸýÝỵỴzZ0-9 ]+$/;
      return value.trim().match(regex);
      });
  
  
  
      jQuery.validator.addMethod('valid_date', function (value) {
      var birthday=new Date(value);
      var today=Date.now();
        if(birthday<=today)return true;
  
        else return false;
      });
         
  
        $(document).ready(function(){
          var $theForm = $('#formDangKy');
         $('#formDangKy').validate({
          rules: {
              'username': {
              required: true,
              valid_username:true
            },
            'password': {
              required: true,
              valid_password:true
            },
            'email': {
                required: true,
                email:true,
              
            },
            'name': {
                required: true,
                valid_name:true
              
            },
            'birthDay':{
              required:true,
              valid_date:true
              
              
              
            }
  
          },
          messages: {
              'username': {
              required: "Vui lòng nhập tài khoản!",
              valid_username:"Tài khoản không hợp lệ!"
             
            },
            'password': {
              required: "Vui lòng nhập mật khẩu!",
              valid_password:"Mật khẩu không hợp lệ!"
            },
            'email': {
                required: "Vui lòng nhập email!",
                email:"Email không hợp lệ!"
               
            },
            'name': {
                required: "Vui lòng nhập tên!",
                valid_name:"Tên không hợp lệ!"
          
            },
            'birthDay':{
              required:"Vui lòng chọn ngày sinh!",
              valid_date:"Ngày sinh không hợp lệ!"
            }
          }
      })
  
  
  
  
  
  
      if(!($theForm.valid())) {
        validation=false;}
        });
  
      if(validation==false)return false;
        document.getElementById("btndangky").disabled=true;
        var username = $('input[name="username"]').val();
        var password = $('input[name="password"]').val();
        var email = $('input[name="email"]').val();
        var name = $('input[name="name"]').val();
        var birthDay = $('input[name="birthDay"]').val();
        var gennder =  parseInt($('select[name="gennder"]').val().toString());
        var deviceToken="";
        $.ajax({
          type: 'POST',
          url: host + endpoint.register,
          data: JSON.stringify({
            "username":username,
            "password":password,
            "email":email,
            "name":name,
            "birthDay":birthDay,
            "gennder":gennder,
            "deviceToken":deviceToken       
            }),
          error: function(e) {
            document.getElementById("err").innerHTML = e.responseJSON;
            document.getElementById("btndangky").removeAttribute("disabled");
          },
          success: function(data) {
              localStorage.username = username;
              localStorage.password = password;
              window.location.href = "/kichhoat";
            
          },
          dataType: "json",
          contentType: "application/json"
       });
        
          return false;
  
      }