var chatpageindex;

var chatremName;

//显示消息盒子列表（单击消息盒子触发/历史记录默认触发消息盒子）
var HistoryChat=function(){
	document.getElementById("onChat").setAttribute("class","on");
	document.getElementById("onAudio").removeAttribute("class");
	document.getElementById("onVideo").removeAttribute("class");
	document.getElementById("onMeeting").removeAttribute("class");
	$('#list_chat').show();
	$('#list_audio').hide();
	$('#list_video').hide();
	$('#list_meeting').hide();
	
	clearchatrightlinfo();//清除已有数据
	clearchatleftlinfo();//清除已有数据
	var myDate=new Date();
	var date_array = [];
	date_array[0]=myDate.getFullYear();
	date_array[1]=myDate.getMonth()+1;
	date_array[2]=myDate.getDate();
	date_array[3]=myDate.getHours();
	date_array[4]=myDate.getMinutes();
	date_array[5]=myDate.getSeconds();

	var myShowName=[];
	var myRemName=[];
	//var myName = formatReEase(curUserId);//我的名字
	var myName = formatRechange(com.webrtc.sigSessionConfig.username);
//	for(var i=localStorage.length - 1 ; i >=0; i--){
	for(var i =0;i<localStorage.length;  i++){
		var remName=[];	
		var remName=localStorage.key(i).split(",");
		
		if(myName==remName[0])
			{
				myRemName.push(localStorage.key(i));
				myShowName.push(remName[1]);
			}
	}
	
	
	for(var i=myRemName.length - 1 ; i >=0; i--){
		//将消息添加到消息盒子
		var msgelem = $('<li>').attr({
			'id' : MsgListPrefix+localStorage.key(i),
			'name' : myRemName[i],		
		}).click(function(){
			var mu = document.getElementById("list_chat_right");
	        var li = mu.getElementsByTagName("li");
			for(var i=0,len=li.length;i<len;i++){
                li[i].className = this == li[i] ? "on":"";
            }
			
			var $a = $(this);
			 chatremName =$a.attr("name");
			requesthistorychatinfo(1);
		});
		var date;
	var day_array=[];
		day_array=localStorage.getItem(localStorage.key(i)).split(",");
		for (j=3;j<6;j++)
			{
			if (day_array[j]>=0 && day_array[j]<=9)
				{
				day_array[j]="0"+day_array[j];
				}
			}
		if(day_array[0]!=date_array[0])
			date=day_array[0]+"-"+day_array[1]+"-"+day_array[2];
		else if (day_array[1]!=date_array[1]||day_array[2]!=date_array[2])
			{
			var today=day_array[2]+1;
			if(day_array[1]==date_array[1] && today==date_array[2])
				date="昨天";
			else
				date=day_array[1]+"-"+day_array[2];
			}
		else
			date=day_array[3]+":"+day_array[4];
	

		var msgName = $("<span class='li_name'>"+myShowName[i]+"</span>");
		msgelem.append(msgName);

		var msgDate = $("<span class='li_time'>"+ date+"</span>");
		msgelem.append(msgDate);


		$('#list_chat_right').append(msgelem);
	}
	
};

//清空消息盒子左栏数据
var clearchatrightlinfo = function(){
	
	$('#list_chat').find("div[id='chat_right']").find("ul[id='list_chat_right']").find("li").remove();
}

//清空消息盒子右栏数据
var clearchatleftlinfo = function(){
	
	$('#list_chat').find("div[id='chat_left']").find("ul[id='list_chat_left']").find("li").remove();
}

//消息盒子左栏/pagedown，查看某个好友消息记录
var requesthistorychatinfo=function (chatpageindex){
	console.log("chatpageindex:"+chatpageindex);
	clearchatleftlinfo();//清除已有数据
	//拉取pageindex这一页的 10条 聊天数据
	
		chatrequest(chatpageindex);

}

//调用local_store获取具体好友聊天记录
var chatrequest=function (curindex){

	chatpageindex = curindex; 
	
	var chat='chat';
	if(e_array!=[]){e_array=[]};
	
	//调用local_store通过索引取多值函数,调用addPerHistoryChat
	indexstore.loadMulDataByIndex("from",chatremName,function(e){
		xxx(e);	
	});
}
var e_array = [];
function xxx(e){
	e_array.push(e);
}

//添加一页聊天记录
var addPerHistoryChat=function (chatpageindex){

	console.log("chatpageindex:"+chatpageindex);
	var chatTotal=Math.ceil(e_array.length/10);
	var page=chatpageindex*10;

//	var a=e_array.length-page>0 ? e_array.length-page:0;
	
	for(var i =page-10;i<e_array.length &&i<page; i++){
//	for(var i =a;i<a+10; i++){
		var riqi=e_array[i].id;
		if (i!=0)
			var yesterday=e_array[i-1].id;
		else
			var yesterday=[0,0,0,0,0,0];

		for (j=3;j<6;j++)
		{
		if (riqi[j]>=0 && riqi[j]<=9)
			{
			riqi[j]="0"+riqi[j];
			}
		}
		//将具体信息添加到人
		var diaelem = $('<li>')
		if(riqi[0]!=yesterday[0]||riqi[1]!=yesterday[1]||riqi[2]!=yesterday[2])
			{
			var riqielem=$("<h2 class='box_dialogue_date'>"+"日期："+"&nbsp;"+riqi[0]+"-"+riqi[1]+"-"+riqi[2]+"</h2>");
			diaelem.append(riqielem);
			}
		var color=[];
		color=e_array[i].from.split(",");
		if(color[1] == e_array[i].to){
		var diaName = $("<h3 class='you_name'>"+e_array[i].to+"&nbsp;&nbsp;&nbsp;&nbsp;"+riqi[3]+":"+riqi[4]+":"+riqi[5]+"</h3>");
		diaelem.append(diaName);}
		else
			{var diaName = $("<h3>"+e_array[i].to+"&nbsp;&nbsp;&nbsp;&nbsp;"+riqi[3]+":"+riqi[4]+":"+riqi[5]+"</h3>");
		diaelem.append(diaName);}

		var diaData = $("<p>"+e_array[i].data +"</p>");
		diaelem.append(diaData);


		$('#list_chat_left').append(diaelem);
		
	}
//	var currentName = e_array[0].from;
//	var $current = $("<input class='currentChatName' value="+currentName+" type='hidden'>");
//	$('#list_chat_left').append($current);
	
	if(e_array!= 0){
		//更新翻页
		refreshpagedown(chatpageindex,chatTotal,'chat');
	}
	else{

		HistoryCallFirstPage=0;

		HistoryCallLastPage=0;

		HistoryCallCurrentPage=0;

		HistoryCallBeforePage=0;

		HistoryCallNextPage=0;

		HistoryCalTotalPage=0;
	}
	
}

//更新消息盒子翻页界面（refreshpagedown触发）
var chatrefreshpagedowndiv = function(){
	$('#historycall_currentpage').attr("value",HistoryCallCurrentPage);
	$('#historycall_totalpage').html(HistoryCallTotalPage);
	$('#historycall_firstpage').attr("onclick","requesthistorychatinfo('"+HistoryCallFirstPage+"')");
	$('#historycall_lastpage').attr("onclick","requesthistorychatinfo('"+HistoryCallLastPage+"')");
	$('#historycall_beforepage').attr("onclick","requesthistorychatinfo('"+HistoryCallBeforePage+"')");
	$('#historycall_nextpage').attr("onclick","requesthistorychatinfo('"+HistoryCallNextPage+"')");
}

//查看消息盒子（右栏好友或聊天界面触发）
var createMyChatHistory=function(youName){
	HistoryCall();
	//var myName = formatReEase(curUserId);//我的名字
	var myName = formatRechange(com.webrtc.sigSessionConfig.username);
	chatremName=myName+','+youName;
	console.log(chatremName);
	//var myid=MsgListPrefix+chatremName;
	var myid=chatremName;
	requesthistorychatinfo(1);
	var mu = document.getElementById("list_chat_right");
    var li = mu.getElementsByTagName("li");
	for(var i=0,len=li.length;i<len;i++){
        li[i].className = myid == li[i].getAttribute("name") ? "on":"";
    }
	
}