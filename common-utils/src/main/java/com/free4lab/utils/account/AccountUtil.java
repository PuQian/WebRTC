package com.free4lab.utils.account;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.TreeMap;

import org.apache.log4j.Logger;
import org.json.JSONException;
import org.json.JSONObject;

import com.free4lab.utils.hash.Md5Util;
import com.free4lab.utils.http.HttpCrawler;



public class AccountUtil {
	/**
	 * 登录过程用到的方法
	 */
	
	final static Logger logger = Logger.getLogger(AccountUtil.class);

//	public static String getWMS_ACCOUNT() {
//		return WMS_ACCOUNT;
//	}

	final static int MAX_FREEACCOUNT_ATTEMPTS = 10;
	
	protected static String URL_ACCOUNT;
	protected static String HTTPS_ACCOUNT;
	protected static String INURL_ACCOUNT;
	protected static String Nginx_URL;
	
//    protected static String WMS_ACCOUNT;
	final static String URL_ACCESS_TOKEN = "api/oauth2/access_token";
	final static String URL_USER_INFO = "api/users/show";
	final static String URL_GET_ACCESSTOKEN_INFO = "api/oauth2/get_token_info";
	final static String URL_USER_INFOS = "api/users/show_batch";
	
	final static String EMAIL_KEY = "email";
	final static String USER_ID_KEY = "uid";
	final static String SCREEN_NAME_KEY = "screen_name";
	final static String REAL_NAME_KEY = "real_name";
	final static String PROFILE_IMAGE_URL_KEY = "profile_image_url";
	final static String ACCESS_TOKEN_KEY = "access_token";
	final static String CLIENT_SECRET_KEY = "client_secret";
	final static String CODE_KEY = "code";
	final static String USER_ID_LIST_KEY = "uids";
	final static String FRID_KEY = "frid";
	final static String RESULT_KEY = "result";
	final static String EXPIRE_IN_KEY = "expire_in";
	final static String STATE_KEY = "state";
	final static String GRAND_TYPE_KEY = "grand_type";
	final static String USER_KEY = "user";
	final static String USERS_KEY = "users";
	final static String SUCCESS_KEY = "success";
	final static String SOURCE_KEY = "source";
	final static String SIGNATURE_KEY = "signature";
	final static String RECORDS_KEY = "records";
	final static String LISTS_KEY = "lists";
	
	
	static {
		final Logger logger = Logger.getLogger("App configuration");
		logger.info("+++++++++++App configuration information++++++++++++");
		try {
			Properties p = new ConfigurationUtil().getPropertyFileConfiguration("app.properties");
           
			URL_ACCOUNT = p.getProperty("URL_ACCOUNT");
            logger.info("URL_ACCOUNT:" + URL_ACCOUNT);
            
            HTTPS_ACCOUNT = p.getProperty("HTTPS_ACCOUNT");
            logger.info("HTTPS_ACCOUNT:" + HTTPS_ACCOUNT);
            
            INURL_ACCOUNT=p.getProperty("INURL_ACCOUNT");
            logger.info("INURL_ACCOUNT:" + INURL_ACCOUNT);
            
            Nginx_URL=p.getProperty("Nginx_URL");
            logger.info("Nginx_URL:" + Nginx_URL);
            
//            WMS_ACCOUNT = p.getProperty("WMS_ACCOUNT");
//            logger.info("WMS_ACCOUNT:"+ WMS_ACCOUNT);
        } catch (Exception e) {
        	URL_ACCOUNT = "http://account.free4lab.com/";
        	HTTPS_ACCOUNT = "https://account.free4lab.com/";
        	logger.warn("Failed to init app configuration" + e.getMessage());
        }
		logger.info("----------App configuration successfully----------");
    }
	
	/**
	 * 获取access_token的方法
	 * @param code
	 * @param client_secret
	 * @return
	 */
	public static String getAccessTokenByCode(String code, String client_secret){
		Map<String, List<String>> params = new HashMap<String, List<String>>();
		
		List<String> appKey = new ArrayList<String>();
		List<String> oauthKey = new ArrayList<String>();
		List<String> grandKey = new ArrayList<String>();
		appKey.add(client_secret);
		oauthKey.add(code);
		grandKey.add("authorization_code");
		params.put(CLIENT_SECRET_KEY, appKey);
		params.put(CODE_KEY, oauthKey);
		params.put(GRAND_TYPE_KEY, grandKey);
		
		String action = URL_ACCESS_TOKEN;
		JSONObject obj = null;
		String accessToken = null;
		try {
			obj = getTargetValue(action, params);
			if(obj != null && obj.has(ACCESS_TOKEN_KEY)){
				accessToken = obj.getString(ACCESS_TOKEN_KEY);
			}
			logger.info(ACCESS_TOKEN_KEY+"="+accessToken);
		} catch (JSONException e) {
			e.printStackTrace();
		}
		return accessToken;
	}
	
	/**
	 * 根据accessToken获取当前用户的信息，返回一个Json对象
	 * @param access_token
	 * @return
	 */
	public static JSONObject getUserByAccessToken(String access_token){
		String action = URL_USER_INFO;
		JSONObject obj = null;
		
		Map<String, List<String>> params = new HashMap<String, List<String>>();
		List<String> accessToken = new ArrayList<String>();
		accessToken.add(access_token);
		
		params.put(ACCESS_TOKEN_KEY, accessToken);
		try {
			obj = getTargetValue(action, params);
			String userInfo = obj.getString(USER_KEY);
			obj = new JSONObject(userInfo);
		} catch (JSONException e) {
			e.printStackTrace();
		}
		return obj;
	}
	
	/**
	 * 获取access_token信息，验证access_token是否有效
	 * @param access_token
	 * @return
	 */
	public static String getAccessTokenInfo(String access_token){
		String action = URL_GET_ACCESSTOKEN_INFO;
		JSONObject obj = null;
		String expire_in = "-2";
		
		Map<String, List<String>> params = new HashMap<String, List<String>>();
		List<String> accessToken = new ArrayList<String>();
		accessToken.add(access_token);
		params.put(ACCESS_TOKEN_KEY, accessToken);
		
		try {
			obj = getTargetValue(action, params);
			if(obj != null && obj.has(EXPIRE_IN_KEY)){
				expire_in = obj.getString(EXPIRE_IN_KEY);
			}
			logger.info(EXPIRE_IN_KEY+"="+expire_in);
		} catch (JSONException e) {
			e.printStackTrace();
		}
		return expire_in;
	}
	
	
	//根据action和参数返回json对象
	public static JSONObject getTargetValue(String url, Map<String, List<String>> params) {
		String result = null;
		int i = 0;//获取result，共测试MAX_FREEACCOUNT_ATTEMPTS次
		//url = URL_ACCOUNT + url;
		
		url=INURL_ACCOUNT+url;
		while ((result == null || "".equalsIgnoreCase(result)) && i <= MAX_FREEACCOUNT_ATTEMPTS) {
			logger.info(url+";"+params);
			result = HttpCrawler.getHtmlDoc(url, params);
			logger.info("第"+i+"次尝试:"+result);
			i++;
		}
		try {
			return new JSONObject(result);
		} catch (JSONException e) {
			return new JSONObject();
		}
	}

	/**
	 * 
	 * @param params
	 * @param client_secret
	 * @return
	 */
	public static String getSignature(Map<String, String> params, String client_secret){
		Map<String, String> treeMap = new TreeMap<String, String>(params);
		StringBuffer signatures = new StringBuffer("");
		Iterator<String> iterator = treeMap.keySet().iterator();
		while (iterator.hasNext()) {
			String key = iterator.next();
			String value = treeMap.get(key);
			signatures.append(key + "=" + value + "&");
		}
		String signature = signatures.substring(0, signatures.length()-1);
		String signatureMd5 = Md5Util.getMd5Standard(signature);
		String secretKey = client_secret + "&";
		String signatureMd5Md5 = Md5Util.getMd5Standard(signatureMd5 + "&" + secretKey);
		
		return signatureMd5Md5;
	}
	
	public static String getNginx_URL() {
		return Nginx_URL;
	}
	
	public static void main(String[] args){
		Map<String, String> params = new HashMap<String, String>();
		params.put("uid", "313");
		/*params.put("real_name", "杨婧媛");
		params.put("description", "好人");
		params.put("pwd", "e10adc3949ba59abbe56e057f20f883e");
		params.put("company", "40");*/
		params.put("source", "freeshareadmin");
		params.put("pwd", "e10adc3949ba59abbe56e057f20f883e");
		System.out.println(getSignature(params, "freeshareAdminSecretKey"));
		//destroy?email=yjycrystal@163.com&source=userinfo&signature=fc93a1fd944be5bc7482b1c789016880
		//email=yjycrystal@163.com&pwd=e10adc3949ba59abbe56e057f20f883e&real_name=杨婧媛&description=好人&company=40&source=userinfo&signature=a08ee751a472dec32fcefb7c175a802d
	}

	

}
