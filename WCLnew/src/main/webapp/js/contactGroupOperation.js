function createReservedRoomFn(){
		var roomname = $('#roomname').val();
		var roomJID = roomname + "@conference." + com.user.domain;
	    $("#room_list").append("<option value='"+roomname+"'>"+roomJID+"</option>");
		var nickname=com.user.email_id;	
		
	//com.xmpp.isRoomExist(roomJID);
		com.xmpp.joinRoom(roomJID);
		//console.log("room_list+"=roomJID);
		cancelFaceboxFn();
				
//		}else{
//			$("#createRoomTip").html('您还没有选择要创建的聊天室。');
//		}
	}

//添加聊天室
function joinRoomFn(){
	var checkObj = $("input[name=searchFriendList]:checked");
	var checkResult = checkObj.val();
	var roomJID = checkResult + '@conference.webrtc';
	com.xmpp.joinRoom(roomJID);
//	com.xmpp.onRoom(com.rooms);
	cancelFaceboxFn();	
		
}

//发起聊天室会话
function startRoomDialog(id,avatar){
	var obj={};
	if(!avatar || avatar == "" || avatar == "undefined"){
		obj = {"id" : id,"avatar" : undefined,"name" : userIdToEmail(id)};
	}else{
		obj = {"id" : id,"avatar" : avatar,"name" : userIdToEmail(id)};
	}	
	if(obj.name == undefined){
		fillTipBox('error','抱歉，此好友不是webrtc用户，无法发起会话！');
	}else{
		$("#myroomgb").click();//跳到好友列表
		$('#'+id).dblclick();		
//		createDialogDiv(obj, true);
	}
}

function deleteRoomFn(roomName){
	
	var rooJID=
	com.xmpp.leaveRoom(roomJID);
	
}

function showRoomMemberFn(){ 
	var roomName =readFromMark();
    var currentUser=com.user.email_id.split('@')[0];  //获取用户id
	 
    console.log(currentUser);
    
    var roomJID = roomName + "@conference." + com.user.domain;
	var roomMemberList=com.groupChat.getRoomMemberList(roomJID);
	 
	//获取当前用户权限
    for(var i=0;i<roomMemberList.length; i++){
    	var memberName=roomMemberList[i].jid.split('@')[0];
    	
    	if(memberName == currentUser){
    		var currentAffiliation= roomMemberList[i].affiliation;
    		
    		console.log(memberName+"currentAffiliation:"+currentAffiliation);
    	}
    	
    	}
    var userJID=[];
			
	//权限为owner的显示界面
	if(currentAffiliation == "Owner"){
		
		for(var i=0; i<roomMemberList.length ; i++){
		
			console.log(roomMemberList[i]);
			var memberID=roomName+":"+i;

			var  memberNameArray=new Array();
			 memberNameArray[0]=roomMemberList[i].jid.split('@')[0];
			 memberNameArray[1]=roomMemberList[i].jid.split('@')[1];
			var  memberName=memberNameArray.join("@");
			
			var userJIDArray=new Array();
			userJIDArray[0]=memberNameArray.join('#');
			userJIDArray[1]="webrtc";
			
			
			userJID[i]=userJIDArray.join('@');
			
			console.log("userJID:"+userJID[i]);
			var memberAffiliation=roomMemberList[i].affiliation;
			var memberStatus=roomMemberList[i].status;
			
		
			console.log(memberID,memberName,memberAffiliation,memberStatus);
			
			if (memberAffiliation=="Owner"){
		       
				var li_1="<li class=\"padding715 dottedline\"><a class=\"greyletter\" href=\"javascript:void(0)\"></a>"+memberID+"&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp"+memberName+"&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp"+memberAffiliation+"&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp"+memberStatus+"&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</li>";
				$("#memberContainer").append(li_1);     		   
				
			}else if(memberAffiliation=="Admin"){
				
				var li_1="<li class=\"padding715 dottedline owner_admin\" onclick=\"changeAffiliationForOwnerFn('"+roomJID+"','"+userJID[i]+"','Member')\">"+memberID+"&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp"+memberName+"&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp"+memberAffiliation+"&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp"+memberStatus+"&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</li>";
				$("#memberContainer").append(li_1);     
				
			}else{
				
				var li_1="<li class=\"padding715 dottedline owner_member\" onclick=\"changeAffiliationForOwnerFn('"+roomJID+"', '"+userJID[i]+"','Admin')\">"+memberID+"&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp"+memberName+"&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp"+memberAffiliation+"&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp"+memberStatus+"&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</li>";
				
				$("#memberContainer").append(li_1);     
			}		
	    }
		
		$('.owner_admin').append($("<image class='owner_admin_img' src='images/toMember.png'></image>"));
		

		
		
		$('.owner_member').append($("<image class='owner_member_img' src='images/toAdmin.png'></image>"));
	     
		
	}
	//权限为Admin的显示界面
	else if (currentAffiliation == "Admin"){
		
		for(var i=0; i<roomMemberList.length ; i++){
		
			console.log(roomMemberList[i]);
			var memberID=roomName+":"+i;

			var  memberNameArray=new Array();
			 memberNameArray[0]=roomMemberList[i].jid.split('@')[0];
			 memberNameArray[1]=roomMemberList[i].jid.split('@')[1];
			var  memberName=memberNameArray.join("@");
			
			var userJIDArray=new Array();
			userJIDArray[0]=memberNameArray.join('#');
			userJIDArray[1]="webrtc";
			
			
			userJID[i]=userJIDArray.join('@');
			
			var memberAffiliation=roomMemberList[i].affiliation;
			var memberStatus=roomMemberList[i].status;
			console.log(memberID,memberName,memberAffiliation,memberStatus);
			
			
			if (memberAffiliation=="Owner"){
		       
				var $li2=$("<li class=\"padding715 dottedline\"><a class=\"greyletter\" href=\"javascript:void(0)\"></a>"+memberID+"&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp"+memberName+"&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp"+memberAffiliation+"&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp"+memberStatus+"&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</li>");
				$("#memberContainer").append($li2);		   
				
			}else if(memberAffiliation=="Admin"){
				
				var $li2=$("<li class=\"padding715 dottedline admin_admin\" onclick=\"changeAffiliationForAdminFn('"+roomJID+"','"+userJID[i]+"','Member')\">"+memberID+"&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp"+memberName+"&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp"+memberAffiliation+"&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp"+memberStatus+"&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</li>");
				$("#memberContainer").append($li2);
			}else{
				
				var $li2=$("<li class=\"padding715 dottedline admin_member\" onclick=\"changeAffiliationForAdminFn('"+roomJID+"','"+userJID[i]+"','Admin')\">"+memberID+"&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp"+memberName+"&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp"+memberAffiliation+"&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp"+memberStatus+"&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</li>");
				$("#memberContainer").append($li2);
			}
           
	    }

		$('.admin_admin').append($("<image class='admin_admin_img' src='images/toMember.png'></image>"));

		
		$('.admin_member').append($("<image class='admin_member_img' src='images/toAdmin.png'></image>"));
	
	}
	else{
	//权限为member的显示界面
	for(var i=0; i<roomMemberList.length ; i++){
	
		console.log(roomMemberList[i]);
		var memberID=roomName+":"+i;

		var  memberNameArray=new Array();
		 memberNameArray[0]=roomMemberList[i].jid.split('@')[0];
		 memberNameArray[1]=roomMemberList[i].jid.split('@')[1];
		var  memberName=memberNameArray.join("@");
		
		var memberAffiliation=roomMemberList[i].affiliation;
		var memberStatus=roomMemberList[i].status;
		console.log(memberID,memberName,memberAffiliation,memberStatus);
		
		
		if (memberAffiliation=="Owner"){
	       
			var $li3=$("<li class=\"padding715 dottedline\"><a class=\"greyletter\" href=\"javascript:void(0)\"></a>"+memberID+"&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp"+memberName+"&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp"+memberAffiliation+""+memberStatus+"&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</li>");
        			   
			
		}else if(memberAffiliation=="Admin"){
			
			var $li3=$("<li class=\"padding715 dottedline \">"+memberID+"&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp"+memberName+"&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp"+memberAffiliation+"&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp"+memberStatus+"&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</li>");
		
		}else{
			
			var $li3=$("<li class=\"padding715 dottedline \">"+memberID+"&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp"+memberName+"&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp"+memberAffiliation+"&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp"+memberStatus+"&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</li>");
		}
       
		$("#memberContainer").append($li3);
	
		

    }
	
	
}
	
	$("#showRoomButton").hide();
}


function changeAffiliationForOwnerFn(roomJID, userJID, toAffiation){
	

	     com.groupChat.changeAffiliationForOwner(roomJID, userJID, toAffiation) 
		  alert("修改权限成功！");
		
	
		  $("#memberContainer").empty();
		  showRoomMemberFn();

		  
}

function changeAffiliationForAdminFn(roomJID, userJID, toAffiation){
	     com.groupChat.changeAffiliationForAdmin(roomJID, userJID, toAffiation)
	     
	     alert("修改权限成功！");
			
	 	
		  $("#memberContainer").empty();
		  showRoomMemberFn();

}







//进入聊天室
function startRoomDialog(id,avatar){
	var roomobj={};
		roomobj = {"id" : id,"avatar" : id,"name" : id};
	var	roomreal = roomobj.id;
	var	roomchange = roomreal.replace('@', '9');
	var	roomchanged = roomchange.replace('.','0');
		createroomDialogDiv(roomchanged, true);

}




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
function dragroomWindow(roomdragClass, roomdialogDiv){
	var bool=false, offsetX = 0, offsetY = 0;  	//标识是否移动元素，声明DIV在当前窗口的Left和Top值
	$('.'+roomdragClass).mouseover(function(){
		$(this).css('cursor','move');			//当鼠标移动到拖拽的DIV上的时候，将鼠标的样式设置为移动(move)
	});
	$('.'+roomdragClass).mousedown(function(evt){ 
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
		$('.'+roomdragClass).css({'cursor':'move !important'});
		//当bool为true的时候执行下面的代码
		var x = evt.clientX-offsetX, y = evt.clientY-offsetY; 
		if(x > $(window).width() - $('.'+roomdragClass).width() - $('#friendlist').width() - 15){
			x = $(window).width() - $('.'+roomdragClass).width() - $('#friendlist').width() - 15;
		}
		if(x < 0){
			x = 0;
		}
		if(y > $(window).height() - $('.dialogbox').height()){
			y = $(window).height() - $('.dialogbox').height()
		}
		if(y < 65){
			y = 65;
		}
		$(roomdialogDiv).css("left", x);
		$(roomdialogDiv).css("top", y);
	}).mouseup(function(){
		bool=false;								//当鼠标在移动元素起来的时候将bool设定为false
	});
}




//打开会话窗口的方法
//加载标题栏
function loadroomTitleDiv(reallroom, roomdialogDiv, dialogWidth){
	var titleHeight = 30, titleTableHeight = 24;
	var roomtitleDiv=document.createElement('div');		//标题Div
	roomdialogDiv.appendChild(roomtitleDiv);
	$(roomtitleDiv).css({'width':dialogWidth+'px', 'height':titleHeight+'px', 'color':'#333333'});
	
	var roomtitleTable=document.createElement("table");
	roomtitleDiv.appendChild(roomtitleTable);
	$(roomtitleTable).css({'width':dialogWidth+'px', 'height':titleTableHeight+'px', 'margin':'2px 5px'});
	
	var roomtitleTr=document.createElement("tr");
	roomtitleTable.appendChild(roomtitleTr);
	
	if(reallroom != undefined){
		var roomtitleTd1=document.createElement("td");
		roomtitleTr.appendChild(roomtitleTd1);
		$(roomtitleTd1).css({'width':'30px'});
		var roomtitleTd1Img=document.createElement("img");
		roomtitleTd1.appendChild(roomtitleTd1Img);
		roomtitleTd1Img.style.width="24px";
		roomtitleTd1Img.style.height="24px";
	}
	
	var roomtitleTd2=document.createElement("td");
	roomtitleTr.appendChild(roomtitleTd2);
	var roomtitleTd2Width = dialogWidth - 30 - 25;
	$(roomtitleTd2).css({'width':roomtitleTd2Width+'px', 'text-align':'left'});
	//edit by qiepei 添加“在线”状态
	var roomtitleTd2Html= $('#'+reallroom+' div:first').html(); 
	if(roomtitleTd2Html == '' || roomtitleTd2Html == undefined){
		var	roomchange = reallroom.replace('9', '@');
		var	roomchanged = roomchange.replace('0','.');
		roomtitleTd2Html = roomchanged;
	}
	roomtitleTd2.innerHTML=roomtitleTd2Html;
	
	var roomdragClass='drag'+reallroom;				//设置窗口可拖拽
	$(roomtitleTd1).attr('class', roomdragClass);
	$(roomtitleTd2).attr('class', roomdragClass);
	dragroomWindow(roomdragClass, roomdialogDiv);

	var roomtitleTd3=document.createElement("td");
	roomtitleTr.appendChild(roomtitleTd3);
	roomtitleTd3.style.width="25px";
	var roomtitleTd3Div=document.createElement("div");
	roomtitleTd3.appendChild(roomtitleTd3Div);
	$(roomtitleTd3Div).css({'width':'16px', 'height':'16px', 'cursor':'pointer'});
	$(roomtitleTd3Div).attr('class', 'dialogclose');
	roomtitleTd3Div.title="关闭";
	
	$(roomtitleTd3Div).click(function(){     			//当用鼠标点击关闭的图片时，清除创建的层
	
		var member = [reallroom];
		
		$(roomdialogDiv).remove();
	});
}

//加载聊天区域
function loadroomChartDiv(reallyroom, imDiv, chartDivWidth){
	var chartDivHeight = 240;
	var roomchatDivID="to"+reallyroom;						//聊天区域的Div
	var roomchatDiv=document.createElement('div');
	imDiv.appendChild(roomchatDiv);
	roomchatDiv.id=roomchatDivID;
	$(roomchatDiv).css({'width':chartDivWidth+'px', 'height':chartDivHeight+'px', 'margin':'0 5px'});
	$(roomchatDiv).css({'background':'#ffffff', 'color':'#000000', 'overflow':'auto'});

}

//加载发送消息区域
function loadroomMessageDiv(reallyedroom, imDiv, chartDivWidth){
	var msgDivHeight = 120, msgTextWidth = 345, msgTextHeight = 70;
	var roommessageDiv=document.createElement('div');	//发送消息部分的Div
	imDiv.appendChild(roommessageDiv);
	$(roommessageDiv).css({'width':chartDivWidth+'px', 'height':msgDivHeight+'px', 'margin':'5px auto'});
	
	var roommessageText=document.createElement('textarea');
	roommessageDiv.appendChild(roommessageText);
	roommessageTextID="text"+reallyedroom;
	roommessageText.id=roommessageTextID;
	$(roommessageText).css({'width':msgTextWidth+'px', 'height':msgTextHeight+'px'});
		
	var roommessageTable=document.createElement("table");
	roommessageDiv.appendChild(roommessageTable);
	var roommessageTr=document.createElement("tr");
	roommessageTable.appendChild(roommessageTr);
	var roommessageTd1=document.createElement("td");
	roommessageTd1.style.width="290px";
	roommessageTr.appendChild(roommessageTd1);

	var roommessageTd2=document.createElement("td");
	roommessageTr.appendChild(roommessageTd2);	
	
	var roommessageSpan=document.createElement('span');
	roommessageTd1.appendChild(roommessageSpan);
	roommessageSpan.style.color="red";	
	
	var roommessageButton = '<input type="button" class="button" value="发送" />';
	$(roommessageTd2).html(roommessageButton);
	$(roommessageTd2).attr('class', roommessageTextID);
	
	$(roommessageTd2).click(function(){
		
		var roomcontent = trim($(roommessageText).val());
		
//		var roomid = $(this).attr('class');
//		var roomcontent = trim( $('#'+roomid).val() );//text是发送的消息
		$(roommessageSpan).attr("class","redletter");
		if(roomcontent ==""){
			$(roommessageSpan).html("不能发送空消息！");
		}else if( roomcontent.length > 350){
			var tip = "您已输入了"+ roomcontent.length +"字，超出了350的最大字数限制";			
			$(roommessageSpan).html(tip);
		}else{
			$(roommessageSpan).html("");
			
			//var content=trim( $('#'+id).val() );
//			var roomjid = roomobj.name;
			
			var	roomchange = reallyedroom.replace('0', '.');
			var	roomchanged = roomchange.replace('9','@');
			
			sendroomMsg(roomchanged, roomcontent,reallyedroom);
			$(roommessageText).val("");
//			$('#'+roomid).val("");
//			$('#'+roomid).focus();
		}			
	});
	$(roommessageText).focus();
	//回车键为发送的快捷方式
	$(roommessageText).keydown(function(event){
		var currKey = 0,e = event || window.event; //为了兼容，ie用event，而标准用e
		currKey = e.keyCode||e.which||e.charCode;
	
		if(currKey == 13 && !e.shiftKey){ //13为enter键，同时要求没有按下shift键
		 	e.returnValue=false;
		 	$(roommessageTd2).click();
		 	return false;
		}
	});
	
	//检查字数
	$(roommessageText).keyup(function(){
		var roommessageValue = trim($(this).val());
		var length = roommessageValue.length;
		if(length <= 350){
			$(roommessageSpan).attr("class","greyletter");
			var tip = "您已输入了"+ length +"字，还可输入"+ (350-length) +"字";
			$(roommessageSpan).html(tip);
			return true;
		}else{
			$(roommessageSpan).attr("class","redletter");
			var tip = "您已输入了"+ length +"字，超出了350的最大字数限制";			
			$(roommessageSpan).html(tip);
			return false;
		}
	})
}





//群成员列表以及邀请他人
function loadlistDiv(roomobj, roomlistDiv){
	var listDivWidth = 200, listDivHeight = 310;
	var listId = 'list'+roomobj;
	var listDiv = document.createElement("div");
	roomlistDiv.appendChild(listDiv);
	listDiv.id=listId;
	$(listDiv).css({'width':listDivWidth+'px', 'height':listDivHeight+'px', 
		 'margin':'0 5px 5px'});
	$(listDiv).css({'background':'#ffffff', 'color':'#000000', 'overflow':'auto'});
	var oprationDiv = document.createElement("div");
	roomlistDiv.appendChild(oprationDiv);
	$(oprationDiv).attr('class','listarea centeralign leftmargin_5 bottommargin_5');
	$(oprationDiv).html('');
	$(oprationDiv).append('<a title="发起视频通话" onclick="beginVideo(\''+obj.name.replace('-','@')+'\',\''+obj.id+'\')"><img src="images/video.png" class="video greybutton"/></a>');
	$(oprationDiv).append('<a title="群成员列表" onclick="getroommember(\''+roomobj+'\')"><input type="button" class="button" value="群成员列表"/></a>');		
	$(oprationDiv).append('<onclick="roomJoinInviteFn()"><input type="button" class="button" value="邀请他人"/>');	
}


//邀请他人
function roomJoinInviteFn(roomJID, userJID, inviteReason){
	com.xmpp.roomJoinInvite(roomJID, userJID, inviteReason);
}

	
//打开会话主窗口的方法
var count=2;
var dialogHeight = 400, dialogWidth = 570;
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
function createroomDialogDiv(realroom, isNew){ 
	var chartDivWidth = 350, chartDivHeight = 180, 
		msgDivHeight = 150, msgTextWidth = 345, msgTextHeight = 70;

	count++;       //count为全局变量,用来决定层的堆叠顺序

	var roomdialogID="chat"+realroom;		
	if(document.getElementById(roomdialogID)){          	//检测对话框是否应经存在
		count++;
		$("#"+roomdialogID).show().css({"z-index":count});
		$("#text"+realroom).focus();
	}else{
		resetPosition()
		if(t < 0){t = 30;}
		if(l < 0){l = 60;}
		if(isNew == true){
			var member = [realroom];
		
		}
		
		var roomdialogDiv=document.createElement('div');   	//创建层dialogDiv
		document.body.appendChild(roomdialogDiv);
		roomdialogDiv.id=roomdialogID;                  		//给层dialogDiv设置属性
		$(roomdialogDiv).css({'width':dialogWidth+'px', 'height':dialogHeight+'px'});
		$(roomdialogDiv).attr('class', 'greybox dialogbox');
		$(roomdialogDiv).css({'position':'absolute', 'top':t+'px', 'left':l+'px'});
		$(roomdialogDiv).attr('onselectstart', 'return false');
		$(roomdialogDiv).attr('onselect', 'document.selection.empty()');
		
		$(roomdialogDiv).click(function(){      			//当用鼠标点击该对话框时，该对话框到最上面
			count++;
			$(this).css({'z-index':count});
		});
		
		loadroomTitleDiv(realroom, roomdialogDiv, dialogWidth);
		var imDiv = document.createElement("div");
		roomdialogDiv.appendChild(imDiv);
		$(imDiv).attr('class', 'leftfloat');
		
		loadroomChartDiv(realroom, imDiv, chartDivWidth);
		loadroomMessageDiv(realroom, imDiv, chartDivWidth);
		
		
//		var	roomchange = realroom.replace('9', '@');
//		var	roomchanged = roomchange.replace('0','.');
		
		
		var inDiv = document.createElement("div");
		roomdialogDiv.appendChild(inDiv);
		$(inDiv).attr('class', 'rightfloat');

		loadlistDiv(realroom, inDiv);
	}
	$(roomdialogDiv).css({'z-index':count});
}






//发送聊天室消息
function sendroomMsg(roomjid, roomcontent, roomdivId){
//	roomjid = roomjid.replace('-', '@');	
	
	var roomjidAdded="@conference.webrtc";
	var roomJID=roomjid+roomjidAdded;
	
	console.log(roomJID+roomcontent);
	com.xmpp.sendRoomChatMessage(roomJID,roomcontent);
	var myemail = $('.pub_banner').attr("user");
	var	namechange = myemail.replace('@', '9');
	var	namechanged = namechange.replace('.','0');
	var myname='name'+namechanged;						//聊天区域的Div
	var mynameDiv=document.createElement('div');
	mynameDiv.id=myname;
	$(mynameDiv).append('<div class=\'leftalign orangeletter strong padding5\'>' + myemail + '</div>');
	$('#to'+roomdivId).append(mynameDiv);
	var mycontent='sending'+namechanged;						//聊天区域的Div
	var mycontentDiv=document.createElement('div');
	mycontentDiv.id=mycontent;
	$(mycontentDiv).append('<div class=\'lefttalign padding5 \'>'+
//	"<img src='http://freedisk.free4lab.com/download?uuid=e5980a8c-9336-4791-b0b4-65ac731a5799' />"+'' + 
	roomcontent + '</div>');
	$('#to'+roomdivId).append(mycontentDiv);
	console.log('Send message to ' + roomJID + ': ' + roomcontent);
	document.getElementById('to'+roomdivId).scrollTop = document.getElementById('to'+roomdivId).scrollHeight;
}

//离开聊天室
function deleteRoomFn(roomName){
	var roomJIDArray=[];
	roomJIDArray[0]=roomName;
	roomJIDArray[1]="@conference.webrtc";
	var roomJID=roomJIDArray.join("");
	com.xmpp.leaveRoom(roomJID);

	console.log(roomJID);

	$("#realroom").empty();
	for(var i=1;i<com.rooms.length;i++){
		
		console.log(com.rooms[i].roomJID);
		var roomName=com.rooms[i].roomJID.split('@')[0];

		showRoom(roomName);
	}

	fillTipBox('success','离开聊天室成功');
}


//获取聊天室成员列表
function getroommember(roomname){
	$('#list'+roomname).html('');
	var	roomchange = roomname.replace('9', '@');
	var	roomchanged = roomchange.replace('0','.')+"@conference.webrtc";
	var roommemberlist = new Array();
	var roommemberlist = com.groupChat.getRoomMemberList(roomchanged);
    var roomlistside = [];
    for(var i=0; i<roommemberlist.length; i++){
  	   
    	roomlistside[i] = "<div class='leftfloat'>"+roommemberlist[i].jid+"</div>";
    
    }
  var roomlistsum = roomlistside.join("");
  console.log(roomlistsum);
  $('#list'+roomname).append(roomlistsum);
}


//搜索房间
function searchRoomFn(roomJId){

	var roomJId = trim($("#"+roomJId).val());	
	//搜索的内容不为空
	if(roomJId != ""){
		$("#searchRoom").attr('disabled',true);
		$("#searchRoom").attr('value','...');
		$("#noSearchResult div").attr('class','centeralign middleveralign lightgreyletter ');
		$("#noSearchResultTip").html("搜索中...");
		com.xmpp.searchRoomsOnServer(roomJId);
	}
}

//上传
function selectfile(id,avatar){
	var roomobj={};
		roomobj = {"id" : id,"avatar" : id,"name" : id};
	var	roomreal = roomobj.id;
	var	roomchange = roomreal.replace('@', '9');
	var	roomchanged = roomchange.replace('.','0');
		selectfileDiv(roomchanged,true);

}



var count=2;
var selectHeight = 150, selectWidth = 244;
var t = null, l = null;
function resetPosition(){
	var h = $(window).height(), w = $(window).width();
	if(t == null && l == null){
		t = (h - selectHeight) / 2;
		l = (w - selectWidth) / 2;
	}else if( t > $(window).height() - $('.dialogbox').height() || l > $(window).width() - $('.dialogbox').width() - $('#friendlist').width() - 15){
		t = (h - selectHeight) / 2;
		l = (w - selectWidth) / 2;
	}else{
		t += 15;
		l += 15;
	}
}
function selectfileDiv(realroom, isNew){ 
	

	count++;       //count为全局变量,用来决定层的堆叠顺序

	var selectID="select"+realroom;		
	if(document.getElementById(selectID)){          	//检测对话框是否应经存在
		count++;
		$("#"+selectID).show().css({"z-index":count});
		$("#text"+realroom).focus();
	}else{
		resetPosition()
		if(t < 0){t = 30;}
		if(l < 0){l = 60;}
		if(isNew == true){
			var member = [realroom];
		
		}
		
		var selectDiv=document.createElement('div');   	//创建层dialogDiv
		document.body.appendChild(selectDiv);
		selectDiv.id=selectID;                  		//给层dialogDiv设置属性
		$(selectDiv).css({'width':selectWidth+'px', 'height':selectHeight+'px','background-color':'white'});
		$(selectDiv).attr('class', 'greybox dialogbox');
		$(selectDiv).css({'position':'absolute', 'top':t+'px', 'left':l+'px'});
		$(selectDiv).attr('onselectstart', 'return false');
		$(selectDiv).attr('onselect', 'document.selection.empty()');
		var selectTable=document.createElement("table");
		selectDiv.appendChild(selectTable);
		
		var selectTr3=document.createElement("tr");
		selectTable.appendChild(selectTr3);
	
		$(selectTr3).css({'background-color':'#ededed'});
		var selecttitleTd3=document.createElement("td");
		selectTr3.appendChild(selecttitleTd3);
		selecttitleTd3.style.width="25px";
		selecttitleTd3.align="right";
		var selecttitleTd3Div=document.createElement("div");
		selecttitleTd3.appendChild(selecttitleTd3Div);
		$(selecttitleTd3Div).css({'width':'16px', 'height':'16px', 'cursor':'pointer'});
		$(selecttitleTd3Div).attr('class', 'dialogclose');
		selecttitleTd3Div.title="关闭";
		
		$(selecttitleTd3Div).click(function(){     			//当用鼠标点击关闭的图片时，清除创建的层
		
			var member = [realroom];
			
			$(selectDiv).remove();
		});
		
	
		var selectTr1=document.createElement("tr");
		selectTable.appendChild(selectTr1);
		
		var selectTr2=document.createElement("tr");
		selectTable.appendChild(selectTr2);
		
		
		var selectTd2=document.createElement("td");
		selectTd2.style.width="40px";
		selectTd2.style.height="50px";
		selectTr1.appendChild(selectTd2);

		var selectfile = '<input type="file" name="file" id="file" />';
		$(selectTd2).append(selectfile);
		
		
		var selectTd1=document.createElement("td");
		selectTd1.style.width="40px";
		selectTd1.style.height="50px";
		selectTr2.appendChild(selectTd1);

		var selectButton = '<input type="button" class="button" value="上传" />';
		
		$(selectTd1).html(selectButton);
		
		$(selectDiv).click(function(){      			//当用鼠标点击该对话框时，该对话框到最上面
			count++;
			$(this).css({'z-index':count});
		});		
		
		
	
	var selectdragClass='drag'+realroom;				//设置窗口可拖拽
	$(selectTr3).attr('class', selectdragClass);
	dragroomWindow(selectdragClass, selectDiv);
	
 }
}

//多人视频

function startRoomvideo(id,avatar){
	var roomobj={};
		roomobj = {"id" : id,"avatar" : id,"name" : id};
	var	roomreal = roomobj.id;
	var	roomchange = roomreal.replace('@', '9');
	var	roomchanged = roomchange.replace('.','0');
	createRoomvideoDiv(roomchanged, true);

}






//加载多人视频的标题栏
function loadvedioTitleDiv(reallroom, roomdialogDiv, vedioWidth){
	var titleHeight = 30, titleTableHeight = 24;
	var roomtitleDiv=document.createElement('div');		//标题Div
	roomdialogDiv.appendChild(roomtitleDiv);
	$(roomtitleDiv).css({'width':vedioWidth+'px', 'height':titleHeight+'px', 'color':'#333333'});
	
	var roomtitleTable=document.createElement("table");
	roomtitleDiv.appendChild(roomtitleTable);
	$(roomtitleTable).css({'width':vedioWidth+'px', 'height':titleTableHeight+'px', 'margin':'2px 5px'});
	
	var roomtitleTr=document.createElement("tr");
	roomtitleTable.appendChild(roomtitleTr);
	
	if(reallroom != undefined){
		var roomtitleTd1=document.createElement("td");
		roomtitleTr.appendChild(roomtitleTd1);
		$(roomtitleTd1).css({'width':'30px'});
		var roomtitleTd1Img=document.createElement("img");
		roomtitleTd1.appendChild(roomtitleTd1Img);
		roomtitleTd1Img.style.width="24px";
		roomtitleTd1Img.style.height="24px";
	}
	
	var roomtitleTd2=document.createElement("td");
	roomtitleTr.appendChild(roomtitleTd2);
	var roomtitleTd2Width = vedioWidth - 30 - 25;
	$(roomtitleTd2).css({'width':roomtitleTd2Width+'px', 'text-align':'left'});
	//edit by qiepei 添加“在线”状态
	var roomtitleTd2Html= $('#'+reallroom+' div:first').html(); 
	if(roomtitleTd2Html == '' || roomtitleTd2Html == undefined){
		var	roomchange = reallroom.replace('9', '@');
		var	roomchanged = roomchange.replace('0','.');
		roomtitleTd2Html = roomchanged;
	}
	roomtitleTd2.innerHTML=roomtitleTd2Html;
	
	var roomdragClass='drag'+reallroom;				//设置窗口可拖拽
	$(roomtitleTd1).attr('class', roomdragClass);
	$(roomtitleTd2).attr('class', roomdragClass);
	dragroomWindow(roomdragClass, roomdialogDiv);

	var roomtitleTd3=document.createElement("td");
	roomtitleTr.appendChild(roomtitleTd3);
	roomtitleTd3.style.width="25px";
	var roomtitleTd3Div=document.createElement("div");
	roomtitleTd3.appendChild(roomtitleTd3Div);
	$(roomtitleTd3Div).css({'width':'16px', 'height':'16px', 'cursor':'pointer'});
	$(roomtitleTd3Div).attr('class', 'dialogclose');
	roomtitleTd3Div.title="关闭";
	
	$(roomtitleTd3Div).click(function(){     			//当用鼠标点击关闭的图片时，清除创建的层
	
		var member = [reallroom];
		
		$(roomdialogDiv).remove();
	});
}

var count=2;
var vedioHeight = 400, vedioWidth = 800;
var t = null, l = null;
function resetPosition(){
	var h = $(window).height(), w = $(window).width();
	if(t == null && l == null){
		t = (h - vedioHeight) / 2;
		l = (w - vedioWidth) / 2;
	}else if( t > $(window).height() - $('.dialogbox').height() || l > $(window).width() - $('.dialogbox').width() - $('#friendlist').width() - 15){
		t = (h - vedioHeight) / 2;
		l = (w - vedioWidth) / 2;
	}else{
		t += 15;
		l += 15;
	}
}



//多人视频聊天的时打开的窗口
function createRoomvideoDiv(realroom, isNew){ 
	var chartDivWidth = 350, chartDivHeight = 180, 
		msgDivHeight = 150, msgTextWidth = 345, msgTextHeight = 70;

	count++;       //count为全局变量,用来决定层的堆叠顺序

	var roomdialogID="chat"+realroom;		
	if(document.getElementById(roomdialogID)){          	//检测对话框是否应经存在
		count++;
		$("#"+roomdialogID).show().css({"z-index":count});
		$("#text"+realroom).focus();
	}else{
		resetPosition()
		if(t < 0){t = 30;}
		if(l < 0){l = 60;}
		if(isNew == true){
			var member = [realroom];
		
		}
		
		var roomdialogDiv=document.createElement('div');   	//创建层dialogDiv
		document.body.appendChild(roomdialogDiv);
		roomdialogDiv.id=roomdialogID;                  		//给层dialogDiv设置属性
		$(roomdialogDiv).css({'width':vedioWidth+'px', 'height':vedioHeight+'px'});
		$(roomdialogDiv).attr('class', 'greybox dialogbox');
		$(roomdialogDiv).css({'position':'absolute', 'top':t+'px', 'left':l+'px'});
		$(roomdialogDiv).attr('onselectstart', 'return false');
		$(roomdialogDiv).attr('onselect', 'document.selection.empty()');
		
		$(roomdialogDiv).click(function(){      			//当用鼠标点击该对话框时，该对话框到最上面
			count++;
			$(this).css({'z-index':count});
		});
		
		loadvedioTitleDiv(realroom, roomdialogDiv, vedioWidth);
		var imDiv = document.createElement("div");
		roomdialogDiv.appendChild(imDiv);
		$(imDiv).attr('class', 'leftfloat');
		
		loadroomChartDiv(realroom, imDiv, chartDivWidth);
		loadroomMessageDiv(realroom, imDiv, chartDivWidth);
		
		var inDiv = document.createElement("div");
		roomdialogDiv.appendChild(inDiv);
		$(inDiv).attr('class', 'rightfloat');

		loadvedioDiv(realroom, inDiv);
	}
	$(roomdialogDiv).css({'z-index':count});
}




//右侧加载多人视频会话
function loadvedioDiv(roomobj, roomlistDiv){
	console.log(roomobj,roomlistDiv);
	var smallWidth = 130, smallHeight = 100;
	var vedioDivWidth = 400, vedioDivHeight = 310;
	var vedioId = 'vedio'+roomobj;
	var vedioDiv = document.createElement("div");
	var roomJID = roomobj+"@conference.webrtc";
	var userList=[];
	userList=com.groupChat.getRoomMemberList(roomJID);
	roomlistDiv.appendChild(vedioDiv);
	vedioDiv.id=vedioId;
	$(vedioDiv).css({'width':vedioDivWidth+'px', 'height':vedioDivHeight+'px', 
		 'margin':'0 5px 5px'});
	$(vedioDiv).css({'background':'#ffffff', 'color':'#000000', 'overflow':'auto'});
	var oprationDiv = document.createElement("div");
	roomlistDiv.appendChild(oprationDiv);
	$(oprationDiv).attr('class','listarea centeralign leftmargin_5 bottommargin_5');
	$(oprationDiv).html('');
	$(oprationDiv).append('<a title="视频会话" onclick="joinConference(\''+userList+'\')"><img src="images/video.png" class="video greybutton"/></a>');		
	$(oprationDiv).append('<a title="音频会话" onclick=""><img src="images/voice.png" class="audio greybutton"/></a>');	
	$(oprationDiv).append('<a title="挂断当前通话" onclick=""><img src="images/hangup.png" class="hidden hang greybutton"/></a>');
	
	

	
	
	var VideoId1 = 'video1'+roomobj;
	var VideoId2 = 'video2'+roomobj;
	var VideoId3 = 'video3'+roomobj;
	var VideoId4 = 'video4'+roomobj;
	var VideoId5 = 'video5'+roomobj;
	var VideoId6 = 'video6'+roomobj;
	var VideoId7 = 'video7'+roomobj;
	var VideoId8 = 'video8'+roomobj;
	var VideoId9 = 'video9'+roomobj;
	
	
	
	
	
	
	var Videodiv1 = document.createElement("div");
	var Videodiv2 = document.createElement("div");
	var Videodiv3 = document.createElement("div");
	var Videodiv4 = document.createElement("div");
	var Videodiv5 = document.createElement("div");
	var Videodiv6 = document.createElement("div");
	var Videodiv7 = document.createElement("div");
	var Videodiv8 = document.createElement("div");
	var Videodiv9 = document.createElement("div");
	
	
	var VideoDIV1 = document.createElement("div");
	var VideoDIV2 = document.createElement("div");
	var VideoDIV3 = document.createElement("div");
	
	
	
	$(VideoDIV1).css({'width':vedioDivWidth+'px','height':smallHeight+'px'});
	$(VideoDIV2).css({'width':vedioDivWidth+'px','height':smallHeight+'px'});
	$(VideoDIV3).css({'width':vedioDivWidth+'px','height':smallHeight+'px'});
	$(Videodiv1).css({'width':smallWidth+'px', 'height':smallHeight+'px','background':'url(images/xiaoren.png) no-repeat #ffffff center center','margin':'0 0 0' ,'float':'left','border':'1px solid black'});
	$(Videodiv1).html('<video width="'+smallWidth+'" height="'+smallHeight+'" id="'+VideoId2+'" autoplay="autoplay"></video>');
  $(Videodiv2).css({'width':smallWidth+'px', 'height':smallHeight+'px','background':'url(images/xiaoren.png) no-repeat #ffffff center center', 'margin':'0 0 0' ,'float':'left','border':'1px solid black'});
  $(Videodiv2).html('<video width="'+smallWidth+'" height="'+smallHeight+'" id="'+VideoId2+'" autoplay="autoplay"></video>');
  $(Videodiv3).css({'width':smallWidth+'px', 'height':smallHeight+'px','background':'url(images/xiaoren.png) no-repeat #ffffff center center', 'margin':'0 0 0','float':'left','border':'1px solid black'});
  $(Videodiv3).html('<video width="'+smallWidth+'" height="'+smallHeight+'" id="'+VideoId3+'" autoplay="autoplay"></video>');
  $(Videodiv4).css({'width':smallWidth+'px', 'height':smallHeight+'px','background':'url(images/xiaoren.png) no-repeat #ffffff center center', 'margin':'0 0 0','float':'left','border':'1px solid black'});
  $(Videodiv4).html('<video width="'+smallWidth+'" height="'+smallHeight+'" id="'+VideoId4+'" autoplay="autoplay"></video>');
  $(Videodiv5).css({'width':smallWidth+'px', 'height':smallHeight+'px','background':'url(images/xiaoren.png) no-repeat #ffffff center center', 'margin':'0 0 0','float':'left','border':'1px solid black'});
  $(Videodiv5).html('<video width="'+smallWidth+'" height="'+smallHeight+'" id="'+VideoId5+'" autoplay="autoplay"></video>');
  $(Videodiv6).css({'width':smallWidth+'px', 'height':smallHeight+'px','background':'url(images/xiaoren.png) no-repeat #ffffff center center', 'margin':'0 0 0','float':'left','border':'1px solid black'});
  $(Videodiv6).html('<video width="'+smallWidth+'" height="'+smallHeight+'" id="'+VideoId6+'" autoplay="autoplay"></video>');
  $(Videodiv7).css({'width':smallWidth+'px', 'height':smallHeight+'px','background':'url(images/xiaoren.png) no-repeat #ffffff center center', 'margin':'0 0 0','float':'left','border':'1px solid black'});
  $(Videodiv7).html('<video width="'+smallWidth+'" height="'+smallHeight+'" id="'+VideoId7+'" autoplay="autoplay"></video>');
  $(Videodiv8).css({'width':smallWidth+'px', 'height':smallHeight+'px','background':'url(images/xiaoren.png) no-repeat #ffffff center center', 'margin':'0 0 0','float':'left','border':'1px solid black'});
  $(Videodiv8).html('<video width="'+smallWidth+'" height="'+smallHeight+'" id="'+VideoId8+'" autoplay="autoplay"></video>');
  $(Videodiv9).css({'width':smallWidth+'px', 'height':smallHeight+'px','background':'url(images/xiaoren.png) no-repeat #ffffff center center', 'margin':'0 0 0','float':'left','border':'1px solid black'});
  $(Videodiv9).html('<video width="'+smallWidth+'" height="'+smallHeight+'" id="'+VideoId9+'" autoplay="autoplay"></video>');
  
  
  VideoDIV1.appendChild(Videodiv1);
  VideoDIV1.appendChild(Videodiv2);
  VideoDIV1.appendChild(Videodiv3);
  VideoDIV2.appendChild(Videodiv4);
  VideoDIV2.appendChild(Videodiv5);
  VideoDIV2.appendChild(Videodiv6);
  VideoDIV3.appendChild(Videodiv7);
  VideoDIV3.appendChild(Videodiv8);
  VideoDIV3.appendChild(Videodiv9);
  
  
  
  vedioDiv.appendChild(VideoDIV1);
  vedioDiv.appendChild(VideoDIV2);
  vedioDiv.appendChild(VideoDIV3);
  
	
	
	
	
}



























