<!DOCTYPE html>
<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" import="java.util.*"%>

<%@ taglib prefix="s" uri="/struts-tags"%>
<% String href = request.getScheme() + "://" + request.getServerName()
	+ ":" + request.getServerPort() + request.getContextPath();%>
<div class="pub_banner" sys="webrtc"  ThirdPartyToken="<s:property value='#session.tpaccToken'/>" thirdpartyuser="<s:property value='#session.tpUser'/>" user="<s:property value='#session.email'/>" userid="<s:property value='#session.userId'/>"  acctoken="<s:property value='#session.accessToken.substring(8, 24)'/>" 
index= "<%= href %>/" handleurl = "<%= href %>/login" oauthToken="<s:property value='#session.oauthToken'/>" >

<table style="width:80%"><tr id="head" align="right"></tr></table>



</div>

<!-- <div class="pub_banner">
	<div>
		<a href=""><img id="logo" src="images/logo_inner.png" border="0" /></a>
	</div>
</div>
-->

<script language="javascript" type="text/javascript">
window.onload = function() { 
	
	//var bannerimg= $("<img id=\"logo\" src=\"images/logo_inner.png\" border=\"0\" style=\"margin-left:15%\"/>");
	//$(".pub_banner").append(bannerimg);
	//$(".pub_banner").css("height","40px");
	//$(".pub_banner").css("z-index","1");
	//$(".pub_banner").css("background","#e5e5e5");
	//$(".pub_banner > .content").css("width","70%");
	//var usernamenow=$(".pub_banner").attr("user");
//$("#usernamenow").html("当前账号："+usernamenow);
	
	
	var bannerimg= $("<th width=\"30%\"><img id=\"logo\" src=\"images/logo_inner.png\" border=\"0\" style=\"margin-left:10%\"/></th>");
//	var bannerright = $("<th id=\"banner_user\" width=\"40%\"></th><th width=\"15%\"><a id=\"banner_setting\" href=\"http:\/\/10.108.114.252:8069\/users\" target=\"_blank\">账号设置</a></th><th width=\"15%\" align=\"center\"><a id=\"banner_quit\" href=\"javascript:void(0)\" onclick=\"logout2();\">退出</a></th>");
	var bannerright = $("<th id=\"banner_user\" width=\"40%\"></th><th width=\"15%\"><a id=\"banner_setting\" href=\"http:\/\/10.109.247.137:8080\/users\" target=\"_blank\">账号设置</a></th><th width=\"15%\" align=\"center\"><a id=\"banner_quit\" href=\"javascript:void(0)\" onclick=\"logout2();\">退出</a></th>");
	
	$(".pub_banner").css({height:"40px",background:"#e5e5e5"});		
	$("#head").append(bannerimg);	
	$("#head").append(bannerright);
	$(".pub_banner").css("z-index","1");
	$("#head").css({fontSize:"18px",fontFamily:"Arial, Helvetica, sans-serif",color:"black"});
	$("#banner_setting").css({color:"black",textDecoration:"none"}); 
	$("#banner_quit").css({color:"black",textDecoration:"none"});
	
	$("#banner_setting").hover(function(){
		$("#banner_setting").css("color","#4f5c6d");
		},function(){
		$("#banner_setting").css("color","black");
		});
	$("#banner_quit").hover(function(){
		$("#banner_quit").css("color","#4f5c6d");
		},function(){
		$("#banner_quit").css("color","black");
		});
	
	var user_em=$(".pub_banner").attr('user');
	$("#banner_user").html("账号:" + user_em);	
	
	$("#friendlist").css("z-index","2");
	$("#myfriend").css("z-index","2");
	//这个是jquery代码 
}; 


</script>

