//历史记录中 通话记录 相关操作
//根据美工美工的静态界面，分页拉取，每次取10条记录

//通话记录 总数
var HistoryCallNumber = 0;
//每条通话记录前缀
var HistoryCallPrefix = "historycall"; 

//最前页，上一页，当前页，下一页，最后页，总页数 变量设置
var HistoryCallFirstPage=0;

var HistoryCallLastPage=0;

var HistoryCallCurrentPage=0;

var HistoryCallBeforePage=0;

var HistoryCallNextPage=0;

var HistoryCalTotalPage=0;

//左栏历史记录初始化操作（标题栏，内容上下栏初始化）
var HistoryCall = function(){
	 
	//当前高亮的菜单恢复原样	
	normalizeSelectedListMenuElement("recent_calls");
	normalizeSelectedListMenuElement("rtc_menu");
	
	//固定，高亮历史记录
	$('.rtc_menu ul li').eq(4).addClass('on');
	
	$('#web').find("div[id='HistoryCall']").remove();
	if (globalCur=="HistoryCall"){ globalCur=null; }
	if(globalCur!=null){
		   
		   document.getElementById(globalCur).setAttribute("style","display:none;");
	}
		
	var HistoryCallDivId = HistoryPrefix + "Call";
    globalCur=HistoryCallDivId;
//	document.getElementById(globalCur).setAttribute("style","display:block;");
    
    if(document.getElementById(HistoryCallDivId)!=null){
		showWeb(HistoryPrefix,"Call");
			return;
	}
	
	var newContent = document.createElement("div");
	newContent.setAttribute("id", HistoryCallDivId);

	var HeadMeeting = $("<div class='rtc_tab'><ul>"+
			"<li id='onChat' onclick='HistoryChat();'>消息盒子</li>"+
            "<li id='onAudio' onclick='HistoryAudio();'>通话记录</li>"+
            "<li id='onVideo' onclick='HistoryVideo();'>视频邀请记录</li>"+
            "<li id='onMeeting' onclick='HistoryMeeting();'>会议召开记录</li></ul></div>");
	$(newContent).append(HeadMeeting);
	
	
	var MiddleMeeting = $("<div class='list_table'></div>");
	
	var Chat=$("<div id='list_chat'><div id='chat_right' class='box_friend_list'>" +
			"<ul id='list_chat_right' class='list_chat_right'></ul>" +
			"</div>" +
			"<div id='chat_left' class='box_dialogue_list'>" +
			"<ul id='list_chat_left' class='dialogue_list'></ul>" +
			"</div></div>");
	
	var Audio=$("<div id='list_audio' ><table>"+
			"<tr id ='audio_title'>"+
			"<th width=\"140\" class=\"pl10\">号码</th>"+
			"<th width=\"50\" class=\"pl10\">呼叫</th>"+
			"<th class=\"pl10\">呼叫时间</th>"+
			"<th width=\"80\" class=\"pl10\">通话时长</th>"+
			"<th width=\"80\"class=\"pl10\">操作</th>"+
			"</tr>"+
			"</table></div>");
	var Video=$("<div id='list_video'><table>"+
			"<tr id ='video_title'>"+
			"<th width=\"140\" class=\"pl10\">开始时间</th>"+
			"<th width=\"150\" class=\"pl10\">终止时间</th>"+
			"<th class=\"pl10\">被邀请人</th>"+
			"<th class=\"pl10\">邀请参与人</th>"+
			"</tr>"+
			"</table></div>");
	var Meeting=$("<div id='list_meeting'><table>"+
			"<tr id ='meeting_title'>"+
			"<th width=\"60\"  class=\"pl10\">会议类型</th>"+
			"<th width=\"65\"  class=\"pl10\">会议主席</th>"+
			"<th width=\"165\" class=\"pl10\">会议时间</th>"+
			"<th class=\"pl10\">与会人</th>"+
			"<th width=\"70\"class=\"pl10\">操作</th>"+
			"</tr>"+
			"</table></div>");
	$(MiddleMeeting).append(Chat);
	$(MiddleMeeting).append(Audio);
	$(MiddleMeeting).append(Video);
	$(MiddleMeeting).append(Meeting);
	$(newContent).append(MiddleMeeting);
	
	
	////////翻页界面
	var PageDown = $("<div class='bottom_operation'></div>");
//	var PageDownLeft = $("<div class=\"bottom_operation_l\">" +
//			"<a href=\"javascript:void(0)\">导出</a>|<a href=\"javascript:void(0)\">删除</a>" +
//			"</div>");
	var PageDownRight =  $("<div class=\"bottom_operation_r\">" +
    							"<span id =\"historycall_firstpage\" class=\"page_first\">最前页</span>"+
    							"<span id =\"historycall_beforepage\"class=\"page_up\">上一页</span>"+
    							"<span>第</span>" +
    							"<span><input name=\"\" type=\"text\" id =\"historycall_currentpage\" class=\"input_num\" /></span>" +
    							"<span>页</span>"+
    							"<span>/</span>"+
    							"<span id =\"historycall_totalpage\"></span>"+
    							"<span>页</span>"+
    							"<span id =\"historycall_nextpage\" class=\"page_next\">下一页</span>"+
    							"<span id =\"historycall_lastpage\" class=\"page_end\">最后页</span></div>" +
    						"</div>");
	
//	$(PageDown).append(PageDownLeft);
	$(PageDown).append(PageDownRight);
	$(newContent).append(PageDown);
	
	$("#web").append(newContent);
	
	$('#list_chat').hide();
	$('#list_audio').hide();
	$('#list_video').hide();
	$('#list_meeting').hide();
	
	//默认显示消息盒子界面
	HistoryChat();

}

//显示通话记录列表（单击通话记录触发）
var HistoryAudio=function(){
	document.getElementById("onAudio").setAttribute("class","on");
	document.getElementById("onChat").removeAttribute("class");
	document.getElementById("onVideo").removeAttribute("class");
	document.getElementById("onMeeting").removeAttribute("class");
	$('#list_chat').hide();
	$('#list_audio').show();
	$('#list_video').hide();
	$('#list_meeting').hide();
	
	//重新拉取第一页的通话记录  
	requesthistorycallinfo(1);
	
};

//拉取通话记录预处理
var requesthistorycallinfo = function(pageindex){
    //清空当前页面中通话记录数据
	clearhistorycallinfo();
	//拉取当前页的 10条 通话数据
	ajaxrequestHistoryCall(pageindex);
}

//清空通话记录页面
var clearhistorycallinfo = function(){
	
	$('#'+HistoryPrefix+'Call').find("div[class='list_table']").find("div[id='list_audio']").find("table").find("tr:not('#audio_title')").remove();
}

//ajax异步拉取通话记录
var ajaxrequestHistoryCall = function(pageindex){
	var user = $('.pub_banner').attr("user");
	var userforwcs = formatChange(user)
	console.log("begin to request history");
	$.ajax({
		url : "/WCLnew/requestSessionHistory",
		type : "post",
		async : false,
		data : {'username':userforwcs,'page':pageindex},
		dataType : "json",
		success : function(data) {
			console.log(data);
			if(data.count != 0){
				var userlocal = $('.pub_banner').attr("user");
				var call='call';
				for(var i =0;i<data.size;i++){
					var caller = formatRechange(data.groups[i].offerer);
					var callee = formatRechange(data.groups[i].answerer);
					var begintime = data.groups[i].callDate;
					var endtime = data.groups[i].byeDate;
					var isCaller = false;
					var accepttime = data.groups[i].acceptDate;
					if(caller == userlocal){
						// 为 本地用户呼叫其他用户
						isCaller = true;
						//添加一条通话记录
						addPerHistoryCall(callee,isCaller,begintime,endtime);
					}
					else{
						addPerHistoryCall(caller,isCaller,begintime,endtime,accepttime);
					}
				}
				//更新翻页，page为请求第几页（从1开始），total为总页
				refreshpagedown(data.page,data.total,call);
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

//添加一条通话记录
var addPerHistoryCall = function(name,isCaller,beginTime,endTime,accepttime){
	
	beginTime = deleteT(beginTime);	//去T
	
	var HistoryIsCaller ="";
	var duration ="";
	var HistoryCallPer =$("<tr></tr>");
	if(isCaller == true)
	{
		HistoryIsCaller="呼出";
	}
	else
	{
		if(accepttime == null) //未接，显示红色字样
			HistoryCallPer.css("color","red");
		HistoryIsCaller="呼入";
	}
	beginTime=new Date(beginTime);
	if(beginTime !=null && endTime !=null){
		
		endTime = deleteT(endTime);	//去T
		endTime = new Date(endTime);
		duration = milliSecondtoTime((endTime-beginTime).toString());
		
	}
	var beginTime = beginTime.Format("yyyy-MM-dd hh:mm:ss"); 
	
	var HistoryCallName = $("<td class=\"pl10\">" +name+"</td>");
	var HistoryCallCaller = $("<td class=\"pl10\">" +HistoryIsCaller+"</td>");
	var HistoryCallbeginTime = $("<td class=\"pl10\">" +beginTime +"</td>");
	var HistoryCallduration = $("<td class=\"pl10\">" +duration+"</td>");
	var HistoryCallopreation = $("<td class=\"fBlue pl10\"> 重新呼叫</td>");
	HistoryCallPer.append(HistoryCallName);
	HistoryCallPer.append(HistoryCallCaller);
	HistoryCallPer.append(HistoryCallbeginTime);
	HistoryCallPer.append(HistoryCallduration);
	HistoryCallPer.append(HistoryCallopreation);
	
	$('#'+HistoryPrefix+'Call').find("div[class='list_table']").find("div[id='list_audio']").find("table").append(HistoryCallPer);
	
}

//ajax返回时间类型去掉字母T
var deleteT = function(datetime)
{
	separates = datetime.split("T");
	return separates[0] + " " + separates[1];
}


//更新翻页全局变量值(page为请求第几页<从1开始>；total为数据总页数，type为call/chat/video/meeting)
var refreshpagedown =function(page,total,type){
	HistoryCallTotalPage=total;
	if(page == 1 && page!=total){        //当前显示是第一页,不是最后一页
		HistoryCallFirstPage=1;
		HistoryCallBeforePage=1;
		HistoryCallCurrentPage=1;
		HistoryCallNextPage=2;
		HistoryCallLastPage=total;
	}
	else if(page == 1 && page == total){  //当前显示是第一页，也是最后一页
		HistoryCallFirstPage = 1;
		HistoryCallBeforePage = 1;
		HistoryCallCurrentPage = 1;
		HistoryCallNextPage = 1;
		HistoryCallLastPage = 1;
	}
	else if(Number(page) != 1 && page != total){    //当前显示不是第一页,不是最后一页
		HistoryCallFirstPage = 1;
		HistoryCallBeforePage = Number(page) - 1 ;
		HistoryCallCurrentPage= Number(page);
		HistoryCallNextPage = Number(page)+1;
		console.log("HistoryCallNextPage"+HistoryCallNextPage);
		HistoryCallLastPage = total;
	}
	else if(page != 1 && page==total){   //当前显示不是第一页,是最后一页
		HistoryCallFirstPage=1;
		HistoryCallBeforePage= Number(page) - 1;
		HistoryCallCurrentPage = page;
		HistoryCallNextPage = total;
		HistoryCallLastPage = total;
	} 
	if(type == 'call')           //更新通话记录翻页
		refreshpagedowndiv();
	else if(type == 'chat')      //更新消息盒子翻页
		chatrefreshpagedowndiv();
	else if(type == 'meeting')   //更新会议翻页
		meetingrefreshpagedowndiv();
}

//更新通话记录翻页界面
var refreshpagedowndiv = function(){
	$('#historycall_currentpage').attr("value",HistoryCallCurrentPage);
	$('#historycall_totalpage').html(HistoryCallTotalPage);
	$('#historycall_firstpage').attr("onclick","requesthistorycallinfo('"+HistoryCallFirstPage+"')");
	$('#historycall_lastpage').attr("onclick","requesthistorycallinfo('"+HistoryCallLastPage+"')");
	$('#historycall_beforepage').attr("onclick","requesthistorycallinfo('"+HistoryCallBeforePage+"')");
	$('#historycall_nextpage').attr("onclick","requesthistorycallinfo('"+HistoryCallNextPage+"')");
}

//毫秒转 时 分 秒 eg: toTime(2600000)    2600000    -->  00:43:20
var milliSecondtoTime = function(milliSecond){
	var h=parseInt(milliSecond/(60*60*1000));
	var temp=milliSecond%(60*60*1000);
	var m=parseInt(temp/(60*1000));
	var s=parseInt((temp%(60*1000))/1000);
	return (h<10?"0"+h:h)+":"+(m<10?"0"+m:m)+":"+(s<10?"0"+s:s);
}


//格式化 日期  Data --> String
Date.prototype.Format = function(fmt)   
{ 
     var o = {   
        "M+" : this.getMonth()+1,                 
        "d+" : this.getDate(),                    
        "h+" : this.getHours(),                  
        "m+" : this.getMinutes(),                 
        "s+" : this.getSeconds()                  
     };   
     if(/(y+)/.test(fmt))   
          fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));   
     for(var k in o)   
         if(new RegExp("("+ k +")").test(fmt))   
              fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
     return fmt;   
}  


