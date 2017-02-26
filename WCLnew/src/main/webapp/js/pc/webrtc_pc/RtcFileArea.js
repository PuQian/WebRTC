// 获取uid
var requestUid = function(username){
	//debugger
	console.log(username);
	$.ajax({
		url : "/WCLnew/SearchUid",
		type : "post",
		async : false,
		data : {username: username},
		dataType : "json",
		success : function(data) {
			console.log(data["uid"]);
			$(document.getElementById("Msg"+username)).attr('data-uid',data["uid"]);
		}
	});
}

//发送文件预处理（this.this.files）
//var CallFiles = function(inputobj,file,RemoteUser){
var CallFilesBefore = function(inputobj,file,RemoteUser){
	// 待发送文件暂存到全局变量上
	window.filesToBeSend = {
		files: file,
		remoteUser: RemoteUser,
	};
	
	// 标识对端是否在线
	if (!window.remoteUserIsOffline) {
		window.remoteUserIsOffline = {};
	}
	window.remoteUserIsOffline[RemoteUser] = false;
	
	console.log(RemoteUser);
	var RemoteUserToFile = formatChange(RemoteUser);	
//	if(file.size == 0){
//		console.log("用户没有选择文件");
//		return;
//	}
	//显示要传输的文件（filedrag文件）
    var files = document.getElementById("files"+RemoteUser).files;
    
	//////显示传输文件对话框
    showFileWindow(RemoteUserToFile);
	for (var i = 0, f; f = files[i]; i++) {
		//添加文件名及文件传输进度条
        addSendPerFile(f,RemoteUserToFile);
	}
    
	//将磁盘文件download到浏览器缓存(注意浏览器缓存并没有区分文件者)
	com.webrtc.file.handleFiles(file,RemoteUserToFile);
	console.log("加入缓存");
	
	//设计新文件input控件（解决先后选择同一文件的问题onchange）
	console.log("change file node");
	var newInputFile = inputobj.cloneNode(true);
	newInputFile.value = "";
	inputobj.parentNode.replaceChild(newInputFile,inputobj);
}

//向文件传输框中添加一个发送文件名及文件传输进度条
var addSendPerFile = function(f,RemoteUserToFile){
    /////添加文件Div
	var fileDiv = $("<div class='fileShow'></div>");
	//添加文件名
	console.log("filename:"+f.name);
	var fileName = $("<span>" + f.name + "</span>");
	fileDiv.append(fileName);		
	//添加传输文件进度条
	var fileProgress = $("<div class='progressbar'><div id='"+ f.name + RemoteUserToFile + "bar' "+
			     "class='bar'></div>");
	fileDiv.append(fileProgress);
	$(document.getElementById("FileBox"+RemoteUserToFile)).append(fileDiv);
	//更新文件传输框文件数量
	var num = $(document.getElementById("SendFileWindow"+RemoteUserToFile)).children("._FILENUM").html();
	$(document.getElementById("SendFileWindow"+RemoteUserToFile)).children("._FILENUM").html(Number(num)+1);
}

//向文件传输框中添加一个接收文件名及文件传输进度条
var addReceivePerFile = function(filename,RemoteUserToFile){
   	var fileDiv = $("<div class='fileShow'></div>");
	console.log("filename:"+filename);
	var fileName = $("<span>" + filename + "</span>");
	fileDiv.append(fileName);		
	//添加传输文件进度条
	var fileProgress = $("<div class='progressbar'><div id='"+ filename + RemoteUserToFile + "bar' "+
			     "class='bar'></div>");
	fileDiv.append(fileProgress);
	$(document.getElementById("FileBox"+RemoteUserToFile)).append(fileDiv);
	//更新文件传输框文件数量
	var num = $(document.getElementById("SendFileWindow"+RemoteUserToFile)).children("._FILENUM").html();
	$(document.getElementById("SendFileWindow"+RemoteUserToFile)).children("._FILENUM").html(Number(num)+1);
}

//更新发送文件进度条
var SendUpdateProgressbar = function(FileName,pre,iter,allchunkIDslength,RemoteID){
	//console.log("SendUpdateProgressbar!");
	//console.log("Filename:" + FileName+ ";RemoteID:" + RemoteID);
	var percent = (pre+iter)/allchunkIDslength*100;
	$(document.getElementById(FileName + RemoteID + "bar")).attr("style","width:"+ percent +"%");
	//提示用户对端写缓存
	if( percent == 100){
		
	}
}

//更新接收文件进度条
var ReceiveUpdateProgressbar = function(FileName,numOfVerifiedChunks,numOfChunks,RemoteID){
    //console.log("SendUpdateProgressbar!");
    //console.log("Filename:" + FileName+ ";RemoteID:" + RemoteID);
    var percent = numOfVerifiedChunks/numOfChunks*100;
    $(document.getElementById(FileName + RemoteID + "bar")).attr("style","width:"+ percent +"%");
}

//显示传输文件对话框
var showFileWindow = function(RemoteUserToFile){
	
    resetPosition();
	if(t < 0){t = 30;}
	if(l < 0){l = 60;}
	
	//存在传输文件对话框
	if(document.getElementById("SendFileWindow" + RemoteUserToFile)){
		return;
	}
	
	var Div = "SendFileWindow" + RemoteUserToFile;
	
	var newContent = document.createElement("div");
	newContent.setAttribute("id", Div);
	document.body.appendChild(newContent);
	
	$(newContent).attr('class', 'pop_chat_voice dialogbox');
	$(newContent).css({'position':'absolute', 'top':t-100+'px', 'left':l-200+'px'});
	$(newContent).css({'z-index':count++});
	$(newContent).show();
	$(newContent).click(function(){      			//当用鼠标点击该对话框时，该对话框到最上面
		count++;
		$(this).css({'z-index':count});
	});	

	/////////加载标题栏
	var titleHeight=40,titleWidth=365,titleTableHeight=40,titleTableWidth=365;
	var titleDiv=document.createElement('div');		//标题Div
	$(newContent).append(titleDiv);
	$(titleDiv).css({'width':titleWidth+'px', 'height':titleHeight+'px'});
	
	var titleTable=document.createElement("table");
	titleDiv.appendChild(titleTable);
	$(titleTable).css({'width':titleTableWidth+'px', 'height':titleTableHeight+'px', 'margin':'-4px 0px'});
	
	var titleTr=document.createElement("tr");
	titleTable.appendChild(titleTr);
	
	var titleTd1=document.createElement("td");
	titleTr.appendChild(titleTd1);
	$(titleTd1).css({'width':'335px','height':'40px','background-color':'#4196ca'});
	
	var titleTd2=document.createElement("td");
	titleTr.appendChild(titleTd2);
	$(titleTd2).css({'width':'30px','height':'40px','background-color':'#4196ca'});
	
	var FriendTitle = $("<p style='font-size:15px;'>"+ formatRechange(RemoteUserToFile)+ " 文件传输中...</p>");
	$(titleTd1).append(FriendTitle);
	var CloseVideo =$("<div class='close_pop' onclick=\"removeSendFileWindow('"+RemoteUserToFile+"')\">关闭</div>");
	 $(titleTd2).append(CloseVideo);
	
	var dragClass='SendFile';				//设置窗口可拖拽
	$(titleTd1).attr('class', dragClass);
	dragWindow(dragClass, newContent);
	
	///////////////内容
    var FileContent = $("<div id='FileBox"+ RemoteUserToFile +"' style='height:250px; overflow-y:auto;' "+
    		"class='word_wrap'></div>");
    $(newContent).append(FileContent);    

    ///////该传输文件对话框中的文件数量
    var FileNum = $("<div class='_FILENUM' style='display:none;'>0</div>");
    $(newContent).append(FileNum);
};

//删除发送文件对话框
var removeSendFileWindow = function(RemoteUserToFile){
	if($(document.getElementById("SendFileWindow"+RemoteUserToFile))){
		$(document.getElementById("SendFileWindow"+RemoteUserToFile)).remove();
	}
};

//删除发送(或接收)文件名以及进度条
var removeFile = function(FileName,RemoteID){
	console.log("removesend:FileName:"+FileName);
	$.each($(document.getElementById("FileBox"+RemoteID)).children(".fileShow").children("span"),function(){
		if( $(this).text() == FileName ){
			console.log("删除文件："+ FileName);
			$(this).parent().remove();
			//更新文件传输框文件数量
			var num = $(document.getElementById("SendFileWindow"+RemoteID)).children("._FILENUM").html();
			$(document.getElementById("SendFileWindow"+RemoteID)).children("._FILENUM").html(Number(num)-1);
			if( Number(num)-1 == 0){
				console.log("删除对话框："+RemoteID);
				removeSendFileWindow(RemoteID);
			}
			return false;
		}
	});
};

//发送文件预处理（每个文件一个sessionID）
var SendFileRequestBefore = function(RemoteUserToFile){
	 var SessionID = guid();
     console.log(SessionID);
     SendFileRequest(RemoteUserToFile,SessionID);
};

//发送文件预处理（每位好友对应一个sessionId,待需求定）
//var SendFileRequest2 = function(RemoteUserToFile){
//	//与该好友存在文件会话
//	if( typeof($(document.getElementById("FileBox"+RemoteUserToFile)).find('.SESSIONFLAG').attr("value")) != "undefined"){
//		console.log("存在好友会话session!");
//		var SessionID = $(document.getElementById("FileBox"+RemoteUserToFile)).find('.SESSIONFLAG').attr("value");
//		console.log("sessionId:"+SessionID);
//		SendFileRequest(RemoteUserToFile,SessionID);
//	}
//	else{
//		console.log("we new a session!");
//        SessionID = guid();
//        console.log(SessionID);
//        //添加隐藏sessionId(每位好友唯一标识一个sessionId)
//    	var $sessionid = $("<input type=\"hidden\" class = \"SESSIONFLAG\" id=\"sessionId\" "+
//    			   "value=\"" + SessionID + "\">");
//    	$(document.getElementById("FileBox"+RemoteUserToFile)).append($sessionid);
//        SendFileRequest(RemoteUserToFile,SessionID);
//	}
//}

//检测浏览器是否支持file api
//if (window.File && window.FileList && window.FileReader) {
//	Init();   //初始化操作
//}
