function logout2(){
	LOGOUT_FLAG=true;

//	var accountAddr="http://10.108.114.252:8067/";
//	var index="http://10.108.114.252:7777/WCLnew/";

//	var accountAddr="http://10.109.247.137:8080/";
//	var index="http://10.109.247.137:5555/WCLnew/";
//	var accountAddr="http://183.62.12.16:7777/";
//	var index="http://183.62.12.16:7777/WCLnew/";	
	
//	
	var accountAddr=com.wmsservers[0];
	console.log(accountAddr);
	var index="http://"+com.nginxservers[0] + "/WCLnew/";	
	console.log(index);
	var userName = $('.pub_banner').attr("userid");


	
	//con
	var access_token =$('.pub_banner').attr("acctoken");
	$.ajax({  
        url:accountAddr+"api/oauth2/revokeoauth2?callback=?",  
        type:"post",
        async:false,
        dataType:"json",  
        data:{'access_token':access_token},  
        complete:function(result) {
        	if(typeof(com) != "undefined"){

        	}
        	location.replace(index);
        }
    });
   
}




