/*
 * element.js	: load some UI elements
 * author		: lmqt(lmqt890930@163.com)
 * last_modify	: 2012-5-7 by lmqt(lmqt890930@163.com)
 */
function loadTabs(){
	if($(".tabcontainer").length > 0) {
		$(".tabcontainer>ul").addClass("tabs");
		var linebottom = '<div class="linebottom"></div>';
		$(".tabcontainer").each(function(i){
			if($(this).attr("type")!="asy"){
				$(this).children(".tabdiv:first").addClass("current");
				$(this).children("ul:first").children("li:first").addClass("current");
				$(this).children(".tabdiv").each(function(i){
					$(this).addClass("tabdiv_"+i);
				});
				$(this).children("ul:first").children("li").each(function(i){
					$(this).click(function(){
						$(this).parent("ul").siblings(".current").removeClass("current").hide();
						$(this).parent("ul").siblings(".tabdiv_" + i).addClass("current").show();
						var height = tabsHeight + $(this).parent("ul").siblings(".tabdiv_" + i).height()+ 25;
						$(this).parent("ul").parent(".tabcontainer").css({"height":height+"px"});
						var width = $(this).parent("ul").parent(".tabcontainer").width()-25;
						$(this).parent("ul").siblings(".tabdiv_" + i).css({"width":width+"px"});
					});
				});
			}
			var tabsHeight = $(this).children(".tabs").height();
			var height = tabsHeight + $(this).children("div.current").height()+ 25;
			var width = $(this).width() - 25;
			$(this).css({"height":height+"px"});
			$(this).children("div.current").css({"width":width+"px"});
			$(this).children(".tabdiv").hide();
			$(this).children("div.current").show();
			$(this).children("ul:first").after(linebottom);
			$(this).children("ul:first").children("li").each(function(i){
				$(this).click(function(){
					$(this).siblings(".current").removeClass("current");
					$(this).addClass("current");				
				});
			});
			
		});
	}
}

function loadDataTable(){
	if($(".datatable").length > 0) {
		$(".datatable").each(function(i){
			if(!$(this).find("tr:first").hasClass("tabletitle")){
				$(this).attr("cellspacing", "0");
				$(this).attr("cellpadding", "0");
				$(this).find("tr:first").addClass("tabletitle");
				$(this).find("tr:not(.tabletitle)").addClass("tablevalue");
				$(this).find("tr:nth-child(even)").addClass("odd");
			}
		});
	}
}

function loadFormTable(){
	if($(".formtable").length > 0) {
		$(".formtable").each(function(i){
			if(!$(this).find("td:first").hasClass("formlabel")){
				$(this).attr("cellspacing", "0");
				$(this).attr("cellpadding", "0");
				$(this).find("tr").each(function(){
					$(this).find("td:first").addClass("formlabel");
					$(this).find("td:nth-child(2)").addClass("formcontent");
					$(this).find("td:nth-child(3)").addClass("formfunction");
				});
			}
		});
		$(".formtable").each(function(i){
			var text = $.trim($(this).find(".formlabel").text());
			if(text.length == 0){
				var only = true;
				var max = 10;
				$(this).find(".formlabel").each(function(){
					if($(this).find("img").length <= 1){
						only = true;
						max = $(this).find("img").width()>max ? $(this).find("img").width() : max;
					}else{
						only = false;
					}
				});
				if(only){
					$(this).find(".formlabel").css({'width':max+'px', 'padding':'0 5px'});
				}
			}
		});
	}
}

function loadBigBlueButton(){
	$(".bigbluebutton").each(function(){
		var divheight=$(this).height();
		var imgeheight=$(this).children("img").height();
		if(imgeheight>divheight){
			$(this).children("img").height(divheight);
		}else{
			$(this).children("img").css("padding-top", Math.round((divheight-imgeheight)/2)+"px");
			$(this).children("img").css("padding-bottom", Math.round((divheight-imgeheight)/2)+"px");
		}
	});
}

function loadImgLink(){
	$(".imglink").each(function(){
		var divheight=$(this).height();
		var imgeheight=$(this).children("img").height();
		if(imgeheight>divheight){
			$(this).children("img").height(divheight);
		}else{
			$(this).children("img").css("padding-top", Math.round((divheight-imgeheight)/2)+"px");
			$(this).children("img").css("padding-bottom", Math.round((divheight-imgeheight)/2)+"px");
		}
	});
}

function loadItemTable(){
	$(".itemtable").each(function(){
		if(!$(this).find("tr:first").hasClass("tabletitle")){
			$(this).attr("cellspacing", "0");
			$(this).attr("cellpadding", "0");
			$(this).find("tr:first").addClass("tabletitle");
		}
	});
}

function loadList(){
	$(".list").each(function(){
		var lineodd = '<div class="lineout odd"></div>';
		var lineeven = '<div class="lineout even"></div>';
		$(this).children("div").addClass("linein");
		$(this).children("div:nth-child(odd)").wrap(lineodd);
		$(this).children("div:nth-child(even)").wrap(lineeven);
		$(this).removeClass("list").addClass("listready");
	});
}

function loadListTitle(){
	var img = '';
	$(".listtitle").each(function(){
		$(this).removeClass("listtitle").addClass("listtitleready");
		img = $(this).attr("bg");
		if(img != undefined){
			$(this).prepend("<img src='"+img+"' class='title' />");
		}
		$(this).append("<div class='clear'></div>");
	});
}

function loadDottedBox(){
	$(".dottedbox").each(function(){
		var bg = $(this).attr("bg");
		if(bg != undefined){
			$(this).css({"background-image":"url("+bg+")"});
			$(this).css({"background-position":"right top"});
			$(this).css({"background-repeat":"no-repeat"});
		}
	});
}

function loadPubBanner(){
	if($(".pub_banner").attr("class") != undefined && $(".pub_banner").html().length < 5){
		var user = $(".pub_banner").attr("user");
		var sys = $(".pub_banner").attr("sys");
		var acctoken = $(".pub_banner").attr("acctoken");
		var index = $(".pub_banner").attr("index");
		var handleUrl = $(".pub_banner").attr("handleurl");
		var subuser = user;
		var userId = $(".pub_banner").attr("userid");
		if(user.length>20){
			subuser = user.substr(0, 17)+"...";
		}
		$.ajax({  
	        url:bannerAddr+"banner.jsp?callback=?",  
	        type:"get",
	        dataType:"jsonp",  
	        data:{'user':user,'sys':sys,'subuser':subuser,'acctoken':acctoken, 'index':index},  
	        jsonp:"jsonp_callback",  
	        success:function(result) {  
	            $(".pub_banner").html(result[0].html);
	            $.getScript(bannerAddr+"pub_banner.js");
	            $.getScript(msgAddr+"js/api/quickcommunication.js");
	            if(sys.length > 0){
	            	if(sys == "shareinfornews"){
	            		$(".pub_banner #sharein").removeAttr("href");
	            		$(".pub_banner #sharecom").removeAttr("target");
	            		$.getScript(msgAddr+"js/api/newMsgBox.js");
	            	}else if(sys == "sharecomfornews"){
	            		$(".pub_banner #sharein").removeAttr("target");
	            		$(".pub_banner #sharecom").removeAttr("href");
	            		$.getScript(msgAddr+"js/api/newMsgBox.js");
	            	}else if(sys == "sharecom"){
	            		$(".pub_banner #sharecom").removeAttr("href");
	            		$(".pub_banner #sharein").removeAttr("target");
	            	}else if(sys == "sharein" ){
	            		$(".pub_banner #sharecom").removeAttr("target");
	            		$(".pub_banner #sharein").removeAttr("href");
	            	}else if (sys == "yhapp"){
	            		$(".pub_banner #yhapp").removeAttr("href");
	            		$(".pub_banner #yhvm").removeAttr("target");
	            	}else if (sys == "yhvm"){
	            		$(".pub_banner #yhapp").removeAttr("target");
	            		$(".pub_banner #yhvm").removeAttr("href");
	            	}else{
	            		$(".pub_banner #"+sys).removeAttr("href");
	            	}
	            }
	            
	            if($("#bannerlogin").length > 0){
	            	var href = $("#bannerlogin").attr("href");
	            	var more = "&handleUrl=" + handleUrl + "&redirectUrl=" + location.href;
	            	$("#bannerlogin").attr("href", href+more);
	            }
	            if(user != undefined && user.length > 0){
	            	checkUserName(userId);
	            }
	        }
	    });
	}
}

function checkUserName(userId){
	$(".pub_banner").after("<div id=\"box\"></div>");
	$.ajax({  
        url:userInfoAddr+"users/checkBasicUserInfo?callback=?&uid="+userId,  
        type:"get",
        dataType:"json",  
        success:function(result) {
        	if(result == "no" ){
        		var mytip = {
    				title:"您的个人信息尚未完善",
    				content:"请进入账号设置中心完善您的个人信息（昵称和头像）。",
    				formore:"立即去设置",
    				url:userInfoAddr + "users/",
    				formore1:"知道了",
    				/*url1:userInfoAddr + "users/DefaultUserInfo"*/
    				url1:"javascript:setDefaultUserInfo('"+userId+"')",
        		};
        		$("#box").css({"position":"fixed", "top":"25px"});
        		$("#box").tipbox(mytip);
        	}else if( result == "nopwd" ){
        		var mytip = {
        				title:"您的密码过于简单",
        				content:"您的密码过于简单，请进入账号设置中心修改密码。",
        				formore:"账号设置",
        				url:userInfoAddr + "users/psw.jsp"
        		};
        		$("#box").css({"position":"fixed", "top":"25px"});
        		$("#box").tipbox(mytip);
        	}
        }
    });
}

function loadScrollToTop(){
	if($("#backtop").attr("id")!="backtop"){
		$("body").append("<p id=\"backtop\"><a href=\"javascript:void(0)\"><span></span>回到顶部</a></p>");
	}
	$("#backtop").hide();
	$(function () {
		$(window).scroll(function () {
			if ($(this).scrollTop() > 200) {
				$('#backtop').fadeIn();
			} else {
				$('#backtop').fadeOut();
			}
		});
		$('#backtop a').click(function () {
			$('body,html').animate({
				scrollTop: 0
			}, 800);
			return false;
		});
	});
}

function loadScrollToBottom(){
	if($("#backbottom").attr("id")!="backbottom"){
		$("body").append("<p id=\"backbottom\"><a href=\"javascript:void(0)\"><span></span>前往底部</a></p>");
	}
	$("#backbottom").show();
	if($(document).height() == $(window).height()){
		$("#backbottom").hide();
	}
	$(function () {
		$(window).scroll(function () {
			if ($(this).scrollTop() < $(document).height()-$(window).height()-200) {
				$('#backbottom').fadeIn();
			} else {
				$('#backbottom').fadeOut();
			}
		});
		$('#backbottom a').click(function () {
			$('body,html').animate({
				scrollTop: $(document).height() 
			}, 800);
			return false;
		});
	});
}

function loadBanner(){
	var pub_bannerTop = 0;
	if($(".pub_banner").length > 0){
		$(".pub_banner").css("position","fixed").css("top","0").css("right","0").css("left","0").css("z-index","1001");
		pub_bannerTop = $(".pub_banner").height();
		if($("#inner").length > 0){
			$("#inner").css("padding-top", pub_bannerTop);
		}
	}
	if($(".banner").length > 0){
		$(".banner").css("position","fixed").css("top",pub_bannerTop).css("right","0").css("left","0").css("z-index","999");
		var bannerTop = $(".banner").height();
		if($("#inner").length > 0){
			//var paddingTop = parseInt($("#inner").css("padding-top"));
			$("#inner").css("padding-top", bannerTop + pub_bannerTop);
		}
	}
}

function loadLeft(){
	if( $(".left dd").length > 0 ){
		var dt = $(".left dd").prev("dt");
		$(".left dd.close").css({"display":"none"});
		dt.each(function(){
			$(this).click(function(){
				var next = $(this).next("dd");
				$(next).animate({height: 'toggle', opacity: 'toggle'}, 300);
			});
		});
	}
}

function loadElement(){
	loadTabs();
	loadDataTable();
	loadFormTable();
	loadItemTable();
	loadList();
	loadListTitle();
	loadDottedBox();
	loadBigBlueButton();
	loadImgLink();
	loadScrollToTop();
	loadScrollToBottom();
	loadBanner();
	loadLeft();
}

function setDefaultUserInfo(userId){
	$.ajax({  
        url:userInfoAddr+"users/DefaultUserInfo?callback=?&uid="+userId,  
        type:"get",
        dataType:"json", 
        success:function(result) {
        	$('#box').attr('class','hidden');
        }
    });
}

//var path = "http://fat.free4lab.com/_.gif?log=";
////var path = "http://localhost:8081/web-agent/log?log=";
//function timing(){
//	var timingObj = new Object();
//	if(!window.performance){
//	    //performance api , (Date : 2011-11),  ie9+(包括兼容模式), chrome11+, Firefox7+ . (Safari,Opera. 没有实现) 
//        return;
//    }
//	timingObj.timing = JSON.stringify(performance.timing);
//	if(timingObj.timing.length < 1 ){
//		return;
//	}
//	
//	var host = document.location.host;
//	if(host.length > 40){
//		return;
//	}
//	timingObj.domain = host;
//	timingObj.path = document.location.href.substring(timingObj.domain.length+7);
//  
//	var data = JSON.stringify(timingObj);
//	var url = path + encodeURI(data);
//	$('body').append("<img style=\"display:none\" src=\"" + url + "\">");
//}

$(function(){
	loadPubBanner();
	loadElement();
	
	//timing();
});