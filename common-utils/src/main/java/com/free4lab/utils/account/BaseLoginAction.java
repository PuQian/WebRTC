package com.free4lab.utils.account;

import java.security.NoSuchAlgorithmException;
import java.util.Map;

import org.apache.log4j.Logger;
import org.json.JSONException;
import org.json.JSONObject;

import com.free4lab.utils.action.BaseAction;

import com.opensymphony.xwork2.ActionContext;

public abstract class BaseLoginAction extends BaseAction  {

	/**
	 * 登录方法的抽象父类
	 */
	private static final long serialVersionUID = 1L;

	final static Logger logger = Logger.getLogger(BaseLoginAction.class);
	
	//抽象方法，把用户信息写入session,在获取userInfo之后被调用，也可以补充应用自己需要的功能
	public abstract boolean writeToSession(JSONObject obj) throws NoSuchAlgorithmException;
	//抽象方法，给出默认的redirectUrl地址
	public abstract String giveDefaultRedirect();
	//抽象方法，把accessToken写入session
	public abstract String writeAccessTokenToSession(String access_token);
	//抽象方法，给出client_secret
	public abstract String giveClientSecret();
	
	protected String code;
	protected String redirect_url;
	protected String state;
	
	public String execute() throws NoSuchAlgorithmException {
		Map<String, Object> session = ActionContext.getContext().getSession();
		String stateInSession = (String) session.get(AccountUtil.STATE_KEY);
		logger.info("stateInSession"+stateInSession);
		if(stateInSession == null || stateInSession.equalsIgnoreCase("") || 
				state == null || state.equalsIgnoreCase("") || 
				(state != null && !"".equalsIgnoreCase(state) && stateInSession.equalsIgnoreCase(state)) ){
			session.remove(AccountUtil.STATE_KEY);
			if( code != null && !"".equalsIgnoreCase(code)){
				//获得accessToken
				String client_secret = giveClientSecret();
				
				System.out.println("AccountUtil.STATE_KEY="+AccountUtil.STATE_KEY+"\n");
				System.out.println("SessionConstants.SECRET_KEY="+giveClientSecret()+"\n");
				String access_token = AccountUtil.getAccessTokenByCode(code, client_secret);
				logger.info("access_token="+access_token);
				System.out.println("access_token = "+access_token);
				if (null == access_token || access_token.isEmpty()) {
					logger.info("the code is invalid! access_token is null or empty!");
					return INPUT;
				}
				writeAccessTokenToSession(access_token);
				// 获取用户名信息，并把用户信息写入会话中
				logger.info("开始请求用户信息，accesstoken为：" + access_token);
				JSONObject obj = AccountUtil.getUserByAccessToken(access_token);
				
				writeToSession(obj);
				
				if(redirect_url == null || "".equalsIgnoreCase(redirect_url)){
					redirect_url = giveDefaultRedirect();
				}
				
				System.out.println("redirect_url="+redirect_url);
				
				return SUCCESS;
			} else {
				logger.info("code 为空!");
				return INPUT;
			}
		}else{
			logger.info("state为空或者错误");
			return INPUT;
		}
		
	}
	
	/**
	 * 从json中提取userId
	 * @param obj
	 * @return
	 */
	protected int jsonGetUserId(JSONObject obj){
		try {
			return obj.getInt(AccountUtil.USER_ID_KEY);
		} catch (JSONException e) {
			e.printStackTrace();
		}
		return -1;
	}
	
	/**
	 * 从json中提取email
	 * @param obj
	 * @return
	 */
	protected String jsonGetEmail(JSONObject obj){
		try {
			return obj.getString(AccountUtil.EMAIL_KEY);
		} catch (JSONException e) {
			e.printStackTrace();
		}
		return null;
	}
	
	/**
	 * 从json中提取screen_name
	 * @param obj
	 * @return
	 */
	protected String jsonGetScreenName(JSONObject obj){
		try {
			return obj.getString(AccountUtil.SCREEN_NAME_KEY);
		} catch (JSONException e) {
			e.printStackTrace();
		}
		return null;
	}
	
	/**
	 * 从json中提取real_name
	 * @param obj
	 * @return
	 */
	protected String jsonGetRealName(JSONObject obj){
		try {
			return obj.getString(AccountUtil.REAL_NAME_KEY);
		} catch (JSONException e) {
			e.printStackTrace();
		}
		return null;
	}
	
	/**
	 * 从json中提取profile_image_url
	 * @param obj
	 * @return
	 */
	protected String jsonGetProfileImageUrl(JSONObject obj){
		try {
			return obj.getString(AccountUtil.PROFILE_IMAGE_URL_KEY);
		} catch (JSONException e) {
			e.printStackTrace();
		}
		return null;
	}
	
	/**
	 * 从json中提取access_token
	 * @param obj
	 * @return
	 */
	protected String jsonGetAccessToken(JSONObject obj){
		try {
			return obj.getString(AccountUtil.ACCESS_TOKEN_KEY);
		} catch (JSONException e) {
			e.printStackTrace();
		}
		return null;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getRedirect_url() {
		return redirect_url;
	}

	public void setRedirect_url(String redirect_url) {
		this.redirect_url = redirect_url;
	}
	
	public String getState() {
		return state;
	}
	
	public void setState(String state) {
		this.state = state;
	}

}
