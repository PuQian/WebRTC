package com.free4lab.account.module;

import java.util.Map;

import com.free4lab.account.common.Constants;
import com.opensymphony.xwork2.ActionContext;

public class SsoModule {

	public static void removeSession() {
		Map<String, Object> session = ActionContext.getContext().getSession();
        session.remove(Constants.SESSION_ACCESSTOKEN);
        session.remove(Constants.SESSION_CLIENT_ID);
        session.remove(Constants.SESSION_REDIRECT_URI);
        session.remove(Constants.SESSION_CODE);
        session.remove(Constants.SESSION_CLIENT_SECRET);
        session.remove(Constants.SESSION_CODE_TO_SEND);
        session.remove(Constants.SESSION_RANDOM);
        session.remove(Constants.SESSION_GRANT_TYPE);
        session.remove(Constants.SESSION_USER_ID);
        session.remove(Constants.SESSION_LOGIN_APP);
	}

	public static String getLoginUrl(String client_id) {
		if(client_id.equals("freeshare")||client_id.equals("freeShare")){
	    	return "/login/freeshare_login.jsp";
	    }else if(client_id.equals("appcloud")){
	    	return "/login/appcloud_login.jsp";
        }else if(client_id.equals("webrtc")){
        	return "/login/webrtc_login.jsp";
        }else if(client_id.equals("iaas")){
        	return "/login/iaas_login.jsp";
        }else if(client_id.equals("webrtc_mobile")){
        	//return "/login/webrtc_login.jsp";
        	return "/login/webrtc_mobile_login.jsp";
        }else if(client_id.equals("freeshare_mobile")){
        	return "/login/freeshare_mobile_login.jsp";
        }else if(client_id.equals("switchboard")){
        	return "/login/switchboard_login.jsp";
        }
        else{
        	return "/login/login.jsp";
        }
	}

}
