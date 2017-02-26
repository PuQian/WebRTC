package com.free4lab.account.api.action.oauth2;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.util.Map;

import org.apache.log4j.Logger;
import org.apache.struts2.json.JSONException;
import org.apache.struts2.json.JSONUtil;
import org.perf4j.aop.Profiled;

import com.free4lab.account.common.Constants;
//import com.free4lab.account.manager.LogUtilManager;
import com.free4lab.account.manager.ParameterUtilManager;
import com.free4lab.account.module.Oauth2Module;
import com.free4lab.account.module.SsoModule;
import com.free4lab.utils.action.BaseAction;
import com.opensymphony.xwork2.ActionContext;

public class RevokeOauth2Action extends BaseAction {

	/**
	 * 单点退出方法 将accessToken置为无效，并清除应用侧的session
	 */
	private static final long serialVersionUID = 1L;
	private static final Logger logger = Logger
			.getLogger(RevokeOauth2Action.class);
//	private static final LogUtilManager lol = new LogUtilManager(RevokeOauth2Action.class);

	private String message = "success";
	private String result = "fail";
	private String callback;
	private String myresult;
	private InputStream inputStr;

	@Profiled(tag = "RevokeOauth2Action.execute")
	public String execute() throws Exception {
		Map<String, Object> pMap = ActionContext.getContext().getParameters();
		String access_token = "";
		if (!pMap.containsKey(Constants.PARAM_ACCESS_TOKEN)) {
			setMessage("缺少参数 " + Constants.PARAM_ACCESS_TOKEN);
			return SUCCESS;
		} else {
			access_token = ((String[]) pMap.get(Constants.SESSION_ACCESSTOKEN))[0];
			if (access_token.equalsIgnoreCase("") || !ParameterUtilManager.isUuid(access_token)
					&& !ParameterUtilManager.isUuid16(access_token)) {
				this.setMessage("参数不合法" + Constants.PARAM_ACCESS_TOKEN);
				return SUCCESS;
			}
		}

		//添加日志，用户退出登录
		/*List<AccessToken> atList = new ArrayList<AccessToken>();
		if(access_token != null && (access_token.length() == 32 || access_token.length() == 16)){
			atList = AccessTokenManager.getAccessTokens(access_token);
			for(AccessToken at : atList){
				if(at.getValid() == 1){
					 AuditModule.addLogout(atList.get(0).getUid(), atList.get(0).getAccess_token(), atList.get(0).getExtend());
					 break;
				}
			}
			
		}*/
		SsoModule.removeSession();
		logger.info("清除Session成功！");
		if (Oauth2Module.revokeOauth2(access_token)) {
			result = "success";
			setMessage("access_token expires successfully");
			
			try {
				myresult = callback + "(" + JSONUtil.serialize(result) + ")";
			} catch (JSONException e1) {
				e1.printStackTrace();
			}
	    	try {
				inputStr = new ByteArrayInputStream(myresult.getBytes("utf-8"));
			} catch (UnsupportedEncodingException e) {
				logger.debug("UnsupportedEncodingException");
				e.printStackTrace();
			}
	    	return SUCCESS;
		} else {
//			lol.info(-1, "用户级退出失败，" + Constants.KEY_ACCESSTOKEN + "：" + access_token + "不存在或者已失效", "退出", access_token, null);
			setMessage("accessToken does not exist or already be invalid!");
			try {
				myresult = callback + "(" + JSONUtil.serialize(result) + ")";
			} catch (JSONException e1) {
				e1.printStackTrace();
			}
	    	try {
				inputStr = new ByteArrayInputStream(myresult.getBytes("utf-8"));
			} catch (UnsupportedEncodingException e) {
				logger.debug("UnsupportedEncodingException");
				e.printStackTrace();
			}
			return SUCCESS;
		}
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String msg) {
		message = msg;
	}

	public String getResult() {
		return result;
	}

	public void setResult(String result) {
		this.result = result;
	}

	public String getCallback() {
		return callback;
	}

	public void setCallback(String callback) {
		this.callback = callback;
	}

	public String getMyresult() {
		return myresult;
	}

	public void setMyresult(String myresult) {
		this.myresult = myresult;
	}

	public InputStream getInputStr() {
		return inputStr;
	}

	public void setInputStr(InputStream inputStr) {
		this.inputStr = inputStr;
	}

}
