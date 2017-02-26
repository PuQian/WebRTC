//修改Web显示内容
var showWeb = function(Prefix,label){
	console.log("showWeb--prefix:"+Prefix+"-label:"+label);
	if(globalCur != null)
	{
		document.getElementById(globalCur).setAttribute("style","display:none;");
	}
	
	document.getElementById(Prefix + label).setAttribute("style","display:block;");
	globalCur=Prefix + label;
};

// 返回活动会话列表id
var getActiveList = function(chatFriendId,type) {
	return document.getElementById(chatFriendId + type + "activelist");
};

//挂断视频，deleteSelectedlabel触发
var closeContactVideoDivList = function(chatFriendId) {
	var contentDiv = getContactVideoDiv(chatFriendId);
    console.log("同时关闭功能区视频界面和活动会话");
	contentDiv.remove();
	
	var listDiv=getActiveList(chatFriendId,CallVideoPrefix);
	listDiv.remove();
	//globalCur=null;
};

//挂断音频，deleteSelectedlabel触发
var closeContactAudioDivList = function(chatFriendId) {
	var contentDiv = getContactAudioDiv(chatFriendId);
    console.log("同时关闭功能区音频界面和活动会话");
	contentDiv.remove();
	
	var listDiv=getActiveList(chatFriendId,CallAudioPrefix);
	listDiv.remove();
	//globalCur=null;
};

//创建活动会话列表标签
var createActiveList = function(chatFriendId,type) {

	//ActiveList命名规则：chatFriendID(webrtc1@163.com) + type +"activelist"
	var ActivelistDiv = getActiveList(chatFriendId,type);
	
	if (ActivelistDiv == null) { // 没有该项Activelist，则新建
		console.log("新建activelist:" + chatFriendId + type +"activeList");
		if(type == MessagePrefix)
		{
			ActivelistDiv = $("<li num = '0'><div class='list_portrait'>"+
					  "<img src='css/pc/images/img/portrait65_2.jpg' /></div>" +
					  "<a onclick='chooseShowDivType(\"" 
			          + chatFriendId + "\",\"" + type + "\");'>聊天 " + chatFriendId + "</a><i class='num' style='display:none;'></i></li>");
			ActivelistDiv.attr("id", chatFriendId + type + "activelist");
		}
		else if(type == CallVideoPrefix)
		{
			ActivelistDiv = $("<li num = '0'><div class='list_portrait'>"+
					  "<img src='css/pc/images/img/portrait65_3.jpg' /></div>" +
					  "<a onclick='chooseShowMedia(\"" 
					  + chatFriendId + "\",\"" + type + "\");'>视频 " + chatFriendId + "</a><i class='num' style='display:none;'></i></li>");
			ActivelistDiv.attr("id", chatFriendId + type + "activelist");
			ActivelistDiv.hide();
		}
		else if(type == CallAudioPrefix)
		{
			ActivelistDiv = $("<li num = '0'><div class='list_portrait'>"+
					  "<img src='css/pc/images/img/portrait65_1.jpg' /></div>" +
					  "<a onclick='chooseShowMedia(\"" 
			          + chatFriendId + "\",\"" + type + "\");'>音频 " + chatFriendId + "</a><i class='num' style='display:none;'></i></li>");
			ActivelistDiv.attr("id", chatFriendId + type + "activelist");
			ActivelistDiv.hide();
		}


		$("#ActiveList").append(ActivelistDiv);
		console.log("新建activelist:" + chatFriendId + type +"activeList完成");
	}
};

//活动会话列表选择显示功能区
//FriendId:webrtc1@163.com
//FriendId:group1+32135243213216543213(GroupId)
var chooseShowDivType = function(FriendId,type){

	//转换布局
	turnContainerToCenter2();
	
	/**add by yck
	 * 减去消息数量
	 */
	subNumInHeadTips(FriendId,type); //顶部减去sub
	clearNumInActiveListItem(FriendId, type);//自身清空不显示

	if(globalCur!=null) //活动会话列表选择显示隐藏聊天界面 
	{
		$(document.getElementById(globalCur)).hide(); //隐藏之前显示的窗口
	}
	
	//若是消息 && 该用户正处于clients（等待服务的用户）中
	if(type == MessagePrefix && clients.indexOf(FriendId) >= 0)
	{
		selectArtiUser(getFinishElementA(FriendId)); //选中访问用户，以便服务完成后点击“完成”
	}
	
	$(document.getElementById(type + FriendId)).show();
	globalCur=type + FriendId;
	
	
	toggleListMenu("rtc_menu","recent_calls",getActiveList(FriendId,type));//高亮最近联系人列表
};

//活动会话列表选择显示隐藏视频音频界面
var chooseShowMedia = function(FriendId,type){
	console.log("====count"+count);
	if($(document.getElementById(type + FriendId)).css("z-index") >= 200){//隐藏界面
		 console.log("pq----z-index:"+$(document.getElementById(type + FriendId)).css("z-index"));
		 $(document.getElementById(type + FriendId)).css({'z-index':199});
		 $(document.getElementById(type + FriendId)).hide();
	}
	else{//显示界面
		$(document.getElementById(type + FriendId)).css({'z-index':count++});
		$(document.getElementById(type + FriendId)).show();
	}
	
	toggleListMenu("rtc_menu","recent_calls",document.getElementById(FriendId+type+"activelist"));//高亮最近联系人列表
}

/**
 * add by yck
 */

/**
 * 左侧消息数量相关
 */
//左侧活动会话列表friendId那项右边的红色消息数量+1
var incNumInActiveListItem = function(chatFriendId,type)
{
	var activeListItem= getActiveList(chatFriendId,type); //取活动列表项dom元素
	var num = getNumInActiveListItem(activeListItem); //获取数量
	updateNumInActiveListItem(activeListItem,num+1); //设置新数量
};

var clearNumInActiveListItem = function(chatFriendId,type)
{
	var activeListItem= getActiveList(chatFriendId,type); //取活动列表项dom元素
	updateNumInActiveListItem(activeListItem,0);
};

//获取左侧活动会话列表friendId项当前的消息数量
var getNumInActiveListItem = function(activeListItem)
{
	//activeListItem是li
	num = $(activeListItem).attr("num");
	return parseInt(num);
};

//设置左侧活动会话列表friendId项当前的消息数量为num
var updateNumInActiveListItem = function(activeListItem,num)
{
	item_i = $(activeListItem).children("i");
	if(num <= 0)
	{
		item_i.hide(); //隐藏红色消息
		num = 0;
	}
	else if(num >= 100)
	{
		item_i.show(); //隐藏红色消息
		$(activeListItem).children(".num").text("..."); //界面上显示数量
	}
	else
	{
		item_i.show(); //隐藏红色消息
		$(activeListItem).children(".num").text(num); //界面上显示数量	
	}
	
	$(activeListItem).attr("num",num); //隐藏在li中的消息数量更新为num
};
