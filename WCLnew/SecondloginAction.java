package com.free4lab.webrtc.action.account;

import java.io.IOException;
import java.util.Map;

import org.apache.http.client.HttpClient;
import org.apache.http.client.ResponseHandler;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.BasicResponseHandler;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.log4j.Logger;

import com.free4lab.utils.account.UserInfo;
import com.free4lab.webrtc.action.basic.BaseAction;
import com.free4lab.webrtc.common.SessionConstants;
import com.free4lab.webrtc.manager.AccountManager;
import com.opensymphony.xwork2.ActionContext;

public class SecondloginAction extends BaseAction {
	private static final Logger logger = Logger.getLogger(SecondloginAction.class);
	private String oauthToken;
	private String redirectUrl;
	
	public String execute() throws Exception{
		if(oauthToken != null){
			//存储oauthToken到session
			Map<String, Object> session = ActionContext.getContext()
					.getSession();
			session.put(SessionConstants.OauthToken, oauthToken);
			logger.info("oauthToken222="+oauthToken);
			
			/*String accessToken = AccountManager.getAccessToken(oauthToken);
			if (null == accessToken || accessToken.isEmpty()) {
				logger.info("accessToken is null or is empty!");
				return NOT_LOGINED;
			}
			// 获取用户名信息，并把用户信息、组消息写入会话中
			logger.info("开始到userinfo请求用户信息，acceeetoken为：" + accessToken);
			logger.info("开始到userinfo请求用户信息，oauthToken为：" + oauthToken);
			String result = AccountManager.getUserInfoByAccessToken(accessToken);
			if(result.contains("email")){
				logger.info("oauthToken is ok");
			}*/		
			/*String secretKey = "webrtcSecretKey";
		 	String url = "http://authentication.free4lab.com/api/getAccessToken?key=" + secretKey + "&oauthToken=" + oauthToken;
		 	System.out.println(url);
			HttpGet httpget = new HttpGet(url);  
		    ResponseHandler<String> responseHandler = new BasicResponseHandler();
		    HttpClient httpclient = new DefaultHttpClient();
		    String responseBody = httpclient.execute(httpget, responseHandler);
		    System.out.println("responseBody="+responseBody);*/

			return SUCCESS;
		}else{
			return NOT_LOGINED;
		}		
	}

	public String getOauthToken() {
		return oauthToken;
	}

	public void setOauthToken(String oauthToken) {
		this.oauthToken = oauthToken;
	}

	public String getRedirectUrl() {
		return redirectUrl;
	}

	public void setRedirectUrl(String redirectUrl) {
		this.redirectUrl = redirectUrl;
	}
	
}
