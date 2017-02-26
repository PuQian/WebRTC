package com.free4lab.account;

import java.io.IOException;
import java.security.MessageDigest;

import org.apache.commons.httpclient.Header;
import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.HttpException;
import org.apache.commons.httpclient.HttpMethodBase;
import org.apache.commons.httpclient.NameValuePair;
import org.apache.commons.httpclient.URIException;
import org.apache.commons.httpclient.cookie.CookiePolicy;
import org.apache.commons.httpclient.methods.GetMethod;
import org.apache.commons.httpclient.methods.PostMethod;
import org.json.JSONException;
import org.json.JSONObject;

public class AccountTester {
	private static final String testUrl = "http://localhost:8080/just4test/login";
	
	private static final String ACCOUNT_HOST = "localhost:8084/freeaccount";
	
	private static final String loginPageUrl = "http://" + ACCOUNT_HOST
			+ "/oauth2/authorize?client_id=freeshare&redirect_uri=" + testUrl;
	
	private static final String loginCheckUrl = "http://" + ACCOUNT_HOST
			+ "/oauth2/loginCheck";
	
	private static final String getAccessTokenUrl = "http://" + ACCOUNT_HOST
			+ "/oauth2/access_token?client_id=freeshare&client_secret=freeshareSecretKey" +
			"&grant_type=authorization_code&redirect_uri=" + testUrl + "&code=";
	
	private static final String getUserInfoUrl = "http://" + ACCOUNT_HOST
			+ "/users/show";
	
	private static final String logoutUrl = "http://" + ACCOUNT_HOST
			+ "/oauth2/revokeoauth2";

	private static final String email = "lmqt890930@163.com";
	private static final String password = "123456";
	private static String code = null;
	
	private static String access_token = null;
	private static String uid = null;
	private static String userId = null;

	private HttpClient httpClient = new HttpClient();

	public AccountTester() {
		httpClient.getParams().setCookiePolicy(
				CookiePolicy.BROWSER_COMPATIBILITY);
	}

	public void doTest() throws HttpException, IOException {
		System.out.println("loginFirstTime:" + loginFirstTime());
		System.out.println("loginSecondTime:" + loginSecondTime());
		System.out.println("getAccessToken:" + getAccessToken());
		System.out.println("getUserInfo:" + getUserInfo());
		System.out.println("logout:" + logout());
	}

	protected boolean loginFirstTime() throws HttpException, IOException {
        GetMethod getLoginPage = new GetMethod(loginPageUrl); 
        httpClient.executeMethod(getLoginPage); 
        
		return loginCheck();
	}
	
	protected boolean loginSecondTime() throws URIException{
		GetMethod getLoginPage = new GetMethod(loginPageUrl); 
        try {
			httpClient.executeMethod(getLoginPage);
		} catch (HttpException e) {
			// TODO Auto-generated catch block
//			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
//			e.printStackTrace();
		} 
        
        return  getLoginPage.getURI().toString().startsWith(testUrl);
	}
	
	protected boolean getAccessToken() throws HttpException, IOException{
		if (code == null){
			return false;
		}
		
		GetMethod getAccessToken = new GetMethod(getAccessTokenUrl + code); 
        httpClient.executeMethod(getAccessToken);
        
        String response = getAccessToken.getResponseBodyAsString();
//		System.out.println(response);
        try {
			JSONObject resp = new JSONObject(response);
			access_token = resp.getString("access_token");
//			uid = resp.getString("uid");
//			userId = resp.getString("userId");
			return true;
		} catch (JSONException e) {
			return false;
		}
	}
	
	protected boolean getUserInfo() throws HttpException, IOException{
		if (access_token == null){
			return false;
		}
		
		GetMethod getUserInfo = new GetMethod(getUserInfoUrl + "?access_token=" + access_token); 
        httpClient.executeMethod(getUserInfo);
//        System.out.println(getUserInfo.getResponseBodyAsString());
        if (getUserInfo.getStatusCode() == 200){
        	return true;
        }
        else{
        	return false;
        }
	}
	
	protected boolean logout() throws HttpException, IOException{
		if (access_token == null){
			return false;
		}
		
		GetMethod logoutPage = new GetMethod(logoutUrl + "?access_token=" + access_token.substring(8, 24)); 
        httpClient.executeMethod(logoutPage);
        
        String response = logoutPage.getResponseBodyAsString();
        
        return response.equals("{\"message\":\"accessToken expires successfully\"}");
	}
	
	protected boolean loginCheck() throws HttpException, IOException{
        PostMethod postLoginCheck = new PostMethod(loginCheckUrl); 
        NameValuePair[] data = { 
                new NameValuePair("email", email), 
                new NameValuePair("epsw", password), 
                new NameValuePair("passwordMd5", md5(password))
            }; 
	    postLoginCheck.setRequestBody(data); 

	    httpClient.executeMethod(postLoginCheck);
	    return checkLocation(postLoginCheck);
	}
	
	protected boolean checkLocation(HttpMethodBase method){
		Header location = method.getResponseHeader("Location");
        if (location == null){
        	System.out.println("location == null");
        	return false;
        }
        else{
        	if (location.getValue().startsWith(testUrl)){
        		int pos = location.getValue().indexOf("code=");
        		if (pos != -1){
        			code = location.getValue().substring(pos + 5);
        			return true;
        		}
        		else{
        			return false;
        		}
        	}
        	else{
            	return false;
        	}
        }
	}
	
	

	public static String md5(String source) {

		StringBuilder sb = new StringBuilder(32);
		try {
			MessageDigest md = MessageDigest.getInstance("MD5");
			byte[] array = md.digest(source.getBytes("utf-8"));

			for (int i = 0; i < array.length; i++) {
				sb.append(Integer.toHexString((array[i] & 0xFF) | 0x100)
						.substring(1, 3));
			}
		} catch (Exception e) {
			return null;
		}

		return sb.toString();
	}
}
