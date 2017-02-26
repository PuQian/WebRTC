var flag = false;
var flag1 = false;
/*$(function(){
	var result = $('#hiddenResult').val();
	//alert(result);
	if(result == "wrong"){
		//alert($('#hiddenUrl').val())
		//$('#error').text('');
		var url = $('#hiddenUrl').val();

		if(url.indexOf("&message=") != -1){
			url = url.substring(0,url.indexOf("&message="));
			$('#hiddenUrl').val(url)
		}

		var client_id = $('#hiddenClient').val().trim();
		if(client_id != "freeshare") {
			location.href = $('#hiddenUrl').val() + "message=" + $('#error').text();
		}
		else{
		location.href = $('#hiddenUrl').val() + "&message=" + $('#error').text();
		}
	}

})*/


//根据是否需要邀请码加载注册页面样式
$(".free_reg").click(function(){

           	if(checkPre()){
           		window.location.href='/register/webrtc_reg_pri.jsp';
           	}else{
           		window.location.href='/register/webrtc_reg.jsp';
           	}

})
//从数据库中读出是否需要邀请码
function checkPre(){
	var flag=false;
	$.ajax({
        url : 'account/preregcheckforfree',
        type : 'post',
        async:false, 
        data : {},
        success : function(data) {
        	if(data.pri){
        		 flag=true;
        	}else{
        		 flag=false;
        	}
        	
        }
    });
	return flag;
	
}
//从cookie中读出保存的用户名
function cheLogSta()
{ 
	if (nGetCookie("rmbUser") == "true") 
	{ 
		//$("#rmbUser").attr("checked", true); 
		$("#rmbUser").attr('src',"images/check_on.jpg");
		if($("#txemail").val()==""){
			$("#txemail").val(nGetCookie("userName"));
		}
	}else{
		$("#rmbUser").attr('src',"images/check_off.jpg");
	}
}

//用户名input的blur动作
$("#txemail").blur(function(){
	 var str=$(this).val();
	    if(str ==""){
	        $("#account #error").html("请输入邮箱名称！");
	        flag = false;
	        return;
	    }else if(!isEmail(str)){
	        $("#account #error").html("输入的邮箱有误！");
	        flag = false;
	        return;
	    }else{
	        $("#account #error").html("");
	        flag = true;
	    }
});

//密码input的blur操作
$("#txpwd").blur(function(){
	var str = $(this).val();
    if(str == ""){
        $("#account #error").html("请输入密码！");
        flag1 = false;
        return;
    }else{
        flag1 = true;
    }
});

//onsubmit返回的方法
function loginCheck(){
	var str=$("#txemail").val();
	var str1 = $("#txpwd").val();
	var random = $("#random").val();
	if(flag == false){
		if(str ==""){
			$("#account #error").html("请输入邮箱名称！");
			return false;
		}else if(!isEmail(str)){
			$("#account #error").html("输入的邮箱有误！");
			return false;
		}else{
			$("#account #error").html("");
		}
	}
	if(flag1 == false ){
		if(str1 == ""){
			$("#account #error").html("请输入密码！");
			return false;
		}else{
			$("#account #error").html("");
		}
	}
	$("#txpasswordMd5").val(hex_md5(random+hex_md5(hex_md5(str1)+str)));
	saveUserName();
}

//勾选了“记住此用户名”后，保存用户名至cookie
function saveUserName(){
//	if ($("#rmbUser").attr("checked")) 
//	{ 
//		var userName = $("#txemail").val();
//		nSetCookie("rmbUser", "true", "d7"); // 存储一个带7天期限的 cookie 
//		nSetCookie("userName", userName, "d7"); // 存储一个带7天期限的 cookie
//	} 
//	else 
//	{
//		nSetCookie("rmbUser", "false", "d7"); 
//		nSetCookie("userName", '', "d7"); 
//	}
	
	if ($("#rmbUser").attr('src') == 'images/check_on.jpg') 
	{ 
		var userName = $("#txemail").val();
		nSetCookie("rmbUser", "true", "d7"); // 存储一个带7天期限的 cookie 
		nSetCookie("userName", userName, "d7"); // 存储一个带7天期限的 cookie
	} 
	else 
	{
		nSetCookie("rmbUser", "false", "d7"); 
		nSetCookie("userName", '', "d7"); 
	}
	
	
}

//判断是否是email
function isEmail(str){
    var reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    return reg.test(str);
}

//load用户名
$(function(){
 	cheLogSta();
});

//转换
function gotoRegister(){
	var html="";
	if(checkPre()){
		html ="<tr><td class=\"middlesize rightalign\">邀请码</td><td colspan=\"2\"><input type=\"text\" name=\"privilege\" class=\"editline\"  value=\"\" /></td>"+
		"</tr><tr><td width=\"50px\"></td><td class=\"leftalign\">"+
		"<button onclick=\"return regCheck();\" class=\"orangebutton\">注册</button>"+
		"</td><td ><span class=\"redletter\" id=\"error\"><s:property value=\"message\" /></span></br><a href=\"javascript:void(0)\" onclick=\"gotoLogin();\">已有FREE账号？马上登录</a> </td></tr>"
		$("#insert_here").html(html);
	}else{
		html ="<tr><td></td><td class=\"leftalign\">"+
		"<button onclick=\"return regCheck();\" class=\"orangebutton\">注册</button>"+
		"</td><td class=\"leftalign\"><span class=\"redletter\" id=\"error\"><s:property value=\"message\" /><br /></span></td>"+
		"</tr><tr><td width=\"50px\"></td><td class=\"leftalign bottomveralign\" width=\"110px\"><span class=\"middlesize\">已有FREE账号？</span></td>"+
		"<td class=\"rightalign\"><a class=\"button\" onclick=\"gotoLogin();\">马上登录</a></td></tr>"
		$("#insert_here").html(html);
	}
	$login=$(".login");
	$account=$("#account");
    $login.animate({
       scrollTop: $account.height()+10
    }, 800);
}
function gotoLogin(){
    $login=$(".login");
    $login.animate({
        scrollTop: 0
    }, 800);
}
function gotoLoginFast(){
   /* $login=$(".login");
    $login.animate({
        scrollTop: 0
    }, 10);*/
    location.reload(true);
}

//register
function regCheck(){
	var str=$("#signupForm input[name=email]").val();
    if(str ==""){
        $("#signupForm #error").html("请输入邮箱名称！");
        return false;
    }else if(!isEmail(str)){
        $("#signupForm #error").html("输入的邮箱有误！");
        return false;
    }else{
        $("#signupForm #error").html("");
    }
    var str2 = $("#signupForm input[name=cepsw]").val();
    var str1 = $("#signupForm input[name=epsw]").val();
    if(str1 == ""){
        $("#signupForm #error").html("请输入密码！");
        return false;
    }else if(str2==""){
        $("#signupForm #error").html("请输入确认密码！");
        return false;
    }
    else if (str2 != str1){
        $("#signupForm #error").html("两次输入的密码不同！");
        return false;
    }else{
        $("#signupForm #error").html("");
    }
    
    var str3 = $("#signupForm input[name=code]").val();
    //验证码应放在后台验证，前台只验证是否为空
    if(str3 == ""){
    	$("#signupForm #error").html("请输入验证码！");
    	return;
    }else{
   		$("#signupForm #error").html("");
    }
    var passwordMd5 = hex_md5(str1); 
    
    //showLoading();
    $.ajax({  
        url:"account/regcheck",  
        type:"post",
        //async:false,
        data:{'email':str,'passwordMd5':passwordMd5,'code':str3},  
        success:function(data) {
        	if(data.result=="success"){
        		location.href="/register/emailconfirming.jsp?email="+str+"&passwordMd5="+passwordMd5;
                $("#emailconfirming tr:eq(1) td").html("一封激活邮件已经发送至"+str+",请点击邮件中的链接以完成用户注册！<br />");
                $("#emailconfirming tr:eq(2) td").html("如果您半个小时内仍未收到邮件，请点击\"<a class=\"blackletter\" href=\"javascript:void(0);\" " +
                		"onclick=\"regCheckAll('"+data.email+"','"+data.passwordMd5+"')\">再次发送</a>\"。<br />如需返回登录页面，" +
                		"请点击\"<a class='blackletter' href='javascript:void(0)' onclick='gotoLoginFast();'>返回登录页面</a>\"。<br /><br /><br /><br />");
                $(".login").animate({scrollTop: $("#account").height()+$("#reg").height()+$("#reg_pri").height()+10}, 800);
            }else if(data.result == "fail"){
            	
            	
            	$("#signupForm #error").html(data.message);
    			//fillTipBox("error","邮件发送失败");
			}else{
				//$("#signupForm #error").html(data.result);
				//fillTipBox("error",data.result);
			}
        	//hideLoading();
        },
        error:function(data){
        	//hideLoading();
        }
    });
    return false;
}


function regCheckmobile(){
	var str=$("#signupForm input[name=email]").val();
    if(str ==""){
        $("#signupForm #reerror").html("请输入邮箱名称！");
        return false;
    }else if(!isEmail(str)){
        $("#signupForm #reerror").html("输入的邮箱有误！");
        return false;
    }else{
        $("#signupForm #reerror").html("<br/>");
    }
    var str2 = $("#signupForm input[name=cepsw]").val();
    var str1 = $("#signupForm input[name=epsw]").val();
    if(str1 == ""){
        $("#signupForm #reerror").html("请输入密码！");
        return false;
    }else if(str2==""){
        $("#signupForm #reerror").html("请输入确认密码！");
        return false;
    }
    else if (str2 != str1){
        $("#signupForm #reerror").html("两次输入的密码不同！");
        return false;
    }else{
        $("#signupForm #reerror").html("<br/>");
    }
    var passwordMd5 = hex_md5(str1); 
    
    //showLoading();
    $.ajax({  
        url:"account/regcheck",  
        type:"post",
        //async:false,
        data:{'email':str,'passwordMd5':passwordMd5},  
        success:function(data) {
        	if(data.result=="success"){
                $("#esemail").html("一封激活邮件已经发送至"+str+",请点击邮件中的链接以完成用户注册！<br />");
                $("#redoemail").html("如果您半个小时内仍未收到邮件，请点击\"<a class=\"blackletter\" href=\"javascript:void(0);\""+
            "onclick=\"regCheckAll_mobile('"+data.email+"','"+data.passwordMd5+"')\">再次发送</a>\"");
             
            }else if(data.result == "fail"){
            	  $("#esemail").html("发送失败");
            	   $("#redoemail").html("请点击\"<a class=\"blackletter\" href=\"javascript:void(0);\""+
            	            "onclick=\"regCheckAll_mobile('"+data.email+"','"+data.passwordMd5+"')\">再次发送</a>\"");
    		//	fillTipBox("error","邮件发送失败");
			}else{
				  $("#esemail").html(data.result);
				   $("#redoemail").html("请点击\"<a class=\"blackletter\" href=\"javascript:void(0);\""+
           	            "onclick=\"regCheckAll_mobile('"+data.email+"','"+data.passwordMd5+"')\">再次发送</a>\"");
			//	fillTipBox("error",data.result);
			}
        	hideLoading();
        	
        	$("#emailresult").click();
        },
        error:function(data){
        	hideLoading();
        	$("#emailresult").click();
        }
    });
    return false;
}


function email_isValid(){
    var str=$("#signupForm input[name=email]").val();
    if(str ==""){
        $("#signupForm #error").html("请输入邮箱名称！");
        return;
    }else if(!isEmail(str)){
        $("#signupForm #error").html(" 输入的邮箱名称有误！");
        return;
    }else{
        $("#signupForm #error").html("");
    }
}

function email_isValid_mobile(){
    var str=$("#signupForm input[name=email]").val();
    if(str ==""){
        $("#signupForm #reerror").html("请输入邮箱名称！");
        return;
    }else if(!isEmail(str)){
        $("#signupForm #reerror").html(" 输入的邮箱名称有误！");
        return;
    }else{
        $("#signupForm #reerror").html("<br/>");
    }
	$('#re').page();
    $("#re").listview('refresh'); 
}
function epsw_isValid(){
    var str2 = $("#signupForm input[name=cepsw]").val();
    var str1 = $("#signupForm input[name=epsw]").val();
    if(str1 == ""){
        $("#signupForm #error").html("请输入密码！");
        return;
    }
    else if (str2 != "" && str2 != str1){
        $("#signupForm #error").html("两次输入的密码不同！");
        return;
    }else{
        $("#signupForm #error").html("");
    }
}

function epsw_isValid_mobile(){
    var str2 = $("#signupForm input[name=cepsw]").val();
    var str1 = $("#signupForm input[name=epsw]").val();
    if(str1 == ""){
        $("#signupForm #error").html("请输入密码！");
        return;
    }
    else if (str2 != "" && str2 != str1){
        $("#signupForm #ewerror").html("两次输入的密码不同！");
        return;
    }else{
        $("#signupForm #ewerror").html("<br/>");
    }
	$('#re').page();
    $("#re").listview('refresh'); 
}
function cepsw_isValid(){
    var str2 = $("#signupForm input[name=cepsw]").val();
    var str1 = $("#signupForm input[name=epsw]").val();
    if(str2==""){
        $("#signupForm #error").html("请输入确认密码！");
        return;
    }else if (str1 != "" && str2 != str1){
        $("#signupForm #error").html("两次输入的密码不同！");
        return;
    }
    else{
        $("#signupForm #error").html("");
    }
}


function cepsw_isValid_mobile(){
    var str2 = $("#signupForm input[name=cepsw]").val();
    var str1 = $("#signupForm input[name=epsw]").val();
    if(str2==""){
        $("#signupForm #reerror").html("请输入确认密码！");
        return;
    }else if (str1 != "" && str2 != str1){
        $("#signupForm #reerror").html("两次输入的密码不同！");
        return;
    }
    else{
        $("#signupForm #reerror").html("<br/>");
    }
	$('#re').page();
    $("#re").listview('refresh'); 
}

function regCheckAll(email,passwordMd5){
	$.ajax({
		url:"account/regcheck",
		type:"post",
		data:{'email':email,'passwordMd5':passwordMd5},
		success:function(data){
			if(data.result == "success"){
				fillTipBox("success","邮件发送成功，请查收");
			}else if(data.result == "fail"){
				fillTipBox("error","邮件发送失败");
			}else{
				fillTipBox("error",data.result);
			}
		}
	});
}
function regCheckAll_mobile(email,passwordMd5){
	$.ajax({
		url:"account/regcheck",
		type:"post",
		data:{'email':email,'passwordMd5':passwordMd5},
		success:function(data){
			if(data.result == "success"){
				  $("#esemail").html("已重新发送邮件<br />");
				
			}else if(data.result == "fail"){
				  $("#esemail").html("发送失败");
				   $("#redoemail").html("请点击\"<a class=\"blackletter\" href=\"javascript:void(0);\""+
           	            "onclick=\"regCheckAll_mobile('"+data.email+"','"+data.passwordMd5+"')\">再次发送</a>\"");
				
			}else{
				  $("#esemail").html(data.result);
				   $("#redoemail").html("请点击\"<a class=\"blackletter\" href=\"javascript:void(0);\""+
           	            "onclick=\"regCheckAll_mobile('"+data.email+"','"+data.passwordMd5+"')\">再次发送</a>\"");
			
			}
		}
	});
}



function post(URL, PARAMS) {        
    var temp = document.createElement("form");        
    temp.action = URL;        
    temp.method = "post";        
    temp.style.display = "none";        
    for (var x in PARAMS) {        
        var opt = document.createElement("textarea");        
        opt.name = x;        
        opt.value = PARAMS[x];        
        // alert(opt.name)        
        temp.appendChild(opt);        
    }        
    document.body.appendChild(temp);        
    temp.submit();        
    return temp;        
}      

function sendmore(){
	var str=getQueryString("email");
	var passwordMd5=getQueryString("passwordMd5");
	//var inviteCode=getQueryString("inviteCode");
	showLoading();
    $.ajax({  
        url:"account/regcheck",  
        type:"post",
        //async:false,
        data:{'email':str,'passwordMd5':passwordMd5},  
        success:function(data) {
        	if(data.result=="success"){
        		//showLoading();
        		location.href="/register/emailconfirming.jsp?email="+str+"&passwordMd5="+passwordMd5+"&random="+Math.random();
        	}
        	//hideLoading();
        },
        error:function(data){
        	//hideLoading();
        }
    });
}

function getQueryString(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    }
    return null;
}

var EmptyImgFlag = true;

function changeImg(){
	if(EmptyImgFlag) { 
		$("#rmbUser").attr('src',"images/check_on.jpg"); 
		EmptyImgFlag = false;
	}
	else{ 
		$("#rmbUser").attr('src',"images/check_off.jpg"); 
		EmptyImgFlag = true;
	} 

}
