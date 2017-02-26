package com.free4lab.account.api.action.WMSAuth;


import com.free4lab.account.common.Constants;
import com.free4lab.account.manager.WcsUserManager;
import com.free4lab.account.manager.AccessTokenManager;
import com.free4lab.account.model.AccessToken;
import com.free4lab.account.model.WcsUser;
import com.free4lab.account.module.Oauth2Module;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.struts2.ServletActionContext;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.lang.reflect.InvocationTargetException;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Calendar;
import java.util.Date;
import java.util.Map;
import java.util.UUID;
import java.util.Vector;

import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import org.apache.commons.httpclient.Header;
import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.HttpException;
import org.apache.commons.httpclient.HttpMethodBase;
import org.apache.commons.httpclient.NameValuePair;
import org.apache.commons.httpclient.URIException;
import org.apache.commons.httpclient.cookie.CookiePolicy;
import org.apache.commons.httpclient.methods.GetMethod;
import org.apache.commons.httpclient.methods.PostMethod;
import org.apache.log4j.Logger;
import org.json.HTTP;
import org.json.JSONException;
import org.json.JSONObject;
import org.perf4j.aop.Profiled;

import sun.misc.BASE64Decoder;
import sun.misc.BASE64Encoder;

import com.free4lab.utils.action.BaseAction;
import com.opensymphony.xwork2.ActionContext;

public class WMSAuth extends BaseAction {
	private static final long serialVersionUID = 1L;
	final static Logger logger = Logger.getLogger(WMSAuth.class);
	private static final String Algorithm = "DESede"; //定义加密算法,可用 DES,DESede,Blowfish
	
	private int Result;
	private String Token;
	private String WebRTCLoginResponseValue;
	private String SPID;
	private String WebRTCUserID;
	private long TimeStamp;
	private String ReturnURL;
	
	@SuppressWarnings("rawtypes")
	@Profiled(tag = "WMSAuth.execute")
	public String execute() throws Exception{
		System.out.println("in WMSAuth.java!!!");	
		//获取request的参数的一种方法    
		Map<String, Object> aMap = ActionContext.getContext().getParameters();
		String EncodedWebRTCLoginRequestValue =  ((String[])aMap.get("WebRTCLoginRequestValue"))[0];	
        logger.info(EncodedWebRTCLoginRequestValue);		
        // 获取request的另一种方法          
//        HttpServletRequest req = ServletActionContext.getRequest();
//        logger.info(req);
//        req.getQueryString();//获取问号后的字符串 
//        logger.info(req.getQueryString());         
 
		//对url解码
        String WebRTCLoginRequestValue = URLDecoder.decode(EncodedWebRTCLoginRequestValue);
        logger.info(WebRTCLoginRequestValue);
        String[] WRVArray = WebRTCLoginRequestValue.split("\\$");		
		String RequestSPID = WRVArray[0];//WRVArray[0]为请求来的SPID
		SPID = RequestSPID;
		logger.info("SPID:"+SPID);
    	ThreeDES des = new ThreeDES();  // 实例化一个对像  
        des.getKey("sortec2008");  // 生成密匙  	
		logger.info(Encryption.getFromBase64(WRVArray[1]));
		String WebRTCRequestID = des.getDesString(Encryption.getFromBase64(WRVArray[1])).split("\\$")[0];
	
		String UserIP = des.getDesString(Encryption.getFromBase64(WRVArray[1])).split("\\$")[1]; 
		ReturnURL = des.getDesString(Encryption.getFromBase64(WRVArray[1])).split("\\$")[2];
		String ExpireTime= "";
        String RequestedTimeStamp = des.getDesString(Encryption.getFromBase64(WRVArray[1])).split("\\$")[3];		
		//时间戳，从1970年1月1日0时开始的毫秒数?		
		Date d = new Date();
		TimeStamp=d.getTime() ;
 
		//对url中的参数认证	
		if(RequestSPID == null ){
			//平台用户不存在
			Result = -1;
			
		}else if(WebRTCRequestID ==null){
			//平台身份信息错误
			Result = -2; 
		}else if(SPID.equals(Constants.WebRTC_WMS_ID)){
			//WMS本系统用户
			Result = 0;
			WebRTCUserID = WebRTCRequestID.split("@")[0]+"-"+WebRTCRequestID.split("@")[1]+"@"+SPID;
			Vector ve = WcsUserManager.FindWcsUser(WebRTCUserID,SPID);  
			if(!ve.isEmpty())
			{
				WcsUserManager.deleteAccTokenByUserId(ve);
			}
			System.out.println("WMS SYSTEM");
			System.out.println(WebRTCUserID+SPID);
			WcsUser accEntity =  Oauth2Module.createWcsAccessToken(WebRTCRequestID,WebRTCUserID, SPID);
			
			Token = accEntity.getAccess_token();		
		}else{
			//第三方系统用户
			
		     Result = 0;
		 	WebRTCUserID = WebRTCRequestID.split("@")[0]+"-"+WebRTCRequestID.split("@")[1]+"@"+SPID;
		     
			 Vector ve = WcsUserManager.FindThirdPartyUser(WebRTCUserID,SPID);

		    if(!ve.isEmpty()){

		    	WcsUserManager.deleteAccTokenByUserId(ve);
			}
		    System.out.println("ThirdParty SYSTEM");
			System.out.println(WebRTCUserID+SPID);
	        WcsUser accEntity = Oauth2Module.createThirdPartyAccessToken(WebRTCUserID, SPID);	

	        Token = accEntity.getAccess_token();		  
	 }
	
		String Digest = Encryption.getBase64(Encryption.SHA1(WebRTCUserID + "$" + Token + "$" +TimeStamp +"$"+Result));

       WebRTCLoginResponseValue = URLEncoder.encode(SPID + "$" +Encryption.getBase64(new String(des.getEncString((WebRTCUserID +"$"+Token+"$"+TimeStamp+"$"+Result+"$"+Digest)))));
	    
       logger.info("flag final");
		return SUCCESS;	
	}

	public String getSPID() {
		return SPID;
	}

	public void setSPID(String sPID) {
		SPID = sPID;
	}

	public long getTimeStamp() {
		return TimeStamp;
	}

	public void setTimeStamp(long timeStamp) {
		TimeStamp = timeStamp;
	}

	public String getAccesstoken() {
		return Token;
	}

	public void setAccesstoken(String Token) {
		this.Token = Token;
	}

	public String getWebRTCLoginResponseValue() {
		return WebRTCLoginResponseValue;
	}

	public void setWebRTCLoginResponseValue(String webRTCLoginResponseValue) {
		WebRTCLoginResponseValue = webRTCLoginResponseValue;
	}

	public int getResult() {
		return Result;
	}
	public void setResult(int result) {
		this.Result = result;
	}
	public String getWebRTCUserID() {
		return WebRTCUserID;
	}

	public void setWebRTCUserID(String webRTCUserID) {
		WebRTCUserID = webRTCUserID;
	}
	public static void main(String[] args){
//		String WebRTCUserID = "guoxuntest-aaa.com@WebRTC";
//		String SPID = "webRTC";
//	    Vector ve =WcsUserManager.FindThirdPartyUser(WebRTCUserID,SPID);
//	    logger.info("flag2");
//	    if(!ve.isEmpty()){
//
//	    	WcsUserManager.deleteAccTokenByUserId(ve);
//		}
//
//	    logger.info(WebRTCUserID+SPID);
//        WcsUser accEntity = Oauth2Module.createThirdPartyAccessToken(WebRTCUserID, SPID);	
//		String WebRTCUserID_old = "woshikelebaobao@163.com";
//		String SPID = "WebRTC";
//		String WebRTCUserID_new =  WebRTCUserID_old.split("@")[0]+"-"+ WebRTCUserID_old.split("@")[1]+"@"+SPID;
//		Vector ve = WcsUserManager.FindWcsUser(WebRTCUserID_new ,SPID);  
//		if(!ve.isEmpty())
//		{
//			WcsUserManager.deleteAccTokenByUserId(ve);
//		}
//		System.out.println(WebRTCUserID_old+WebRTCUserID_new+SPID);
//		WcsUser accEntity =  Oauth2Module.createWcsAccessToken(WebRTCUserID_old,WebRTCUserID_new, SPID);
//		
//		String Token = accEntity.getAccess_token();		
		
		
		String result=AccessTokenManager.getAccessTokenByUserId("webrtc1@163.com");
		System.out.println(result);
 	}
}
