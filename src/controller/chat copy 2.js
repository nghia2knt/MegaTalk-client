
var roomChatID = 0;
var socket = io(hostsocket, { transports: ["websocket"] });
var firstTime = true;
var roomNameMain = "nhóm chưa đặt tê";
var dataChat="";
var maxLoad = 20;
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
        //  console.log(localStorage.token);
        }
      },
      success: function (data) {
        // thông tin
        // danh sách room
        dataChat = JSON.stringify(data);
        localStorage.username = data.data.username;
        const chatsList = data.data.chatsList;
        var d = 0;
       

        // get memeber lan 1 

        var roomMember = [];
        for (var i in chatsList) {
          if (chatsList[i].type==0) {
            const memberList = data.data.chatsList[i].member;
            for (j in memberList){
              if (memberList[j].username!=localStorage.username){
                roomMember.push(memberList[j].username) 
              }
            }
          }
        }
     //   console.log(roomMember);
        var memberListInfo = [];
        getMultiUser(roomMember).then(
          (value)=>{
            memberListInfo=value;
            document.getElementById("tableRoom").innerHTML = "";
          
        for (var i in chatsList) {
          d++;
          //set ten va avatar mac dinh
          if (chatsList[i].roomName == null) {
            var roomname = "Nhóm chưa đặt tên";
          } else {
            var roomname = chatsList[i].roomName;
          }

          var ava = './asset/image/defaultAvatar.jpg';



          if (chatsList[i].type==0){
            const memberList = data.data.chatsList[i].member;
            for (j in memberList){
              if (memberList[j].username!=localStorage.username){
                const obj = memberListInfo.data.filter(
                  (e) => e.username == memberList[j].username
                )[0];
                roomname=obj.name;
                if (obj.avatar!=""){
                  ava = obj.avatar;
                }
              }
            }
          }
          
          // set ten phong cho phong dau tien 

          if (firstTime){
            if (i == 0){
                 
              roomNameMain = roomname;
             // console.log(roomNameMain);
           //   console.log(firstTime);
            }
          }
         
         
          
          //set tin nhan moi nhat
          var count = Object.keys(chatsList[i].messagesList).length;
          var lastMess = chatsList[i].messagesList[count - 1].content;
          var lastTime = chatsList[i].messagesList[count - 1].createAt;
          //set ID phong
          var chatID = chatsList[i].roomID;

          //set ava
         // if (chatsList[i].type==0){
           
          //}
         

          document.getElementById("tableRoom").innerHTML +=
            
            "<tr onclick=\"changeID('" +
            chatID +"','"+roomname+
            '\')" class="list-group-item list-group-item-action" id=R_'+chatID+'>'+
            '<td style="height:50px;width:50px;text-align: center;vertical-align: middle;border:none;">'+
            '<img src="'+ava+'" alt="Avatar" class="avatar2"></td><td class="" style="border:none;" >' +
            '<p class="text-start fw-bold">' +
            roomname+
            "</p>" +
            '<p class="text-start lastMess-2" id = "C_'+chatID+'">' +
            lastMess +
            "</p>" +
            '<p class="text-start fw-lighter fs-6" id = "T_'+chatID+'">' +
            maskDate(lastTime) +
            "</p>" +
            "</td></tr>"
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
       


        document.getElementById("roomName").innerHTML = roomNameMain;

       

   

        // search info member
        const memberList = chatsListMain.member;
        var arrUser = [];
        for (var i in memberList){
           arrUser.push(memberList[i].username) 
        }
        var memberListInfo = [];
        getMultiUser(arrUser).then(
          (value)=>{
            memberListInfo=value;
            selectRoom();
            var messagesList = chatsListMain.messagesList;
            if (maxLoad >= messagesList.length){
              document.getElementById("tableChatbox").innerHTML = "";
            }else{
              messagesList = messagesList.slice(Math.max(messagesList.length - maxLoad, 0));
              document.getElementById("tableChatbox").innerHTML = "";
              document.getElementById("tableChatbox").innerHTML += 
              '<tr><td></td><td style="text-align: center;"><a href="#" onclick="return loadMore()">Xem thêm</a></td><td></td></tr>'
            }
            for (var i in messagesList) {
              const obj = memberListInfo.data.filter(
                (e) => e.username == messagesList[i].sender
              )[0];
              if (obj.avatar == "")
                  obj.avatar = "./asset/image/defaultAvatar.jpg"; 
              d++;
              
              //console.log(dataChat.username);
              if (obj.username!=localStorage.username){
                if (messagesList[i].type==0){
                  document.getElementById("tableChatbox").innerHTML +=
                  '<tr class="messenger"><td style="height:100px;width:100px;text-align: center;vertical-align: middle;border:none">'+
                  '<img src="'+obj.avatar+'" alt="Avatar" class="avatar"></td><td  style="border:none;text-align: left;">' +
                  '<p class="text-start fw-bold">' +
                  obj.name+
                  "</p>" +
                  '<label class="text-start triangle-obtuse right " style="white-space: normal;">' +
                  '<label class="fs-5">'+  messagesList[i].content + '</label><br>'+  
                  '<label class="fw-lighter fs-6"><small>' + maskDate(messagesList[i].createAt) + "</small></label>" +
                  "</label>" +
                  '</td><td style="border:none"></td></tr>';
                }else
                if (messagesList[i].type==1){
                  document.getElementById("tableChatbox").innerHTML +=
                  '<tr class="messenger"><td style="height:100px;width:100px;text-align: center;vertical-align: middle;border:none">'+
                  '<img src="'+obj.avatar+'" alt="Avatar" class="avatar"></td><td style="border:none;text-align: left;">' +
                  '<p class="text-start fw-bold">' +
                  obj.name+
                  "</p>" +
                  '<label class="text-start triangle-obtuse right " style="white-space: normal;">'+
                  '<img src="'+messagesList[i].content+'" style="max-width:400px"><br>' +
                  '<label class="fw-lighter fs-6"><small>' + maskDate(messagesList[i].createAt) + "</small></label>" +
                  "</label>" +
                  '</td><td style="border:none"></td></tr>';
                }else
                if (messagesList[i].type==2){
                  document.getElementById("tableChatbox").innerHTML +=
                  '<tr class="messenger"><td style="height:100px;width:100px;text-align: center;vertical-align: middle;border:none">'+
                  '<img src="'+obj.avatar+'" alt="Avatar" class="avatar"></td><td style="border:none;text-align: left;">' +
                  '<p class="text-start fw-bold">' +
                  obj.name+
                  "</p>" +
                  '<label class="text-start triangle-obtuse right " style="white-space: normal;">'+
                  '<video width="320" controls><source src="'+messagesList[i].content+'" type="video/mp4"></video><br>' +
                  '<label class="fw-lighter fs-6"><small>' + maskDate(messagesList[i].createAt) + "</small></label>" +
                  "</label>" +
                 
                  '</td><td style="border:none"></td></tr>';
                }
              }else{
                if (messagesList[i].type==0){
                  document.getElementById("tableChatbox").innerHTML +=
                  '<tr class="messenger"><td style="border:none"></td><td  style="border:none;text-align: right;">' +
                 
                  '<label class="text-start triangle-obtuse left " style="white-space: normal;">' +
                  '<label class="fs-5">'+  messagesList[i].content + '</label><br>'+  
                  '<label class="fw-lighter fs-6"><small>' + maskDate(messagesList[i].createAt) + "</small></label>" +
                  "</label>" +
                  '</td><td style="height:100px;width:100px;text-align: center;vertical-align: middle;border:none">'+
                  '<img src="'+obj.avatar+'" alt="Avatar" class="avatar"></td></tr>';
                }else
                if (messagesList[i].type==1){
                  document.getElementById("tableChatbox").innerHTML +=
                  '<tr class="messenger"><td style="border:none"></td><td style="border:none;text-align: right;">' +
                 
                  '<label class="text-start triangle-obtuse left " style="white-space: normal;">'+
                  '<img src="'+messagesList[i].content+'" style="max-width:400px"><br>' +
                  '<label class="fw-lighter fs-6"><small>' + maskDate(messagesList[i].createAt) + "</small></label>" +
                  "</label>" +
                 
                  '</td><td style="height:100px;width:100px;text-align: center;vertical-align: middle;border:none">'+
                  '<img src="'+obj.avatar+'" alt="Avatar" class="avatar"></td></tr>';
                }else
                if (messagesList[i].type==2){
                  document.getElementById("tableChatbox").innerHTML +=
                  '<tr class="messenger"><td style="border:none"></td><td style="border:none;text-align: right;">' +
                 
                  '<label class="text-start triangle-obtuse left " style="white-space: normal;">'+
                  '<video width="320" controls><source src="'+messagesList[i].content+'" type="video/mp4"></video><br>' +
                  '<label class="fw-lighter fs-6"><small>' + maskDate(messagesList[i].createAt) + "</small></label>" +
                  "</label>" +
                 
                  '</td><td style="height:100px;width:100px;text-align: center;vertical-align: middle;border:none">'+
                  '<img src="'+obj.avatar+'" alt="Avatar" class="avatar"></td></tr>';
                }
              }
              
              
            }
           

          }
        ).then(()=>{
          if (maxLoad == 20) {
            $("#myMessageContainer")
          .stop()
          .animate({
          scrollTop: $("#myMessageContainer")[0].scrollHeight+1000,
        });}
        })
       
      }) 

        
      },
      error: function () {
        window.location.href = "/dangnhap";
      },
    });
  }
}

function socketUp() {
  socket.on(`${localStorage.username}`, function (msg) {
  //  getALL();
    // cap nhat room 
  //  console.log(msg.data);
  /*
    var type = msg.type;
    var data = JSON.parse(msg.data);
    if (type=="newMess"){
      document.getElementById("C_"+data.roomID).innerHTML = data.content;
      document.getElementById("T_"+data.roomID).innerHTML = maskDate(data.createAt);
    }
    */
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
        dataChat = JSON.stringify(data);
        const chatsList = data.data.chatsList;
        var d = 0;
        

        // get memeber lan 1 

        var roomMember = [];
        for (var i in chatsList) {
          if (chatsList[i].type==0) {
            const memberList = data.data.chatsList[i].member;
            for (j in memberList){
              if (memberList[j].username!=localStorage.username){
                roomMember.push(memberList[j].username) 
              }
            }
          }
        }
     //   console.log(roomMember);
        var memberListInfo = [];
        getMultiUser(roomMember).then(
          (value)=>{
            memberListInfo=value;
            document.getElementById("tableRoom").innerHTML = "";
        for (var i in chatsList) {
          d++;
          //set ten va avatar mac dinh
          if (chatsList[i].roomName == null) {
            var roomname = "Nhóm chưa đặt tên";
          } else {
            var roomname = chatsList[i].roomName;
          }

          var ava = './asset/image/defaultAvatar.jpg';



          if (chatsList[i].type==0){
            const memberList = data.data.chatsList[i].member;
            for (j in memberList){
              if (memberList[j].username!=localStorage.username){
                const obj = memberListInfo.data.filter(
                  (e) => e.username == memberList[j].username
                )[0];
                roomname=obj.name;
                if (obj.avatar!=""){
                  ava = obj.avatar;
                }
              }
            }
          }
          
          // set ten phong cho phong dau tien 

          //set tin nhan moi nhat
          var count = Object.keys(chatsList[i].messagesList).length;
          var lastMess = chatsList[i].messagesList[count - 1].content;
          var lastTime = chatsList[i].messagesList[count - 1].createAt;
          //set ID phong
          var chatID = chatsList[i].roomID;

          //set ava
         // if (chatsList[i].type==0){
           
          //}
         
           document.getElementById("tableRoom").innerHTML +=
            
            "<tr onclick=\"changeID('" +
            chatID +"','"+roomname+
            '\')" class="list-group-item list-group-item-action" id=R_'+chatID+'>'+
            '<td style="height:50px;width:50px;text-align: center;vertical-align: middle;border:none;">'+
            '<img src="'+ava+'" alt="Avatar" class="avatar2"></td><td class="" style="border:none;" >' +
            '<p class="text-start fw-bold">' +
            roomname+
            "</p>" +
            '<p class="text-start lastMess-2" id = "C_'+chatID+'">' +
            lastMess +
            "</p>" +
            '<p class="text-start fw-lighter fs-6" id = "T_'+chatID+'">' +
            maskDate(lastTime) +
            "</p>" +
            "</td></tr>"
        }
      
        changeID(roomChatID,roomNameMain);
        
      });

      },
      error: function(e) {
        window.location.href = "/dangnhap";
      }
      
      
    });
});
}

function loadMore(){
  maxLoad+=20;
  getALL();
}

function changeID(id,roomname) {
  roomChatID = id;
  roomNameMain = roomname;
  var data = dataChat;
  data = JSON.parse(data);
  maxLoad = 20;
 // console.log(data);
  var chatsListMain = data.data.chatsList.filter(
    (e) => e.roomID == roomChatID
  )[0];


 
  var d = 0;
  document.getElementById("roomName").innerHTML = roomNameMain;
  




  // search info member
  const memberList = chatsListMain.member;
  var arrUser = [];
  for (var i in memberList){
     arrUser.push(memberList[i].username) 
  }
  var memberListInfo = [];
  getMultiUser(arrUser).then(
    (value)=>{
      memberListInfo=value;
      
      var messagesList = chatsListMain.messagesList;
      if (maxLoad >= messagesList.length){
        document.getElementById("tableChatbox").innerHTML = "";
      }else{
        messagesList = messagesList.slice(Math.max(messagesList.length - maxLoad, 0));
        document.getElementById("tableChatbox").innerHTML = "";
        document.getElementById("tableChatbox").innerHTML += 
        '<tr><td></td><td style="text-align: center;"><a href="#" onclick="return loadMore()">Xem thêm</a></td><td></td></tr>'
      }
     
      for (var i in messagesList) {
        const obj = memberListInfo.data.filter(
          (e) => e.username == messagesList[i].sender
        )[0];
        if (obj.avatar == "")
            obj.avatar = "./asset/image/defaultAvatar.jpg"; 
        d++;
        if (obj.username!=localStorage.username){
          if (messagesList[i].type==0){
            document.getElementById("tableChatbox").innerHTML +=
            '<tr class="messenger"><td style="height:100px;width:100px;text-align: center;vertical-align: middle;border:none">'+
            '<img src="'+obj.avatar+'" alt="Avatar" class="avatar"></td><td  style="border:none;text-align: left;">' +
            '<p class="text-start fw-bold">' +
            obj.name+
            "</p>" +
            '<label class="text-start triangle-obtuse right " style="white-space: normal;">' +
            '<label class="fs-5">'+  messagesList[i].content + '</label><br>'+  
            '<label class="fw-lighter fs-6"><small>' + maskDate(messagesList[i].createAt) + "</small></label>" +
            "</label>" +
            '</td><td style="border:none"></td></tr>';
          }else
          if (messagesList[i].type==1){
            document.getElementById("tableChatbox").innerHTML +=
            '<tr class="messenger"><td style="height:100px;width:100px;text-align: center;vertical-align: middle;border:none">'+
            '<img src="'+obj.avatar+'" alt="Avatar" class="avatar"></td><td style="border:none;text-align: left;">' +
            '<p class="text-start fw-bold">' +
            obj.name+
            "</p>" +
            '<label class="text-start triangle-obtuse right " style="white-space: normal;">'+
            '<img src="'+messagesList[i].content+'" style="max-width:400px"><br>' +
            '<label class="fw-lighter fs-6"><small>' + maskDate(messagesList[i].createAt) + "</small></label>" +
            "</label>" +
           
            '</td><td style="border:none"></td></tr>';
          }else
          if (messagesList[i].type==2){
            document.getElementById("tableChatbox").innerHTML +=
            '<tr class="messenger"><td style="height:100px;width:100px;text-align: center;vertical-align: middle;border:none">'+
            '<img src="'+obj.avatar+'" alt="Avatar" class="avatar"></td><td style="border:none;text-align: left;">' +
            '<p class="text-start fw-bold">' +
            obj.name+
            "</p>" +
            '<label class="text-start triangle-obtuse right " style="white-space: normal;">'+
            '<video width="320" controls><source src="'+messagesList[i].content+'" type="video/mp4"></video><br>' +
            '<label class="fw-lighter fs-6"><small>' + maskDate(messagesList[i].createAt) + "</small></label>" +
            "</label>" +
           
            '</td><td style="border:none"></td></tr>';
          }
        }else{
          if (messagesList[i].type==0){
            document.getElementById("tableChatbox").innerHTML +=
            '<tr class="messenger"><td style="border:none"></td><td  style="border:none;text-align: right;">' +
           
            '<label class="text-start triangle-obtuse left " style="white-space: normal;">' +
            '<label class="fs-5">'+  messagesList[i].content + '</label><br>'+  
            '<label class="fw-lighter fs-6"><small>' + maskDate(messagesList[i].createAt) + "</small></label>" +
            "</label>" +
            '</td><td style="height:100px;width:100px;text-align: center;vertical-align: middle;border:none">'+
            '<img src="'+obj.avatar+'" alt="Avatar" class="avatar"></td></tr>';
          }else
          if (messagesList[i].type==1){
            document.getElementById("tableChatbox").innerHTML +=
            '<tr class="messenger"><td style="border:none"></td><td style="border:none;text-align: right;">' +
           
            '<label class="text-start triangle-obtuse left " style="white-space: normal;">'+
            '<img src="'+messagesList[i].content+'" style="max-width:400px"><br>' +
            '<label class="fw-lighter fs-6"><small>' + maskDate(messagesList[i].createAt) + "</small></label>" +
            "</label>" +
           
            '</td><td style="height:100px;width:100px;text-align: center;vertical-align: middle;border:none">'+
            '<img src="'+obj.avatar+'" alt="Avatar" class="avatar"></td></tr>';
          }else
          if (messagesList[i].type==2){
            document.getElementById("tableChatbox").innerHTML +=
            '<tr class="messenger"><td style="border:none"></td><td style="border:none;text-align: right;">' +
           
            '<label class="text-start triangle-obtuse left " style="white-space: normal;">'+
            '<video width="320" controls><source src="'+messagesList[i].content+'" type="video/mp4"></video><br>' +
            '<label class="fw-lighter fs-6"><small>' + maskDate(messagesList[i].createAt) + "</small></label>" +
            "</label>" +
           
            '</td><td style="height:100px;width:100px;text-align: center;vertical-align: middle;border:none">'+
            '<img src="'+obj.avatar+'" alt="Avatar" class="avatar"></td></tr>';
          }
        }
        
      }
     
    }
  ).then(()=>{
    $("#myMessageContainer")
    .stop()
    .animate({
    scrollTop: $("#myMessageContainer")[0].scrollHeight+1000,
  });

  });
 // getALL();
}
function sendMess() {
  if (content != "") {
  var content = $('input[name="messArea"]').val();
  var roomID = roomChatID;
  document.getElementById("messArea").value = "";
  document.getElementById("tableChatbox").innerHTML +=
  '<tr class="messenger"><td style="border:none"></td><td style="border:none"></td><td  style="border:none;text-align: right;">' +
           
  '<label class="text-start triangle-obtuse left " style="white-space: normal;">' +
  '<label class="fs-5">'+  content + '</label><br>'+  
  '<label class="fw-lighter fs-6"><small>' + "Đang gửi tin nhắn..." + "</small></label>" +
  "</label>" +
  '</td><td style="height:100px;width:100px;text-align: center;vertical-align: middle;border:none">'+
  '<div class="spinner-border" role="status"><span class="sr-only"></span></div></td></tr>';
  $("#myMessageContainer")
    .stop()
    .animate({
      scrollTop: $("#myMessageContainer")[0].scrollHeight,
    });
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
      success: function (data) {
       // getUploadFile();
      },
      dataType: "json",
      contentType: "application/json",
    });
  }

  return false;
}

function sendImage(url) {
  if (url!=""){
    var content = url;
    var roomID = roomChatID;
    document.getElementById("messArea").value = "";

    document.getElementById("tableChatbox").innerHTML +=
    '<tr class="messenger"><td class="p-4">' +
    '<p class="text-start fw-lighter fs-6">' +
    "Đang gửi 1 ảnh" +
    "</p>" +
    "</td></tr>";
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
        type: 1,
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
      success: function (data) {
        
      },
      dataType: "json",
      contentType: "application/json",
      
    });
  }
  }
  

  return false;
}


function sendVideo(url) {
  if (url!=""){
    var content = url;
    var roomID = roomChatID;
    document.getElementById("messArea").value = "";

    document.getElementById("tableChatbox").innerHTML +=
    '<tr class="messenger"><td class="p-4">' +
    '<p class="text-start fw-lighter fs-6">' +
    "Đang gửi 1 video" +
    "</p>" +
    "</td></tr>";
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
        type: 2,
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
      success: function (data) {
        
      },
      dataType: "json",
      contentType: "application/json",
      
    });
  }
  }
  

  return false;
}

$(document).ready(function(){
  $("#imageUpload").on('change',function(){
    getUploadFile();
  });
});
$(document).ready(function(){
  $("#videoUpload").on('change',function(){
    getUploadFileVideo();
  });
});
function dangXuat() {
  if (confirm("Bạn có muốn đăng xuất?")) {
    localStorage.clear();
    window.location.href = "/dangnhap";
  } else {
    // false
  }
}

function getInfo(username) {
  var info = {
    name: "",
    avatar: "",
  };

  return info;
}

function selectRoom() {
 // console.log("R_"+roomChatID);
  document.getElementById("R_"+roomChatID).style.backgroundColor = "#f2f2f2";
  return true;
}

function getUploadFile() {
  if (document.getElementById('imageUpload').value==""){
    return false;
  }else
  {
    var formData = new FormData();
    formData.append("filename", $('input[name="imageUpload"]')[0].files[0]);
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
        sendImage(data.data);
      },
      error: function (e) {
        alert(e.responseJSON);
      },
    });
  }
}

function getUploadFileVideo() {
  if (document.getElementById('videoUpload').value==""){
    return false;
  }else
  {
    var formData = new FormData();
    formData.append("filename", $('input[name="videoUpload"]')[0].files[0]);
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
        sendVideo(data.data);
      },
      error: function (e) {
        alert(e.responseJSON);
      },
    });
  }
}

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

$(function () {
  getALL();
  socketUp();
});