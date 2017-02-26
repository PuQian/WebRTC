/***********我的会议全局变量***************/
//我的会议数量全局变量
var MeetingNumber = 0;
//每条我的会议前缀
var MeetingListPrefix = "meetingList"; 
//我的会议翻页前缀
var MeetingListPageDown = "meetinglistpageDown";

/***********创建会议全局变量**************/
//创建会议与会人
var members = "";
//创建会议与会人数
var member_num = 0;

/***********历史会议全局变量********************/
//每条历史会议前缀
var MeetingHistoryPrefix = "meetingHistory"; 
//历史会议翻页前缀
var MeetingHistoryPageDown = "meetinghistorypageDown";


/**********************************我的会议***************************************/
var MyWebMeeting = function(){
		
    var MeetingMyDivId = MeetingPrefix + "MeetingMy"; 
    //当前高亮的菜单恢复原样	
	normalizeSelectedListMenuElement("recent_calls");
	normalizeSelectedListMenuElement("rtc_menu");
	
	//固定，高亮Web会议
	$('.rtc_menu ul li').eq(2).addClass('on');
	
    //已经创建了Web会议（我的会议）界面
	if(document.getElementById(MeetingMyDivId)!=null){
		//showWeb(MeetingPrefix,"MeetingMy");
		$("#"+ MeetingMyDivId).html("");
		var newContent = document.getElementById(MeetingMyDivId);
	}
	//新建我的会议界面	
	else{
	    var newContent = document.createElement("div");
	    newContent.setAttribute("id", MeetingMyDivId);
		$("#web").append(newContent);
	}
	var HeadMeeting = $("<div class='rtc_tab'><ul>"+
            "<li class='on' onclick='MyWebMeeting();'>我的会议</li>"+
            "<li onclick='CreateWebMeeting();'>创建会议</li>"+
            "<li onclick='HistoryWebMeeting();'>历史会议</li></ul></div>");
	$(newContent).append(HeadMeeting);
	
	var MyMeetingList = $("<div id='MyMeetingList' class='meeting_list'><ul></ul></div>");
	$(newContent).append(MyMeetingList);
	
	/////////////我的会议翻页
	var PageDown = $("<div id='MyMeetingPagedown' class='pagedown'></div>");
	$(newContent).append(PageDown);
	
	/////////拉取我的会议内容函数
	requestMyMeetingBefore(1);  //自查询mymeeting
	
	showWeb(MeetingPrefix,"MeetingMy");
};

var requestMyMeetingBefore = function(pageindex){
	$("#MyMeetingList").html("");
	ajaxrequestMyMeeting(pageindex,4);
};

//ajax异步拉取我的会议
var ajaxrequestMyMeeting = function(pageindex,size){
	var user = $('.pub_banner').attr("user");
	var userforwcs = formatChange(user);
	console.log("begin to request myMeeting");
	$.ajax({
		url : "/WCLnew/requestMyMeeting",
		type : "post",
		async : false,
		data : {'username':userforwcs,'page':pageindex,'size':size},
		dataType : "json",
		success : function(data) {
			console.log(data);
			if(data.count != 0){
				for(var i =0; i<data.size;i++){
					var MeetingRoomid = data.groups[i].roomid;
					var MeetingConfname = data.groups[i].confname;
					var MeetingType = data.groups[i].type;
					var Meetingcreator = formatRechange(data.groups[i].creator);
					var Meetingbegintime = data.groups[i].reservation_time;
					var Meetingendtime = data.groups[i].endTime;
					var Meetingmembers = data.groups[i].members;

					addPerMyMeeting(MeetingRoomid,MeetingConfname,MeetingType,Meetingcreator,
							     Meetingbegintime,Meetingendtime,Meetingmembers);
				}
				//更新我的会议分页,count为我的会议总数，total为我的会议总页数，size为当前页的我的会议数目
				MyMeetingPageTurn(data.count,data.total,data.page,data.size);
			}
			else{
			    console.log("我的会议内容为空");
				$("#MyMeetingList").html("没有与我有关的会议");
			}
		}
			
	});
};

//添加一条我的会议
var addPerMyMeeting = function(roomid,confname,type,creator,reservation_time,endtime,members){
	var MyMeetingPer =$("<li id='"+ MeetingListPrefix + roomid +"'></li>");
	$("#MyMeetingList").append(MyMeetingPer);
	
	//timestamp转为string类型(Date->String Format自定义函数)
	//reservation_time = (new Date(reservation_time).Format("yyyy-MM-dd hh:mm:ss")).toString();
	reservation_time = deleteT(reservation_time);	//去T
	reservation_time = new Date(reservation_time).Format("yyyy-MM-dd hh:mm:ss");
	var MeetingYear = reservation_time.substring(0,4);
	var MeetingMonth = reservation_time.substring(5,7);
	var MeetingDay = reservation_time.substring(8,10);
	var MeetingTime = $("<div class='meeting_time'>"+"<span class='time_year'>"+ MeetingYear +"</span>"
	        +"<span class='time_date'>"+ MeetingMonth +"-" + MeetingDay +"</span>"+"</div>");
	MyMeetingPer.append(MeetingTime);
	
	var MeetingText = $("<div class='meeting_text'>"+
	          "<h3>"+ confname +"</h3>"+
	          "<p>会议类型：视频</p>"+
	          "<p>会议时间："+ reservation_time +"</p>"+
	          "<p>会议主席："+ creator + "</p>"+
	        "</div>");
	MyMeetingPer.append(MeetingText);
	
	var MeetingOpea = $("<div class='meeting_opea'>"+
	          /*"<div class='btn_blue'>加入会议</div>"+*/
	          "<div class='btn_blue2'>查看详情</div>"+
	        "</div>");
	MyMeetingPer.append(MeetingOpea);
	
};

//处理我的会议分页
var MyMeetingPageTurn = function(MeetingCount,MeetingPageTotal,MeetingCurPage,MeetingSizePerPage){
	//获取翻页
	var PageDown = $("#MyMeetingPagedown");
	//清空我的会议翻页页码
	$("#MyMeetingPagedown").html("");  
	
	//添加翻页页码
	for(var i=1; i<=MeetingPageTotal; i++){
		var PerPageNumber = $("<a id='"+ MeetingListPageDown + Number(i)+"' "+
				"onclick='requestMyMeetingBefore("+ Number(i) +")'>"+ Number(i) +"</a>");
		PageDown.append(PerPageNumber);
	}
	//设置当前页码为活动状态
	$("#"+MeetingListPageDown + MeetingCurPage).addClass("on");
};

////翻页触发函数处理(不用了)
//var showMeetingPage = function(PageNumber){
//	//设置活动状态
//	//隐藏所有会议
//	for(var j=1; j<=MeetingNumber; j++){
//		document.getElementById(MeetingListPrefix + j).setAttribute("style","display:none;");
//		$("#"+MeetingListPageDown + j).removeClass();
//	}
//	//显示第pageNumber页
//	for(var j=(PageNumber-1)*4+1; j<=(PageNumber-1)*4+4; j++){
//		if(document.getElementById(MeetingListPrefix + j)!=null){
//		   document.getElementById(MeetingListPrefix + j).setAttribute("style","display:block;");
//		}
//	}
//	$("#"+MeetingListPageDown + PageNumber).addClass("on");
//}
/**************************************历史会议***************************************/
var HistoryWebMeeting = function(){
	var MeetingHistoryDivId = MeetingPrefix + "MeetingHistory";
	 
	//存在历史会议界面，清空并添加
	if(document.getElementById(MeetingHistoryDivId)!=null){   
		$("#"+ MeetingHistoryDivId).html("");
		var newContent = document.getElementById(MeetingHistoryDivId);
	}
	//不存在历史会议界面，新建
	else{
	    var newContent = document.createElement("div");
	    newContent.setAttribute("id", MeetingHistoryDivId);
	    $("#web").append(newContent);
	}
	var HeadMeeting = $("<div class='rtc_tab'><ul>"+
            "<li onclick='MyWebMeeting();'>我的会议</li>"+
            "<li onclick='CreateWebMeeting();'>创建会议</li>"+
            "<li class='on' onclick='HistoryWebMeeting();'>历史会议</li></ul></div>");   
	$(newContent).append(HeadMeeting);
		
		
	var HistoryMeetingList = $("<div id='HistoryMeetingList' class='meeting_list'><ul></ul></div>");
	$(newContent).append(HistoryMeetingList);
		
	/////////////翻页
	var HistoryPageDown = $("<div id='HistoryMeetingPagedown' class='pagedown'></div>");
	$(newContent).append(HistoryPageDown);
		
	requestHistoryMeetingBefore(1);  //自查询HistoryMeeting（注意在创建好洁面之后再拉取）
	
	showWeb(MeetingPrefix,"MeetingHistory");
	console.log("history meeting end");
	
};
var requestHistoryMeetingBefore = function(pageindex){
	$("#HistoryMeetingList").html("");
	ajaxrequestHistoryMeeting2(pageindex,4);
};

//ajax异步拉取历史会议(与RtcHistoryMeeting.js中基本相同)
var ajaxrequestHistoryMeeting2 = function(pageindex,size){
	var user = $('.pub_banner').attr("user");
	var userforwcs = formatChange(user);
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
					var MeetingRoomid = data.groups[i].roomid;
					var MeetingConfname = data.groups[i].confname;
					var MeetingType = data.groups[i].type;
					var Meetingcreator = formatRechange(data.groups[i].creator);
					var Meetingbegintime = data.groups[i].reservation_time;
					console.log(Meetingbegintime);
					var Meetingendtime = data.groups[i].endTime;
					console.log(Meetingendtime);
					var Meetingmembers = data.groups[i].members;

					addPerHistoryMeeting(MeetingRoomid,MeetingConfname,MeetingType,Meetingcreator,
							     Meetingbegintime,Meetingendtime,Meetingmembers);
				}
				//更新历史会议分页,count为历史会议总数，total为历史会议总页数，size为当前页的会议数目
				HistoryMeetingPageTurn(data.count,data.total,data.page,data.size);
			}
			else{
				console.log("历史会议内容为空");
				$("#HistoryMeetingList").html("没有历史会议");
			}
		}
			
	});
};

//添加一条历史会议
var addPerHistoryMeeting = function(Roomid,Confname,Type,Creator,reservation_time,endtime,members){
	console.log("addPer");
	var HistoryMeetingPer =$("<li id='"+ MeetingHistoryPrefix + Roomid +"'></li>");
	$("#HistoryMeetingList").append(HistoryMeetingPer);
	
	//timestamp转为string类型(Date->String Format自定义函数)
	reservation_time = deleteT(reservation_time);	//去T
	reservation_time = new Date(reservation_time).Format("yyyy-MM-dd hh:mm:ss");
	console.log(reservation_time);
	var MeetingYear = reservation_time.substring(0,4);
	var MeetingMonth = reservation_time.substring(5,7);
	var MeetingDay = reservation_time.substring(8,10);
	var MeetingTime = $("<div class='meeting_time'>"+"<span class='time_year'>"+ MeetingYear +"</span>"
	        +"<span class='time_date'>"+ MeetingMonth +"-" + MeetingDay +"</span>"+"</div>");
	HistoryMeetingPer.append(MeetingTime);
	
	var HistoryMeetingText = $("<div class='meeting_text'>"+
	          "<h3>"+ Confname +"</h3>"+
	          "<p>会议类型：视频</p>"+
	          "<p>会议时间："+ reservation_time +"</p>"+
	          "<p>会议主席："+ Creator + "</p>"+
	        "</div>");
	HistoryMeetingPer.append(HistoryMeetingText);
	
	var HistoryMeetingOpea = $("<div class='meeting_opea'>"+
	          /*"<div class='btn_blue'>加入会议</div>"+*/
	          "<div class='btn_blue2'>查看详情</div>"+
	        "</div>");
	HistoryMeetingPer.append(HistoryMeetingOpea);
	console.log("addPer success");
};

//更新历史会议分页(添加页数，高亮当前页数)
var HistoryMeetingPageTurn = function(MeetingCount,MeetingPageTotal,MeetingCurPage,MeetingSizePerPage){
	//获取历史会议翻页
	var HistoryPageDown = $("#HistoryMeetingPagedown");
	console.log("page begin");
	//清空历史会议翻页页码
	$("#HistoryMeetingPagedown").html("");  
	//更新历史会议翻页页码
	for(var i=1; i<=MeetingPageTotal; i++){
		//添加历史会议翻页页码
		var PerHistoryPageNumber = $("<a id='"+ MeetingHistoryPageDown + Number(i)+"' "+
				"onclick='requestHistoryMeetingBefore("+ Number(i) +")'>"+ Number(i) +"</a>");
		HistoryPageDown.append(PerHistoryPageNumber);
	}
	//高亮当前页活动状态
	$("#" + MeetingHistoryPageDown + MeetingCurPage).addClass("on");
	console.log("page end");
};

/***********************************创建会议************************************/
var CreateWebMeeting = function(){

	var MeetingCreateDivId = MeetingPrefix + "MeetingCreate";
	 
	if(document.getElementById(MeetingCreateDivId)!=null){
		showWeb(MeetingPrefix,"MeetingCreate");
		//$("input[name='isimmediateconf']").val("立即会议");
		return;
	}

	var newContent = document.createElement("div");
	newContent.setAttribute("id", MeetingCreateDivId);
	$("#web").append(newContent);

	var HeadMeeting = $("<div class='rtc_tab'><ul>"+
            "<li onclick='MyWebMeeting();'>我的会议</li>"+
            "<li class='on' onclick='CreateWebMeeting();'>创建会议</li>"+
            "<li onclick='HistoryWebMeeting();'>历史会议</li></ul></div>");   
	$(newContent).append(HeadMeeting);

	var panelBodyBox = $("<div class='meeting_found'></div>");
	$(newContent).append(panelBodyBox);
	var panelBody = $("<table></table>");
	panelBodyBox.append(panelBody);

    /////////////////会议主题
	var formConfname = $("<tr><td width='70px' valign='top'>会议主题</td>"+
		"<td><input name='confname' type='text' class='meeting_input meeting_name' style='padding:0 10px;' value='WebRTC'/></td></tr>");
	panelBody.append(formConfname);

   ////////////////会议类型
    var formConfType = $("<tr><td>会议类型</td><td class='media_type'>"+
    	"<img src='css/pc/images/media_type1.png' width='120' height='62' />"+
    	"<img src='css/pc/images/media_type2.png' width='120' height='62' />"+
    	"<img src='css/pc/images/media_type32.png' width='120' height='62' />"+
    	"<img src='css/pc/images/media_type4.png' width='120' height='62' />"+
    	"<img src='css/pc/images/media_type5.png' width='120' height='62' />"+
    	"<img src='css/pc/images/media_type6.png' width='120' height='62' /></td></tr>");
    panelBody.append(formConfType);
    
    //////////////选择会议时间（立即、预约、周期）
     var formIsImmediate = $("<tr><td>会议时间</td><td>"+
     		//会议时间，立即会议...
    		"<div onclick='showMeetingTypeMenu();' class='meeting_input fl' style='width:160px;'>"+
        	"<div class='meeting_text fl' id='meetingType_S'>立即会议</div>"+
        	"<i class='input_more'></i></div>" +
        	//会议类型下拉菜单
        	"<div class='meeting_input DN' id='meetingType_D'"+
        	"style='position:absolute; width:160px; margin:37px 0px;'>"+
        	"<ul><li class='meetingTypeMenuLi MeetingDropBorder'>立即会议</li>"+
        	"<li class='meetingTypeMenuLi MeetingDropBorder'>预约会议</li>"+
        	"<li class='meetingTypeMenuLi'>周期会议</li></ul></div>"+
        	
        	
        	//周期会议表单1
        	//周期会议按...天
        	"<div id='Cycle_Form1' class='meeting_input fl DN' style='margin-left:25px;'>"+
         	"<div onclick='showCycleTimeMenu();' id='CycleTime_S' class='meeting_text fl'>按天</div>"+
            "<i onclick='showCycleTimeMenu();' class='input_more'></i></div>"+
            //周期会议按...天 下拉菜单
            "<div class='meeting_input DN' id='CycleTime_D'"+
            "style='position:absolute; margin:37px 187px; width:72px;'>"+
            "<ul><li class='meetingTypeMenuLi MeetingDropBorder'>按天</li>"+
            "<li class='meetingTypeMenuLi MeetingDropBorder'>按周</li>"+
            "<li class='meetingTypeMenuLi'>按月</li></ul></div>" +
            
            //每...天
            "<div id='Per_Day' class='fl DN'>"+
            "<span class='fl pr5 fsize14' style='margin-left:15px;'>每</span>"+
            "<div class='meeting_input fl'>"+
            "<input name='PerDay' type='text' class='meeting_time' style='width:60px;' value='2'/>"+
            "</div><span class='fl pl5 pr5 fsize14'>天</span></div>"+
            //每...周
            "<div id='Per_Week' class='fl DN'>"+
            "<span class='fl pr5 fsize14' style='margin-left:15px;'>每</span>"+
            "<div class='meeting_input fl'>"+
            "<div onclick='showCycleWeekMenu();' id='CycleWeek_S' class='meeting_text fl'>周一</div>"+
            "<i onclick='showCycleWeekMenu();' class='input_more'></i></div>"+
            "</div>"+
            //每周几下拉菜单
            "<div class='meeting_input DN' id='CycleWeek_D'"+
            "style='position:absolute; margin:37px 295px; width:72px;'>"+
            "<ul><li class='meetingTypeMenuLi MeetingDropBorder'>周一</li>"+
            "<li class='meetingTypeMenuLi MeetingDropBorder'>周二</li>"+
            "<li class='meetingTypeMenuLi MeetingDropBorder'>周三</li>"+
            "<li class='meetingTypeMenuLi MeetingDropBorder'>周四</li>"+
            "<li class='meetingTypeMenuLi MeetingDropBorder'>周五</li>"+
            "<li class='meetingTypeMenuLi MeetingDropBorder'>周六</li>"+
            "<li class='meetingTypeMenuLi'>周日</li></ul></div>" +
            //每月几号
            "<div id='Per_Month' class='fl DN'>"+
            "<span class='fl pr5 fsize14' style='margin-left:15px;'>每月</span>"+
            "<div class='meeting_input fl'>"+
            "<input name='PerMonth' type='text' class='meeting_time' style='width:59px;' value='1'/>"+
            "</div><span class='fl pl5 pr5 fsize14'>号</span></div>"+
            
            "</td></tr>");
       panelBody.append(formIsImmediate);
       
       //下拉菜单选择会议类型绑定事件
       $("#meetingType_D li").bind("click",function(){
    	   //隐藏下拉菜单
    	   $("#meetingType_D").hide();
    	   $("#CycleTime_D").hide();
    	   //隐藏预约与周期会议元素
 		   $("#Cycle_Form1").hide();
		   $("#Cycle_Form2").hide();
	       $("#Res_Form").hide();
  		   $("#Per_Day").hide();
 		   $("#Per_Week").hide();
 		   $("#Per_Month").hide();
 		   //显示选择项
    	   $("#meetingType_S").text($(this).text());
    	   if($(this).text() == "立即会议"){}
    	   else if($(this).text() == "预约会议"){
    		  $("#Res_Form").show();
    	   }
    	   else if($(this).text() == "周期会议"){ 
    		  $("#Cycle_Form1").show();
    		  $("#Cycle_Form2").show();
     		  $("#Per_Day").show();
    	   }
       });
       //下拉菜单选择周期会议时间按...绑定事件
       $("#CycleTime_D li").bind("click",function(){
    	   //隐藏下拉菜单
    	   $("#CycleTime_D").hide();
    	   $("#meetingType_D").hide();
    	   //隐藏预约与周期会议元素
	       $("#Res_Form").hide();
  		   $("#Per_Day").hide();
 		   $("#Per_Week").hide();
 		   $("#Per_Month").hide();
 		   
    	   $("#CycleTime_S").text($(this).text());
    	   if($(this).text() == "按天"){
     		  $("#Per_Day").show();
     	      $("#Per_Week").hide();
     	      $("#Per_Month").hide();
     	   }
    	   else if($(this).text() == "按周"){
    		  $("#Per_Day").hide();
    	      $("#Per_Week").show();
    	      $("#Per_Month").hide();
    	   }
    	   else if($(this).text() == "按月"){ 
    		  $("#Per_Day").hide();
     	      $("#Per_Week").hide();
     	      $("#Per_Month").show();
    	   }
       });
       
       //下拉菜单选择每周几绑定事件
       $("#CycleWeek_D li").bind("click",function(){
    	   //隐藏选择每周几菜单
    	   $("#CycleWeek_D").hide();
    	   $("#CycleWeek_S").text($(this).text());
//    	   $("#CycleWeek_S").children("div").remove();
//    	   $("#CycleWeek_S").append($("<div class='DN'>"+ $(this).index() +"</div>"));
       });
       
       //select标签实现下拉菜单
//       var formIsImmediate = $("<tr><td>会议时间</td><td>"+
//    	   "<select style='-webkit-appearance:none; border: #bad1de 1px solid; border-radius:4px;"+
//           "WIDTH:150px;'><option value='>立即会议</option><option>预约会议</option>"+
//           "<option>周期会议</option></select></td></tr>");
//       panelBody.append(formIsImmediate);
       
       ////////////////预约会议表单
//       var Res = $("<tr id='ResMeetingForm' style='display:none;'><td>预约时间</td><td>"+
//       	"<div class='meeting_input fl' style='width:200px;'>"+
//       	"<input name='reservationTime' type='text' class='meeting_time' style='width:190px;' value='2016-5-1 12:00:00'/>"+
//       	"</div></td></tr>");
       var Res = $("<tr id='Res_Form' class='DN'><td>预约时间</td>"+
    		       "<td><input type='text'  id='datetimepicker1' class='meeting_input' "+
    		       "style='padding-left:10px; width:190px;'/></td></tr>");
       panelBody.append(Res);

//       ////////////////周期会议表单
//       var Cycle = $("<tr id='CycleMeetingForm' style='display:none;'><td>预约时间</td><td>"+
//       	"<div class='meeting_input fl' style='width:200px;'>"+
//       	"<input name='reservationTime' type='text' class='meeting_time' style='width:190px;' value='2016-5-1 12:00:00'/>"+
//       	"</div><span class='fl' style='padding:0 5px 0 20px;'>会议周期</span>"+
//       	"<div class='meeting_input w100 fl'><input name='cycle' type='text' "+
//       	"class='meeting_time' style='width:90px;' value='1'/>"+
//        "</div><span class='fl  pl5 pr5'>天</span></td></tr>");

     var Cycle = $("<tr id='Cycle_Form2' class='DN'><td>起止时间</td><td>"+
    	//开始日期
     	"<div class='meeting_input fl' style='width:110px; margin-right:6px;'>"+
     	"<input type='text' class='meeting_time'"+
     	"style='width:100px;' id='datetimepickerDate1'/>"+
     	"</div><span class='fl pl5 pr5 fsize14'>至</span>"+
     	//结束日期
     	"<div class='meeting_input fl' style='width:110px; margin-left:6px;'>"+
     	"<input type='text' class='meeting_time'"+
     	"style='width:100px;' id='datetimepickerDate2'/>"+
     	"</div>"+
     	//时间
     	"<div class='meeting_input fl w100' style='width:100px; margin-left:20px;'>"+
     	"<input type='text' class='meeting_time'"+
     	"style='width:90px;' id='datetimepickerTime'/>"+
     	"</div>"+
     	
        "</td></tr>");
       panelBody.append(Cycle);

       ////////////////////会议时长     (<i class='input_more'></i>)
      var formDuration = $("<tr><td>会议时长</td><td>"+
    	"<div class='meeting_input w100 fl'><input name='DurationHour' type='text' "+
    	"class='meeting_time' style='width=90px;' value='0'/></div><span class='fl pl5 pr20'>小时</span>"+
    	"<div class='meeting_input w100 fl'><input name='DurationMinute' "+
    	"type='text' class='meeting_time' style='width:89px;' value='20'/>"+
    	"</div><span class='fl  pl5 pr5'>分钟</span></td></tr>");
      panelBody.append(formDuration);

    /////////////////////////与会人
    var formMembers = $("<tr><td>与会人</td>"+
    	"<td><div class='meeting_input h60'>"+
    	"<textarea oninput='MemberNumbertextarea()'  name='members' cols='' rows='' class='meeting_person' "+
    	"style='font-size:14px; line-height:30px;"+
    	"placeholder='与会人之间用英文分号隔开，如：webrtc1@163.com;webrtc2@163.com'></textarea>"+
    	"<i class='input_add_person'>添加成员</i></div></td></tr>");
    panelBody.append(formMembers);

//    //////////////////////与会人数 
//    var formMemberNum = $("<tr><td>与会人数</td><td><div class='meeting_input w125'>"+
//    	"<i class='input_num_add' onclick='addMemberNum();'>+</i>"+
//    	"<input name='member_num' type='text' class='meeting_person_num' value='0' />"+
//    	"<i class='input_num_minus' onclick='minusMemberNum();'>-</i></div></td></tr>");
//    panelBody.append(formMemberNum);	
    
     //////////////////////与会人数 (自动回显)
     var formMemberNum = $("<tr><td>与会人数</td><td>"+
    		 "<div class='meeting_input w125' style='text-align:center;' name='member_num'>0</div></td></tr>");
      panelBody.append(formMemberNum);	
      
      
	var createCancelButton = $("<tr><td>&nbsp;</td>"+
		"<td><input onclick='sendBefore();' type='button' value='创建'' class='meeting_btn1' />"+
		"<input type='button' value='取消 ' class='meeting_btn2'/></td></tr>");
	panelBody.append(createCancelButton);


	showWeb(MeetingPrefix,"MeetingCreate");
	$("input[name='isimmediateconf']").val("立即会议");
	
	var Today = new Date();
	
    //设置日历插件参数
	$.datetimepicker.setLocale('zh');  //设置显示语言为中文
	$('#datetimepicker1').datetimepicker({
		dayOfWeekStart : 1,    //设置日历显示第一列为周一
		format:"Y-m-d H:i",    //格式化日期
		//disabledDates:['1986/01/08','1986/01/09','1986/01/10'], //不能选择的日期
		//startDate:Today,  //日历初始化选择日期
		yearStart:2015,   //日历开始年
		yearEnd:2030,     //日历结束年
		//todatButton:false //关闭选择今天按钮
		});
	//设置input初始化时以及时钟步长
	$('#datetimepicker1').datetimepicker({step:15});
	//$('#datetimepicker1').datetimepicker({value:Today, step:15});
	//设置今天之前的日期不能选择
	$('#datetimepicker1').datetimepicker({
		beforeShowDay:function(date){
			//var TodayDate = new Date();(初始化默认值，需要使用)
			if(date.getTime() < Today.getTime() - Number(24*3600*1000))
				return [false,""];
			return [true,""];
		}
	});
	
	
	//周期会议开始日期
	$('#datetimepickerDate1').datetimepicker({
		timepicker: false,    //设置日历显示第一列为周一
		format:"Y-m-d",    //格式化日期
		//startDate:Today,  //日历初始化选择日期
		yearStart:2015,   
		yearEnd:2030,     
		});	
	//设置今天之前的日期不能选择
	$('#datetimepickerDate1').datetimepicker({
		beforeShowDay:function(date){
			//var TodayDate = new Date();(初始化默认值，需要使用)
			if(date.getTime() < Today.getTime() - Number(24*3600*1000))
				return [false,""];
			return [true,""];
		}
	});
	
	//周期会议结束日期
	$('#datetimepickerDate2').datetimepicker({
		timepicker: false,    
		format:"Y-m-d",    
		//startDate:Today,  //日历初始化选择日期
		yearStart:2015,   
		yearEnd:2030,     
		});	
	//设置今天之前的日期不能选择
	$('#datetimepickerDate2').datetimepicker({
		beforeShowDay:function(date){
			//var TodayDate = new Date();(初始化默认值，需要使用)
			if(date.getTime() < Today.getTime() - Number(24*3600*1000))
				return [false,""];
			return [true,""];
		}
	});
	//周期会议时间
	$('#datetimepickerTime').datetimepicker({
		datepicker: false,   
		format:"H:i",    //格式化日期
		step:15
		});
};

//显示会议类型下拉菜单
var showMeetingTypeMenu = function(){
	$("#meetingType_D").show();
};

//隐藏会议类型下拉菜单（鼠标移出web则隐藏）
$("body div div:not(#web)").mouseout(function(){
	$("#meetingType_D").hide();
});

//显示周期会议按...计算
var showCycleTimeMenu = function(){
	$("#CycleTime_D").show();
};

//隐藏周期会议按...计算下拉菜单（鼠标移出web则隐藏）
$("body div div:not(#web)").mouseout(function(){
	$("#CycleTime_D").hide();
});

//显示周期会议为每周几...
var showCycleWeekMenu = function(){
	$("#CycleWeek_D").show();
};

//隐藏周期会议为每周几下拉菜单（鼠标移出web则隐藏）
$("body div div:not(#web)").mouseout(function(){
	$("#CycleWeek_D").hide();
});

//设置与会人数的自动回显
var MemberNumbertextarea = function(){
	members = "";
	member_num = 0;
	var membersBefore = $("textarea[name='members']").val();
	var membersTemp = membersBefore.split(';');
	//console.log("membersTemp.length:"+membersTemp.length);

	for(var i=0; i< membersTemp.length; i++){  //与会人之间用#号隔开
		//console.log("membersTemp["+ i +"]:" + membersTemp[i]); 
		if(membersTemp[i]){  //处理连续分号的情况（memberTemp中有内容）
		   member_num ++;
		   if(members){  //处理第一个字符为空的情况（members不为空）
		      members =  members + "#"  + formatChange(membersTemp[i]);
		   }
		   else
			  members = formatChange(membersTemp[i]);
		}
	}
	////////////////////////与会人数回显
	$("div[name='member_num']").text(member_num);
};
//与会人数增加（暂时没用）
var addMemberNum = function(){
	var member_num = Number($("input[name='member_num']").val())+1;
	$("input[name='member_num']").val(member_num);
};
//与会人数减少（暂时没用）
var minusMemberNum = function(){
	var member_num = Number($("input[name='member_num']").val())-1;
	if(member_num == -1) return;
	$("input[name='member_num']").val(member_num);
};

/***************************************召开会议**********************************************/
var CallVideoMeetingBefore = function(roomID){
	console.log("-------CallVideoMeetingBefore");
	    var SessionID = null;
	    var RemoteID = roomID;
	    // 不存在当前视频会议（包括界面）
	    if(getVideoMeetingDiv(roomID)==null)
	    {
	        console.log("meetingvediolabel for "+RemoteID+"is not exist!");
	        console.log("we new a SessionID");
	        SessionID = guid();
	        console.log(SessionID);
	        createVideoMeetingLabel(RemoteID,com.webrtc.UserSession.TYPE.MEETING,com.webrtc.UserSession.MODULE_TYPE.VIDEOMEETING,SessionID);
	        CallMeetingVideo(RemoteID,SessionID);
	    }
	    //showWeb(VideoMeetingPrefix,roomID);
};

//创建视频会议界面  （2016-3-2 pq）
var createVideoMeetingLabel = function(RemoteID,sessionType,moduleType,SessionID){

	var gRemoteUserID = RemoteID;	
	var gLocalUserID=com.webrtc.sigSessionConfig.username;
	console.log("----------gLocalUserID"+gLocalUserID);
    //var MeetingVideoDiv = VideoMeetingPrefix + gRemoteUserID; 
   
    var meetingDiv = document.createElement('div'); 
    $(meetingDiv).addClass("meeting_box");
    document.body.appendChild(meetingDiv);

    ////////////////////////视频会议界面head
    var meetingHead = $("<div class='meeting_head'></div>");
    $(meetingDiv).append(meetingHead);

    var userMessage =$("<div class='user_info'></div>");
    meetingHead.append(userMessage);

    var userContent=$("<div class='portrait'><img src='css/pc/images/img/portrait65_1.jpg' width='65' height='65'/></div>"+
    		  "<h1 class='user_name'>"+ RemoteID +"</h1>");
    userMessage.append(userContent);
    
    //////设置会议界面可拖动
    //dragWindow("meeting_head", meetingDiv);
    dragWindow("user_info", meetingDiv);

    var rightHead = $("<div class='meeting_head_right'>"+
                      "<ul><li title='最小化' class='operation_min' onclick='hideMeetingDiv()'最小化</li>"+
                      "<li class='operation_exit' title='退出会议' id='" + "hangup"+
   		                     gRemoteUserID + gLocalUserID + sessionType + moduleType+"'"+
                             " onclick='HangUpMeetingvideo(\""+
                             gRemoteUserID+"\","+"\""+SessionID+"\")'>退出会议</li>"+
                      "<li title='设置' class='operation_set'>设置</li>"+
                      "<li title='邀请好友' class='operation_add' onclick='InviteMemberModal(\""+ 
                           gRemoteUserID+"\")'>邀请好友</li></ul></div>");
    meetingHead.append(rightHead);

    ///////////////////////会议body
    //左端
    var LeftBody= $("<div class='meeting_box_l'></div>");
    $(meetingDiv).append(LeftBody);
    /////左端添加本端视频
    var localVedio =  $("<div class='vedio_me'>"+
                 "<video style='width:250px;' id=\""
	            + gLocalUserID + gRemoteUserID + sessionType + moduleType
	            + "\" autoplay=\"autoplay\" ></video></div>");
    LeftBody.append(localVedio);
    
    var ListMember = $("<div class='meeting_member'></div>"); 
    LeftBody.append(ListMember);
    var head = $("<h2>会议成员</h2>");
    ListMember.append(head);
    var Memberlist = $("<ul id='meeting_member'></ul>");
    ListMember.append(Memberlist);
    ///////添加具体会议成员
    // requestmeetingmember(RemoteID);
   
    //右端
    var rightBody = $("<div class='meeting_box_r'></div>");
    $(meetingDiv).append(rightBody);
    
    //右端视频会议界面
    var meetingVideo = $("<div class='vedio_box'></div>");
    rightBody.append(meetingVideo);

	var VideoMeeting= $("<video style='width:616px;' id='" 
			    + gRemoteUserID +gLocalUserID+ sessionType + moduleType 
			    + "' autoplay='autoplay'></video>");	
	meetingVideo.append(VideoMeeting);
	
	//右端群聊界面
//	var meetingDialog = $("<div class='vedio_dialogue'></div>");
//	rightBody.append(meetingDialog);
//	//右下显示聊天内容
//	var DialogContentUl = $("<div class='dialogue_list'><ul id='"+ RemoteID +"meetingContent'></ul></div>");
//	meetingDialog.append(DialogContentUl);
//	//右下输入聊天内容
//	var DialogChatBox = $("<div class='meeting_input_chat_box'></div>");
//	meetingDialog.append(DialogChatBox);
//	var ChatTextarea = $("<textarea id='"+ RemoteID +"message'"+
//			        " name='' onkeydown='checkEnterDown(\""+RemoteID+"\")' "+
//			        "cols='' rows='' class='meeting_input_text'></textarea>");
//	DialogChatBox.append(ChatTextarea);
//	var ChatEdit = $("<div class='meeting_input_chat_edit'><ul class='meeting_input_chat_edit_l'>"+
//                     //"<li class='icon_face'>选择表情</li><li class='icon_font_size'>文字大小</li>"+
//                     //"<li class='icon_color'>文字颜色</li>"+"
//                     "</ul><div class='meeting_input_chat_edit_r'>"+
//                     "<input type='button' id=\""+RemoteID+"sendBtn\" onclick=\"sendMeetingText\('"+ 
//                  	 RemoteID + "'\);\" value='发送' class='send_out btn_blue'/></div></div>");
//	DialogChatBox.append(ChatEdit);
	/////////////////////////视频界面结束//////////////////////////////////////////
	  
	//////////创建会议活动列表
	createActiveList(gRemoteUserID,MeetingPrefix); 
	
    //添加隐藏sessionId
	var $sessionid = $("<input type=\"hidden\" class = \"SESSIONFLAG\" id=\"sessionId\" "+
			   "value=\"" + SessionID + "\">");
	$(meetingDiv).append($sessionid);
	
	console.log("-----会议创建成功！");
	//本端静音
	document.getElementById(gLocalUserID+gRemoteUserID+sessionType+moduleType).muted=true;    
};  

//添加每位会议成员,member为webrtc1@163.com，成员id为"MeetingMember"+webrtc1@163.com
var addPerMeetingMember = function(member,roomid){
	console.log("添加会议号为"+roomid+"的成员"+member);
	var perMeetingMember = $("<li id='MeetingMember"+ member +"'><div class='list_portrait'>"+
			"<img src='css/pc/images/img/portrait65_2.jpg'/></div>"+
			"<a>"+ member + "</a><span class='state'>正常</span></li></li>");
	$("#meeting_member").append(perMeetingMember);
	
	//////////为每位会议成员添加右击菜单操作
	var RightClickMenu = $("<div id='PerMeeting"+ member+"' style='display:none;' class='friend_pop_operation RightClickMeetingMember'></div>");
	$(document.body).append(RightClickMenu);
	
	var MenuUL = $("<ul></ul>");
	RightClickMenu.append(MenuUL);
	var MenuList1 = $("<li onclick='requestMeetingVoiceBefore(\""+ member+ "\",\"" + roomid+ "\",\"UDP_MUTE\")'>静音</li>");
	MenuUL.append(MenuList1);
	var MenuList2 = $("<li onclick='requestMeetingVoiceBefore(\""+ member + "\",\"" + roomid +"\",\"UDP_UNSAY\")'>闭音</li>");
	MenuUL.append(MenuList2);
	var MenuList3 = $("<li onclick='requestMeetingVoiceBefore(\""+ member + "\",\"" + roomid +"\",\"UDP_UNMUTE\")'>恢复正常听说</li>");
	MenuUL.append(MenuList3);
	var MenuList4 = $("<li onclick='DeleteMeetingMember(\""+ member + "\",\"" + roomid +"\")'>踢出会议</li>");
	MenuUL.append(MenuList4);
	
	
	perMeetingMember.mousedown(function(e){
		if(e.which == 3){
	    //右击我的一个好友
		   console.log("右击一个我的会议成员:"+this.id);
		   //var username = this.id.replace("FriendList","");
		   document.oncontextmenu = function() {
			   return false;
		   };
		var RightClick = document.getElementById("PerMeeting" + member);
		//$(RightClick).hide();
		//$(this).parent().parent().parent().parent().parent().parent().children("div[class='friend_pop_operation']").hide();
		$("."+"friend_pop_operation").hide();
		$(RightClick).attr(
				"style",
				"display: block;  position:absolute; z-index:200; top:" + e.pageY  + "px; left:"
						+ e.pageX  + "px;");
		$(RightClick).show();
		$("body").click(function(e) {
			$(RightClick).hide();
			//$(document.body).children("div[class='friend_pop_operation']").hide();
			
		});
		
		}
		
	});
};

//设置视频会议head可拖拽，gragClass为可拖动区域，meetingDiv为拖动的区域
function dragWindow(dragClass, meetingDiv){
	  
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
	    $(meetingDiv).css("left", x);
	    $(meetingDiv).css("top", y);
	  }   ).mouseup(function(){
	    bool=false;               //当鼠标在移动元素起来的时候将bool设定为false
	  });
};

//会议成员静音、闭音、恢复预处理
var requestMeetingVoiceBefore = function(member,roomid,event){
	CurState = $(document.getElementById("MeetingMember"+ member)).children("span").html();
	console.log(CurState);
	if(event== "UDP_UNMUTE"){
		if(CurState == "正常") 
			return;
		else 
			$(document.getElementById("MeetingMember"+ member)).children("span").html("正常");
	}
	else if(event== "UDP_MUTE"){
		if(CurState == "静音"){ 
			console.log("该成员已经是静音状态");
			return;
		}
		else 
			$(document.getElementById("MeetingMember"+ member)).children("span").html("静音");
	}
	if(event== "UDP_UNSAY"){
		if(CurState == "闭音") 
			return;
		else 
			$(document.getElementById("MeetingMember"+ member)).children("span").html("闭音");
	}
	requestMeetingVoice(member,roomid,event);
		
};

////创建视频会议界面
//var createVideoMeetingLabel =function(RemoteID,sessionType,moduleType,SessionID){
//	var gRemoteUserID = RemoteID;
//	//var gLocalUserID = com.webrtc.sigSessionConfig.username;
//	
//	var gLocalUserID=com.webrtc.sigSessionConfig.username;
//	console.log("----------gLocalUserID"+gLocalUserID);
//    var MeetingVideoDiv = VideoMeetingPrefix + gRemoteUserID;
//	    
//    var newContent = document.createElement("div");
//	newContent.setAttribute("id",MeetingVideoDiv);
//
//    ///////////////////////////////视频会议图像
//    var MeetingVideo = $("<div class='call_video'></div>");
//    $(newContent).append(MeetingVideo);
//
//	var VideoMeeting= $("<video class='remote' id='" + gRemoteUserID +gLocalUserID 
//		     + sessionType + moduleType + "' autoplay='autoplay'></video>");	
//	MeetingVideo.append(VideoMeeting);
//	
//	var LocalVideo = $("<video style='display:none;' class='local' id=\""
//			+ gLocalUserID + gRemoteUserID + sessionType + moduleType
//			+ "\" autoplay=\"autoplay\" ></video>");
//	MeetingVideo.append(LocalVideo);
//	
//	/*var addLocalVideo= $("<video width='320' height='240' id='" +
//			  gLocaleUserID+gRemoteUserID+sessionType+moduleType+ "' autoplay='autoplay'></video>");
//	MeetingVideo.append(addLocalVideo);*/
//    /////////////////////////////bottombuttons
//    var bottomButtons = $("<div class='call_operation'>");
//    $(newContent).append(bottomButtons);
//
//    var hangupbutton = $("<div class='call_btn call_btn_hang'  id='" + "hangup"+
//    		         gRemoteUserID + gLocalUserID + sessionType + moduleType+"'"+
//                     "onclick='HangUpMeetingvideo(\""+
//                     gRemoteUserID+"\","+"\""+SessionID+"\")'/>");
//    bottomButtons.append(hangupbutton);
//
//   /* var toAudio = $("<div class='call_btn call_btn_audio2'>转为音频</div>");
//    bottomButtons.append(toAudio);
//
//    var toKey = $("<div class='call_btn call_btn_key_open call_btn_non'>收起键盘</div>");
//    bottomButtons.append(toKey);*/
//
//    var InviteMemberButton = $("<button onclick='InviteMemberModal(\""+ 
//                    gRemoteUserID+"\")'>邀请与会人</button>");
//    var deleteMemberButton = $("<button onclick='DeleteMemberModal(\""+
//                    gRemoteUserID+"\")'>删除与会人</button>");
//    
//    bottomButtons.append(InviteMemberButton);
//    bottomButtons.append(deleteMemberButton);
//    //////////////////////////////////////////////////////////
//
//    //添加隐藏sessionId
//    var $sessionid = $("<input type=\"hidden\" class = \"SESSIONFLAG\" id=\"sessionId\" value=\""
//			+ SessionID + "\">");
//
//	$(newContent).append($sessionid);
//	
//	console.log("-----------创建视频会议界面成功！！！！");
//	$("#web").append(newContent);
//	//本端静音
//    document.getElementById(gLocalUserID+gRemoteUserID+sessionType+moduleType).muted=true;
//}

//隐藏会议界面
var hideMeetingDiv = function(){
	console.log("隐藏会议界面------------------");	
	$(".meeting_box").hide();
};

//显示会议界面（由左栏活动列表触发）
var ShowMeetingDiv = function(roomID,type){
	console.log("显示会议界面------------------");	
	$(".meeting_box").show();
};

//退出会议
var closeVideoMeetingDiv = function(gRemoteUserID){
	console.log("退出会议------------------");	
	$(".meeting_box").remove();
	document.getElementById(gRemoteUserID + MeetingPrefix + "activelist").remove();
	$("."+"RightClickMeetingMember").remove();
	
	var contents = "退出会议成功! Exit meeting success!";
	$.fillTipBox({type:'info', icon:'glyphicon-info-sign', content:contents});
	//var VideoMeetingDiv = getVideoMeetingDiv(gRemoteUserID);
	//VideoMeetingDiv.remove();
	//globalCur=null;
};

//返回视频会议功能区id
var getVideoMeetingDiv = function(roomID) {
	return document.getElementById(VideoMeetingPrefix + roomID);
};

//计算Date对象的昨天、后天等值
var GetDate = function(date,AddDate){
	date.setDate(date.getDate()+AddDate);  //获取date对象AddDate天后的日期
	//date = 2016-05-18T00:00:00.000Z
	var year = date.getFullYear();
	var month = date.getMonth()+1;
	var day = date.getDate();
	return year+"-"+month+"-"+day;
};

//输出每周几开会（0为周日）
var MeetingPerWeekDay = function(){
	var content = $("#CycleWeek_S").html();
	if(content == "周一") return Number(1);
	if(content == "周二") return Number(2);
	if(content == "周三") return Number(3);
	if(content == "周四") return Number(4);
	if(content == "周五") return Number(5);
	if(content == "周六") return Number(6);
	if(content == "周日") return Number(0);
};
////添加输入与会人名字文本框函数
//var addInputMembers = function(){
//	//输入与会人
//	var number = $("input[name='member_num']").val();
//	$("#inputMembers").html("");
//	if(Number(number) == 0){//与会人数为0
//		console.log("-----------与会人数:" + Number(number) );
//		$("textarea[name='members']").remove();
//		var formMembers = $("<textarea style='display:none;' name='members'></textarea>");
//		$("#inputMembers").append(formMembers);
//		return;
//	}
//	//显示输入与会人框
//	for (var i=0; i<number; i++){
//		var inputMembers = $("<input type='text' name='inputMeetingMember"+ i +"'/>");
//		$("#inputMembers").append(inputMembers);
//	}
//	var inputButton = $("<button id='InputMembersOK' onclick='handleMembers();'>确定</button>");
//	$("#inputMembers").append(inputButton);
//}
//
////处理输入的用户名称
//var handleMembers = function(){
//	var number = $("input[name='member_num']").val();
//	//$("#inputTitle").remove();
//	
//	var sum = "";
//	for (var i=0; i<number-1; i++){
//		var inputMembers = $("input[name='inputMeetingMember"+ i +"']");
//		var temp = inputMembers.val();
//		sum = sum + temp + "#";
//		//inputMembers.remove();
//	}
//	var inputMembers = $("input[name='inputMeetingMember"+ i +"']");
//	//sum = sum + inputMembers.val();
//	var temp = inputMembers.val();
//	sum = sum + temp ;
//	//inputMembers.remove();
//	$("#InputMembersOK").remove();
//	
//	$("#inputMembers").html(sum);
//	console.log("---前端显示添加人员："+ sum);
//	sum = formatChange(sum);
//	
//	$("textarea[name='members']").remove();
//	var formMembers = $("<textarea style='display:none;' name='members'>"+ sum +"</textarea>");
//	$("#inputMembers").append(formMembers);
//}