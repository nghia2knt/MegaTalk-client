var roomChatID = "";
var socket = io(hostsocket, { transports: ["websocket"] });
var firstTime = true;
var roomNameMain = "";
var dataChat="";
var maxLoad = 20;
var listRoom = [];
var infoMemberMain = [];
var index =0;
var arrSeen =[];
var lastMessInfo="";
var keo=true;
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
       // console.log(data);
        // thông tin
        // danh sách room
        dataChat = JSON.stringify(data);
        localStorage.username = data.data.username;
        const chatsList = data.data.chatsList;
        var d = 0;
       

        // get memeber lan 1 

        var roomMember = [];
        for (var i in chatsList) {
           
            const memberList = data.data.chatsList[i].member;
            if (chatsList[i].type==1) {
              const messagesList = data.data.chatsList[i].messagesList;
              for (j in messagesList){
                if (messagesList[j].sender!=localStorage.username){
                  roomMember.push(messagesList[j].sender) 
                }
              }
            }
            for (j in memberList){
              if (memberList[j].username!=localStorage.username){
                roomMember.push(memberList[j].username) 
              }
            }
          
        }
        for (i in data.data.friendsList){
          roomMember.push(data.data.friendsList[i].username) 
        }
        
        roomMember.push(localStorage.username);
        roomMember = [...new Set(roomMember)];
        console.log(roomMember);
        var memberListInfo = [];
        getMultiUser(roomMember).then(
          (value)=>{
            var memberListInfo=value;
            infoMemberMain=value;
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
          var avat =[];
          if (chatsList[i].type==1){
            const memberList = data.data.chatsList[i].member;
            for (j in memberList){
              
                const obj = memberListInfo.data.filter(
                  (e) => e.username == memberList[j].username
                )[0];
               
                if (obj.avatar!=""){
                  avat.push(obj.avatar);
                }else{
                  avat.push('./asset/image/defaultAvatar.jpg');
                }
              
            }
            if (avat[1]==null) avat.push('./asset/image/defaultAvatar.jpg');
            if (avat[2]==null) avat.push('./asset/image/defaultAvatar.jpg');
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
         
          if (chatsList[i].type==1){
            
            document.getElementById("tableRoom").innerHTML +=
            
            "<tr onclick=\"changeID('" +
            chatID +"','"+roomname+
            '\')" class="list-group-item list-group-item-action" id=R_'+chatID+'>'+
            '<td style="height:50px;width:50px;text-align: center;vertical-align: middle;border:none;">'+
            '<div class="avatars">'+
            '<span class="avatarG" >'+
                  '<img  src='+avat[0]+' width="50" height="50">'+
              '</span>'+
            '<span class="avatarG">'+
                  '<img src='+avat[1]+' width="50" height="50">'+
              '</span>'+
            '<span class="avatarG">'+
                  '<img src='+avat[2]+' width="50" height="50">'+
              '</span>'+
       
          '</div>'+
            '</td><td class="" style="border:none;" >' +
            '<p class="text-start fw-bold" id = "N_'+chatID+'">' +
            roomname+
            "</p>" +
            '<p class="text-start lastMess-2" id = "C_'+chatID+'">' +
            lastMess +
            "</p>" +
            '<p class="text-start fw-lighter fs-6" id = "T_'+chatID+'">' +
            maskDate(lastTime) +
            "</p>" +
            '<input type="hidden" id="custId" name="time" value="'+lastTime+'">'+
            '<input type="hidden" id="custId2" name="iddd" value="'+chatID+'">'+
            "</td></tr>";
           
            if (chatID == roomChatID) selectRoom();
          }else{
            document.getElementById("tableRoom").innerHTML +=
            
            "<tr onclick=\"changeID('" +
            chatID +"','"+roomname+
            '\')" class="list-group-item list-group-item-action" id=R_'+chatID+'>'+
            '<td style="height:50px;width:50px;text-align: center;vertical-align: middle;border:none;">'+
            '<img src="'+ava+'" alt="Avatar" class="avatar2"></td><td class="" style="border:none;" >' +
            '<p class="text-start fw-bold" id = "N_'+chatID+'">' +
            roomname+
            "</p>" +
            '<p class="text-start lastMess-2" id = "C_'+chatID+'">' +
            lastMess +
            "</p>" +
            '<p class="text-start fw-lighter fs-6" id = "T_'+chatID+'">' +
            maskDate(lastTime) +
            "</p>" +
            '<input type="hidden" id="custId" name="time" value="'+lastTime+'">'+
            '<input type="hidden" id="custId2" name="iddd" value="'+chatID+'">'+
            "</td></tr>";
           
          
            if (chatID == roomChatID) selectRoom();
          }
         
          
        }
      
        // tin nhắn trong room
        // obj for mess in room 
 

        sortTable();
        if (firstTime){
          roomChatID = document.getElementsByName("iddd")[0].value;
          roomNameMain = document.getElementById("N_"+roomChatID).innerHTML;
          selectRoom();
          firstTime = false;
        }

        var chatsListMain = data.data.chatsList.filter(
          (e) => e.roomID == roomChatID
        )[0];

         // console.log(roomChatID);
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

            var messagesList = chatsListMain.messagesList;
            if (maxLoad >= messagesList.length){
              document.getElementById("tableChatbox").innerHTML = "";
            }else{
              messagesList = messagesList.slice(Math.max(messagesList.length - maxLoad, 0));
              document.getElementById("tableChatbox").innerHTML = "";
              document.getElementById("tableChatbox").innerHTML += 
              '<tr><td></td><td style="text-align: center;"><a href="#" onclick="return loadMore()">Xem thêm</a></td><td></td></tr>'
              d++;
            }
            console.log(messagesList);
        
            for (var i in messagesList) {
              const obj = memberListInfo.data.filter(
                (e) => e.username == messagesList[i].sender
              )[0];

              

              if (obj.avatar == "")
                  obj.avatar = "./asset/image/defaultAvatar.jpg"; 
              d++;
              index = messagesList[i].index;
               // console.log(messagesList[i]);
              //console.log(dataChat.username);
              if (!messagesList[i].recall){
              if (obj.username!=localStorage.username){
                if (messagesList[i].type==0){
                  document.getElementById("tableChatbox").innerHTML +=
                  '<tr class="messenger"><td style="height:100px;width:100px;text-align: center;vertical-align: middle;border:none">'+
                  '<a href="#" title="" data-bs-toggle="modal" data-bs-target="#infoAnotherModal" onclick=\"getProfileAnother(\''+obj.username+'\')" class="iconHV">'+
                  '<img src="'+obj.avatar+'" alt="Avatar" class="avatar"></td><td  style="border:none;text-align: left;">' +
                  '<p class="text-start fw-bold">' +
                  obj.name+
                  "</p>" +
                  '</a>'+
                  '<label class="text-start triangle-obtuse right " style="white-space: normal;">' +
                  '<label class="fs-5">'+  messagesList[i].content + '</label><br>'+  
                  '<label class="fw-lighter fs-6"><small>' + maskDate(messagesList[i].createAt) + "</small></label>" +
                  "</label>" +
                  '</td><td style="border:none"></td></tr>';
                }else
                if (messagesList[i].type==1){
                  document.getElementById("tableChatbox").innerHTML +=
                  '<tr class="messenger"><td style="height:100px;width:100px;text-align: center;vertical-align: middle;border:none">'+
                  '<a href="#" title="" data-bs-toggle="modal" data-bs-target="#infoAnotherModal" onclick="" class="iconHV">'+
                  '<img src="'+obj.avatar+'" alt="Avatar" class="avatar"></td><td  style="border:none;text-align: left;">' +
                  '<p class="text-start fw-bold">' +
                  obj.name+
                  "</p>" +
                  '</a>'+
                  '<label class="text-start triangle-obtuse right " style="white-space: normal;">'+
                  '<img src="'+messagesList[i].content+'" style="max-width:400px"><br>' +
                  '<label class="fw-lighter fs-6"><small>' + maskDate(messagesList[i].createAt) + "</small></label>" +
                  "</label>" +
                  '</td><td style="border:none"></td></tr>';
                }else
                if (messagesList[i].type==2){
                  document.getElementById("tableChatbox").innerHTML +=
                  '<tr class="messenger"><td style="height:100px;width:100px;text-align: center;vertical-align: middle;border:none">'+
                  '<a href="#" title="" data-bs-toggle="modal" data-bs-target="#infoAnotherModal" onclick="" class="iconHV">'+
                  '<img src="'+obj.avatar+'" alt="Avatar" class="avatar"></td><td  style="border:none;text-align: left;">' +
                  '<p class="text-start fw-bold">' +
                  obj.name+
                  "</p>" +
                  '</a>'+
                  '<label class="text-start triangle-obtuse right " style="white-space: normal;">'+
                  '<video width="320" controls><source src="'+messagesList[i].content+'" type="video/mp4"></video><br>' +
                  '<label class="fw-lighter fs-6"><small>' + maskDate(messagesList[i].createAt) + "</small></label>" +
                  
                  "</label>" +
                 
                  '</td><td style="border:none"></td></tr>';
                }
              }else{
                if (messagesList[i].type==0){
                  document.getElementById("tableChatbox").innerHTML +=
                  '<tr class="messenger" ><td style="border:none"></td><td  style="border:none;text-align: right;">' +
                 
                  '<label class="text-start triangle-obtuse left " style="white-space: normal;">' +
                  '<label class="fs-5" id="R_'+d+'">'+  messagesList[i].content + '</label><br>'+  
                  '<label class="fw-lighter fs-6"><small>' + maskDate(messagesList[i].createAt) + "</small></label>" +
                  //'<br><label class="fw-lighter fs-6" >'+ '<small><a class="delete" href="#" onclick="getRecall('+messagesList[i].index+','+d+')">[Thu Hồi]</a></small>' + '</label>'+  
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
              
              
              
            }else{
              
              if (obj.username!=localStorage.username){
               
                  document.getElementById("tableChatbox").innerHTML +=
                  '<tr class="messenger"><td style="height:100px;width:100px;text-align: center;vertical-align: middle;border:none">'+
                  '<a href="#" title="" data-bs-toggle="modal" data-bs-target="#infoAnotherModal" onclick=\"getProfileAnother(\''+obj.username+'\')" class="iconHV">'+
                  '<img src="'+obj.avatar+'" alt="Avatar" class="avatar"></td><td  style="border:none;text-align: left;">' +
                  '<p class="text-start fw-bold">' +
                  obj.name+
                  "</p>" +
                  '</a>'+
                  '<label class="text-start triangle-obtuse right " style="white-space: normal;">' +
                  '<label class="fs-5">'+  'Tin nhắn đã bị thu hồi'+ '</label><br>'+  
                  '<label class="fw-lighter fs-6"><small>' + maskDate(messagesList[i].createAt) + "</small></label>" +
                  "</label>" +
                  '</td><td style="border:none"></td></tr>';
                
              }else{
                
                  document.getElementById("tableChatbox").innerHTML +=
                  '<tr class="messenger"><td style="border:none"></td><td  style="border:none;text-align: right;">' +
                 
                  '<label class="text-start triangle-obtuse left " style="white-space: normal;">' +
                  '<label class="fs-5">'+  'Tin nhắn đã bị thu hồi' + '</label><br>'+  
                  '<label class="fw-lighter fs-6"><small>' + maskDate(messagesList[i].createAt) + "</small></label>" +
                  "</label>" +
            
                  '</td><td style="height:100px;width:100px;text-align: center;vertical-align: middle;border:none">'+
                  '<img src="'+obj.avatar+'" alt="Avatar" class="avatar"></td></tr>';
              
              }

            }
          }
           
            lastMessInfo = messagesList[messagesList.length-1];
            if (lastMessInfo.sender == localStorage.username){
              
              var strSeen="";
              for (var i in messagesList[messagesList.length-1].seeder){
                if (i==0){
                  strSeen=strSeen+messagesList[messagesList.length-1].seeder[i];
                }else{
                  strSeen=strSeen+", "+messagesList[messagesList.length-1].seeder[i];
                }
              }
              if ((messagesList[messagesList.length-1].seeder.length)==0){

              }else{
                document.getElementById("tableChatbox").innerHTML +='<tr><td style="border:none;text-align: right;"></td><td  style="border:none;text-align: right;"><label class="fw-lighter fs-6" id="lastSeen"><small>'+'</small></label></td></tr>'
                document.getElementById("lastSeen").innerHTML =strSeen+" đã xem";
              }
              
            }
          }
        ).then(()=>{
         // getALL();
          if (maxLoad == 20 && keo) {
            $("#myMessageContainer")
          .stop()
          .animate({
          scrollTop: $("#myMessageContainer")[0].scrollHeight+1000,
        });
        keo=false}
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
    if (msg.type == "newBoxChat"){
      var dat2 = JSON.parse(msg.data);
      if (dat2.messagesList[0].sender == localStorage.username){
       changeID(dat2.roomID,dat2.roomName);
      }
      getALL();
    }
    if (msg.type == "seeder"){    
      /*
      var strSeen="";
      for (var i in lastMessInfo.seeder){
        strSeen=strSeen+lastMessInfo.seeder[i]+",";
      }
      document.getElementById("lastSeen").innerHTML =strSeen + " đã xem";
      */
     getALL();
    }
    if (msg.type == "recall"){    
      /*
      var strSeen="";
      for (var i in lastMessInfo.seeder){
        strSeen=strSeen+lastMessInfo.seeder[i]+",";
      }
      document.getElementById("lastSeen").innerHTML =strSeen + " đã xem";
      */
     getALL();
    }
    if (msg.type == "newMess"){
      keo=true;
      getALL();
    }
    if (msg.type == "newName"){ 
      console.log(msg.data);
      var sdata = JSON.parse(msg.data)
      if (roomChatID == sdata.roomID) changeID(roomChatID,sdata.name) 
      getALL();
    }
    if (msg.type == "newMember"){ 
      getALL();
      $('#listAddRoomModal').modal('hide');
    }
    if (msg.type == "deleteMember"){ 
     
      getALL();
      $('#infoChatModal').modal('hide');
    }
    if (msg.type == "deleteRoom"){ 
      window.location.href = "/chat";
    }
});
}

function loadMore(){
  maxLoad+=20;
  getALL();
}

function changeID(id,roomname) {
  roomChatID = id;
  roomNameMain = roomname;
  keo=true;
  var data = dataChat;
  data = JSON.parse(data);
  maxLoad = 20;
 // console.log(data);
  getALL();
  
 // getALL();
}
function sendMess() {
  if (content != "") {
  var content = $('input[name="messArea"]').val();
  var roomID = roomChatID;
  document.getElementById("messArea").value = "";
  document.getElementById("tableChatbox").innerHTML +=
  '<tr class="messenger"><td style="border:none"></td><td  style="border:none;text-align: right;">' +
           
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
    '<tr class="messenger"><td style="border:none"></td><td style="border:none"></td><td class="p-4">' +
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
    '<tr class="messenger"><td style="border:none"></td><td style="border:none"></td><td class="p-4">' +
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
  $("#btnroiphong").on('click',function(){
    postDeleteMember(localStorage.username,roomChatID);
    window.location.href = "/chat";
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
function sortTable() {
  var table, rows, switching, i, x, y, shouldSwitch;
  table = document.getElementById("tableRoom");
  switching = true;
  /*Make a loop that will continue until
  no switching has been done:*/
  while (switching) {
    //start by saying: no switching is done:
    switching = false;
    rows = table.rows;
    /*Loop through all table rows (except the
    first, which contains table headers):*/
    for (i = 0; i < (rows.length - 1); i++) {
      //start by saying there should be no switching:
      shouldSwitch = false;
      /*Get the two elements you want to compare,
      one from current row and one from the next:*/
     // x = rows[i].getElementsByTagName("TD")[0];
   //   y = rows[i + 1].getElementsByTagName("TD")[0];
      x = new Date(document.getElementsByName("time")[i].value);
      y = new Date(document.getElementsByName("time")[i+1].value);
   //   console.log(x+" "+y);
      //check if the two rows should switch place:
      if (x.getTime() <= y.getTime()) {
        //if so, mark as a switch and break the loop:
        shouldSwitch = true;
        break;
      }
    }
    if (shouldSwitch) {
      /*If a switch has been marked, make the switch
      and mark that a switch has been done:*/
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
    }
  }
}
$(function () {

  getALL();
  socketUp();
  
});

$(document).ready(function(){
  $("#searchRoomInput").on("keyup", function() {
    var value = $(this).val().toLowerCase();
    $("#tableRoom tr").filter(function() {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
  });
});


function getStaterForInfoChat() {
  {
      var data = JSON.parse(dataChat);
      var chatsListData = data.data.chatsList.filter(
        (e) => e.roomID == roomChatID
      )[0];
     
      if (chatsListData.type == 0) {
        document.getElementById('infoChatNameHeader').innerHTML="";
        document.getElementById('tableMemberBodyMD').innerHTML="";
        var memberT = chatsListData.member;
        for (var i in memberT){
          const obj = infoMemberMain.data.filter(
            (e) => e.username == memberT[i].username
          )[0];
          if (obj.avatar == "")
          obj.avatar = "./asset/image/defaultAvatar.jpg"; 
          //console.log(obj)
          document.getElementById('tableMemberBodyMD').innerHTML +=
          '<tr><td><a href="#" title="" data-bs-toggle="modal" data-bs-target="#infoAnotherModal" onclick=\"getProfileAnother(\''+obj.username+'\')" class="iconHV">'+
          '<img src="'+obj.avatar+'" alt="Avatar" class="avatar"></td><td  style="text-align: left;">' +
          '</a></td>'+
          '<td style="text-align: center;vertical-align: middle;">'+obj.name+'<br>('+obj.username+')<td>'+
          '<td style="text-align: center;vertical-align: middle;"><td>'+
          '</tr>';
        
          document.getElementById('footinfo').innerHTML ="";
      }
      }else{
        document.getElementById('infoChatNameHeader').innerHTML=
        '<form  class="input-group">'+
        '<input type="text" class="form-control" id="infoChatName" name="infoChatName" />'+
        '<button type="button" class="btn btn-primary" onclick="postChangeName()" data-bs-dismiss="modal">Lưu</button>'+
        '</form>';
        document.getElementById('infoChatName').value=roomNameMain;
        document.getElementById('tableMemberBodyMD').innerHTML="";
        var memberT = chatsListData.member;
        for (var i in memberT){
          const obj = infoMemberMain.data.filter(
            (e) => e.username == memberT[i].username
          )[0];
          if (obj.avatar == "")
          obj.avatar = "./asset/image/defaultAvatar.jpg"; 
          //console.log(obj)
          document.getElementById('tableMemberBodyMD').innerHTML +=
          '<tr><td><a href="#" title="" data-bs-toggle="modal" data-bs-target="#infoAnotherModal" onclick=\"getProfileAnother(\''+obj.username+'\')" class="iconHV">'+
          '<img src="'+obj.avatar+'" alt="Avatar" class="avatar"></td><td  style="text-align: left;">' +
          '</a></td>'+
          '<td style="text-align: center;vertical-align: middle;">'+obj.name+'<br>('+obj.username+')<td>'+
          '<td style="text-align: center;vertical-align: middle;"><button class="btn btn-danger" onclick=\"postDeleteMember(\''+obj.username+'\')" >Xóa khỏi phòng chat</button><td>'+
          '</tr>';
          document.getElementById('footinfo').innerHTML ="";
          document.getElementById('footinfo').innerHTML +=
          '<button type="button" class="btn btn-secondary" data-bs-dismiss="modal" id="btnroiphong">Rời khỏi phòng</button>'+
          '<button type="button" class="btn btn-danger" data-bs-dismiss="modal" style = "margin-right: auto;" onclick="deleteRoom()">Xóa phòng</button>'+
          '<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng </button>';
          
          
        }
      }
      
     
     
  
  };
};

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
      if ((data.data.gennder = "0")) {
        gennder.innerHTML = "Nam";
      } else {
        gennder.innerHTML = "Nữ";
      }
      var birthDay = document.getElementById("birthDayInfo");
      birthDay.innerHTML = maskDate(data.data.birthDay);
      var email = document.getElementById("emailInfo");
      email.innerHTML = data.data.email;

      var data2 = dataChat;
      data2 = JSON.parse(data2);
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


function addUser(username) {
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
      getALL();
    },
    dataType: "json",
    contentType: "application/json",
  });
  return false;
}

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
      getALL();
    },
    dataType: "json",
    contentType: "application/json",
  });
  return false;
}

function daXem(){
 // console.log(lastMessInfo.sender);
  var kt = true;
  for (var i in lastMessInfo.seeder){
    if (lastMessInfo.seeder[i]==localStorage.username)
      kt=false;
  }
  
  if (lastMessInfo.sender!=localStorage.username && kt){
    
    $.ajax({
    type: "POST",
    url: host + endpoint.seeder,
    data: JSON.stringify({
      "roomID":roomChatID,
      "index":index
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
      getALL();
    },
    dataType: "json",
    contentType: "application/json",
  });
}
  return false;

}





function getRecall(inn,x){
 $.ajax({
     type: "POST",
     url: host + endpoint.recall,
     data: JSON.stringify({
       "roomID":roomChatID,
       "index":inn
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
      document.getElementById("R_"+x).innerHTML ="Tin nhắn đã bị thu hồi.";
  
     },
     dataType: "json",
     contentType: "application/json",
   });
   
 
 }



 function postChangeName(){
   var name =  $('input[name="infoChatName"]').val();
  $.ajax({
      type: "POST",
      url: host + endpoint.changeName,
      data: JSON.stringify({
        "roomID":roomChatID,
        "name": name
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
        roomNameMain=name;
      },
      dataType: "json",
      contentType: "application/json",
    });
    
  
  }

  
function getStaterForAddMember() {
  {
      var data = JSON.parse(dataChat);
      var chatsListData = data.data.chatsList.filter(
        (e) => e.roomID == roomChatID
      )[0];
     
      if (chatsListData.type == 0) {
        document.getElementById('tableListAddBodyMD').innerHTML="<td>Không thể thêm người dùng vào phòng chat 1-1</td>";
      }else{
        document.getElementById('tableListAddBodyMD').innerHTML="";
        var memberT = chatsListData.member;
        var friendListT = data.data.friendsList;
        friendListT=  friendListT.filter(ar => !memberT.find(rm => (rm.username === ar.username) ))
        for (var i in friendListT){
          const obj = infoMemberMain.data.filter(
            (e) => e.username ==  friendListT[i].username
          )[0];
          if (obj.avatar == "")
          obj.avatar = "./asset/image/defaultAvatar.jpg"; 
          //console.log(obj)
          document.getElementById('tableListAddBodyMD').innerHTML +=
          '<tr><td><a href="#" title="" data-bs-toggle="modal" data-bs-target="#infoAnotherModal" onclick=\"getProfileAnother(\''+obj.username+'\')" class="iconHV">'+
          '<img src="'+obj.avatar+'" alt="Avatar" class="avatar"></td><td  style="text-align: left;">' +
          '</a></td>'+
          '<td style="text-align: center;vertical-align: middle;">'+obj.name+'<br>('+obj.username+')<td>'+
          '<td style="text-align: center;vertical-align: middle;"><button class="btn btn-primary" onclick=\"postAddMember(\''+obj.username+'\')" >Thêm vào phòng</button><td>'+
          '</tr>';
          
          
        }
      }
      
     
     
  
  };
};

function postAddMember(username){
 
 $.ajax({
     type: "POST",
     url: host + endpoint.addMember,
     data: JSON.stringify({
       "roomID":roomChatID,
       "username": username
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

 
function postDeleteMember(username){
 
  $.ajax({
      type: "POST",
      url: host + endpoint.deleteMember,
      data: JSON.stringify({
        "roomID":roomChatID,
        "username": username
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

  
function postDeleteRoom(){
 
  $.ajax({
      type: "POST",
      url: host + endpoint.deleteRoom,
      data: JSON.stringify({
        "roomID":roomChatID
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

  
