function check(){
    //alert("!");
    var str2 = $("[name=cepsw]").val();
    var str1 = $("[name=epsw]").val();
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
    
    var email = $("#email").val();
    var uuid = $("#uuid").val();
    var passwordMd5 = hex_md5(str1); 
    //alert("pass"+passwordMd5);
    //alert("name"+$("#FreeInputLogo input[name=ename]").val());
    var submitForm = document.createElement("form");
    document.body.appendChild(submitForm);
    submitForm.method = "POST";
    createNewFormElement(submitForm, "passwordMd5", passwordMd5);
    createNewFormElement(submitForm, "email", email);
    createNewFormElement(submitForm, "uuid", uuid);
    submitForm.action= "account/pwdupdate";
    submitForm.submit();    
}
function createNewFormElement(inputForm, elementName, elementValue){
        var newElement = document.createElement("input");
        newElement.type="hidden";
        newElement.name=elementName;
        inputForm.appendChild(newElement);
        newElement.value = elementValue;
}
function checkpswkong(){
    var str2 = $("#signupForm input[name=cepsw]").val();
    var str1 = $("#signupForm input[name=epsw]").val();
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
    var str2 = $("#signupForm input[name=cepsw]").val();
    var str1 = $("#signupForm input[name=epsw]").val();
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