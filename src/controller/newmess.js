function getStater() {
    {
        document.getElementById('newMess').value="Xin chào, hãy bắt đầu một tin nhắn.";
        $.ajax({
          type: 'GET',
          url:  host + endpoint.getProfileUser,
          beforeSend: function(xhr) {
            if (localStorage.token) {
              xhr.setRequestHeader('jwt', localStorage.token);
            }
          },
          success: function(data) {
            // danh sách bạn
            const friendsList = data.data.friendsList;
            var d = 0;
            document.getElementById('tableFriendsBodyMD').innerHTML="";
            for (var i in friendsList){
             d++;
             document.getElementById('tableFriendsBodyMD').innerHTML += 
             '<tr><th scope="row">'+d+'</th><td><a href="#" value="'+friendsList[i].username+'">'+friendsList[i].username+'</a></td><td><input type="checkbox" style="width: 20px;height: 20px;"/></td></tr> ';
            }
            
          },
          error: function(e) {
            window.location.href = "/dangnhap";
          }
          
          
        });
    };
};

function GetSelected() {
    //Reference the Table.
    var grid = document.getElementById("tableFriendsMD");

    //Reference the CheckBoxes in Table.
    var checkBoxes = grid.getElementsByTagName("INPUT");
    
    var name = [];
    //Loop through the CheckBoxes.
    for (var i = 0; i < checkBoxes.length; i++) {
        if (checkBoxes[i].checked) {
            var row = checkBoxes[i].parentNode.parentNode;
            var name2 = row.cells[1].textContent;
            name.push(name2);
        }
      
    }

    //Display selected Row data in Alert Box.
    return name;
}

function sendNewMess() {
    var content = $('input[name="newMess"]').val()
    document.getElementById('newMess').value="";
    var listname = GetSelected();
    if (content!="" && listname.length>0){
      $.ajax({
        type: 'POST',
        url: host + endpoint.sendNewMess,
        data: JSON.stringify({
            "type":0,
            "content":content,
            "receiver":listname
        })
        ,beforeSend: function(xhr) {
        if (localStorage.token) {
          xhr.setRequestHeader('jwt', localStorage.token);
        }
        },
        error: function(e) {
            console.log(e.responseJSON);
            alert(e.responseJSON);
        },
        success: function(data) {
            window.location.href = "/chat";
        },
        dataType: "json",
        contentType: "application/json"
     });
    }
  
    return false;
  }
  

