var dataMain ="";
const fixNumber = (number) => {
  return number >= 10 ? number : `0${number}`;
};
const maskDate = (dateString) => {
  var date = new Date(dateString);
  return `${fixNumber(date.getDate())}/${fixNumber(
    date.getMonth() + 1
  )}/${fixNumber(date.getFullYear())}`;
};
function acceptAdd(username) {
  $.ajax({
    type: "PUT",
    url: host + endpoint.addFriend,
    data: JSON.stringify({
      usernameAccept: username,
    }),
    beforeSend: function (xhr) {
      if (localStorage.token) {
        xhr.setRequestHeader("jwt", localStorage.token);
      }
    },
    error: function (e) {
      alert(e.responseJSON);
    },
    success: function (data) {
      alert("Đã chấp thuận lời mời kết bạn thành công!");
      window.location.href="/nguoidung";
    },
    dataType: "json",
    contentType: "application/json",
  });
  return false;
}

function deleteFriend(username) {
  $.ajax({
    type: "DELETE",
    url: host + endpoint.addFriend,
    data: JSON.stringify({
      usernameDelete: username,
    }),
    beforeSend: function (xhr) {
      if (localStorage.token) {
        xhr.setRequestHeader("jwt", localStorage.token);
      }
    },
    error: function (e) {
      alert(e.responseJSON);
    },
    success: function (data) {
      alert("Đã xóa bạn thành công!");
      window.location.href="/nguoidung";
    },
    dataType: "json",
    contentType: "application/json",
  });
  return false;
}

function addUser() {
  var username = $('input[name="addUsername"]').val();
  $.ajax({
    type: "POST",
    url: host + endpoint.addFriend,
    data: JSON.stringify({
      usernameFriend: username,
    }),
    beforeSend: function (xhr) {
      if (localStorage.token) {
        xhr.setRequestHeader("jwt", localStorage.token);
      }
    },
    error: function (e) {
      alert(e.responseJSON);
    },
    success: function (data) {
      alert("Đã gửi lời mời kết bạn thành công!");
      window.location.href="/nguoidung";
    },
    dataType: "json",
    contentType: "application/json",
  });
  return false;
}

function getALL() {
  {
    $.ajax({
      type: "GET",
      url: host + endpoint.getProfileUser,
      beforeSend: function (xhr) {
        if (localStorage.token) {
          xhr.setRequestHeader("jwt", localStorage.token);
        }
      },
      success: function (data) {
        console.log(data);
        dataMain = data;
        // thông tin
        if (data.data.avatar==""){
          var avatar = document.getElementById("avatar");
          avatar.src = "./asset/image/defaultAvatar.jpg";
        }else{ 
          var avatar = document.getElementById("avatar");
          avatar.src = data.data.avatar;
        }
       

        var username = document.getElementById("username");
        username.innerHTML = data.data.username;
        var name = document.getElementById("name");
        name.innerHTML = data.data.name;
        var gennder = document.getElementById("gennder");
        if ((data.data.gennder == 0)) {
          gennder.innerHTML = "Nam";
        } else {
          gennder.innerHTML = "Nữ";
        }
        var birthDay = document.getElementById("birthDay");
        birthDay.innerHTML = maskDate(data.data.birthDay);
        var email = document.getElementById("email");
        email.innerHTML = data.data.email;

        // danh sách bạn
        const friendsList = data.data.friendsList;
        var friendMember = [];
        for (var i in friendsList) {
          const member = friendsList[i].username;
          friendMember.push(member);
        
        }
        const requestList = data.data.requestsFriendList;
        for (var i in requestList) {
          const member = requestList[i].username;
          friendMember.push(member);
        }

       // console.log(friendMember);
       
        getMultiUser(friendMember).then(
          (value)=>{
            var memberListInfo=value;
           
            for (var i in friendsList) {
              const obj = memberListInfo.data.filter(
                (e) => e.username == friendsList[i].username
              )[0];
              if (obj.avatar == "")
              obj.avatar = "./asset/image/defaultAvatar.jpg"; 
              document.getElementById('tableFriendsBody').innerHTML +=
              '<tr><td><a href="#" title="" data-bs-toggle="modal" data-bs-target="#infoAnotherModal" onclick=\"getProfileAnother(\''+obj.username+'\')" class="iconHV">'+
              '<img src="'+obj.avatar+'" alt="Avatar" class="avatar2"></td><td  style="text-align: left;">' +
              '</a></td>'+
              '<td style="text-align: center;vertical-align: middle;">'+obj.name+'<br>('+obj.username+')<td>'+
              '<td style="text-align: center;vertical-align: middle;"><button type="button" class="btn btn-danger" onClick="if(confirm(\'Are you sure?\')) deleteFriend(\''+obj.username+'\')"  >Xóa bạn</button><td>'+
              '</tr>';
              
            }
            
            for (var i in requestList) {
              const obj = memberListInfo.data.filter(
                (e) => e.username == requestList[i].username
              )[0];
              if (obj.avatar == "")
              obj.avatar = "./asset/image/defaultAvatar.jpg"; 
              document.getElementById('tableRequestBody').innerHTML +=
              '<tr><td><a href="#" title="" data-bs-toggle="modal" data-bs-target="#infoAnotherModal" onclick=\"getProfileAnother(\''+obj.username+'\')" class="iconHV">'+
              '<img src="'+obj.avatar+'" alt="Avatar" class="avatar2"></td><td  style="text-align: left;">' +
              '</a></td>'+
              '<td style="text-align: center;vertical-align: middle;">'+obj.name+'<br>('+obj.username+')<td>'+
              '<td style="text-align: center;vertical-align: middle;"><button type="button" class="btn btn-success" onClick="acceptAdd(\''+obj.username+'\')"  >Chấp thuận</button><button type="button" class="btn btn-light">Từ Chối</button><td>'+
              '</tr>';
              
            }
          }

        )
        /*
         var d = 0;
        document.getElementById("tableFriendsBody").innerHTML = "";
        for (var i in friendsList) {
          d++;
          document.getElementById("tableFriendsBody").innerHTML +=
            '<tr><th scope="row">' +
            d +
            '</th><td><a href="#">' +
            friendsList[i].username +
            "</a></td><td><button type=\"button\" onClick=\"if(confirm('Are you sure?')) deleteFriend('" +
            friendsList[i].username +
            '\')" class="btn btn-danger">Xóa bạn</button></td></tr> ';
        }

        //danh sach loi moi
        /*
        const requestList = data.data.requestsFriendList;
        var d = 0;
        document.getElementById("tableRequestBody").innerHTML = "";
        for (var i in requestList) {
          d++;
          document.getElementById("tableRequestBody").innerHTML +=
            '<tr><th scope="row">' +
            d +
            '</th><td><a href="#">' +
            requestList[i].username +
            '</a></td><td><button type="button" id="submit" name="submit"  onClick="acceptAdd(\'' +
            requestList[i].username +
            '\')"  class="btn btn-success">Chấp thuận</button> &nbsp<button type="button" onClick="if(confirm(\'Are you sure?\')) deleteFriend(\'' +
            requestList[i].username +
            '\')"  class="btn btn-light">Từ chối</button></td></tr> ';
         
        }
        */
      },
      error: function (e) {
        window.location.href = "/dangnhap";
      },
    });
  }
}

function dangXuat() {
  if (confirm("Bạn có muốn đăng xuất?")) {
    localStorage.clear();
    window.location.href = "/dangnhap";
  } else {
    // false
  }
}

function getUploadFile() {
  if (document.getElementById('avatarUpdate').value==""){
    getUpdateMain("");
  }else
  {
    var formData = new FormData();
    formData.append("filename", $('input[name="avatarUpdate"]')[0].files[0]);
    $.ajax({
      type: "POST",
      url: host + endpoint.uploadfile,
      data: formData,
      cache: false,
      contentType: false,
      processData: false,
      beforeSend: function (xhr) {
        if (localStorage.token) {
          xhr.setRequestHeader("jwt", localStorage.token);
        }
      },
      success: function (data) {
        getUpdateMain(data.data);
      },
      error: function (e) {
        alert(e.responseJSON);
      },
    });
  }
}

function getUpdateMain(linkAvatarT) {
  {
    $.ajax({
      type: "GET",
      url: host + endpoint.getProfileUser,
      beforeSend: function (xhr) {
        if (localStorage.token) {
          xhr.setRequestHeader("jwt", localStorage.token);
        } else {
          window.location.href = "/dangnhap";
        }
      },
      success: function (data) {
        var nameT = $('input[name="nameUpdate"]').val();
        var birthDayT = $('input[name="birthDayUpdate"]').val();
        var gennderT = parseInt($('select[name="gennderUpdate"]').val().toString());
       
        if (linkAvatarT == ""){
          var avatarT = data.data.avatar;
        }else{
          var avatarT = linkAvatarT;
        }
        

        $.ajax({
          type: "POST",
          url: host + endpoint.updateProfile,
          data: JSON.stringify({
            name: nameT,
            birthDay: birthDayT,
            gennder: gennderT,
            avatar: avatarT,
            background: "",
          }),
          beforeSend: function (xhr) {
            if (localStorage.token) {
              xhr.setRequestHeader("jwt", localStorage.token);
            }
          },
          success: function (data) {
            window.location.href = "/nguoidung";
          },
          error: function (e) {
            alert(e.responseJSON);
          },
          dataType: "json",
          contentType: "application/json",
        });
      },
      error: function (e) {
        window.location.href = "/dangnhap";
      },
    });
  }
}




function getInfoUpdate() {
  {
      $.ajax({
        type: 'GET',
        url:  host + endpoint.getProfileUser,
        beforeSend: function(xhr) {
          if (localStorage.token) {
            xhr.setRequestHeader('jwt', localStorage.token);
          }
        },
        success: function(data) {
          console.log(data);
          document.getElementById('nameUpdate').value=data.data.name;
          document.getElementById('birthDayUpdate').value=data.data.birthDay;
          document.getElementById('gennderUpdate').value=data.data.gennder;
          
        },
        error: function(e) {
          window.location.href = "/dangnhap";
        }
        
        
      });
  };
};

function getMultiUser(list){
  return $.ajax({
    type: "POST",
    url: host + endpoint.findMultiUser,
    data: JSON.stringify({
      "listUser":list
    }),
    //async: false,
    beforeSend: function (xhr) {
      if (localStorage.token) {
        xhr.setRequestHeader("jwt", localStorage.token);
      }
    },
    error: function (e) {
      alert(e.responseJSON);
    },
    success: function (data) {
    },
    dataType: "json",
    contentType: "application/json",
  });
}

function getProfileAnother(username){
  $.ajax({
    type: "POST",
    url: host + endpoint.findUser,
    data: JSON.stringify({
      "usernameFind":username
    }),
    //async: false,
    beforeSend: function (xhr) {
      if (localStorage.token) {
        xhr.setRequestHeader("jwt", localStorage.token);
      }
    },
    error: function (e) {
      alert(e.responseJSON);
    },
    success: function (data) {
      if (data.data.avatar==""){
        var avatar = document.getElementById("avatarInfo");
        avatar.src = "./asset/image/defaultAvatar.jpg";
      }else{ 
        var avatar = document.getElementById("avatarInfo");
        avatar.src = data.data.avatar;
      }
     

      var username = document.getElementById("usernameInfo");
      username.innerHTML = data.data.username;
      var name = document.getElementById("nameInfo");
      name.innerHTML = data.data.name;
      var gennder = document.getElementById("gennderInfo");
      if ((data.data.gennder == "0")) {
        gennder.innerHTML = "Nam";
      } else {
        gennder.innerHTML = "Nữ";
      }
      var birthDay = document.getElementById("birthDayInfo");
      birthDay.innerHTML = maskDate(data.data.birthDay);
      var email = document.getElementById("emailInfo");
      email.innerHTML = data.data.email;

      var data2 = dataMain;
    //  data2 = data2);
     // console.log(data);
      document.getElementById("btnThemBan").innerHTML =  '<button type="button" class="btn btn-primary" onclick=\"addUser(\''+data.data.username+'\')"  data-bs-dismiss="modal"> Thêm bạn </button>';
    
      for (var i in data2.data.friendsList){
        if (data2.data.friendsList[i].username == data.data.username){
          document.getElementById("btnThemBan").innerHTML = data.data.name + " là bạn bè của bạn.";
        }
      }
      for (var i in data2.data.requestsFriendList){
        if (data2.data.requestsFriendList[i].username == data.data.username){
          document.getElementById("btnThemBan").innerHTML ='<button type="button" class="btn btn-success"  onclick=\"acceptAdd(\''+data.data.username+'\')"  data-bs-dismiss="modal"> Chấp thuận lời mời kết bạn </button>';
        }
      }
      for (var i in data.data.requestsFriendList){
        if (data.data.requestsFriendList[i].username == data2.data.username){
          document.getElementById("btnThemBan").innerHTML ='<button type="button" class="btn btn-primary disabled"  data-bs-dismiss="modal"> Đã gửi lời mời kết bạn </button>';
        }
      }
      if (data.data.username == data2.data.username){
        document.getElementById("btnThemBan").innerHTML = "";

      }
    },
    dataType: "json",
    contentType: "application/json",
  });
  return true;
}

$(function () {
  getALL();
});
