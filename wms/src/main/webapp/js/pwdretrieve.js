function check(){
    var str=$("#signupForm input[name=ename]").val();
    if(str ==""){
        $("#error").html("请输入邮箱名称！");
        return;
    }else if(!isEmail(str)){
        $("#error").html("输入的邮箱有误！");
        return;
    }else{
        $("#error").html("");
    }
    var str1 = $("#signupForm input[name=epsw]").val();
    //验证码应放在后台验证，前台只验证是否为空
    if(str1 == ""){
    	$("#error").html("请输入验证码！");
    	return;
    }else{
   		$("#error").html("");
    }
    
    //var handleUrl = $("#handleUrl").val();
    //var customId = $("#customId").val();
    //alert("pass"+passwordMd5);
    //alert("name"+$("#FreeInputLogo input[name=ename]").val());
    var submitForm = document.createElement("form");
    document.body.appendChild(submitForm);
    submitForm.method = "POST";
    //createNewFormElement(submitForm, "handleUrl", handleUrl);
    //createNewFormElement(submitForm, "customId", customId);
    createNewFormElement(submitForm, "email", str);
    createNewFormElement(submitForm, "securitycode", str1);
    submitForm.action= "account/pwdretrievecheck";
    submitForm.submit();    
}

function createNewFormElement(inputForm, elementName, elementValue){
        var newElement = document.createElement("input");
        newElement.type="hidden";
        newElement.name=elementName;
        inputForm.appendChild(newElement);
        newElement.value = elementValue;
}

function isEmail(str){
    var reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    return reg.test(str);
}

$("#Verify").click(function(){
	createSercuityCode();
});

function createSercuityCode(){
$("#Verify").attr("src","account/SecurityCodeImage?timestamp="+new Date().getTime());
}

function ename_isValid(){
    var str=$("#signupForm input[name=ename]").val();
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
