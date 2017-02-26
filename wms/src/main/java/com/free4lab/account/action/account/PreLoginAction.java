package com.free4lab.account.action.account;

import java.util.Map;

import org.apache.log4j.Logger;

import com.free4lab.account.common.Constants;

import com.free4lab.utils.action.BaseAction;
import com.opensymphony.xwork2.ActionContext;

public class PreLoginAction extends BaseAction{
	
	
	private static final long serialVersionUID = 1L;
	private static final Logger logger = Logger.getLogger(PreLoginAction.class);
	private String client_id = "webrtc";
	private String redirect_uri = "";
	private String random = "";
	private String sessionUrl = "";

	public String execute() throws Exception {
		Map<String, Object> session = ActionContext.getContext().getSession();
		if(session != null) {
			if(session.containsKey(Constants.SESSION_CLIENT_ID)) {
				client_id = (String) session.get(Constants.SESSION_CLIENT_ID);
			}
			if(session.containsKey(Constants.SESSION_REDIRECT_URI)) {
				 redirect_uri = (String) session.get(Constants.SESSION_REDIRECT_URI);
			}
			if(session.containsKey(Constants.SESSION_RANDOM)) {
				random = (String) session.get(Constants.SESSION_RANDOM);
			}
//			if(session.containsKey("url")) {
//				sessionUrl = (String) session.get("url");
//			}
			logger.info("client_id : " + client_id + "; redirect_uri : " 
						+ redirect_uri + "; sessionUrl : " + sessionUrl);
		}
		return SUCCESS;
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

	public String getRandom() {
		return random;
	}

	public void setRandom(String random) {
		this.random = random;
	}

	public String getSessionUrl() {
		return sessionUrl;
	}

	public void setSessionUrl(String sessionUrl) {
		this.sessionUrl = sessionUrl;
	}
	

}
