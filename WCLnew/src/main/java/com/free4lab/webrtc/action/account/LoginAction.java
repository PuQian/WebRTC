package com.free4lab.webrtc.action.account;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.net.UnknownHostException;
import java.security.NoSuchAlgorithmException;
import java.util.Calendar;
import java.util.Map;

import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.log4j.Logger;
import org.apache.struts2.ServletActionContext;
import org.json.JSONException;
import org.json.JSONObject;

import com.free4lab.utils.account.BaseLoginAction;
import com.free4lab.webrtc.common.APIConstants;
import com.free4lab.webrtc.common.SessionConstants;
import com.opensymphony.xwork2.ActionContext;
import com.free4lab.webrtc.action.account.*;
//import com.free4lab.webrtc.action.authorization.Auth;
import com.free4lab.webrtc.action.authorization.WMSRequest;

public class LoginAction extends BaseLoginAction {

	/**
	 * 
	 */
//	private static final long serialVersionUID = -2567646001401970359L;
//	private static final Logger logger = Logger.getLogger(LoginAction.class);
//	private String oauthToken;
//	private String redirectUrl;
//	private String myredirectUrl;
	
	public static final String NOT_LOGINED = "notlogined";
	
	private static final long serialVersionUID = 1L;
	private static final Logger logger = Logger.getLogger(LoginAction.class);
	@Override
	public boolean writeToSession(JSONObject obj) {
//		logger.info(obj);

		System.out.println("obj:"+obj);
		if (obj != null && obj.has("uid")){
			//可以通过检查uid字段判断此json对象是否有效
			Map<String, Object> session = ActionContext.getContext().getSession();
			//将用户信息存入session，session的key可以自己在应用的Constants里定义
			Integer userId = jsonGetUserId(obj);
			String email = jsonGetEmail(obj);
			System.out.println(obj);
			session.put(SessionConstants.UserID, userId);
			session.put(SessionConstants.UserEmail, email);
			logger.info("UserId"+userId);
			
			try {
			 JSONObject js= WMSRequest.getTargetValue("api/WMSAuth");
			 
			 System.out.println("api/WMSAuth response js="+js);
			 try {
				if(js.getInt("result")==0){
		       String thirdAccessToken = js.getString("accesstoken");
		       String thirdUser = js.getString("webRTCUserID");
		       logger.info(thirdAccessToken+thirdUser);
			   session.put(SessionConstants.ThirdPartyAccToken, thirdAccessToken);
			   session.put(SessionConstants.ThirdPartyUser, thirdUser);
				}
				} catch (JSONException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			} catch (UnknownHostException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (NoSuchAlgorithmException e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			}
			
			
			return true;
			
       } else {
    	   	logger.info("获取的用户信息为空");
       }

       return false;
	}

	@Override
	public String giveDefaultRedirect() {
		//返回应用默认跳转的地址，
		return "/majors";
	}

	@Override
	public String writeAccessTokenToSession(String access_token) {
		Map<String, Object> session = ActionContext.getContext().getSession();//获取http session
		//将传入的access_token写入session
		session.put(SessionConstants.AccessToken, access_token);
		session.put(SessionConstants.AccToken, access_token.substring(8, 24));
		
		session.put(SessionConstants.Access_Token, access_token);
		
		
		
		//		logger.info("test3");
//		try {
//		logger.info("test2");
//		Auth.sendWMSHttpAuth();
//	} catch (NoSuchAlgorithmException e) {
//		// TODO Auto-generated catch block
//		e.printStackTrace();
//	} catch (JSONException e) {
//		// TODO Auto-generated catch block
//		e.printStackTrace();
//	}	
		return null;
	}

	@Override
	public String giveClientSecret() {
		//返回account分配给应用的secret_key
		return SessionConstants.SECRET_KEY;
	}
	

//	private String login(){
//		if (null != oauthToken) {
//			// 获取accessToken
//			String accessToken = AccountManager.getAccessToken(oauthToken);
//			if (null == accessToken || accessToken.isEmpty()) {
//				logger.info("accessToken is null or is empty!");
//				return NOT_LOGINED;
//			}
//			// 获取用户名信息，并把用户信息、组消息写入会话中
//			logger.info("开始到userinfo请求用户信息，accesstoken为：" + accessToken);
//			logger.info("开始到userinfo请求用户信息，oauthToken为：" + oauthToken);
////		    UserInfo ui = AccountManager.getUserInfo(accessToken);
//			String result = AccountManager.getUserInfoByAccessToken(accessToken);
//			JSONObject ui = null;
//			try {
//				ui = new JSONObject(result);
//				
//			} catch (JSONException e1) {
//				// TODO Auto-generated catch block
//				e1.printStackTrace();
//			}			
//			if(!AccountManager.writeToSession(ui, accessToken)){
//				logger.info("用户信息写入session失败。");
//				return NOT_LOGINED;
//			}
//			ActionContext context = ActionContext.getContext();  
//		    HttpServletRequest request = (HttpServletRequest) context.get(ServletActionContext.HTTP_REQUEST);
//			
//			try {
//				redirectUrl = java.net.URLEncoder.encode(redirectUrl, "utf-8");
//			} catch (UnsupportedEncodingException e) {
//				// TODO Auto-generated catch block
//				e.printStackTrace();
//			}
//			logger.info("登录成功，开始跳转到：" + redirectUrl);
//			if (redirectUrl == null || redirectUrl.equals("")) {
//				setRedirectUrl("main");
//			}
//			myredirectUrl = APIConstants.APIPrefix_FreeAccount+"login?customId=webrtc&handleUrl="
//					+ request.getScheme() + "://"+ request.getServerName() + ":" + request.getServerPort()
//					+ request.getContextPath() + "/secondlogin"
//					+ "?redirectUrl=" + java.net.URLEncoder.encode(redirectUrl);
//			return SUCCESS;
//		}else {
//			// 会话中无用户信息，而且无oauth_token参数，表示未登录
//			return NOT_LOGINED;
//		}
//	}
	
//	public String getOauthToken() {
//		return oauthToken;
//	}
//
//	public void setOauthToken(String oauthToken) {
//		this.oauthToken = oauthToken;
//	}

//	public String getRedirectUrl() {
//		System.out.println( ((String[]) ActionContext.getContext().getParameters().get("redirectUrl"))[0]);
//		try {
//			redirectUrl = URLDecoder.decode(redirectUrl, "utf-8");
//		} catch (UnsupportedEncodingException e) {
//			e.printStackTrace();
//		}
//		return redirectUrl;
//	}

//	public void setRedirectUrl(String redirectUrl) {
//		this.redirectUrl = redirectUrl;
//	}
//
//	public String getMyredirectUrl() {
//		return myredirectUrl;
//	}
//
//	public void setMyredirectUrl(String myredirectUrl) {
//		this.myredirectUrl = myredirectUrl;
//	}
	
//	public String getSessionToken(){
//		return (String)ActionContext.
//			getContext().getSession().get(SessionConstants.AccessToken);
//	}
	public static void main(String[] args) throws JSONException, NoSuchAlgorithmException, UnknownHostException{
		//向WMS发起认证请求
		logger.info("test1");		
	
			 JSONObject js= WMSRequest.getTargetValue("api/WMSAuth");
		
				if(js.getInt("result")==0){
		        String thirdAccessToken = js.getString("accesstoken");                		
			}
		}

}



