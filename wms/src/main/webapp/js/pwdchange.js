function check(){
    var strname=$("input[name=ename]").val();
    if(strname ==""){
        $("#error").html("请输入邮箱名称！");
        return;
    }else if(!isEmail(strname)){
        $("#error").html("输入的邮箱名称有误！");
        return;
    }else{
        $("#error").html("");
    }
    var str=$("input[name=opsw]").val();
    if(str ==""){
        $("#error").html("请输入原密码！");
        return;
    }else{
        $("#error").html("");
    }
    var str2 = $("input[name=cepsw]").val();
    var str1 = $("input[name=epsw]").val();
    if(str1 == ""){
        $("#error").html("请输入新密码！");
        return;
    }else if(str2==""){
        $("#error").html("请输入新的确认密码！");
        return;
    }
    else if (str2 != str1){
        $("#error").html("两次输入的密码不同！");
        return;
    }else{
        $("#error").html("");
    }
    
    var originPasswordMd5 = hex_md5(str); 
    var newPasswordMd5 = hex_md5(str1);
    //var handleUrl = $("#handleUrl").val();
    //var customId = $("#customId").val();
    //alert("pass"+passwordMd5);
    //alert("name"+$("#FreeInputLogo input[name=ename]").val());
    var submitForm = document.createElement("form");
    document.body.appendChild(submitForm);
    submitForm.method = "POST";
    //createNewFormElement(submitForm, "handleUrl", handleUrl);
    //createNewFormElement(submitForm, "customId", customId);
    createNewFormElement(submitForm, "email", strname);
    createNewFormElement(submitForm, "originPasswordMd5", originPasswordMd5);
    createNewFormElement(submitForm, "newPasswordMd5", newPasswordMd5);
    submitForm.action= "account/pwdchangecheck";
    submitForm.submit();    
}
function createNewFormElement(inputForm, elementName, elementValue){
        var newElement = document.createElement("input");
        newElement.type="hidden";
        newElement.name=elementName;
        inputForm.appendChild(newElement);
        newElement.value = elementValue;
}
function checknamekong(){
    var str=$("input[name=ename]").val();
    if(str ==""){
        $("#error").html("请输入邮箱名称！");
        return;
    }else if(!isEmail(str)){
        $("#error").html(" 输入的邮箱名称有误！");
        return;
    }else{
        $("#error").html("");
    }
}
function isEmail(str){
    var reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    return reg.test(str);
}

function checkoldpswkong(){
    var str=$("input[name=opsw]").val();
    if(str ==""){
        $("#error").html("请输入原密码！");
        return;
    }else{
        $("#error").html("");
    }
}
function checkpswkong(){
    var str2 = $("input[name=cepsw]").val();
    var str1 = $("input[name=epsw]").val();
    if(str1 == ""){
        $("#error").html("请输入新密码！");
        return;
    }
    else if (str2 != "" && str2 != str1){
        $("#error").html("两次输入的密码不同！");
        return;
    }else{
        $("#error").html("");
    }
}
function checkcpswkong(){
    var str2 = $("input[name=cepsw]").val();
    var str1 = $("input[name=epsw]").val();
    if(str2==""){
        $("#error").html("请输入新的确认密码！");
        return;
    }else if (str1 != "" && str2 != str1){
        $("#error").html("两次输入的密码不同！");
        return;
    }
    else{
        $("#error").html("");
    }
}