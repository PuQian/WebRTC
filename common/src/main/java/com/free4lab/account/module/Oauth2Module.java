package com.free4lab.account.module;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.apache.log4j.Logger;

//import com.free4lab.account.action.oauth2.LoginCheckAction;
import com.free4lab.account.manager.AccessTokenManager;
import com.free4lab.account.manager.AccountManager;
import com.free4lab.account.manager.ClientManager;
import com.free4lab.account.manager.CodeManager;
import com.free4lab.account.manager.WcsUserManager;
import com.free4lab.account.model.AccessToken;
import com.free4lab.account.model.Code;
import com.free4lab.account.model.WcsUser;

public class Oauth2Module {
	private static final Logger logger = Logger
			.getLogger(Oauth2Module.class);
	/**
	 * 根据access_token获取Token的信息：uid和剩余时间
	 */
	public static List<String> getAccessTokenInfo(String access_token) {
		List<String> results = new ArrayList<String>();
		AccessToken accessToken = AccessTokenManager.getAccessTokenByAccessToken(access_token);
		if( accessToken != null ){
			String uid = new Integer(accessToken.getUid()).toString();
			long expire = accessToken.getBegin_time() + AccessTokenManager.EXPIRE_TIME - System.currentTimeMillis();
			if(expire <= 0){
				expire = -1;
			}
			String expire_in = new Long(expire).toString();
			results.add(uid);
			results.add(expire_in);
		}
		return results;
	}

	/**
	 * 创建一个新的code
	 */
	public static Code createCode(String client_secret, String codeInSession) {
		//将返回的code_sso和codeInSession加入数据库code表
		String codeSso = UUID.randomUUID().toString().replace("-", "");
		Code code = CodeManager.newCode(client_secret, codeInSession, codeSso);
		return code;
	}
	
	/**
	 * 根据code获取access_token
	 * @param code
	 * @param client_id
	 * @param client_secret
	 * @return
	 */
	public static String getAccessTokenByCode(String code, String client_id, String client_secret) {
		Code codeEntity = CodeManager.getCode(code);
    	if(codeEntity !=null && codeEntity.getClient_secret().equals(client_secret) ){
    		String firstCode = codeEntity.getCode();
    		AccessToken accessToken = AccessTokenManager.getAccessTokenByCode(firstCode);
    		//AuditModule.addLogin(accessToken.getUid(), client_id, code, firstCode, accessToken.getAccess_token());
    		return accessToken.getAccess_token();
    	}else{
    		return "";
    	}
	}

	/**
	 * access_token无效
	 * @param access_token
	 * @return
	 */
	public static boolean revokeOauth2(String access_token) {
		List<AccessToken> atList = new ArrayList<AccessToken>();
		if (access_token != null && access_token.length() == 32) {
			atList = AccessTokenManager.expireAccessTokenByAccessToken(access_token);
        } else if (access_token != null && access_token.length() == 16) {
        	atList = AccessTokenManager.expireAccessTokenByAccessTokenMiddle(access_token);
        }
		if (atList != null && atList.size() > 0) {
            AuditModule.addLogout(atList.get(0).getUid(), atList.get(0).getAccess_token(), atList.get(0).getExtend());
            return true;
        }
		return false;
	}
    public static WcsUser createThirdPartyAccessToken(String email, String client_id){
		logger.info("test flag ThirdParty0");    	
		String code = UUID.randomUUID().toString().replace("-", "");
		String access_token = UUID.randomUUID().toString().replace("-", "");
		int uid =0;
		logger.info("test flag ThirdParty");
		WcsUser accEntity = WcsUserManager.newAccessToken(
				uid, code, access_token, client_id, email);
		return accEntity;
		
    }
    public static WcsUser createTempThirdPartyAccessToken(String temp_name, String access_token,long temp_begintime){
    	logger.info("test flag TempThirdParty0");    	
		String code = "0";
		int uid =0;
		String client_id="TempWebRTC";
		logger.info("test flag TempThirdParty");
		WcsUser accEntity = WcsUserManager.newTempAccessToken(
				uid, code, access_token, client_id, temp_name,temp_begintime);
		return accEntity;
    }
	public static AccessToken createCodeAndAccessToken(String email, String client_id) {
		String code = UUID.randomUUID().toString().replace("-", "");
		String access_token = UUID.randomUUID().toString().replace("-", "");
		int uid = AccountManager.getUserIdByEmail(email);
		String client_secret = ClientManager.getClientByClientId(client_id).getClient_secret();
		Code codeEntity = CodeManager.newCode(client_secret, code, code);
		if(codeEntity == null)
		{
			return null;
		}
		logger.info("test flag 1");
		AccessToken accEntity = AccessTokenManager.newAccessToken(uid, code, access_token, client_id, email);
		return accEntity;
	}
	  public static WcsUser createWcsAccessToken(String email,String newemail, String client_id){
		  
			String code = AccessTokenManager.getCodeByUserId(email);
			String access_token = AccessTokenManager.getAccessTokenByUserId(email);
			int uid =0;
			logger.info("test flag ThirdParty");
			WcsUser accEntity = WcsUserManager.newAccessToken(
					uid, code, access_token, client_id, newemail);
			return accEntity;
			
	    }
	  
	  //add by yck
	public static AccessToken createAccessTokenForExternal(String client_id) {
		String code = UUID.randomUUID().toString().replace("-", "");
		String access_token = UUID.randomUUID().toString().replace("-", "");
		String username = access_token+"@"+client_id;
		int uid = -1;
		String client_secret = ClientManager.getClientByClientId(client_id).getClient_secret();
		Code codeEntity = CodeManager.newCode(client_secret, code, code);
		if(codeEntity == null)
		{
			return null;
		}

		/**
		 * 在access_token和wcsuser表生成外部临时用户信息
		 */
		
		//name eg: XXXXXXXXXXXXX@Auto
		AccessToken accessToken = AccessTokenManager.newAccessToken(uid, code, access_token, client_id, username);
		
		//name externalXXXXXXXXXXXXX-Auto@WebRTC
		String wcs_username = username.split("@")[0]+"-"+username.split("@")[1]+"@"+"WebRTC";
		WcsUserManager.newAccessToken(uid, code, access_token, client_id, wcs_username);
		
		return accessToken;
	}
	
	
    
//	public static WcsUser createToken(String email, String client_id){
//		String token = UUID.randomUUID().toString().replace("-", "");
//		int uid = AccountManager.getUserIdByEmail(email);
//		WcsUser tokEntity = WcsUserManager.newToken(uid, token, client_id);
//		return tokEntity;
//	}
}
