
//查找好友
function searchFriendFn(friendId){
	var friendId = trim($("#"+friendId).val());	
	//搜索的内容不为空
	if(friendId != ""){
		$("#searchFriend").attr('disabled',true);
		$("#searchFriend").attr('value','...');
		$("#noSearchResult div").attr('class','centeralign middleveralign lightgreyletter ');
		$("#noSearchResultTip").html("搜索中...");
		com.xmpp.searchFriendsOnServer(friendId);
	}
}
//设置添加好友的选择列表的整行为全选
function makeItSelectedFn(selected,name){
	$("input[name="+ name +"]").removeAttr("checked");
	$("#"+selected).attr("checked",true);
}
//取消添加好友的选择列表的radio的冒泡
function stopBubble(e) {
    if (e && e.stopPropagation)
        e.stopPropagation();
    else
        window.event.cancelBubble=true;
}
//添加好友前的检测
function checkBeforeAddFriendFn(){
	var boxclass = $("#addGroupDiv").attr("class");
	//新建群组现在是展开状态
	if(boxclass.indexOf("hidden") == -1){
		if(!confirm("群组的创建还没有完成，是否舍弃群组的创建？")){
			return false;
		}		
	}
	var checkObj = $("input[name=searchFriendList]:checked");
	var checkResult = checkObj.val();
	if( checkResult ){
		var username = $('.pub_banner').attr("user");
		if(-1 != username.indexOf(checkResult)){
			$("#addFriendTip").html('不能添加自己为好友哦，请重新选择。');
			return false;
		}else{
			var isMyFriend = com.xmpp.isFriendInRoster(checkResult);
			//是否已经在我的好友列表中
			if(isMyFriend){
				$("#addFriendTip").html('该用户已在您的好友列表中了，请选择其他好友。');
				return false;
			}else{
				//分别获取好友id和所选择的群组
				var friendId = checkResult;			
				var selectGroup = $("#groupListId").val();		
				var friend_info={
						'email_id':friendId,
						'name':'',
						'group':selectGroup
				};
				console.log("friend_info.name="+friend_info.name);
				com.xmpp.addFriend(friend_info); //自带刷新列表
				cancelFaceboxFn();
				fillTipBox('success','已发送了好友申请，待对方确认');
			}
		}		
	}else{
		$("#addFriendTip").html('您还没有选择要添加的好友。');
		return false;
	}
}

//添加好友时,点击“新建群组”
function addGroupFn(){
	$("#groupNameTip").html("");
	$("#groupName").val("");
	
	var boxclass = $("#addGroupDiv").attr("class");
	//现在是隐藏状态
	if(boxclass.indexOf("hidden") != -1){
		$("#addGroupDiv").attr("class","yellowbox padding5 ");
	}else{
		$("#addGroupDiv").attr("class","hidden");
	}
}
//关闭“新建群组”的区域
function cancelAddGroupFn(){
	$("#addGroupDiv").attr("class","hidden");
}
//添加群组前的检测
function checkBeforeAddGroupFn(){
	var checkResult = checkGroupIdFn('groupName','groupNameTip');
	if(checkResult){
		var groupName = $("#groupName").val();			
		var isExist=false;
		//com.xmpp.subscribeFriend(friendId, 'Qie Pei');
		$("#groupListId option").each(function(){
			if($(this).attr("value") == groupName){
				isExist=true;
			}
		})
		//现在的select中没有该群组，就把它添加上，然后设置为选中；若有，就直接设置为选中
		if(!isExist){	
			$("#groupListId").append("<option value='"+groupName+"'>"+groupName+"</option>");		
		}else{
			fillTipBox("success","该群组已存在");
		}
		$("#groupListId").val(groupName);
		cancelAddGroupFn();
	}else{
		return checkResult;
	}
}
//检测添加群组的合法性
function checkGroupIdFn(checkId,tipId){
	return checkNullIllegal(checkId,tipId);
}
//好友申请
//判断是否还有其他好友申请
function judgeOtherApplyFn(email_id){
	var matchStr = ","+email_id;
	var applyFriendRemain = $("#applyFriendId").val().replace(new RegExp(matchStr,"g"),"");
	$("#applyFriendId").val(applyFriendRemain);

	if(applyFriendRemain != ""){
		$("#applyfriendhref").click();
	}else{
		cancelFaceboxFn();
	}
}
//接受好友申请
function acceptApplyFriendFn(){
	var boxclass = $("#addGroupDiv").attr("class");
	//新建群组现在是展开状态
	if(boxclass.indexOf("hidden") == -1){
		if(!confirm("群组的创建还没有完成，是否舍弃群组的创建？")){
			return false;
		}		
	}
	var email_id = $("#showApply").html();
	//同意对方添加自己为好友
	com.xmpp.approveSubscribeById(email_id);
	
	//分别获取好友id和所选择的群组		
	var selectGroup = $("#groupListId").val();		
	var friend_info={
			'email_id':email_id,
			'name':'',
			'group':selectGroup
	};
	console.log("friend_info.name="+friend_info.name);
	com.xmpp.approveAddFriend(friend_info); //自带刷新列表	
	judgeOtherApplyFn(email_id);
}
//拒绝好友申请
function refuseApplyFriendFn(){
	var email_id = $("#showApply").html();
	com.xmpp.denySubscribeById(email_id);
	judgeOtherApplyFn(email_id);
}

//删除packetFilter插件中从sourceId到destinationId的规则
function deletePacketFilterRule(sourceId, destinationId, success) {
	
    	//send http request
    	var sendMethod = "GET";
    	//var url = "http://majiao:9090/plugins/packetfilter/delete-rule-by-name.jsp";
    	
    	var url = com.urls[1] + "/plugins/packetfilter/delete-rule-by-name.jsp";
    	var source = sourceId;
    	var destination = destinationId;
       	//var destination = com.user.getBareJid();
    	var params = "source="+source+"&destination="+destination;
        
    	var reg0 = new RegExp('#','g');
    	var reg1 = new RegExp('@','g');
    	params = params.replace(reg0, escape('#'));
    	params = params.replace(reg1, encodeURIComponent('@'));
    	//alert("url is " + url + "?" + params);
    	
    //com.urls[1] what is this mean?	
   // 	com.http.sendHttpRequ(sendMethod,url + "?" + params,"no",success);
}

//删除好友
function deleteFriendFn(friendId){
	if( friendId && friendId!="" && confirm("是否确认删除该好友？") ){
		var groupName = com.roster.getFriendGroup(friendId);
	    var user = com.user.getBareJid();
	    var destination = com.util.emailToJid(friendId);
	    
	    if(groupName == "黑名单"){
	    	deletePacketFilterRule(destination, user);
	    	deletePacketFilterRule(user, destination);
	    }else{
	    	deletePacketFilterRule(user, destination);
	    }
		//调用删除好友的接口
		com.xmpp.deleteFriend(friendId);//自带刷新列表
		fillTipBox('success','删除好友成功');
	}
}
//发起会话
function startFriendDialog(id,avatar){
	var obj={};
	console.log(id);
	if(!avatar || avatar == "" || avatar == "undefined"){
		obj = {"id" : id,"avatar" : undefined,"name" : userIdToEmail(id)};
	}else{
		obj = {"id" : id,"avatar" : avatar,"name" : userIdToEmail(id)};
	}	
	if(obj.name == undefined){
         
		fillTipBox('error','抱歉，此好友不是webrtc用户，无法发起会话！');
		
	}else{
		$("#myfriendgb").click();//跳到好友列表
		$('#'+id).dblclick();		
		createDialogDiv(obj, true);
	}
}

//发起视频共享

function startScreenShare(id,avatar){
	var obj={};
	console.log(id);
	if(!avatar || avatar == "" || avatar == "undefined"){
		obj = {"id" : id,"avatar" : undefined,"name" : userIdToEmail(id)};
	}else{
		obj = {"id" : id,"avatar" : avatar,"name" : userIdToEmail(id)};
	}	
	if(obj.name == undefined){
         
		fillTipBox('error','抱歉，此好友不是webrtc用户，无法发起屏幕共享！');
		
	}else{
//		$("#myfriendgb").click();//跳到好友利润表
// 		$('#'+id).dblclick();		
		createScreenshareDiv(obj, true);
	}

}



//将好友移动至黑名单
function moveToBlackList(userName){
	//alert('将好友 ' + userName +'移至黑名单');
	if(confirm('将好友 ' + userName +'移至黑名单')!=true) {
		return;
	}
	var friend_info={
			'email_id':userName,
			'name':'',
			'group':'黑名单'
	};
	console.log("friend_info.name="+friend_info.name);
	com.xmpp.moveFriendToOtherGroup(userName,friend_info.group);
	
	//send http request
	var sendMethod = "GET";
	//var url = "http://majiao:9090/plugins/packetfilter/rule-form.jsp";
	
	var url = com.urls[1] + "/plugins/packetfilter/rule-form.jsp";
	var packetAction= "Drop";
	var packetType = "Any";	
	var source = "User";
	var sourceOtherJID = "";
	var sourceUserJID = com.util.emailToJid(friend_info.email_id);
	var sourceDomain = com.domain.calculateDomain(friend_info.email_id);
	var sourceComponentJID = "proxy."+ sourceDomain;
	var destination = "User";
	
	var destOtherJID = "";	
	var destComponentJID = "proxy." + com.user.domain;
	var destUserJID = com.user.getBareJid();
	var description ="";
	var create = "Create+Rule";
	var params = "packetAction="+packetAction+"&packetType="+packetType+"&source="+source+"&sourceOtherJID="+sourceOtherJID+"&sourceUserJID="+sourceUserJID+"&sourceComponentJID="+sourceComponentJID+"&destination="+destination+"&destComponentJID="+destComponentJID+"&destOtherJID="+destOtherJID+"&destUserJID="+destUserJID+"&description="+description+"&create="+create;
    
	var reg0 = new RegExp('#','g');
	var reg1 = new RegExp('@','g');
	params = params.replace(reg0, escape('#'));
	params = params.replace(reg1, encodeURIComponent('@'));
	//alert("url is " + url + "?" + params);
	
	
	com.http.sendHttpRequ(sendMethod,url + "?" + params,"no", function(bSuccess) {
		if(bSuccess) {
			alert("成功将好友移至黑名单");
		} else {
			alert("将好友移至黑名单失败:(");
		}
	});
		
}
//通讯录页面发起webrtc会话
function contactStartFriendDialog(id,avatar){
	//$("#myfriendgb").click(); //121mod
	startFriendDialog(id,avatar);
}
//获取单个好友的信息
function getItemInfoFriend(email_id){
	//获取好友列表，以Array(Object)的方式返回，Object包含email_id，name和group属性
	var item_list = com.xmpp.getRoster();
	//遍历好友列表，如果找到了，就返回该好友的object，若没有找到，返回undefined
	for(var i=0; i<item_list.length; i++){
		if(item_list[i].email_id == email_id){
			return item_list[i];
		}
	}
	return undefined;
}
//编辑好友信息
function editFriendInfo(){
	var boxclass = $("#addGroupDiv").attr("class");
	//新建群组现在是展开状态
	if(boxclass.indexOf("hidden") == -1){
		if(!confirm("群组的创建还没有完成，是否舍弃群组的创建？")){
			return false;
		}		
	}
	//获得要编辑的好友的id
	var editFriendId=readFromMark();
	//获取该好友的个人信息
	var itemInfo = getItemInfoFriend(editFriendId);
	
	var newGroup = $("#groupListId").val();
	//群组没有改
	if(itemInfo.group == newGroup){
		cancelFaceboxFn();
	}else{
		com.xmpp.moveFriendToOtherGroup(itemInfo.email_id, newGroup);//自带刷新列表
		cancelFaceboxFn();
		fillTipBox('success','编辑好友信息成功');
	}
}
//通过分组名称删除分组，分组中原先的好友全部移动到根组
function deleteGroupFn(groupName){
	if( groupName && groupName!="" && confirm("是否确认删除该群组？") ){
		//调用删除好友的接口
		com.xmpp.deleteGroupByName(groupName);
		fillTipBox('success','删除群组成功');
	}
}
//编辑修改群组信息
function editGroupInfoFn(){
	var checkStatus = checkNullIllegal('editGroupName','groupNameTip');
	if(checkStatus){
		//获取当前点击的群组信息
		var editGroupId=readFromMark();
		
		var newGroupName = $("#editGroupName").val();
		//群组名字没有做修改
		if(editGroupId == newGroupName){			
			cancelFaceboxFn();
			fillTipBox('success','群组名字没有做修改');
		}else{
			var isExist = com.xmpp.isGroupExist(newGroupName);
			if(isExist){
				//fillTipBox('error','该群组名字已存在');
				$("#groupNameTip").html("该群组名字已存在，请重新输入");
			}else{
				//调用重命名接口
				com.xmpp.renameGroup(editGroupId,newGroupName);
				cancelFaceboxFn();
				fillTipBox('success','群组名字修改成功');
			}
			
		}		
	}else{
		return false;
	}
}


