function getALL(){
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
            document.getElementById("welcome").innerHTML="Chào mừng, "+data.data.name+" đã đến với MegaTalk!";
            localStorage.username = data.data.username;
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
      
    }
  
};

$(function() {
    getALL();
});