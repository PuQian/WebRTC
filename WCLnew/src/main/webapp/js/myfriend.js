//if($("#myfriend").attr("id")!="myfriend"){
//	var html = [];
//	html[0] = "<div id=\"myfriend\"><span class=\"greyletter\" href=\"javascript:void(0)\">好友列表</span>"
//			+"<input type=\"text\" id=\"whichIsClicked\" class=\"hidden\"/></div>"
//			+"<img id=\"newmsg\" src=\"images/msgntf.gif\" class=\"hidden\"/>";
//	html[1] = "<div id=\"friendlist\" class=\"hidden\"></div>";
//	var htmlSum = html.join("");
//	$("body").append(htmlSum);
//	$("#newmsg").css({'position':'fixed','right':'100px','bottom':'20px'});
//	
//}

//拖拽窗口的方法
//修复firefox没有offsetX的bug
function getoffsetfunction(evt){
	var target = evt.target;
	if (target.offsetLeft == undefined){
	    target = target.parentNode;
	}
	var pageCoord = target;
	var eventCoord ={ 
			x: window.pageXOffset + evt.clientX,
			y: window.pageYOffset + evt.clientY
		};
	var offset ={
			offsetX: eventCoord.x - $(pageCoord).offset().left,
			offsetY: eventCoord.y - $(pageCoord).offset().top
	};
	return offset;
}
//dragClass:可拖拽区域的class，dialogDiv:被拖动的Dom
function dragWindow(dragClass, dialogDiv){
	
	//转义字符串
	var dragClassAfter="";
	for(var i=0;i<dragClass.length;i++)
		{
		  if(  (dragClass[i]>="0" && dragClass[i]<="9")
				  ||(dragClass[i]>="a" && dragClass[i]<="z")
				  ||(dragClass[i]>="A" && dragClass[i]<="Z"))
			  {
			  dragClassAfter+=dragClass[i];
			  
			  }
		  else
			  {
			  dragClassAfter+="\\";
			  dragClassAfter+=dragClass[i];
			  }
		
		}
	
	dragClass=dragClassAfter;
	
	
	
	var bool=false, offsetX = 0, offsetY = 0;  	//标识是否移动元素，声明DIV在当前窗口的Left和Top值
	$('.'+dragClass).mouseover(function(){
		$(this).css('cursor','move');			//当鼠标移动到拖拽的DIV上的时候，将鼠标的样式设置为移动(move)
	});
	$('.'+dragClass).mousedown(function(evt){ 
		$(this).css('cursor','move');
		if(evt==null)evt=window.event;//IE
		bool=true;  							//当鼠标在移动元素按下的时候将bool设定为true
		offsetX = evt.offsetX;				//获取鼠标在当前窗口的相对偏移位置的Left值并赋值给offsetX
		offsetY = evt.offsetY; 				//获取鼠在当前窗口的相对偏移位置的Top值并赋值给offsetY
		if(offsetX == undefined){
			var evtOffsets = getoffsetfunction(evt);
			offsetX=evtOffsets.offsetX;
			offsetY=evtOffsets.offsetY;
		}
		$(this).css('cursor','move');
	});
	$(document).mousemove(function(evt){
		if(evt==null)evt=window.event;//IE
		if(!bool){								//如果bool为false则返回
			return;
		}		
		$('.'+dragClass).css({'cursor':'move !important'});
		//当bool为true的时候执行下面的代码
		var x = evt.clientX-offsetX, y = evt.clientY-offsetY; 
		if(x > $(window).width() - $('.'+dragClass).width() -15){
			x = $(window).width() - $('.'+dragClass).width() - 15;
		}
		
		if(x < 0){
			x = 0;
		}
		if(y > $(window).height() - $('.dialogbox').height()){
			y = $(window).height() - $('.dialogbox').height()
		}
		if(y < 10){
			y = 10;
		}
		$(dialogDiv).css("left", x);
		$(dialogDiv).css("top", y);
	}).mouseup(function(){
		bool=false;								//当鼠标在移动元素起来的时候将bool设定为false
	});
}

//打开会话窗口的方法
//加载标题栏
function loadTitleDiv(obj, dialogDiv, dialogWidth){
	var titleHeight = 30, titleTableHeight = 24;
	var titleDiv=document.createElement('div');		//标题Div
	dialogDiv.appendChild(titleDiv);
	$(titleDiv).css({'width':dialogWidth+'px', 'height':titleHeight+'px', 'color':'#333333'});
	
	var titleTable=document.createElement("table");
	titleDiv.appendChild(titleTable);
	$(titleTable).css({'width':dialogWidth+'px', 'height':titleTableHeight+'px', 'margin':'2px 5px'});
	
	var titleTr=document.createElement("tr");
	titleTable.appendChild(titleTr);
	
	if(obj.avatar != undefined){
		var titleTd1=document.createElement("td");
		titleTr.appendChild(titleTd1);
		$(titleTd1).css({'width':'30px'});
		var titleTd1Img=document.createElement("img");
		titleTd1.appendChild(titleTd1Img);
		titleTd1Img.style.width="24px";
		titleTd1Img.style.height="24px";
		titleTd1Img.src=obj.avatar;
	}
	
	var titleTd2=document.createElement("td");
	titleTr.appendChild(titleTd2);
	var titleTd2Width = dialogWidth - 30 - 25;
	$(titleTd2).css({'width':titleTd2Width+'px', 'text-align':'left'});
	//edit by qiepei 添加“在线”状态

	
//	var titleTd2Html= $('#'+obj.id+' div:first').html(); 
	var titleTd2Htmltemp=$(document.getElementById(obj.id));
	
	var titleTd2Html = titleTd2Htmltemp.find("div:first").html();
	if(titleTd2Html == '' || titleTd2Html == undefined){
		titleTd2Html = obj.name;
	}
	titleTd2.innerHTML=titleTd2Html;
	
	var dragClass='drag'+obj.id;				//设置窗口可拖拽
	$(titleTd1).attr('class', dragClass);
	$(titleTd2).attr('class', dragClass);
	dragWindow(dragClass, dialogDiv);

	var titleTd3=document.createElement("td");
	titleTr.appendChild(titleTd3);
	titleTd3.style.width="25px";
	var titleTd3Div=document.createElement("div");
	titleTd3.appendChild(titleTd3Div);
	$(titleTd3Div).css({'width':'16px', 'height':'16px', 'cursor':'pointer'});
	$(titleTd3Div).attr('class', 'dialogclose');
	titleTd3Div.title="关闭";
	
	$(titleTd3Div).click(function(){    
		//change by guoxun 存疑！！！
		//当用鼠标点击关闭的图片时，清除创建的层
		
		console.log("obj.name="+obj.name);
	//	endVideo(obj.name.replace('-','@'),obj.id);
		endVideo(obj.name,obj.id);
		
		obj.name.replace('-','@');
		var member = [obj];
		optionSpecialGroup('会话中','talking','minus', member);
		$(dialogDiv).remove();
	});
}

//加载聊天区域
function loadChartDiv(obj, imDiv, chartDivWidth){
	var chartDivHeight = 240;
	var chatDivID="to"+obj.id;						//聊天区域的Div
	var chatDiv=document.createElement('div');
	imDiv.appendChild(chatDiv);
	chatDiv.id=chatDivID;
	$(chatDiv).css({'width':chartDivWidth+'px', 'height':chartDivHeight+'px', 'margin':'0 5px'});
	$(chatDiv).css({'background':'#ffffff', 'color':'#000000', 'overflow':'auto'});
}

//加载发送消息区域
function loadMessageDiv(obj, imDiv, chartDivWidth){
	

	
	var msgDivHeight = 120, msgTextWidth = 345, msgTextHeight = 70;
	var messageDiv=document.createElement('div');	//发送消息部分的Div
	imDiv.appendChild(messageDiv);
	$(messageDiv).css({'width':chartDivWidth+'px', 'height':msgDivHeight+'px', 'margin':'5px auto'});
	
	var messageText=document.createElement('textarea');
	messageDiv.appendChild(messageText);
	messageTextID="text"+obj.id;
	messageText.id=messageTextID;
	$(messageText).css({'width':msgTextWidth+'px', 'height':msgTextHeight+'px'});
		
	var messageTable=document.createElement("table");
	messageDiv.appendChild(messageTable);
	var messageTr=document.createElement("tr");
	messageTable.appendChild(messageTr);
	var messageTd1=document.createElement("td");
	messageTd1.style.width="290px";
	messageTr.appendChild(messageTd1);

	var messageTd2=document.createElement("td");
	messageTr.appendChild(messageTd2);	
	
	var messageSpan=document.createElement('span');
	messageTd1.appendChild(messageSpan);
	messageSpan.style.color="red";	
	
	var messageButton = '<input type="button" class="button" value="发送" />';
	$(messageTd2).html(messageButton);
	$(messageTd2).attr('class', messageTextID);
	
	$(messageTd2).click(function(){
		var id = $(this).attr('class');
		var content = trim( $('#'+id).val() );//text是发送的消息
		$(messageSpan).attr("class","redletter");
		if(content ==""){
			$(messageSpan).html("不能发送空消息！");
		}else if( content.length > 350){
			var tip = "您已输入了"+ content.length +"字，超出了350的最大字数限制";			
			$(messageSpan).html(tip);
		}else{
			$(messageSpan).html("");
			//var content=trim( $('#'+id).val() );
			var jid = obj.name;
			sendMsg(jid, content, obj.id);
			$('#'+id).val("");
			$('#'+id).focus();
			console.log(obj.name+obj.id);
		
		}
		
	});
	$(messageText).focus();
	//回车键为发送的快捷方式
	$(messageText).keydown(function(event){
		var currKey = 0,e = event || window.event; //为了兼容，ie用event，而标准用e
		currKey = e.keyCode||e.which||e.charCode;
	
		if(currKey == 13 && !e.shiftKey){ //13为enter键，同时要求没有按下shift键
		 	e.returnValue=false;
		 	$(messageTd2).click();
		 	return false;
		}
	});
	
	//检查字数
	$(messageText).keyup(function(){
		var messageValue = trim($(this).val());
		var length = messageValue.length;
		if(length <= 350){
			$(messageSpan).attr("class","greyletter");
			var tip = "您已输入了"+ length +"字，还可输入"+ (350-length) +"字";
			$(messageSpan).html(tip);
			return true;
		}else{
			$(messageSpan).attr("class","redletter");
			var tip = "您已输入了"+ length +"字，超出了350的最大字数限制";			
			$(messageSpan).html(tip);
			return false;
		}
	})
}

//加载屏幕共享窗口

function loadscreenshareVideoDiv(obj, videoDiv){
	var videoDivWidth = 990, videoDivHeight = 580;
	var operationId = 'operation'+$('.pub_banner').attr("userId")+'_'+obj.id
	var hisVideoId = 'video'+obj.id;
	var myVideoId = 'video'+$('.pub_banner').attr("userId")+'_'+obj.id;
	var hisVideoDiv = document.createElement("div");
	videoDiv.appendChild(hisVideoDiv);

	
	$(hisVideoDiv).css({'width':videoDivWidth+'px', 'height':videoDivHeight+'px', 
						'background':'url(images/screenshare123.jpg) no-repeat #ffffff', 'margin':'0 5px 5px'});

$(hisVideoDiv).html('<video width="'+videoDivWidth+'" height="'+videoDivHeight+'" id="'+hisVideoId+'" style="z-index:'+99+';position:absolute" autoplay="autoplay"></video>');
	
$(hisVideoDiv).append('<video width="'+videoDivWidth+'" height="'+videoDivHeight+'" id="'+myVideoId+'" style="z-index:'+100+'; position:absolute"  autoplay="autoplay" ></video>');	
	
	var oprationDiv = document.createElement("div");
	videoDiv.appendChild(oprationDiv);
	//页面加载时就连接websocket，连接失败则将videoconnected的值置为“false”
	if($("#browersupport").val() == 'false'){
		$(oprationDiv).attr('class','videoarea padding715 redletter centeralign');
		$(oprationDiv).html('您当前使用的浏览器<br />不支持webrtc音视频会话');
	}else if($('#socketconnected').val() == 'false'){
		$(oprationDiv).attr('class','videoarea padding715 redletter centeralign');
		$(oprationDiv).html('websocket连接失败<br />暂时无法发起视频会话');
	}else{
		$(oprationDiv).attr('class','videoarea centeralign leftmargin_5 bottommargin_5');
		$(oprationDiv).attr('id', operationId);
		$(oprationDiv).html('');
		$(oprationDiv).append('<a title="开始屏幕共享" onclick="beginScreen(\''+obj.name.replace('-','@')+'\',\''+obj.id+'\')"><img src="images/video.png" class="video greybutton"/></a>');
		$(oprationDiv).append('<a title="结束屏幕共享" onclick="endScreen(\''+obj.name+'\',\''+obj.id+'\')"><img src="images/hangup.png" class="hidden hang greybutton"/></a>');
	}
}


//加载会议窗口
function loadmeetingVideoNew(originId)
{
	var Videoflag = $(document.getElementById("videoflag"));
	
	
	
	if((Videoflag.find("video").length>0) && (Videoflag.find("video").attr("id").substr(5)==originId))
		{
		console.log("don't need to loadmeeting!");
		return;
		
		}
	else{
	
	Videoflag.children().remove();
		
	var videoDivWidth = 700, videoDivHeight = 580;

	var hisVideoId = 'video'+originId;
	var bigAudioingPicture ='bigaudiopicture'+originId;
	
	var hisVideo=$("<video width='"+videoDivWidth+"' height='"+videoDivHeight+"' id='"+hisVideoId+"' style='z-index:100;position:absolute' autoplay='autoplay'></video>");
	var bigAudioingPictureimg=$('<img width="'+videoDivWidth+'" height="'+videoDivHeight+'" id="'+bigAudioingPicture+'" style="z-index:'+101+'; position:absolute;display:none" src="images/bigaudioingmeeting.png"/>');
	
	Videoflag.append(hisVideo);
	Videoflag.append(bigAudioingPictureimg);
	console.log("create loadmeeting success!");
	}
}


function loadmeetingmemberList(showid,originId)
{
	
	
    var liDivWidth = 270, liDivHeight = 30;		
	var liDiv = document.createElement("li");
	liDiv.id="li"+showid;
	
	$(liDiv).attr("onclick","handlebegin('"+showid+"','"+originId+"')");
	
	$(liDiv).html(showid);
	$(liDiv).css({"float": "right",'width':liDivWidth+'px', 'height':liDivHeight+'px', 
		'margin':'0 5px 5px',"text-align":"center"});	
	$("#ullist").append(liDiv);
}


//加载视频/音频窗口
function loadVideoDiv(obj, videoDiv){
	
	//edit by chenyan
	var videoDivWidth = 413, videoDivHeight = 310;
	var operationId = 'operation'+$('.pub_banner').attr("userId")+'_'+obj.id
	var hisVideoId = 'video'+obj.id, myVideoId = 'video'+$('.pub_banner').attr("userId")+'_'+obj.id;
	var bigAudioingPicture ='bigaudiopicture'+obj.id;
	var hisVideoDiv = document.createElement("div");
	videoDiv.appendChild(hisVideoDiv);
	$(hisVideoDiv).css({'width':videoDivWidth+'px','height':videoDivHeight+'px', 
						'background':'url(images/member.png) 50% 50% no-repeat #ffffff', 'margin':'0 5px 5px'});
	
	$(hisVideoDiv).html('<video width="'+413+'"  height="'+310+'" id="'+hisVideoId+'" style="z-index:'+99+'; position:absolute" autoplay="autoplay"></video>');
	$(hisVideoDiv).append('<video width="'+50+'" height="'+50+'" id="'+myVideoId+'" style="z-index:'+100+'; position:absolute"  autoplay="autoplay" ></video>');
	$(hisVideoDiv).append('<img width="'+413+'" height="'+310+'" id="'+bigAudioingPicture+'" style="z-index:'+101+'; position:absolute;display:none" src="images/bigaudioing.png"/>');
	
	var operationDiv = document.createElement("div");
	videoDiv.appendChild(operationDiv);
	
	//页面加载时就连接websocket，连接失败则将videoconnected的值置为“false”
	if($("#browersupport").val() == 'false'){
		$(operationDiv).attr('class','videoarea padding715 redletter centeralign');
		$(operationDiv).html('您当前使用的浏览器<br />不支持webrtc音视频会话');
	}else if($('#socketconnected').val() == 'false'){
		$(operationDiv).attr('class','videoarea padding715 redletter centeralign');
		$(operationDiv).html('websocket连接失败<br />暂时无法发起视频会话');
	}else{
		$(operationDiv).attr('class','videoarea centeralign leftmargin_5 bottommargin_5');
		$(operationDiv).attr('id', operationId);
		$(operationDiv).html('');
		$(operationDiv).append('<a title="发起视频通话" onclick="beginVideo(\''+obj.name.replace('-','@')+'\',\''+obj.id+'\')"><img src="images/video.png" class="video greybutton"/></a>');
		$(operationDiv).append('<a title="发起音频通话" onclick="beginAudio(\''+obj.name.replace('-','@')+'\',\''+obj.id+'\')"><img src="images/voice.png" class="audio greybutton"/></a>');
		$(operationDiv).append('<a title="挂断当前通话" onclick="endVideo(\''+obj.name+'\',\''+obj.id+'\')"><img src="images/hangup.png" class="hidden hang greybutton"/></a>');
	}
	
	
}



//加载IMS 视频窗口
function loadIMSVideoDiv(obj,videoDiv)
{
	var videoDivWidth = 413, videoDivHeight = 310;
	var operationId = 'operation'+$('.pub_banner').attr("userId")+'_'+obj.id
	var hisVideoId = 'video'+obj.id, myVideoId = 'video'+$('.pub_banner').attr("userId")+'_'+obj.id;
	var bigAudioingPicture ='bigaudiopicture'+obj.id;
	var hisVideoDiv = document.createElement("div");
	videoDiv.appendChild(hisVideoDiv);
	$(hisVideoDiv).css({'width':videoDivWidth+'px','height':videoDivHeight+'px', 
						'background':'url(images/member.png) 50% 50% no-repeat #ffffff', 'margin':'0 5px 5px'});
	$(hisVideoDiv).html('<video width="'+413+'" height="'+310+'" id="'+hisVideoId+'" style="z-index:'+99+'; position:absolute" autoplay="autoplay"></video>');
	$(hisVideoDiv).append('<video width="'+50+'" height="'+50+'" id="'+myVideoId+'" style="z-index:'+100+'; position:absolute"  autoplay="autoplay" ></video>');
	$(hisVideoDiv).append('<img width="'+413+'" height="'+310+'" id="'+bigAudioingPicture+'" style="z-index:'+101+'; position:absolute;display:none;" src="images/bigaudioing.png"/>');
	var operationDiv = document.createElement("div");
	videoDiv.appendChild(operationDiv);
	
	//页面加载时就连接websocket，连接失败则将videoconnected的值置为“false”
	if($("#browersupport").val() == 'false'){
		$(operationDiv).attr('class','videoarea padding715 redletter centeralign');
		$(operationDiv).html('您当前使用的浏览器<br />不支持webrtc音视频会话');
	}else if($('#socketconnected').val() == 'false'){
		$(operationDiv).attr('class','videoarea padding715 redletter centeralign');
		$(operationDiv).html('websocket连接失败<br />暂时无法发起IMS视频会话');
	}else{
		$(operationDiv).attr('class','videoarea centeralign leftmargin_5 bottommargin_5');
		$(operationDiv).attr('id', operationId);
		$(operationDiv).html('');
		$(operationDiv).append('<a title="发起视频通话" onclick="beginIMSVideo(\''+obj.name+'\',\''+obj.id+'\')"><img src="images/video.png" class="video greybutton"/></a>');
		$(operationDiv).append('<a title="发起音频通话" onclick="beginIMSAudio(\''+obj.name+'\',\''+obj.id+'\')"><img src="images/voice.png" class="audio greybutton"/></a>');
		$(operationDiv).append('<a title="挂断当前通话" onclick="endIMSVideo(\''+obj.name+'\',\''+obj.id+'\')"><img src="images/hangup.png" class="hidden hang greybutton"/></a>');
	}
	
}





//打开会话主窗口的方法
var count=2;

//edit by chenyan     by guoxun
//var dialogHeight = 400, dialogWidth = 570;
var t = null, l = null;
function resetPosition(){
	var h = $(window).height(), w = $(window).width();
	if(t == null && l == null){
		t = (h - dialogHeight) / 2;
		l = (w - dialogWidth) / 2;
	}else if( t > $(window).height() - $('.dialogbox').height() || l > $(window).width() - $('.dialogbox').width() - $('#friendlist').width() - 15){
		t = (h - dialogHeight) / 2;
		l = (w - dialogWidth) / 2;
	}else{
		t += 15;
		l += 15;
	}
}

//视频会议外框 中兴界面 有会议列表
function createIMSmeetingOutside(obj,isNew)
{
	var sdialogHeight = 680, sdialogWidth = 1000;	
	var chartDivWidth = 900, chartDivHeight = 700, msgDivHeight = 150, msgTextWidth = 345, msgTextHeight = 70;
	count++;   //count为全局变量,用来决定层的堆叠顺序
	var dialogID="Meeting";
	if(document.getElementById(dialogID)){          	//检测对话框是否应经存在
		count++;
		$("#"+dialogID).show().css({"z-index":count});
		$("#text"+obj.id).focus();
	}else{
		resetPosition()
		if(t < 0){t = 30;}
		if(l < 0){l = 60;}
		if(isNew == true){
			var member = [obj];
			optionSpecialGroup('会话中','talking','add', member);
		}
		
		var dialogDiv=document.createElement('div');   	//创建层dialogDiv
		document.body.appendChild(dialogDiv);
		dialogDiv.id=dialogID;                  		//给层dialogDiv设置属性
		$(dialogDiv).css({'width':sdialogWidth+'px', 'height':sdialogHeight+'px'});
		$(dialogDiv).attr('class', 'greybox dialogbox');
		$(dialogDiv).css({'position':'absolute', 'top':50+'px', 'left':50+'px'});
		$(dialogDiv).attr('onselectstart', 'return false');
		$(dialogDiv).attr('onselect', 'document.selection.empty()');
		
		$(dialogDiv).click(function(){      			//当用鼠标点击该对话框时，该对话框到最上面
			count++;
			$(this).css({'z-index':count});
		});
		
		loadTitleDiv(obj, dialogDiv, sdialogWidth);
		
		
		
		var videoDiv = document.createElement("div");
		dialogDiv.appendChild(videoDiv);
		videoDiv.id="leftfloatflag";
		
		var videoDivWidth = 700, videoDivHeight = 580;		
		var hisVideoDiv = document.createElement("div");
		hisVideoDiv.id="videoflag";
		videoDiv.appendChild(hisVideoDiv);
		$(hisVideoDiv).css({"float": "left",'width':videoDivWidth+'px', 'height':videoDivHeight+'px', 
			'background':'url(images/meeting24.jpg) no-repeat #ffffff','margin':'0 5px 5px'});

		
		var memberDiv = document.createElement("div");
		memberDiv.id="memberflag";
		videoDiv.appendChild(memberDiv);		
		var memberDivWidth = 280, memberDivHeight = 580;
		$(memberDiv).css({"float": "right",'width':memberDivWidth+'px', 'height':memberDivHeight+'px', 
			'margin':'0 5px 5px',"background": "white"});		

		
		var ultitleDivWidth = 270, ultitleDivHeight = 20;		
		var ultitleDiv = document.createElement("div");
		ultitleDiv.id="ultitle";
		memberDiv.appendChild(ultitleDiv);
		$(ultitleDiv).html("当前会议成员列表");
		$(ultitleDiv).css({"float": "right",'width':ultitleDivWidth+'px', 'height':ultitleDivHeight+'px', 
			'margin':'0 5px 5px',"text-align":"center"});				
		
		
		var ulDivWidth = 270, ulDivHeight = 200;
		var ulDiv = document.createElement("ul");
		memberDiv.appendChild(ulDiv);
		ulDiv.id="ullist";
		memberDiv.appendChild(ulDiv);
		
		$(ulDiv).css({"float": "right",'width':ulDivWidth+'px', 'height':ulDivHeight+'px', 
			'margin':'0 5px 5px',"text-align":"center"});	
		
	
		var oprationDiv = document.createElement("div");
		oprationDiv.id="oprationflag";
		dialogDiv.appendChild(oprationDiv);
		//页面加载时就连接websocket，连接失败则将videoconnected的值置为“false”
		if($("#browersupport").val() == 'false'){
			$(oprationDiv).attr('class','videoarea padding715 redletter centeralign');
			$(oprationDiv).html('您当前使用的浏览器<br />不支持webrtc音视频会话');
		}else if($('#socketconnected').val() == 'false'){
			$(oprationDiv).attr('class','videoarea padding715 redletter centeralign');
			$(oprationDiv).html('websocket连接失败<br />暂时无法发起视频会话');
		}else{
			$(oprationDiv).attr('class','videoarea centeralign leftmargin_5 bottommargin_5');
		//	$(oprationDiv).attr('id', operationId);
			$(oprationDiv).html('');
			$(oprationDiv).append('<input id="meetingInputId" type="text" style="height:32px;width:230px;float:left" value="" class="editline" placeholder="请输入会议号"/>');
			$(oprationDiv).append('<a title="开始视频会议" onclick="beginIMSmeetingVideo()"><img src="images/video.png" class="video greybutton"/></a>');
			$(oprationDiv).append('<a title="开始音频会议" onclick="beginIMSmeetingAudio()"><img src="images/voice.png" class="audio greybutton"/></a>');
			$(oprationDiv).append('<a title="结束当前会议" onclick="endIMSmeetingVideo()"><img src="images/hangup.png" class="hidden hang greybutton"/></a>');
		}
	}
	$(dialogDiv).css({'z-index':count});
	
}



//屏幕共享界面
function createScreenshareDiv(obj, isNew){ 
	var sdialogHeight = 680, sdialogWidth = 1000;
	console.log(obj);
	var chartDivWidth = 900, chartDivHeight = 700, 
		msgDivHeight = 150, msgTextWidth = 345, msgTextHeight = 70;

	count++;                							//count为全局变量,用来决定层的堆叠顺序
	var dialogID="chatscreen"+obj.id;
	
	
	if(document.getElementById(dialogID)){          	//检测对话框是否应经存在
		count++;
		$("#"+dialogID).show().css({"z-index":count});
		$("#text"+obj.id).focus();
	}else{
		resetPosition()
		if(t < 0){t = 30;}
		if(l < 0){l = 60;}
		if(isNew == true){
			var member = [obj];
			optionSpecialGroup('会话中','talking','add', member);
		}
		
		var dialogDiv=document.createElement('div');   	//创建层dialogDiv
		document.body.appendChild(dialogDiv);
		dialogDiv.id=dialogID;                  		//给层dialogDiv设置属性
		$(dialogDiv).css({'width':sdialogWidth+'px', 'height':sdialogHeight+'px'});
		$(dialogDiv).attr('class', 'greybox dialogbox');
		$(dialogDiv).css({'position':'absolute', 'top':t-100+'px', 'left':l-250+'px'});
		$(dialogDiv).attr('onselectstart', 'return false');
		$(dialogDiv).attr('onselect', 'document.selection.empty()');
		
		$(dialogDiv).click(function(){      			//当用鼠标点击该对话框时，该对话框到最上面
			count++;
			$(this).css({'z-index':count});
		});
		
		loadTitleDiv(obj, dialogDiv, sdialogWidth);
		var imDiv = document.createElement("div");
		dialogDiv.appendChild(imDiv);
		$(imDiv).attr('class', 'leftfloat');
		
//		loadChartDiv(obj, imDiv, chartDivWidth);
//		loadMessageDiv(obj, imDiv, chartDivWidth);
		
		var videoDiv = document.createElement("div");
		dialogDiv.appendChild(videoDiv);
		$(videoDiv).attr('class', 'rightfloat');
		loadscreenshareVideoDiv(obj, videoDiv);
		console.log(obj+videoDiv);
	}
	$(dialogDiv).css({'z-index':count});
}


//音视频通话界面
function createDialogDiv(obj, isNew){ 
	
	//edit by chenyan
	var dialogHeight = 400, dialogWidth = 800;
	console.log(obj);
	var chartDivWidth = 360, chartDivHeight = 180, 
		msgDivHeight = 150, msgTextWidth = 345, msgTextHeight = 70;

	count++;                							//count为全局变量,用来决定层的堆叠顺序
	var dialogID="chat"+obj.id;
	
	
	if(document.getElementById(dialogID)){          	//检测对话框是否应经存在
		count++;
		$("#"+dialogID).show().css({"z-index":count});
		$("#text"+obj.id).focus();
	}else{
		resetPosition()
		if(t < 0){t = 30;}
		if(l < 0){l = 60;}
		if(isNew == true){
			var member = [obj];
			optionSpecialGroup('会话中','talking','add', member);
		}
		
		var dialogDiv=document.createElement('div');   	//创建层dialogDiv
		document.body.appendChild(dialogDiv);
		dialogDiv.id=dialogID;                  		//给层dialogDiv设置属性
		$(dialogDiv).css({'width':dialogWidth+'px', 'height':dialogHeight+'px'});
		$(dialogDiv).attr('class', 'greybox dialogbox');
		$(dialogDiv).css({'position':'absolute', 'top':t-100+'px', 'left':l-200+'px'});
		$(dialogDiv).attr('onselectstart', 'return false');
		$(dialogDiv).attr('onselect', 'document.selection.empty()');
		
		$(dialogDiv).click(function(){      			//当用鼠标点击该对话框时，该对话框到最上面
			count++;
			$(this).css({'z-index':count});
		});
		
		loadTitleDiv(obj, dialogDiv, dialogWidth);
		var imDiv = document.createElement("div");
		dialogDiv.appendChild(imDiv);
		$(imDiv).attr('class', 'leftfloat');
		
		loadChartDiv(obj, imDiv, chartDivWidth);
		loadMessageDiv(obj, imDiv, chartDivWidth);
		
		var videoDiv = document.createElement("div");
		dialogDiv.appendChild(videoDiv);
		$(videoDiv).attr('class', 'rightfloat');
		loadVideoDiv(obj, videoDiv);
		console.log(obj+videoDiv);
	}
	$(dialogDiv).css({'z-index':count});
	
	
}


//IMS音视频通话界面
function createIMSDialogDiv(obj, isNew){
	var dialogHeight = 400, dialogWidth = 422;

count++;                							//count为全局变量,用来决定层的堆叠顺序
var dialogID="chat"+obj.id;


if(document.getElementById(dialogID)){          	//检测对话框是否应经存在
	count=count+10;
	var dialogDiv = document.getElementById(dialogID);
	$(dialogDiv).css({'z-index':count+10});
	$("#"+dialogID).show().css({"z-index":count});
	$("#text"+obj.id).focus();
}else{
	resetPosition()
	if(t < 0){t = 30;}
	if(l < 0){l = 60;}
	if(isNew == true){
		var member = [obj];
		optionSpecialGroup('会话中','talking','add', member);
	}
	
	var dialogDiv=document.createElement('div');   	//创建层dialogDiv
	document.body.appendChild(dialogDiv);
	dialogDiv.id=dialogID;                  		//给层dialogDiv设置属性
	$(dialogDiv).css({'width':dialogWidth+'px', 'height':dialogHeight+'px'});
	$(dialogDiv).attr('class', 'greybox dialogbox');
	$(dialogDiv).css({'position':'absolute', 'top':t-100+'px', 'left':l-200+'px'});
	$(dialogDiv).attr('onselectstart', 'return false');
	$(dialogDiv).attr('onselect', 'document.selection.empty()');
	
	$(dialogDiv).click(function(){      			//当用鼠标点击该对话框时，该对话框到最上面
		count++;
		$(this).css({'z-index':count});
	});
	
	loadTitleDiv(obj, dialogDiv, dialogWidth);
//	var imDiv = document.createElement("div");
//	dialogDiv.appendChild(imDiv);
//	$(imDiv).attr('class', 'leftfloat');
//	
//	loadChartDiv(obj, imDiv, chartDivWidth);
//	loadMessageDiv(obj, imDiv, chartDivWidth);
	
	var videoDiv = document.createElement("div");
	dialogDiv.appendChild(videoDiv);
	$(videoDiv).attr('class', 'rightfloat');
	loadIMSVideoDiv(obj, videoDiv);
}
count=count+10;
$(dialogDiv).css({'z-index':count});
	
}







//添加特殊分组如“会话中”“搜索结果”分组,option:add/minus添加成员、删除成员
function optionSpecialGroup(groupName, divId, option, member){
	var htmlInside = [];
	var groupMembers = [];
	if( option == 'add' ){
		htmlInside[0] = "<div id=\""+divId+"\"><div class=\"greyletter groupname\">"+groupName+"</div>";
		htmlInside[1] = "<div id=\""+divId+"member\">";
		groupMembers = [];
		for(var i = 0; i < member.length; i++){
			if(member[i] != undefined){
				var $membertemp = $(document.getElementById(""+divId+member[i].id));
				if($membertemp.length == 0){
					var name = member[i].name;
					if(name.indexOf('@') != -1){
						name = name.replace('@','-').replace('.','-');
					}
					
					groupMembers[i] = "<div class=\"groupmembertemp\" onselectstart=\"return false\" onselect=\"document.selection.empty()\" id=\""+divId+""+member[i].id+"\" name=\""+name+"\">";
					if(member[i].avatar != undefined){
						groupMembers[i] += "<img src='"+member[i].avatar+"' height=\"30px\" width=\"30px\"  class=\"avatar leftfloat\"/>";
					}
					groupMembers[i] += "<div class=\"leftfloat padding5\">";
					if(member[i].status != undefined){
						groupMembers[i] += "<img class='status leftfloat rightmargin_5' src='"+member[i].status+"' />"
					}
					groupMembers[i] += "<span class='leftfloat'>"+member[i].name+"</span></div><div class=\"clear\"></div></div>";
				}else{
					groupMembers[i] = "";
				}
			}
		}
		htmlInside[2] = groupMembers.join("");
		htmlInside[3] = "</div></div>";
		
		var $divId = $(document.getElementById(divId));
		if($divId.length == 0){
    		var htmlInsideSum = htmlInside.join("");
    		$("#friendcontent").prepend(htmlInsideSum);
		}else{
			htmlInside[0] = '';
			htmlInside[1] = '';
			htmlInside[3] = '';
			var htmlInsideSum = htmlInside.join("");
			var $membertemp = $(document.getElementById(""+divId+"member"));
			$membertemp.prepend(htmlInsideSum);
		}
	}
	
	else if(option == 'minus'){
		
		for(var i = 0; i < member.length; i++){
			//$('#'+divId+member[i].id).remove();
			var minus=document.getElementById(""+divId+member[i].id);
			$(minus).remove();
		}
		if($('#'+divId+'member').html() == ''){
			//$('#'+divId).remove();
			//$('#'+divId+'member').remove();
			
			var minus1=document.getElementById(divId);
			var minus2=document.getElementById(""+divId+'member');
			$(minus1).remove();
			$(minus2).remove();
		}
	}
	$(".groupmembertemp").dblclick(function(){
		
		console.log("in optionSpecialGroup");
		//$(this).css({'background':'#ffffff'});
		var status = $(this).find('.status').attr('src');
		var id = $(this).attr('id').split(divId)[1];
		
	console.log(" id.split(divId)="+$(this).attr('id').split(divId));
		
		console.log(".groupmembertemp.dblclick!!! id:"+id);
		console.log("id:"+id);
		if(status == 'images/onlinemessage.gif'){
			$(this).find('.status').attr('src', 'images/online.gif');
			$('#'+id).find('.status').attr('src', 'images/online.gif');
		}else if(status == 'images/offlinemessage.gif'){
			$(this).find('.status').attr('src', 'images/offline.gif');
			$('#'+id).find('.status').attr('src', 'images/offline.gif');
		}
		var memberId = $(this).attr('id').split(divId);
		var dialogID = memberId[1];
		if($('#chat'+dialogID).length > 0){
			count ++;
			$('#chat'+dialogID).show().css({'z-index':count});
			$('#text'+dialogID).focus();
		}else{
			var obj = {
					id : dialogID,
					avatar : undefined,
					name : $('#'+divId+dialogID+' div:first span').html()
			}
			createDialogDiv(obj, true);
		}
	});
	$(".groupmembertemp").attr('class', 'padding5 groupmember');
}

//去后端获取好友列表数据
//function loadFriendList(){
//	$.getJSON(msgAddr +"getFriendListAction?callback=?",{},function(result){
//		var friendList = result;
//		var groupName = "我的好友";
//		var groupMember = [];
//		for(var i=0; i<friendList.length; i++){
//			groupMember[i] = {
//					avatar:"http://freedisk.free4lab.com/download?uuid="+friendList[i].avatar,
//					userName:friendList[i].userName,
//					userId:friendList[i].userId
//					};
//		}
//		showGroup(groupName, groupMember);
//	});
//}

//好友列表内容框
function showFriendFrame(select){
	if($('#friendlist').html() == ''){
		var loadingImgFr = "<div class='centeralign' id='frloading'>"+
				"<img src='images/loading.png' />"+
				"好友列表加载中...</div>";
		var loadingImgAdr = "<div class='centeralign' id='frloading'>"+
				"<img src='images/loading.png' />"+
				"通讯录列表加载中...</div>";
		var loadingImgRo = "<div class='centeralign' id='frroom'>"+
		"<img src='images/loading.png' />"+
		"聊天室列表加载中...</div>";
		var htmlFrame = [];
		var i = 0;
		htmlFrame[i++] = "<div class=\"processtable greybg border_0\">";
//		htmlFrame[i++] = "<a id=\"myfriendgb\" title=\"我的好友\" class=\"selected leftmargin_10\" ><img src=\"images/friend.png\" class=\"process currentstep padding715\" /></a>";
		htmlFrame[i++] = "<a id=\"myfriendgb\" title=\"我的好友\" class=\"selected leftmargin_10\" ><img src=\"images/friend.png\" class=\"process currentstep padding715\" /></a><a class=\"leftmargin_10\" href=\"basic/_addFriend.jsp\" rel=\"facebox\" size=\"s\" title=\"添加好友\"><img src=\"images/addfriend.png\" /></a><a class=\"leftmargin_10\" href=\"basic/_addIMS.jsp\" rel=\"facebox\" size=\"s\" title=\"添加IMS\"><img src=\"images/imscall.png\" /></a><a class=\"leftmargin_10\" onclick=\"IMSmeeting()\" size=\"s\" title=\"添加视频会议\"><img src=\"images/c22.png\" /></a>";

		
		//		htmlFrame[i++] = "<a id=\"addlistgb\" title=\"通讯录\" class=\"\" \"><img src=\"images/contact.png\" class=\"process padding715 greybg\"/></a>";
//		htmlFrame[i++] = "<a id=\"myroomgb\" title=\"我的群组\" class=\"\" ><img src=\"images/friend.png\" class=\"process  padding715 greybg\" /></a>";
		htmlFrame[i++] = "</div><div id=\"frienddiv\">";
		htmlFrame[i++] = "<div id=\"searchfriend\" class=\"padding10\"><input type=\"text\" class=\"fullinput greyletter grey1border\" placeholder=\"搜索好友\"></div>";
		htmlFrame[i++] = loadingImgFr + "<div id=\"friendcontent\" class=\"padding10\">";
		htmlFrame[i++] = "<div id=\"realfriend\"></div></div>";
	//	htmlFrame[i++] = "<div id=\"friendadd\" class=\" greybg padding5\"><a class=\"leftmargin_10\" href=\"basic/_addFriend.jsp\" rel=\"facebox\" size=\"s\" title=\"添加好友\"><img src=\"images/addfriend.png\" /></a><a class=\"leftmargin_10\" href=\"basic/_addIMS.jsp\" rel=\"facebox\" size=\"s\" title=\"添加IMS\"><img src=\"images/imscall.png\" /></a>";
	//	htmlFrame[i++] = "<div id=\"friendadd\" class=\" greybg padding5\"><a class=\"leftmargin_10\" href=\"basic/_addFriend.jsp\" rel=\"facebox\" size=\"s\" title=\"添加好友\"><img src=\"images/addfriend.png\" /></a><a class=\"leftmargin_10\" href=\"basic/_addIMS.jsp\" rel=\"facebox\" size=\"s\" title=\"添加IMS\"><img src=\"images/imscall.png\" /></a><a class=\"leftmargin_10\" onclick=\"IMSmeeting()\" size=\"s\" title=\"添加视频会议\"><img src=\"images/c22.png\" /></a>";//edit by chenyan
		
		
		
		htmlFrame[i++] = "</div></div>";
		htmlFrame[i++] = "<div id=\"contactdiv\">";
		htmlFrame[i++] = "<div id=\"searchcontact\" class=\"padding10\"><input type=\"text\" class=\"fullinput greyletter grey1border\" placeholder=\"搜索联系人\" onkeyup=\"searchContact()\"></div>";
		htmlFrame[i++] = loadingImgAdr + "<div id=\"friendcontent\" class=\"padding10\">";
		htmlFrame[i++] = "<div id=\"realcontact\"></div></div>";
		
		htmlFrame[i++] = "</div></div>";
		
		htmlFrame[i++] = "<div id=\"roomdiv\">";
		htmlFrame[i++] = "<div id=\"searchroom\" class=\"padding10\"><input type=\"text\" class=\"fullinput greyletter grey1border\" placeholder=\"搜索聊天室\" onkeyup=\"searchContact()\"></div>";
		htmlFrame[i++] = loadingImgRo + "<div id=\"friendcontent\" class=\"padding10\">";
		htmlFrame[i++] = "<div id=\"realroom\"></div></div>";
		htmlFrame[i++] = "<div id=\"roomadd\" class=\" greybg padding5\"><a class=\"leftmargin_10\" href=\"basic/_createRoom.jsp\" rel=\"facebox\" size=\"s\" title=\"创建聊天室\"><img src=\"images/createroom.png\" /></a><a class=\"leftmargin_10\" href=\"basic/_addRoom.jsp\" rel=\"facebox\" size=\"s\" title=\"添加聊天室\"><img src=\"images/addfriend.png\" /></a>";		htmlFrame[i++] = "</div></div>";
		
		var htmlFrameSum = htmlFrame.join("");
		$("#friendlist").html(htmlFrameSum);
	}
	if(select == "friend"){
		
		$('#contactdiv').hide();
		$('#roomdiv').hide();
		$('#frienddiv').show();
		$('#myfriendgb').attr('class', 'selected leftmargin_10');
		$('#myfriendgb img').attr('class', 'process currentstep padding715');
		$('#addlistgb').attr('class','');
		$('#addlistgb img').attr('class','process padding715 greybg');
		
		$('#myroomgb').attr('class','');
		$('#myroomgb img').attr('class','process padding715 greybg');
		
		$('#contactdiv #friendcontent').attr('id', 'notfriendcontent');
		$('#contactdiv #frloading').attr('id', 'notfrloading');
		$('#frienddiv #notfriendcontent').attr('id', 'friendcontent');
		$('#frienddiv #notfrloading').attr('id', 'frloading');

		
		
		
	}else if(select == "addlist"){
		$('#contactdiv').show();
		$('#frienddiv').hide();
		
		$('#roomdiv').hide();
		
		
		$('#addlistgb').attr('class','selected');
		$('#addlistgb img').attr('class', 'process currentstep padding715');
		
		$('#myfriendgb').attr('class','');
		$('#myfriendgb img').attr('class', 'process  padding715 greybg');
		$('#myroomgb').attr('class','');
		$('#myroomgb img').attr('class','process padding715 greybg');
		
		$('#contactdiv #notfriendcontent').attr('id', 'friendcontent');
		$('#contactdiv #notfrloading').attr('id', 'frloading');
		$('#frienddiv #friendcontent').attr('id', 'notfriendcontent');
		$('#frienddiv #frloading').attr('id', 'notfrloading');
		
		
		
		
		
	}else if(select == "room"){
		$('#contactdiv').hide();
		$('#frienddiv').hide();
		
		$('#roomdiv').show();
		
		$('#myroomgb').attr('class', 'selected');
		$('#myroomgb img').attr('class', 'process currentstep padding715');
		$('#addlistgb').attr('class','');
		$('#addlistgb img').attr('class','process padding715 greybg');
		$('#myfriendgb').attr('class','');
		$('#myfriendgb img').attr('class', 'process  padding715 greybg');
		
		
		$('#contactdiv #friendcontent').attr('id', 'notfriendcontent');
		$('#contactdiv #frloading').attr('id', 'notfrloading');
		$('#roomdiv #notfriendcontent').attr('id', 'friendcontent');
		$('#roomdiv #notfrroom').attr('id', 'frroom');
        $('#roomdiv #notfriendcontent').attr('id', 'friendcontent');
		$('#roomdiv #notfrroom').attr('id', 'frroom');
		$('#frienddiv #friendcontent').attr('id', 'notfriendcontent');
		$('#frienddiv #frloading').attr('id', 'notfrloading');
		
		
		
		
		
	}
}



//显示视频会议界面函数 由主页图片点击进入  edit by chenyan
function IMSmeeting(){
	 var obj={"id" : "meeting","avatar" : undefined,"name" : "meeting"};

	 if($("#Meeting").length<=0)
		 {
	 createIMSmeetingOutside(obj,true);
		 }
    //createIMSmeetingDiv(obj,true);	
}





//显示一组成员
function showGroup(groupName, groupMember, is_root){
	var htmlInside = [];
	var groupMembers = [];
	if(is_root){
		htmlInside[0] = "<div><div class=\"greyletter groupname leftfloat\">"+groupName+"</div>"+
						"<div class=\"clear\"></div></div>";
	}else{
		var operation = "<ul><li><a class=\"greyletter nodecoration rightmargin_5 bigsize\" href=\"javascript:void(0)\">...</a>"+
						"<ul>"+
						"<li class=\"padding715 dottedline\"><a class=\"greyletter\" href=\"basic/_editGroupInfo.jsp\" rel=\"facebox\" size=\"s\" title=\"编辑信息\" onclick=\"writeIntoMark('"+groupName+"')\">编辑信息</a></li>"+
						"<li class=\"padding715\"><a class=\"greyletter\" href=\"javascript:void(0)\" onclick=\"deleteGroupFn('"+groupName+"')\">删除群组</a></li>"+
						"</ul></li></ul>";
		htmlInside[0] = "<div><div class=\"greyletter groupname leftfloat\">"+groupName+"</div>"+
						"<div class=\"rightfloat webwidget_vertical_menu_temp\">"+operation+"</div>"+
						"<div class=\"clear\"></div></div>";
	}

	for(var i = 0; i < groupMember.length; i++){
		if(groupName == "黑名单"){
			groupMembers[i] = "<div class=\"blacklistItem\" onselectstart=\"return false\" onselect=\"document.selection.empty()\" id=\""+groupMember[i].userId+"\">";
			if(groupMember[i].avatar != undefined){
				groupMembers[i] += "<img src='"+groupMember[i].avatar+"' height=\"30px\" width=\"30px\"  class=\"avatar leftfloat\"/>";
			}
			var operation = "<ul><li><a class=\"greyletter nodecoration leftmargin_5\" href=\"javascript:void(0)\">▼</a>"+
							"<ul>"+
							"<li class=\"padding715 dottedline\" onclick=\"$(this).find('a').click()\"><a class=\"greyletter\" href=\"basic/_editFriendInfo.jsp\" rel=\"facebox\" size=\"s\" title=\"编辑信息\" onclick=\"stopBubble(event);writeIntoMark('"+groupMember[i].userName+"')\">编辑信息</a></li>"+
							"<li class=\"padding715\" onclick=\"deleteFriendFn('"+groupMember[i].userName+"')\"><a class=\"greyletter\" href=\"javascript:void(0)\">删除该好友</a></li>"+
							"</ul></li></ul>";
			groupMembers[i] += "<div class=\"leftfloat padding5\"><img class='status leftfloat rightmargin_5' src='images/"+groupMember[i].status+".gif' />  <div class='leftfloat'>"+groupMember[i].userName+"</div></div>"+
								"<div class=\"rightfloat webwidget_vertical_menu_temp\">"+operation+"</div>"+
								"<div class=\"clear\"></div></div>";
			
		}else{
			groupMembers[i] = "<div class=\"groupmembertemp\" onselectstart=\"return false\" onselect=\"document.selection.empty()\" id=\""+groupMember[i].userId+"\">";
			if(groupMember[i].avatar != undefined){
				groupMembers[i] += "<img src='"+groupMember[i].avatar+"' height=\"30px\" width=\"30px\"  class=\"avatar leftfloat\"/>";
			}
			var operation = "<ul><li><a class=\"greyletter nodecoration leftmargin_5\" href=\"javascript:void(0)\">▼</a>"+
							"<ul>"+
							"<li class=\"padding715 dottedline\" onclick=\"startFriendDialog('"+groupMember[i].userId+"','"+groupMember[i].avatar+"')\"><a class=\"greyletter\"  href=\"javascript:void(0)\">发起会话</a></li>"+
							"<li class=\"padding715 dottedline\" onclick=\"moveToBlackList('"+groupMember[i].userName+"')\"><a class=\"greyletter\"  href=\"javascript:void(0)\">移至黑名单</a></li>"+
							"<li class=\"padding715 dottedline\" onclick=\"$(this).find('a').click()\"><a class=\"greyletter\" href=\"basic/_editFriendInfo.jsp\" rel=\"facebox\" size=\"s\" title=\"编辑信息\" onclick=\"stopBubble(event);writeIntoMark('"+groupMember[i].userName+"')\">编辑信息</a></li>"+
							"<li class=\"padding715\" onclick=\"deleteFriendFn('"+groupMember[i].userName+"')\"><a class=\"greyletter\" href=\"javascript:void(0)\">删除该好友</a></li>"+
							"<li class=\"padding715\" onclick=\"$(this).find('a').click()\"><a class=\"greyletter\" href=\"basic/_filetransfer.jsp\"rel=\"facebox\"size=\"b\" title=\"文件传输\" onclick=\"writeIntoMark('"+groupMember[i].userName+"')\">文件传输</a></li>"+	
							"<li class=\"padding715 dottedline\" onclick=\"startScreenShare('"+groupMember[i].userId+"','"+groupMember[i].avatar+"')\"><a class=\"greyletter\"  href=\"javascript:void(0)\">屏幕共享</a></li>"+
							"</ul></li></ul>";
			groupMembers[i] += "<div class=\"leftfloat padding5\"><img class='status leftfloat rightmargin_5' src='images/"+groupMember[i].status+".gif' />  <div class='leftfloat'>"+groupMember[i].userName+"</div></div>"+
								"<div class=\"rightfloat webwidget_vertical_menu_temp\">"+operation+"</div>"+
								"<div class=\"clear\"></div></div>";
		}
		
	}
	htmlInside[1] = groupMembers.join("");
	var htmlInsideSum = htmlInside.join("");
	$("#frloading").hide();
	$("#realfriend").append(htmlInsideSum);
	$(".groupmembertemp").dblclick(function(){
		console.log("in showgroups");
		var status = $(this).find('.status').attr('src');
		var id = $(this).attr('id');
		if(status == 'images/onlinemessage.gif'){
			$(this).find('.status').attr('src', 'images/online.gif');
			$('#talking'+id).find('.status').attr('src', 'images/online.gif');
		}else if(status == 'images/offlinemessage.gif'){
			$(this).find('.status').attr('src', 'images/offline.gif');
			$('#talking'+id).find('.status').attr('src', 'images/offline.gif');
		}
		var obj = {
			id : $(this).attr("id"),
			avatar : $(this).find("img.avatar").attr("src"),
			name : userIdToEmail($(this).attr("id")),
			status : $(this).find(".status").attr("src")
		};
		console.log("obj.id:"+obj.id);
		
		if(obj.name == undefined){
			console.log(obj);
			alert('抱歉，此好友不是webrtc用户，无法发起会话！');
		}else{
			createDialogDiv(obj, true);
		}
	});
	$(".blacklistItem").attr('class', 'padding5 groupmember');
	$(".groupmembertemp").attr('class', 'padding5 groupmember');
	$(".webwidget_vertical_menu_temp").webwidget_vertical_menu();
	$(".webwidget_vertical_menu_temp").removeClass('webwidget_vertical_menu_temp').addClass('webwidget_vertical_menu');
}

//显示聊天室
function showRoom(roomName){
	
	var htmlInside = [];
	
	var roomobj={};
	roomobj = {"id" : roomName,"avatar" : roomName,"name" : roomName};
    	
	var operation = "<ul><li><a class=\"greyletter nodecoration rightmargin_5 bigsize\" href=\"javascript:void(0)\">...</a>"+
	"<ul>"+
	"<li class=\"padding715 dottedline\"><a class=\"greyletter\"  href=\"javascript:void(0)\" onclick=\"startRoomDialog('"+roomobj.id+"','"+roomobj.avatar+"')\">进入聊天室</a></li>"+
	"<li class=\"padding715 dottedline\"><a class=\"greyletter\" href=\"basic/_editContactInfo.jsp\" rel=\"facebox\" size=\"s\" title=\"编辑信息\" onclick=\"writeIntoMark('"+roomName+"')\">编辑信息</a></li>"+
	"<li class=\"padding715 dottedline\" onclick=\"startRoomvideo('"+roomobj.id+"','"+roomobj.avatar+"')\"><a class=\"greyletter\"  href=\"javascript:void(0)\">发起视频会话</a></li>"+
	"<li class=\"padding715 dottedline\" onclick=\"selectfile('"+roomobj.id+"','"+roomobj.avatar+"')\"><a class=\"greyletter\"  href=\"javascript:void(0)\">上传文件</a></li>"+
	"<li class=\"padding715\"><a class=\"greyletter\" href=\"javascript:void(0)\" onclick=\"deleteRoomFn('"+roomName+"')\">离开聊天室</a></li>"+
	"</ul></li></ul>";
    htmlInside[0] = "<div><div class=\"greyletter groupname leftfloat\">"+roomName+"</div>"+
	"<div class=\"rightfloat webwidget_vertical_menu_temp\">"+operation+"</div>"+
	"<div class=\"clear\"></div></div>";
	console.log("ABC");
	var htmlInsideSum = htmlInside.join("");
	$("#frroom").hide();
	$("#realroom").append(htmlInsideSum);

}

//显示好友列表外框，根据屏幕高度宽度设置不同的形态
function showFriendList(){
	var height;
	var top;
	
	height = $("#myfriend").offset().top - $(window).scrollTop();
	top = 0;
	
	$("#inner").css({"margin-right" :"auto", "margin-left" : "auto"});
	$(".pub_banner").css({"margin-right" : "auto", "margin-left" : "auto"});
	$(".banner").css({'width' : 'auto'});
	$("#friendlist").css({"width":"270px"});
	var widthMinus = $("#friendlist").width() - ($("body").width() - $("#inner").width()) / 2;
	if( widthMinus > 0 ){
		var marginRight = ($("body").width() - $("#inner").width()) / 2 + widthMinus;
//		if( $("#inner").offset().left > widthMinus){
			var marginLeft = $("#inner").offset().left - widthMinus;
			$("#inner").css({"margin-right" : marginRight, "margin-left" : marginLeft});
			$(".pub_banner").css({"margin-right" : marginRight, "margin-left" : "auto"});
			var width = $(".banner").width() - $("#friendlist").width();
			$(".banner").css({'width' : width+'px'});
			$(".banner .content").css({"margin-left" : marginLeft});
			$("#friendlist").css({'border-top':'none'});
//		}else{
		//	$("#friendlist").css({'border-top':'1px solid #c8c8c8'});
		//	height -= 75;
		//	top += 75;
//		}
	}
	$("#friendlist").css({"height" : height, "top" : top, "width" : '270px'});
	$("#friendcontent").css({"height" : height-155, "overflow": "auto"});
}

//点击“好友列表”的事件
var clicktimes = 0;
$("#myfriend").click(function(){
	clicktimes ++;
	$("#friendlist").toggleClass("hidden");
	if( $("#friendlist").hasClass("hidden") ){
		$(this).css({"width":"100px"});
		$("#inner").css({"margin-right" : "auto", "margin-left" : "auto"});
		$(".pub_banner").css({"margin-right" : "auto", "margin-left" : "auto"});
		$(".banner").css({'width' : 'auto'});
		$(".banner .content").css({"margin-left" : "auto", "margin-right" : "auto"});
	}else{
		if(!$("#newmsg").hasClass("hidden")){
			$("#newmsg").addClass("hidden");
		}
		$(this).css({"width":"270px"});
		showFriendFrame("friend");
		//首次打开时不需要加载好友列表
		if(clicktimes != 1){
			com.xmpp.queryRoster();
		}
		showFriendList();
	}
});
$('#myfriend').click()



//滚动滚轮的事件
$(window).scroll(function () {
	if(!$("#friendlist").hasClass("hidden")){
		showFriendList();
	}
});

//窗口大小改变的事件
$(window).resize(function(){
	if(!$("#friendlist").hasClass("hidden")){
		showFriendList();
	}
});

//搜索好友事件
var searchFriendList = [];
$('#searchfriend input').keyup(function(){
	if(searchFriendList.length == 0){
		searchFriendList = com.xmpp.getRoster();
		console.log(searchFriendList);
	}else{
		var searchTip = $('#searchfriend input').val();
		var groupName = "搜索结果";
		var groupMember = [];
		for(var i = 0; i < searchFriendList.length; i++){
			if(searchTip != '' && searchFriendList[i].email_id.match(searchTip)){
				groupMember[i] = {
					name:searchFriendList[i].email_id,
					id:searchFriendList[i].name
				};
			}
		}
		
		$('#search').remove();
		$('#searchmember').remove();
		if(searchTip != ''){
			optionSpecialGroup(groupName, 'search', 'add', groupMember);
			if(groupMember.length == 0){
				$('#searchmember').html('<div class="padding715 centeralign redletter">没有搜索到任何好友</div>');
			}
		}
	}
})

//搜索事件
var searchRoomList = [];
$('#searchroom input').keyup(function(){
	if(searchRoomList.length == 0){
		searchRoomList = com.xmpp.getRoster();
		console.log(searchRoomList);
	}else{
		var searchTip = $('#searchroom input').val();
		var roomName = "搜索结果";
		var roomMember = [];
		for(var i = 0; i < searchRoomList.length; i++){
			if(searchTip != '' && searchRoomList[i].name.match(searchTip)){
				roomMember[i] = {
					name:searchFriendList[i].name
				};
			}
		}
		
		$('#search').remove();
		$('#searchmember').remove();
		if(searchTip != ''){
			optionSpecialRoom(groupName, 'search', 'add', groupMember);
			if(roomMember.length == 0){
				$('#searchmember').html('<div class="padding715 centeralign redletter">没有搜索到任何好友</div>');
			}
		}
	}
})
