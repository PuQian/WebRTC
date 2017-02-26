package com.free4lab.webrtc.action.account;

import java.net.UnknownHostException;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.apache.log4j.Logger;
import org.json.JSONException;
import org.json.JSONObject;

import com.appcloud.enabler.sdk.common.Constants;
import com.free4lab.utils.account.AccountUtil;
import com.free4lab.utils.http.HttpCrawler;

import com.free4lab.webrtc.action.authorization.WMSRequest;
import com.free4lab.webrtc.common.APIConstants;
import com.free4lab.webrtc.common.SessionConstants;
import com.opensymphony.xwork2.ActionContext;


public class TempLoginAuthAction {
	private String result;
	private String temp_name;
	private long temp_begintime;
	private String temp_access_token;
	private Integer temp_type;
	private String temp_type2;
	private String inviter_email;
	
	private static final long serialVersionUID = 1L;
	private static final Logger logger = Logger.getLogger(TempLoginAuthAction.class);
	public static final String SUCCESS = "success";
	public static final String ERROR = "error";
	public String execute() throws NoSuchAlgorithmException, UnknownHostException, JSONException{
		
		Map<String, Object> session = ActionContext.getContext().getSession();
			System.out.println("TempLoginAuthaction");
			JSONObject tempjs= getTargetValue("api/oauth2/tempauthorize",temp_name,temp_begintime);
			result = tempjs.getString("result");
			temp_access_token = tempjs.getString("temp_access_token");
			String thirdAccessToken = tempjs.getString("temp_access_token");
		    String thirdUser = tempjs.getString("temp_name");
		    System.out.println("thirdAccessToken="+thirdAccessToken+", thirdUser="+thirdUser);
			session.put(SessionConstants.ThirdPartyAccToken, thirdAccessToken);
			session.put(SessionConstants.AccessToken, thirdAccessToken);
			session.put(SessionConstants.ThirdPartyUser, thirdUser);
			String temp_email=temp_name.split("@")[0];
			session.put(SessionConstants.UserID,temp_name);
			session.put(SessionConstants.UserEmail,temp_email);
			System.out.println("temp_type="+temp_type);
			if(temp_type.equals(0))
				setTemp_type2("video");
				
			if(temp_type.equals(1))
				setTemp_type2("meeting");
				
			System.out.println("temp_type2="+temp_type2);
			if(result.equalsIgnoreCase("true")){
				System.out.println("result="+result);
				
			 return SUCCESS;
			}else return ERROR;
	}
	public static JSONObject getTargetValue(String url,String temp_nameauth,long temp_begintimeauth) {
		Map<String, List<String>> params = new HashMap<String, List<String>>();
		final String URL_ACCOUNT = APIConstants.WMS_URL;
		

		List<String> temp_name = new ArrayList<String>();
		temp_name.add(temp_nameauth);
		params.put("temp_name", temp_name);
		
		
		List<String> temp_begintime = new ArrayList<String>();
		temp_begintime.add(temp_begintimeauth+"");
		params.put("temp_begintime", temp_begintime);
		
		String result = null;
		int j = 0;//获取result，共测试MAX_FREEACCOUNT_ATTEMPTS次
		url = URL_ACCOUNT + url;
		while ((result == null || "".equalsIgnoreCase(result)) && j <= 10) {
			logger.info(url+";"+params);
			result = HttpCrawler.getHtmlDoc(url, params);
			logger.info("第"+j+"次尝试:"+result);
			j++;
		}
		try {
			return new JSONObject(result);
		} catch (JSONException e) {
			return new JSONObject();
		}
	}
	
	
	public String getResult() {
		return result;
	}
	public void setResult(String result) {
		this.result = result;
	}
	public String getTemp_name() {
		return temp_name;
	}
	public void setTemp_name(String temp_name) {
		this.temp_name = temp_name;
	}
	public long getTemp_begintime() {
		return temp_begintime;
	}
	public void setTemp_begintime(long temp_begintime) {
		this.temp_begintime = temp_begintime;
	}
	public String getTemp_access_token() {
		return temp_access_token;
	}
	public void setTemp_access_token(String temp_access_token) {
		this.temp_access_token = temp_access_token;
	}
	public Integer getTemp_type() {
		return temp_type;
	}
	public void setTemp_type(Integer temp_type) {
		this.temp_type = temp_type;
	}
	public String getTemp_type2() {
		return temp_type2;
	}
	public void setTemp_type2(String temp_type2) {
		this.temp_type2 = temp_type2;
	}
	public String getInviter_email() {
		return inviter_email;
	}
	public void setInviter_email(String inviter_email) {
		this.inviter_email = inviter_email;
	}

	}


