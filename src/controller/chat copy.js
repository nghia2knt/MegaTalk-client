var roomChatID = 0;
var socket = io(hostsocket, { transports: ["websocket"] });
var firstTime = true;

const fixNumber = (number) => {
  return number >= 10 ? number : `0${number}`;
};
const maskDate = (dateString) => {
  var date = new Date(dateString);
  return `${fixNumber(date.getHours())}:${fixNumber(
    date.getMinutes()
  )} ${fixNumber(date.getDate())}/${fixNumber(date.getMonth() + 1)}/${fixNumber(
    date.getFullYear()
  )}`;
};

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
        // thông tin

        // danh sách room
        localStorage.username = data.data.username;
        const chatsList = data.data.chatsList;
        var d = 0;
        document.getElementById("tableRoom").innerHTML = "";
        for (var i in chatsList) {
          d++;
          //set ten
          if (chatsList[i].roomName == null) {
            var roomname = "Chưa đặt tên";
          } else {
            var roomname = chatsList[i].roomName;
          }
          //set tin nhan moi nhat
          var count = Object.keys(chatsList[i].messagesList).length;
          var lastMess = chatsList[i].messagesList[count - 1].content;

          //set ID phong
          var chatID = chatsList[i].roomID;

          document.getElementById("tableRoom").innerHTML +=
            "<tr><td onclick=\"changeID('" +
            chatID +
            '\')" class="list-group-item list-group-item-action"><h5>' +
            roomname +
            '</h5><p class="lastMess-2">' +
            lastMess +
            "</p></td></tr>";
        }

        // tin nhắn trong room

        if (firstTime) {
          roomChatID = data.data.chatsList[0].roomID;
          firstTime = false;
        }
        var chatsListMain = data.data.chatsList.filter(
          (e) => e.roomID == roomChatID
        )[0];
        if (chatsListMain.roomName == null) {
          var roomname = "Chưa đặt tên";
        } else {
          var roomname = chatsListMain.roomName;
        }
        var d = 0;
        document.getElementById("roomName").innerHTML = roomname;

        const messagesList = chatsListMain.messagesList;
        document.getElementById("tableChatbox").innerHTML = "";
        
        
      //  const rMess = messagesList.reverse();
       
          (async () => {
            for (var i in messagesList) {
              d++;
            try {
                var info = await getInfoToChat(messagesList[i].sender);
                if (info.avatar == "")
                  info.avatar = "./asset/image/defaultAvatar.jpg"; 

                document.getElementById("tableChatbox").innerHTML +=
                '<tr class="messenger"><td style="height:100px;width:100px;text-align: center;vertical-align: middle;">'+
                '<img src="'+info.avatar+'" alt="Avatar" class="avatar"></td><td class="p-4">' +
                '<p class="text-start fw-bold">' +
                info.name+
                "</p>" +
                '<p class="text-start">' +
                messagesList[i].content +
                "</p>" +
                '<p class="text-start fw-lighter">' +
                maskDate(messagesList[i].createAt) +
                "</p>" +
                "</td></tr>";
                $("#myMessageContainer")
                .stop()
                .animate({
                  scrollTop: $("#myMessageContainer")[0].scrollHeight,
                });
              
            } catch (e) {
                // Deal with the fact the chain failed
            }
          }
          
       
        })();
          
          
         
      
       
      },
      error: function () {
        window.location.href = "/dangnhap";
      },
    });
  }
}

function socketUp() {
  socket.on(`${localStorage.username}`, function (msg) {
    console.log(msg);
    getALL();
  });
}

function changeID(id) {
  roomChatID = id;
  getALL();
}
function sendMess() {
  var content = $('input[name="messArea"]').val();
  var roomID = roomChatID;
  document.getElementById("messArea").value = "";
/*
  document.getElementById("tableChatbox").innerHTML +=
    '<tr class="messenger"><td class="p-4">' +
    '<p class="text-start fw-lighter">' +
    "Đang gửi tin nhắn" +
    "</p>" +
    '<p class="text-start">' +
    content +
    "</p>" +
    "</td></tr>"; */
  $("#myMessageContainer")
    .stop()
    .animate({
      scrollTop: $("#myMessageContainer")[0].scrollHeight,
    });
   
  if (content != "") {
    $.ajax({
      type: "POST",
      url: host + endpoint.sendMessByRoomID,
      data: JSON.stringify({
        type: 0,
        content: content,
        roomID: roomID,
      }),
      beforeSend: function (xhr) {
        if (localStorage.token) {
          xhr.setRequestHeader("jwt", localStorage.token);
        }
      },
      error: function (e) {
        alert(e.responseJSON);
      },
      success: function (data) {},
      dataType: "json",
      contentType: "application/json",
    });
  }

  return false;
}

function dangXuat() {
  if (confirm("Bạn có muốn đăng xuất?")) {
    localStorage.clear();
    window.location.href = "/dangnhap";
  } else {
    // false
  }
}

async function getInfoToChat(username) {
  try{
    const info = await getInfo(username);
    const result = {
      name: info.data.name,
      avatar: info.data.avatar
    }
    return result;
  }catch(err){

  }
 
}

function getInfo(username){
  return $.ajax({
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
    },
    dataType: "json",
    contentType: "application/json",
  });
}


function getMultiUser(list){
  return $.ajax({
    type: "POST",
    url: host + endpoint.findUser,
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

$(function () {
  getALL();
  socketUp();
});
