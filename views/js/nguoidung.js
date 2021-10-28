function acceptAdd(username) {
    $.ajax({
      type: 'PUT',
      url: host + endpoint.addFriend,
      data: JSON.stringify({
        "usernameAccept":username
        }),
      beforeSend: function(xhr) {
            if (localStorage.token) {
              xhr.setRequestHeader('jwt', localStorage.token);
            }
      },
      error: function(e) {
          alert(e.responseJSON);
      },
      success: function(data) {
        alert(data.status);
        getALL();
      },
      dataType: "json",
      contentType: "application/json"
   });
      return false;
  }

  function deleteFriend(username) {
    $.ajax({
      type: 'DELETE',
      url: host + endpoint.addFriend,
      data: JSON.stringify({
        "usernameDelete":username
        }),
      beforeSend: function(xhr) {
            if (localStorage.token) {
              xhr.setRequestHeader('jwt', localStorage.token);
            }
      },
      error: function(e) {
          alert(e.responseJSON);
      },
      success: function(data) {
        alert(data.status);
        getALL();
      },
      dataType: "json",
      contentType: "application/json"
   });
      return false;
  }

  function addUser() {
    var username = $('input[name="addUsername"]').val()
    $.ajax({
      type: 'POST',
      url: host + endpoint.addFriend,
      data: JSON.stringify({
        "usernameFriend":username
        }),
      beforeSend: function(xhr) {
            if (localStorage.token) {
              xhr.setRequestHeader('jwt', localStorage.token);
            }
      },
      error: function(e) {
          alert(e.responseJSON);
      },
      success: function(data) {
        alert(data.status);
        getALL();
      },
      dataType: "json",
      contentType: "application/json"
   });
      return false;
  }

  

function getALL(){
    {
        $.ajax({
          type: 'GET',
          url: host + endpoint.getProfileUser,
          beforeSend: function(xhr) {
            if (localStorage.token) {
              xhr.setRequestHeader('jwt', localStorage.token);
            }
          },
          success: function(data) {
 
            // thông tin
            var avatar = document.getElementById("avatar");
            avatar.src=data.data.avatar;

            var username = document.getElementById("username");
            username.innerHTML=data.data.username;
            var name = document.getElementById("name");
            name.innerHTML=data.data.name;
            var gennder = document.getElementById("gennder");
            if (data.data.gennder = "0") {
                 gennder.innerHTML="Nam";
             } else {
                 gennder.innerHTML="Nữ";
             };
            var birthDay = document.getElementById("birthDay");
            birthDay.innerHTML=data.data.birthDay;
            var email = document.getElementById("email");
            email.innerHTML=data.data.email;
 
            // danh sách bạn
            const friendsList = data.data.friendsList;
            var d = 0;
            document.getElementById('tableFriendsBody').innerHTML="";
            for (var i in friendsList){
             d++;
             document.getElementById('tableFriendsBody').innerHTML += 
             '<tr><th scope="row">'+d+'</th><td><a href="#">'+friendsList[i].username+'</a></td><td><button type="button" onClick="if(confirm(\'Are you sure?\')) deleteFriend(\'' + friendsList[i].username + '\')" class="btn btn-danger">Xóa bạn</button></td></tr> ';
            }
            
            //danh sach loi moi
            const requestList = data.data.requestsFriendList;
            var d = 0;
            document.getElementById('tableRequestBody').innerHTML="";
            for (var i in requestList){
             d++;
             document.getElementById('tableRequestBody').innerHTML += 
             '<tr><th scope="row">'+d+'</th><td><a href="#">'+requestList[i].username+
             '</a></td><td><button type="button" id="submit" name="submit"  onClick="acceptAdd(\'' + requestList[i].username + '\')"  class="btn btn-success">Chấp thuận</button>&nbsp<button type="button" onClick="if(confirm(\'Are you sure?\')) deleteFriend(\'' + requestList[i].username + '\')"  class="btn btn-light">Từ chối</button></td></tr> ';
            
            }
          },
          error: function(e) {
           
            window.location.href = "/dangnhap";
            
          }
          
          
        });
    };
};

function dangXuat() {
    if (confirm('Bạn có muốn đăng xuất?')) {
        localStorage.clear();
        window.location.href = "/dangnhap";
      } else {
        // false
      }
    
};

function getUploadFile() {
  { 
      var formData = new FormData();
      formData.append('filename', $('input[name="avatarUpdate"]')[0].files[0]); 
      $.ajax({
        type: 'POST',
        url:  host + endpoint.uploadfile,
        data: formData,
        cache:false,
        contentType: false,
        processData: false,
        beforeSend: function(xhr) {
          if (localStorage.token) {
            xhr.setRequestHeader('jwt', localStorage.token);
          }
        },
        success: function(data) {
            getUpdateAvatar(data.data);
        },
        error: function(e) {
          alert(e.responseJSON)
        }
        
        
      });
  };
};



function getUpdateAvatar(linkAvatarT) {
  {
    $.ajax({
      type: 'GET',
      url: host + endpoint.getProfileUser,
      beforeSend: function(xhr) {
        if (localStorage.token) {
          xhr.setRequestHeader('jwt', localStorage.token);
        }else{
          window.location.href = "/dangnhap";
        }
      },
      success: function(data) {
        var nameT = data.data.name;
        var birthDayT = data.data.birthDay;
        var gennderT = parseInt(data.data.gennder.toString());
        var data = JSON.stringify({
          "name": nameT,
          "birthDay": birthDayT,
          "gennder": gennderT,
          "avatar":linkAvatarT,
          "background":""
        });
        console.log(data);
        
        $.ajax({
          type: 'POST',
          url:  host + endpoint.updateProfile,
          data: JSON.stringify({
            "name": nameT,
            "birthDay": birthDayT,
            "gennder": gennderT,
            "avatar":linkAvatarT,
            "background":""
          }),
          beforeSend: function(xhr) {
            if (localStorage.token) {
              xhr.setRequestHeader('jwt', localStorage.token);
            }
          },
          success: function(data) {
            window.location.href = "/nguoidung";
          },
          error: function(e) {
           alert(e.responseJSON);
          },
          dataType: "json",
          contentType: "application/json"

        });
        
      },
      error: function(e) {
        window.location.href = "/dangnhap";
      }

    });

      
  };
};

$(function() {
    getALL();
});