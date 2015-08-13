$(document).ready(function(){
	localStorage.setItem("userId","5502779c3cf407d619a776b9")
	var socket = io.connect();
	socket.emit("getUserInfo",{userId:"12345"})
	socket.on("getUserInfo",function(userInfo){
		$("#container").html(userInfo)
	})

})