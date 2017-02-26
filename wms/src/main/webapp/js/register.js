function check(){
    var str=$("#FreeInputLogo1 input[name=ename]").val();
    if(str ==""){
        $("#signup_error").html("请输入邮箱名称！");
        return;
    }else if(!isEmail(str)){
        $("#signup_error").html(" 输入的邮箱有误！");
        return;
    }else{
        $("#signup_error").html("");
    }
    var str2 = $("#FreeInputLogo1 input[name=cepsw]").val();
    var str1 = $("#FreeInputLogo1 input[name=epsw]").val();
    if(str1 == ""){
        $("#signup_error").html("请输入密码！");
        return;
    }else if(str2==""){
        $("#signup_error").html("请输入确认密码！");
        return;
    }
    else if (str2 != str1){
        $("#signup_error").html("两次输入的密码不同！");
        return;
    }else{
        $("#signup_error").html("");
    }
    var passwordMd5 = hex_md5(str1); 
    //alert("pass:"+passwordMd5);
    //alert("name:"+$("#FreeInputLogo1 input[name=ename]").val());
    var submitForm = document.createElement("form");
    document.body.appendChild(submitForm);
    submitForm.method = "POST";
    createNewFormElement(submitForm, "passwordMd5", passwordMd5);
    createNewFormElement(submitForm, "email", str);
      $.post("account/regcheck",{email:str,passwordMd5:passwordMd5},function(data){
    	if(data.result=="success"){
    		var sucUrl = "";
        	sucUrl=data.toUrl;
        	$("#toLink").attr("href",sucUrl);
        	$("#toLink").click();
        	//console.log(emailUrl);
    	}
    	else{
    		var failUrl = "";
    		failUrl="register/sign_up.jsp?msg="+data.message;
    		$("#toLink").attr("href",failUrl);
    		$("#toLink").click();		
    	}
    	
    })
    //submitForm.action= "account/regcheck";
    //submitForm.submit();    
}

function createNewFormElement(inputForm, elementName, elementValue){
        var newElement = document.createElement("input");
        newElement.type="hidden";
        newElement.name=elementName;
        inputForm.appendChild(newElement);
        newElement.value = elementValue;
}

function checknamekong(){
    //alert("!");
    var str=$("#FreeInputLogo1 input[name=ename]").val();
    //alert("!"+str);
    if(str ==""){
        $("#signup_error").html("请输入邮箱名称！");
        return;
    }else if(!isEmail(str)){
        $("#signup_error").html(" 输入的邮箱名称有误！");
        return;
    }else{
        $("#signup_error").html("");
    }
}
function isEmail(str){
    var reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    return reg.test(str);
}
function checkpswkong(){
    var str2 = $("#FreeInputLogo1 input[name=cepsw]").val();
    var str1 = $("#FreeInputLogo1 input[name=epsw]").val();
    if(str1 == ""){
        $("#signup_error").html("请输入密码！");
        return;
    }
    else if (str2 != "" && str2 != str1){
        $("#signup_error").html("两次输入的密码不同！");
        return;
    }else{
        $("#signup_error").html("");
    }
}
function checkcpswkong(){
    var str2 = $("#FreeInputLogo1 input[name=cepsw]").val();
    var str1 = $("#FreeInputLogo1 input[name=epsw]").val();
    if(str2==""){
        $("#signup_error").html("请输入确认密码！");
        return;
    }else if (str1 != "" && str2 != str1){
        $("#signup_error").html("两次输入的密码不同！");
        return;
    }
    else{
        $("#signup_error").html("");
    }
}