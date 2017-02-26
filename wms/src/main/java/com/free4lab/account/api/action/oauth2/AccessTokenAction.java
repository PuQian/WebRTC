package com.free4lab.account.api.action.oauth2;

import java.util.Map;

import org.apache.log4j.Logger;
import org.perf4j.aop.Profiled;

import com.free4lab.account.common.Constants;
import com.free4lab.account.manager.AccessTokenManager;
import com.free4lab.account.manager.ClientManager;
//import com.free4lab.account.manager.LogUtilManager;
import com.free4lab.account.manager.ParameterUtilManager;
import com.free4lab.account.module.Oauth2Module;
import com.free4lab.utils.action.BaseAction;
import com.opensymphony.xwork2.ActionContext;

public class AccessTokenAction extends BaseAction {
	/**
	 * 获取accessToken的方法，通过code（其实是code_sso）获取code，再从code获取accessToken
	 */
	private static final long serialVersionUID = 1L;

	final static Logger logger = Logger.getLogger(AccessTokenAction.class);
//	private static final LogUtilManager lol = new LogUtilManager(AccessTokenAction.class);

	private String access_token = "";
	private String message = "";
	private String result = "fail";

	@Profiled(tag = "AccessTokenAction.execute")
	public String execute() throws Exception {
		Map<String, Object> pMap = ActionContext.getContext().getParameters();
		Map<String, Object> session = ActionContext.getContext().getSession();
		String code = "";
		if (pMap.containsKey(Constants.PARAM_CODE)) {
			code = ((String[]) pMap.get(Constants.PARAM_CODE))[0];
			if (code.equalsIgnoreCase("") || !ParameterUtilManager.isUuid(code)) {
				this.setMessage("参数不合法" + Constants.PARAM_CODE);
				return SUCCESS;
			}
		} else {
			this.setMessage("缺少参数" + Constants.PARAM_CODE);
			return SUCCESS;
		}
		String client_secret = "";
		if (pMap.containsKey(Constants.PARAM_CLIENT_SECRET)) {
			client_secret = ((String[]) pMap.get(Constants.PARAM_CLIENT_SECRET))[0];
			if (client_secret.equalsIgnoreCase("") || !ParameterUtilManager.isString(client_secret)) {
				this.setMessage("参数不合法" + Constants.PARAM_CLIENT_SECRET);
				return SUCCESS;
			}
		} else {
			this.setMessage("缺少参数" + Constants.PARAM_CLIENT_SECRET);
			return SUCCESS;
		}
		String client_id = "";
		if (session.containsKey(Constants.PARAM_CLIENT_ID)) {
			client_id = (String) session.get(Constants.PARAM_CLIENT_ID);
		} else {
			client_id = ClientManager.getClientByClientSecret(client_secret)
					.getClient_id();
		}
		if (client_id.equalsIgnoreCase("") || !ParameterUtilManager.isString(client_id)) {
			this.setMessage("参数不合法" + Constants.PARAM_CLIENT_SECRET);
			return SUCCESS;
		}
		String grand_type = "";
		if (pMap.containsKey(Constants.PARAM_GRAND_TYPE)) {
			grand_type = ((String[]) pMap.get(Constants.PARAM_GRAND_TYPE))[0];
			if (!grand_type.equalsIgnoreCase("authorization_code")) {
				this.setMessage("参数不合法" + Constants.PARAM_GRAND_TYPE);
				return SUCCESS;
			}
		} else {
			this.setMessage("缺少参数" + Constants.PARAM_GRAND_TYPE);
			return SUCCESS;
		}
		logger.info("client_id:" + client_id);
		logger.info("code = " + code);
		logger.info("client_secret = " + client_secret);

		if (null != code && !code.equals("")) {
			access_token = Oauth2Module.getAccessTokenByCode(code, client_id,
					client_secret);
			if (!access_token.equalsIgnoreCase("")) {
//				lol.info(AccessTokenManager.getUserIdByAccessToken(access_token), "用户级获取授权通过的" + Constants.KEY_ACCESSTOKEN + "："+ access_token +"成功，授权码：" + grand_type, "OAuth2.0", grand_type, client_id);
				setMessage("获取accessToken成功！");
				setResult("success");
			} else {
//				lol.error(-1, "用户级获取授权通过的" + Constants.KEY_ACCESSTOKEN + "："+ access_token +"失败，code和client_secret不匹配，授权码：" + grand_type, "OAuth2.0", grand_type, client_id);
				setMessage("所传参数有误，code和client_secret不匹配！");
			}
		}
		return SUCCESS;
	}

	public String getAccess_token() {
		return access_token;
	}

	public void setAccess_token(String access_token) {
		this.access_token = access_token;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public String getResult() {
		return result;
	}

	public void setResult(String result) {
		this.result = result;
	}
}