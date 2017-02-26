//显示会议召开记录（单击会议召开记录触发）
var HistoryMeeting=function(){
	document.getElementById("onMeeting").setAttribute("class","on");
	document.getElementById("onAudio").removeAttribute("class");
	document.getElementById("onVideo").removeAttribute("class");
	document.getElementById("onChat").removeAttribute("class");
	$('#list_chat').hide();
	$('#list_audio').hide();
	$('#list_video').hide();
	$('#list_meeting').show();
	
	//拉取历史会议记录（第1页）
	requesthistorymeetinginfo(1);
	
};

//拉取通话记录预处理
var requesthistorymeetinginfo = function(pageindex){
    //清空当前页面中的会议数据
	clearhistorymeetinginfo();
	//拉取指定页的 10条 历史会议数据
	ajaxrequestHistoryMeeting(pageindex,Number(10));
}

//清空会议召开记录页面
var clearhistorymeetinginfo = function(){
	//HistoryPrefix="History"
	$('#'+HistoryPrefix+'Call').find("div[class='list_table']").find("div[id='list_meeting']").find("table").find("tr:not('#meeting_title')").remove();
}

//ajax异步拉取历史会议记录
var ajaxrequestHistoryMeeting = function(pageindex,size){
	var user = $('.pub_banner').attr("user");
	var userforwcs = formatChange(user)
	console.log("begin to request history");
	$.ajax({
		url : "/WCLnew/requestMeetingHistory",
		type : "post",
		async : false,
		data : {'username':userforwcs,'page':pageindex,'size':size},
		dataType : "json",
		success : function(data) {
			console.log(data);
			if(data.count != 0){
				for(var i =0; i<data.size;i++){
					var MeetingType = data.groups[i].type;
					var Meetingcreator = formatRechange(data.groups[i].creator);
					var Meetingbegintime = data.groups[i].reservation_time;
					//console.log(Meetingbegintime);
					var Meetingendtime = data.groups[i].endTime;
					//console.log(Meetingendtime);
					var Meetingmembers = data.groups[i].members;

				    addPerMeetingHistory(MeetingType,Meetingcreator,Meetingbegintime,Meetingendtime,Meetingmembers);
				}
				//更新翻页（与通话记录/视频分享共用一套翻页），page为请求第几页（从1开始），total为总页
				refreshpagedown(data.page,data.total,"meeting");
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
			
	});
}

//添加一条会议数据
var addPerMeetingHistory = function(Type,creator,begintime,endtime,members){	

	var MeetingHistoryPer =$("<tr></tr>");
	
	var MeetingType = "";    //会议类型文字描述
	members = members.replace(/#/g,";");
	
	//会议召开时间
	begintime = deleteT(begintime);	//去T
	begintime=new Date(begintime);
	var begintime = begintime.Format("yyyy-MM-dd hh:mm:ss"); 
	
	if(Type == 1){
	     MeetingType =  "视频";
	}
	var MeetingHistoryType = $("<td class=\"pl10 f999\">" + MeetingType +"</td>");
	var MeetingHistoryCreator = $("<td class=\"pl10\">" + creator +"</td>");
	var MeetingHistoryBegintime = $("<td class=\"pl10 f999\">" + begintime +"</td>");
	var MeetingHistoryMembers = $("<td class=\"pl10 f999\">" + members +"</td>");
	var MeetingHistoryOperation = $("<td class=\"fBlue pl10\"> 再次召集</td>");
	MeetingHistoryPer.append(MeetingHistoryType);
	MeetingHistoryPer.append(MeetingHistoryCreator);
	MeetingHistoryPer.append(MeetingHistoryBegintime);
	MeetingHistoryPer.append(MeetingHistoryMembers);
	MeetingHistoryPer.append(MeetingHistoryOperation);
	
	$('#'+HistoryPrefix+'Call').find("div[class='list_table']").find("div[id='list_meeting']").find("table").append(MeetingHistoryPer);
}


//更新召开会议翻页界面（所有通话记录/视频邀请/会议召开公用翻页）
var meetingrefreshpagedowndiv = function(){
	$('#historycall_currentpage').attr("value",HistoryCallCurrentPage);
	$('#historycall_totalpage').html(HistoryCallTotalPage);
	$('#historycall_firstpage').attr("onclick","requesthistorymeetinginfo('"+HistoryCallFirstPage+"')");
	$('#historycall_lastpage').attr("onclick","requesthistorymeetinginfo('"+HistoryCallLastPage+"')");
	$('#historycall_beforepage').attr("onclick","requesthistorymeetinginfo('"+HistoryCallBeforePage+"')");
	$('#historycall_nextpage').attr("onclick","requesthistorymeetinginfo('"+HistoryCallNextPage+"')");
}




