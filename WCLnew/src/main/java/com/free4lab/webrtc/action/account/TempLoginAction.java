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


public class TempLoginAction {
	private String temp_url;
	private String temp_name;
	private static String type;

	private static final long serialVersionUID = 1L;
	private static final Logger logger = Logger.getLogger(LoginAction.class);
	public static final String SUCCESS = "success";
	public static final String ERROR = "error";
	public String execute() throws NoSuchAlgorithmException, UnknownHostException, JSONException{
		
			System.out.println("temploginaction");
			JSONObject tempjs= getTargetValue("api/account/tempcreate");
			temp_url = tempjs.getString("temp_url");
			temp_name = tempjs.getString("temp_name");
			return SUCCESS;
	}
	public static JSONObject getTargetValue(String url) {
		Map<String, List<String>> params = new HashMap<String, List<String>>();
		Map<String, Object> session = ActionContext.getContext().getSession();
		final String URL_ACCOUNT = APIConstants.WMS_URL;
		int i=0;
		List<String> inviter_email = new ArrayList<String>();
		inviter_email.add((String) session.get(SessionConstants.UserEmail));
		params.put("inviter_email", inviter_email);
		
//		List<String> temp_name = new ArrayList<String>();
//		temp_name.add("temp"+i++);
//		params.put("temp_name", temp_name);
//		
//		List<String> temp_account = new ArrayList<String>();
//		temp_account.add(UUID.randomUUID().toString().replace("-", ""));
//		params.put("temp_account", temp_account);
		
		List<String> temp_type = new ArrayList<String>();
		if(type.equals("video"))
		{
			temp_type.add("0");// vedio==>0
		}
		if(type.equals("meeting"))
		{
			temp_type.add("1");// meeting==>1
		}
		params.put("temp_type", temp_type);
		
		List<String> temp_url = new ArrayList<String>();
		temp_url.add("http://"+AccountUtil.getNginx_URL()+"/WCLnew");
		params.put("temp_url", temp_url);

//		List<String> temp_begintime = new ArrayList<String>();
//		temp_begintime.add(System.currentTimeMillis()+"");
//		params.put("temp_begintime", temp_begintime);
//		
//		List<String> temp_valid = new ArrayList<String>();
//		temp_valid.add("1");
//		params.put("temp_valid", temp_valid);
		
		List<String> temp_extend = new ArrayList<String>();
		temp_extend.add("webrtc");
		params.put("temp_extend", temp_extend);
		
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
	public String getTemp_url() {
		return temp_url;
	}

	public void setTemp_url(String temp_url) {
		this.temp_url = temp_url;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		TempLoginAction.type = type;
	}
	public String getTemp_name() {
		return temp_name;
	}
	public void setTemp_name(String temp_name) {
		this.temp_name = temp_name;
	}

}
