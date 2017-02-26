//function sendmsg(remotename){
//        var div=$("<div class=\"chatunit\"></div>");
//        var h=$("<h4 class=\"chat-right green\">本人"+localname+"</h4>");
//        var p=$("<p class=\"chat-right\">hello world!hello world!</p>");
//        div.append(h);
//        div.append(p);
//        $("#chatarea").append(div);
//   }
var createRecordlistLi = function(contactlistDivId,userName){
	

	var contact = $(document.getElementById(contactlistDivId));
	
	var lielem = $('<li>').attr({
		'id' : RecordPrefix+userName,
		'class' : 'ui-item ui-ignore-space'
	}).click(function() {
		chooseContactDivClick(this);
	});
	var $avater = $("<div class='my-item-left' id='avater'> ");
	var $image =  $("<img src='images/boy.jpg'>");
	var $span = $("<span></span>");
	$avater.append($image);
	$avater.append($span);
	var $people = $("<div class = \" my-item-right \"></div>");			
	var $p1=$("<p class = \" ui-no-wrap\"><span class =\"ui-right ui-gray\"></span></p>");
	var $p2=$("<p class = \"ui-gray\"></p>");
	$people.append($p1);
	$people.append($p2);
	
	
	var MsgDivId = MessagePrefix+userName;
	var $href = $("<a href =\""+"#"+MsgDivId+"\" class=\"ui-link\" onclick = \"removeRedCounter\('"+RecordPrefix+userName+"'\)\">");
	
	$href.append($avater);
	$href.append($people);
	lielem.append($href);
	
	contact.append(lielem);
	
}

var createFriendInfoPage=function(friendname){
	
	if(true == judgeExist(InfoPrefix+friendname)){
		return;
	}
	
    console.log("start");
    var page=$("<div data-role=\"page\" id="+InfoPrefix+friendname+">");
    var top_bar=$("<div class=\"ui-top-bar\"></div>");
    var js_active=$(" <div class=\"js-active\"></div>");
    var title_left=$("<div class=\"title-left floatleft\"></div>");
    var title_p=$("<p class=\"titlep inline-block position\">");
    var title_a=$("<a href=\"#friendhtml\"></a>");
    var span1=$("<span class=\"ion-ios-arrow-back  title-left-icon\"></span>");
    var span2 = $("<span class=\" title-left-p\">返回</span>");
    title_a.append(span1);
    title_a.append(span2);
    title_left.append(title_a);
    js_active.append(title_left);
    js_active.append(title_p);
    top_bar.append(js_active);

    var page_content=$("<div class=\"ui-page-content\"></div>");
    var infoposition=$("<div class=\"infoposition\"></div>");
    var img=$("<img src=\"images/default_avatar.jpg\">");
    var content_p=$("<p>"+friendname+"</p>");

    infoposition.append(img);
    infoposition.append(content_p);

    var funcposition=$("<div class=\"funcposition\"></div>");
    var btn_msg=$("<a onclick = \"createMsgPage\('"+friendname+"'\)\" href=\""+"#"+MessagePrefix+friendname+"\" ><input type=\"button\" value=\"消息\" /></a>");
    var btn_audio=$("<input type=\"button\" value=\"音频\" href=\"#audiohome\">");
    var btn_video=$("<input type=\"button\" value=\"视频\" href=\"#videohome\">");
    funcposition.append(btn_msg);
    funcposition.append(btn_audio);
    funcposition.append(btn_video);
    page_content.append(infoposition);
    page_content.append(funcposition);

    page.append(top_bar);
    page.append(page_content);

    console.log("end");
  
    var bodyHTML = $("body");
    bodyHTML.append(page);
}


var addRecordMsg = function(contactlistDivId,userName,data){
	
	var contactLi = $(document.getElementById(contactlistDivId));
	var $p1 = $(contactLi.find(".my-item-right").children("p")[0]);
	var $p2 = $(contactLi.find(".my-item-right").children("p")[1]);
	$p1.empty();
	$p2.empty();
	$Time = $("<span class =\"ui-right ui-gray\">"+getLoacalTimeString()+"</span>");	
	$p1.html(userName);
	$p1.append($Time);
	$p2.html(data);
}


var removeRedCounter = function(contactlistDivId){
	var contactLi = $(document.getElementById(contactlistDivId));
	var badgespan = $(contactLi).find(".ui-red-counter");
	badgespan.addClass("no-visible");
	badgespan.html("");
	
}

var judgeHasClass = function(divId,Class){
	var $divId = $(document.getElementById(divId));
	return $divId.hasClass(Class);
}

var judgeExist = function(divId){
	var test  = document.getElementById(divId);
	if(test){
		return true;
	}
	else{
		return false;
	}
}

var createMsgPage = function(contact){
	
	if(true == judgeExist(MessagePrefix+contact)){
		return;
	}
	var MsgDivId=MessagePrefix+contact;
	
	var $div = $("<div data-role=\"page\" id=\""+MsgDivId+"\" data-url =\""+MsgDivId+"\"></div>");
	var $top=$("<div class=\"ui-top-bar\"></div>");
	var $divjs = $("<div class=\"js-active\"></div>");
	var $div1 = $("<div class=\"title-left floatleft\"><a href=\"#msghome\"><span class=\"ion-ios-arrow-back  title-left-icon\"></span><span class=\" title-left-p\">消息</span></a></div>");
	var $p =  $("<p class=\"titlep inline-block\">"+contact+"</p>");
	var $div2 = $("<div class=\"title-right floatright\"><a href=\"#audiohome\"><span class=\"ion-mic-a title-right-icon \"></span></a><a href=\"#videohome\"><span class=\"ion-ios-videocam  title-right-icon\"></span></a></div>");   
	$divjs.append($div1);
	$divjs.append($p);
	$divjs.append($div2);
	$top.append($divjs);
	$div.append($top);
	var $content=$("<div class=\"ui-page-content\" id=\"chatarea\"></div>");
	var $foot =  $("<div class=\"ui-bottom-bar grey\" role=\"toolbar\"><input type=\"text\" class=\"bottominput\" id=\"msginput\"><button class=\"sendmsgbutton\" onclick=\"sendText('"+contact+"')\">发送</button></div>");
	
	$div.append($content);
	$div.append($foot);
	
	var $body = $("body");
	
	$body.append($div);
	
	console.log("createMsgPage finish!");
}

var addMessageMsg = function(MsgDivId,userName,data){
	
	var MsgPage = $(document.getElementById(MsgDivId));
	if (curUserId == userName) {
		//本端发出去的消息，放在右边;
		createOneMessageOnRight(MsgDivId,userName,data);
	} else {
		//对端发送来的消息,放在左边;
		createOneMessageOnLeft(MsgDivId,userName,data);
	}
}

var createOneMessageOnLeft = function(MsgDivId,userName,data){
	 
	var chatunit$ = $("<div class =\"chatunit\"></div>");
	var h4$ = $("<h4 class = \"chat-left orange\">"+userName+"</h4>");
	var p$ = $("<p class = \"chat-left\">"+data+"</p>");
	
	chatunit$.append(h4$);
	chatunit$.append(p$);
	
	var MsgPage = $(document.getElementById(MsgDivId));
	
	var chatarea$ = MsgPage.find("#chatarea");
	chatarea$.append(chatunit$);
	console.log("addMessage to MsgPage finish!");
}
var createOneMessageOnRight = function(MsgDivId,userName,data){
	var chatunit$ = $("<div class =\"chatunit\"></div>");
	var h4$ = $("<h4 class = \"chat-right green\">"+userName+"</h4>");
	var p$ = $("<p class = \"chat-right\">"+data+"</p>");
	
	chatunit$.append(h4$);
	chatunit$.append(p$);
	
	var MsgPage = $(document.getElementById(MsgDivId));
	
	var chatarea$ = MsgPage.find("#chatarea");
	chatarea$.append(chatunit$);
	console.log("addMessage to MsgPage finish!");
}

var createMeHome=function(myname){
	
	console.log("begin");
	
    var top_bar=$("#mehome .ui-top-bar");
    var js_active=$(" <div class=\"js-active\"></div>");
    var top_p=$("<p class=\"titlep\">我</p>");
    js_active.append(top_p);
    top_bar.append(js_active);

    var page_content=$("#mehome .ui-page-content"); 
    
    var infoposition=$("<div class=\"infoposition\"></div>");
    var img=$("<img src=\"images/default_avatar.jpg\">");
    var content_p=$("<p>"+myname+"</p>");

    infoposition.append(img);
    infoposition.append(content_p);


    var funcposition=$("<div class=\"funcposition\"></div>");   
    var btm_logout=$("<input type=\"button\" value=\"退出\" onclick=\"logout1()\">");

    funcposition.append(btm_logout);
    

    page_content.append(infoposition);
    page_content.append(funcposition);

    console.log("end");
}

var test = function(){
	console.log("aa");
}

$(document).ready(function(){
   $('#groupone > ul').hide();

//
//    $(".myloginimgleft").click(function()
//    { 
//        $(this).attr('src',$(this).attr('src')=='images/check_on.jpg'?'images/check_off.jpg':'images/check_on.jpg');
//    });
//    $(".myloginimgright").click(function()
//    { 
//        $(this).attr('src',$(this).attr('src')=='images/check_on.jpg'?'images/check_off.jpg':'images/check_on.jpg');
//    });

    $("#groupone #click").click(function(){
        $('#groupone #rightordown').toggleClass("ion-arrow-right-b");
      
        $('#groupone > ul').toggle();
    });
    
    
   
 

});