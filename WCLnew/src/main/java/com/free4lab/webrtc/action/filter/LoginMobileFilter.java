package com.free4lab.webrtc.action.filter;
import com.free4lab.webrtc.common.SessionConstants;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


import com.free4lab.utils.account.BaseLoginFilter;

/**
 * 继承common中封装过的BaseLoginFilter
 */
public class LoginMobileFilter extends BaseLoginFilter {
	@Override
	protected String getClientId() {
		//返回account分配给应用的client_id即原customId的值
		return SessionConstants.CUSTOM_ID_MOBILE;
	}
	
	@Override
	protected String getRedirectUri() {
		//返回应用login方法的url，注意login和logout方法要在同一个父目录下！
		return "/login2";
	}
	@Override
	protected String getAccessTokenInSession(HttpServletRequest request,
           HttpServletResponse response) {
       //返回session中access_token的值
       String accessTokenInSession = (String) request.getSession().getAttribute(SessionConstants.AccessToken);
       return accessTokenInSession;
   }

}