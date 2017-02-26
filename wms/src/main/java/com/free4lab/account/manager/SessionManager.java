package com.free4lab.account.manager;

import java.util.Vector;

import javax.servlet.http.HttpSession;
import javax.servlet.http.HttpSessionEvent;
import javax.servlet.http.HttpSessionListener;

import com.free4lab.account.common.Constants;

/**
 * session创建和销毁时的事件处理
 * @author add by yck
 *
 */
public class SessionManager implements HttpSessionListener {

	//session创建
	@Override
	public void sessionCreated(HttpSessionEvent event) {
		// TODO Auto-generated method stub
		
	}

	//session销毁
	@SuppressWarnings({ "rawtypes", "unchecked" })
	@Override
	public void sessionDestroyed(HttpSessionEvent event) {
		
		System.out.println("进入session销毁事件处理");
		
		//若session中含有临时用户信息，销毁
		HttpSession session = event.getSession();
		String client_id = (String)session.getAttribute(Constants.SESSION_CLIENT_ID);
		String access_token = (String)session.getAttribute(Constants.SESSION_ACCESSTOKEN);
		Integer uid = (Integer)session.getAttribute(Constants.SESSION_USER_ID);
		
		if(client_id != null 
		&& client_id.equals(Constants.SWITCHBOARD_WMS_ID) 
		&& access_token != null) //是已为外部用户产生过临时账号的客户端(如总机)
		{	
			//执行删除
			//1.access_token表
			Vector vector = new Vector();
			vector.add(AccessTokenManager.getIdByAccessToken(access_token));
			AccessTokenManager.deleteAccTokenByUserId(vector);
			
			//2.wcs_user表
			vector.clear();
			vector.add(WcsUserManager.getIdByAccessToken(access_token));
			WcsUserManager.deleteAccTokenByUserId(vector);
//			
//			//3.exter_account表
//			ExterAccountManager.deleteExterAccountById(uid);
		}
		
	}

}
