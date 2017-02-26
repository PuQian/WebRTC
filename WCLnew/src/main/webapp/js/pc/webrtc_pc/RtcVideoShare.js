//我的视频分享界面
var VideoShare = function(element){
	
	toggleListMenu("recent_calls","rtc_menu",element);//高亮这个菜单项
	
    var VideoShareSendDivId = VideoSharePrefix + "send"; 
	if(document.getElementById(VideoShareSendDivId)!=null){
		showWeb(VideoSharePrefix,"send");
		return;
	}
	
	var newContent = document.createElement("div");
	newContent.setAttribute("id", VideoShareSendDivId);

	var HeadVideoShare = $("<div class='rtc_tab'><ul>"+
            "<li class='on' onclick='VideoShareSend();'>发出的邀请</li>"+
            "<li onclick='VideoShareCreate();'>创建邀请</li>"+
            "<li>历史邀请</li></ul></div>");
	$(newContent).append(HeadVideoShare);
	
	var VedioShareSendTable = $("<div class='list_table list_table2'></div>");
	var Table = $("<table></table>");
	VedioShareSendTable.append(Table);
	var TableList = $("<tr><th width=\"140\" class=\"pl20\">有效时间</th><th  class=\"pl20\">邀请链接</th><th  width=\"80\"class=\"pl20\">受邀请人</th><th  width=\"80\"class=\"pl20\">操作</th></tr>");
	
	//拉取我的视频分享记录函数
	Table.append(TableList)
	$(newContent).append(VedioShareSendTable);
	
	//翻页
//	var PageDown = $("<div class='pagedown'><a href=\"#\">1</a><a href=\"#\" class=\"on\">2</a><a href=\"#\">3</a><a href=\"#\">4</a><a href=\"#\">5</a></div>");
//	$(newContent).append(PageDown);
	
	$("#web").append(newContent);
	
	showWeb(VideoSharePrefix,"send");
}

//创建视频分享主界面
var VideoShareCreate = function(){

	var VideoShareCreateDivId = VideoSharePrefix + "create";
	 
	if(document.getElementById(VideoShareCreateDivId)!=null){
		showWeb(VideoSharePrefix,"create");
		return;
	}

	var newContent = document.createElement("div");
	newContent.setAttribute("id", VideoShareCreateDivId);
	$("#web").append(newContent);

	var HeadMeeting = $("<div class='rtc_tab'><ul>"+
            "<li onclick='VideoShareSend();'>发出的邀请</li>"+
            "<li class='on' onclick='VideoShareCreate();'>创建邀请</li>"+
            "<li>历史邀请</li></ul></div>");   
	$(newContent).append(HeadMeeting);

//	var createButton = $("<div class=\"call_operation\"><div class=\"call_btn call_btn_video\" onclick=\"CreateVideoShare()\">发起视频</div></div>");
	var createButton = $("<div class=\"meeting_found\"><input id=\"createVideoShareButton\" onclick=\"CreateVideoShareUrl();\" value=\"创建\"  class=\"meeting_btn1\" type=\"button\"></div>");
	$(newContent).append(createButton);
	showWeb(VideoSharePrefix,"create");

};

var VideoShareSend = function(){
	showWeb(VideoSharePrefix,"send");
}


var CreateVideoShareUrl = function(){
	//var type = $('input:radio:checked').val();
	var type = "video"
		console.log("创建URL");
	//	showLoading();
	$.ajax({
		type : "post",
		url : "templogin",
		data : {
			type : type,
		},
		success : function(data) {
				console.log("data=");
				console.log(data);
				console.log("******************creat Video count******************="+count);
			    var Div = "VideoShareUrl";
			    
			    resetPosition();
				if(t < 0){t = 30;}
				if(l < 0){l = 60;}

			    
				var newContent = document.createElement("div");
				newContent.setAttribute("id", Div);
				document.body.appendChild(newContent);
				
				$(newContent).attr('class', 'pop_chat_voice dialogbox');
				$(newContent).css({'position':'absolute', 'top':t-100+'px', 'left':l-200+'px'});
				//$(newContent).attr('onselectstart', 'return false');//禁止复制
				//$(newContent).attr('onselect', 'document.selection.empty()');//不让选择文本内容
				$(newContent).css({'z-index':count++});
				$(newContent).show();
				$(newContent).click(function(){      			//当用鼠标点击该对话框时，该对话框到最上面
					count++;
					console.log("++++++++++++++++creat Video count end +++++++++++++++++="+count);
					$(this).css({'z-index':count});
				});
				
				

				//加载标题栏
				var titleHeight=60,titleWidth=365,titleTableHeight=40,titleTableWidth=365;
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
				
				var FriendTitle = $("<p class='title'>邀请链接</p>");
				$(titleTd1).append(FriendTitle);
				var CloseVideo =$("<div class='close_pop' onclick='removeURLWindow()'>关闭</div>");
				 $(titleTd2).append(CloseVideo);
				

				//var titleClass=contact.replace(".","a");
				//var titleClass1=titleClass.replace("@","b");
				var dragClass='VideoShare';				//设置窗口可拖拽
				$(titleTd1).attr('class', dragClass);
				dragWindow(dragClass, newContent);

			    var tempurl = $("<div class='call_video word_wrap' id=\"tempurl\"></div>");
			    $(newContent).append(tempurl);

			    tempurl.append(data.temp_url);

				console.log("createVideoPage finish!");
			}})}


var removeURLWindow = function(){
	document.getElementById("VideoShareUrl").remove();//删除对话框
}




//设置视频分享窗口head可拖拽，gragClass为可拖动区域，videoShareDiv为拖动的区域
function dragWindow(dragClass, videoShareDiv){
	  
	  var bool=false, offsetX = 0, offsetY = 0;   //标识是否移动元素，声明DIV在当前窗口的Left和Top值
	  $('.'+dragClass).mouseover(function(){
	    $(this).css('cursor','move');     //当鼠标移动到拖拽的DIV上的时候，将鼠标的样式设置为移动(move)
	  });

	  $('.'+dragClass).mousedown(function(evt){ 
	    $(this).css('cursor','move');
	    bool=true;                //当鼠标在移动元素按下的时候将bool设定为true
	    offsetX = evt.offsetX;        //获取鼠标在当前窗口的相对偏移位置的Left值并赋值给offsetX
	    offsetY = evt.offsetY;        //获取鼠在当前窗口的相对偏移位置的Top值并赋值给offsetY
	    console.log("down！！！！"+evt.offsetX+"Y!!!!"+evt.offsetY);
	  });

	  $(document).mousemove(  function(evt){
	    if(!bool){                //如果bool为false则返回
	      return;
	    }   
	    var x = evt.clientX-offsetX, y = evt.clientY-offsetY; 
	    if(y < 0){
	      y = 0;
	     }
	    $(videoShareDiv).css("left", x);
	    $(videoShareDiv).css("top", y);
	  }   ).mouseup(function(){
	    bool=false;               //当鼠标在移动元素起来的时候将bool设定为false
	  });
}
