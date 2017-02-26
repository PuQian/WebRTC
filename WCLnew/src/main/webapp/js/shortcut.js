//快捷方式盒子的数量
var SHORTCUTBOX_NUM = 6;
//记录点击的快捷方式盒子
function writeShortIndexFn(index){
	$("#changedShortCut").val(index);
}
//读取刚刚点击的快捷方式盒子的序号
function readShortIndexFn(){
	return $("#changedShortCut").val();
}
//把快捷方式存储到cookie
function recordShortCutToCookie(index,emailId){
	var userId = $('.pub_banner').attr("userid");
	var shortCuts = $.cookie(userId);
	var shortCutList=[];
	//该用户还没有将快捷方式列表写入过cookie
	if(!shortCuts || shortCuts == ""){				
		for(var i=0; i< SHORTCUTBOX_NUM; i++){
			if(i == index){
				shortCutList[i] = emailId;
			}else{
				shortCutList[i] = 'null';
			}
		}
	}else{
		var shortCutList=shortCuts.split(",");
		shortCutList[index] = emailId;
	}
	shortCuts = shortCutList.join(",");
	//expires是过期时间，在这里是以 天 为单位的
	$.cookie(userId,shortCuts,{
		expires : 100000,
		path : "/"
	});
}
//从cookie中读取快捷方式列表
function getShortCutFromCookie(){
	var userId = $('.pub_banner').attr("userid");
	return $.cookie(userId);
}
//填充快捷方式盒子
function fillShortCutBox(emailAccountId, index){			
	if(emailAccountId && emailAccountId != "null"){
		//该盒子要填充有联系人的
		var friendInfo = emailAccountId.split("?");//emailId,accountId
		var fillShortCutHtml = "<div class=\"centeralign\"><img src=\"images/member.png\" /></div><div class=\"centeralign greyletter\">"+ friendInfo[0] +
							"<a class=\"blueletter rightfloat\" href=\"javascript:void(0)\" onclick=\"deleteShortCutFn('"+ index +"')\">移除</a></div>"+
							"<div class=\"centeralign padding5\"><a href=\"javascript:void(0)\" onclick=\"startFriendDialog('"+ friendInfo[1] +"',"+ undefined +")\"  class=\"button\">发起会话</a>"+
							"<a href=\"basic/_editFriendInfo.jsp\" onclick=\"writeIntoMark('"+ friendInfo[0] +"')\" rel=\"facebox\" size=\"s\" title=\"编辑信息\" class=\"button\">编辑信息</a></div>";					
		$("#shortCut"+index).html(fillShortCutHtml);
	}else{
		//该盒子是空的
		var fillShortCutHtml = "<a class=\"blueletter\" href=\"basic/_addShortCut.jsp\" rel=\"facebox\" title=\"添加快捷方式\" size=\"s\" onclick=\"writeShortIndexFn('"+index+"')\"><img src=\"images/shortcut.png\" /></a>";
		$("#shortCut"+index).html(fillShortCutHtml);
	}
	$('a[rel=facebox]').facebox();
}
//“添加快捷方式”浮层的确定按钮
function checkBeforeAddShortCutFn(){
	var checkedObj = $("input[name=addShortCut]:checked");   
	var checkResult = checkedObj.val();
	var accountId = checkedObj.attr("id").replace("shortCut","");
	
	var index = readShortIndexFn();
	//将该记录写入到cookie中
	recordShortCutToCookie(index,checkResult+"?"+accountId);
	//填充快捷方式盒子
	fillShortCutBox(checkResult+"?"+accountId, index);   			
	cancelFaceboxFn();
	fillTipBox('success','添加快捷方式成功');
}
//删除快捷方式盒子
function deleteShortCutFn(index){
	if(confirm("确定删除该快捷方式吗？")){
		fillShortCutBox('null', index);
		recordShortCutToCookie(index,'null');
		fillTipBox('success','删除快捷方式成功');
	}			
}
function showShortCutBox(){			
	var shortCut = getShortCutFromCookie();
	if(shortCut){
		var shortCutList = shortCut.split(",");
		for(var i=0; i<SHORTCUTBOX_NUM; i++){
			fillShortCutBox(shortCutList[i], i);
		}				
	}else{
		for(var i=0; i<SHORTCUTBOX_NUM; i++){
			fillShortCutBox('null', i);
		}
	}
}
$(document).ready(function(){
	var shortCutTableHtml="";
	
	for(var i=0; i<SHORTCUTBOX_NUM; i++){
		var fillShortCutHtml = "<a class=\"blueletter\" href=\"basic/_addShortCut.jsp\" rel=\"facebox\" title=\"添加快捷方式\" size=\"s\" onclick=\"writeShortIndexFn('"+i+"')\"><img src=\"images/shortcut.png\" /></a>";
		shortCutTableHtml += "<div class=\"dottedbox padding10 leftfloat leftmargin_20 rightmargin_20 topmargin_20 centeralign\" id=\"shortCut"+ i +"\" style=\"width:220px;height:220px\">"+ fillShortCutHtml +"</div>";
	}
	$("#shortCutTable").html(shortCutTableHtml);
	//显示快捷方式列表
	showShortCutBox();
	
})