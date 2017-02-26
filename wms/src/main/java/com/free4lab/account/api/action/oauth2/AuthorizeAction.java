package com.free4lab.account.api.action.oauth2;

import java.util.Map;
import java.util.Set;
import java.util.Iterator;
import java.util.UUID;

import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.apache.struts2.ServletActionContext;
import org.perf4j.aop.Profiled;

import com.free4lab.account.common.Constants;
import com.free4lab.account.manager.AccessTokenManager;
import com.free4lab.account.manager.ClientManager;
//import com.free4lab.account.manager.LogUtilManager;
import com.free4lab.account.manager.ParameterUtilManager;
import com.free4lab.account.manager.LoginUtilManager;
import com.free4lab.account.model.AccessToken;
import com.free4lab.account.model.Client;
import com.free4lab.account.model.Code;
import com.free4lab.account.module.AuditModule;
import com.free4lab.account.module.Oauth2Module;
import com.free4lab.account.module.SsoModule;
import com.free4lab.utils.action.BaseAction;
import com.opensymphony.xwork2.ActionContext;

public class AuthorizeAction extends BaseAction {
	/**
	 * 第三方应用登录接口 若用户已登录，直接返回；否则返回登录页面供用户输入用户名密码
	 */
	private static final long serialVersionUID = 1L;

	private static final Logger logger = Logger
			.getLogger(AuthorizeAction.class);
//	private static final LogUtilManager lol = new LogUtilManager(AuthorizeAction.class);
	private String message = "";
	private String loginUrl = "";
	private String random = "";
	private String state = "";
	private String accTokenValue = "";
	private String result = "";
	private String sessionUrl = "";
	private String client_id = "";
	private String redirect_uri = "";

	@Profiled(tag = "AuthorizeAction.execute")
	public String execute() throws Exception {
		// 获取参数&参数合法性检查
		Map<String, Object> pMap = ActionContext.getContext().getParameters();
		if (pMap.containsKey(Constants.PARAM_STATE)) {
			state = ((String[]) pMap.get(Constants.PARAM_STATE))[0];
			if (state.equalsIgnoreCase("") || !ParameterUtilManager.isUuid(state)) {
				this.setMessage("参数不合法" + Constants.PARAM_STATE);
				return SUCCESS;
			}
		}
		//String client_id = "";
		if (!pMap.containsKey(Constants.PARAM_CLIENT_ID)) {
			this.setMessage("缺少参数" + Constants.PARAM_CLIENT_ID);
			return SUCCESS;
		} else {
			client_id = ((String[]) pMap.get(Constants.PARAM_CLIENT_ID))[0];
			if (client_id.equalsIgnoreCase("") || !ParameterUtilManager.isString(client_id)) {
				this.setMessage("参数不合法" + Constants.PARAM_CLIENT_ID);
				return SUCCESS;
			}
		}
		//String redirect_uri = "";
		if (!pMap.containsKey(Constants.PARAM_REDIRECT_URI) && ! client_id.equalsIgnoreCase("freeshare_mobile")) {
			this.setMessage("缺少参数" + Constants.PARAM_REDIRECT_URI);
			return SUCCESS;
		} else if(! client_id.equalsIgnoreCase("freeshare_mobile") ){
			redirect_uri = ((String[]) pMap.get(Constants.PARAM_REDIRECT_URI))[0];
		}
		// 通过client_id判断第三方是否合法，若合法保存client_id和redirect_uri至session
		Client clientResult = ClientManager.getClientByClientId(client_id);
		
		if (null == clientResult) {
			setMessage("第三方不合法" + Constants.PARAM_CLIENT_ID);
			return ERROR;
		}
		Map<String, Object> session = ActionContext.getContext().getSession();
		if (client_id != null && !client_id.equals("")) {
			if (session.get(Constants.SESSION_CLIENT_ID) == null) {
				session.put(Constants.SESSION_CLIENT_ID, client_id);
			} else {
				session.remove(Constants.SESSION_CLIENT_ID);
				session.put(Constants.SESSION_CLIENT_ID, client_id);
			}
		}
		if (redirect_uri != null && !redirect_uri.equals("")) {
			if (session.get(Constants.SESSION_REDIRECT_URI) == null) {
				session.put(Constants.SESSION_REDIRECT_URI, redirect_uri);
			} else {
				session.remove(Constants.SESSION_REDIRECT_URI);
				session.put(Constants.SESSION_REDIRECT_URI, redirect_uri);
			}
		}	
		
		HttpServletRequest request = ServletActionContext.getRequest();
		System.out.println(request);
		sessionUrl = Constants.HTTPS_ACCOUNT +  "api/oauth2/authorize" + "?"+ request.getQueryString();
		session.put("url", sessionUrl);
		logger.info( sessionUrl);
		// 根据code是否存在来验证用户是否已经登录过，若存在则说明登录过，但可能退出了或者过时了，
		// 或者是一个新应用首次访问，应登录
		String codeInSession = "";
		codeInSession = (String) session.get(Constants.SESSION_CODE);
		logger.info("根据codeInSession判断用户是否已登录过，但可能已退出或者超时：" + codeInSession);
		if (null != codeInSession && !"".equalsIgnoreCase(codeInSession)) {
			AccessToken accToken = AccessTokenManager
					.getAccessTokenByCode(codeInSession);
			if (null != accToken) {
				logger.info("根据codeInSession获取accessToken信息：userId:"
						+ accToken.getUid() + ",client_id:" + client_id
						+ ",action:登录" + ",time:" + System.currentTimeMillis());
				session.put(Constants.SESSION_USER_ID, accToken.getUid());
				Code code = Oauth2Module.createCode(
						clientResult.getClient_secret(), codeInSession);
				//添加日志：首次登录
				AuditModule.addLogin(accToken.getUid(), client_id, code.getCode_sso(),code.getCode(), accToken.getAccess_token());
				// 重定向到应用的LoginAction
				if (null != code && !state.equalsIgnoreCase("")) {
					//freeshare_mobile直接返回codeSso
					if(client_id.equalsIgnoreCase("freeshare_mobile")){
						this.accTokenValue = accToken.getAccess_token();
						return "freesharemobile";
					}
					if (LoginUtilManager.redirectTo2(redirect_uri,
							code.getCode_sso(), state)) {
						return SUCCESS;
					}
				} else if (null != code && state.equalsIgnoreCase("")) {
					
					if (LoginUtilManager.redirectTo(redirect_uri,
							code.getCode_sso())) {
						return SUCCESS;
					}
				} else {
//					lol.error(accToken.getUid(), "用户进入应用:"+client_id+"失败,数据库写code错误", "登录", accToken.getAccess_token(), client_id);
					setMessage("单点登录失败，数据库写失败");
					return ERROR;
				}
			}
		}

		// 若未登录，则申请一个随机数并确认登录页面
		random = UUID.randomUUID().toString().replace("-", "");
		session.put(Constants.SESSION_RANDOM, random);
		loginUrl = SsoModule.getLoginUrl(client_id);

		return SUCCESS;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public String getLoginUrl() {
		return loginUrl;
	}

	public void setLoginUrl(String loginUrl) {
		this.loginUrl = loginUrl;
	}

	public String getRandom() {
		return random;
	}

	public void setRandom(String random) {
		this.random = random;
	}

	public String getState() {
		return state;
	}


	public String getAccTokenValue() {
		return accTokenValue;
	}

	public void setAccTokenValue(String accTokenValue) {
		this.accTokenValue = accTokenValue;
	}

	public String getResult() {
		return result;
	}

	public void setResult(String result) {
		this.result = result;
	}

	public String getSessionUrl() {
		return sessionUrl;
	}

	public void setSessionUrl(String sessionUrl) {
		this.sessionUrl = sessionUrl;
	}

	public String getClient_id() {
		return client_id;
	}

	public void setClient_id(String client_id) {
		this.client_id = client_id;
	}

	public String getRedirect_uri() {
		return redirect_uri;
	}

	public void setRedirect_uri(String redirect_uri) {
		this.redirect_uri = redirect_uri;
	}

	/*public String getRedirect_url() {
		return redirect_url;
	}

	public void setRedirect_url(String redirect_url) {
		this.redirect_url = redirect_url;
	}*/
	

}
