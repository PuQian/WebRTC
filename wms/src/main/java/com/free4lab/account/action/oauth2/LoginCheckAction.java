package com.free4lab.account.action.oauth2;

import java.util.Map;
import java.util.UUID;

import javax.mail.Session;
import javax.persistence.Access;

import org.apache.log4j.Logger;
import org.perf4j.aop.Profiled;

import com.free4lab.account.common.Constants;
import com.free4lab.account.manager.AccessTokenManager;
import com.free4lab.account.manager.ExterAccountManager;
import com.free4lab.account.manager.ParameterUtilManager;
import com.free4lab.account.manager.LoginUtilManager;
import com.free4lab.account.manager.WcsUserManager;
import com.free4lab.account.model.AccessToken;
import com.free4lab.account.model.ExterAccount;
import com.free4lab.account.module.AccountModule;
import com.free4lab.account.module.AuditModule;
import com.free4lab.account.module.Oauth2Module;
import com.free4lab.account.module.SsoModule;
import com.free4lab.utils.action.BaseAction;
import com.opensymphony.xwork2.ActionContext;
import com.free4lab.account.model.WcsUser;

public class LoginCheckAction extends BaseAction {

	/**
	 * 检查提交的用户名密码 如果正确检查应用授权信息
	 */
	private static final long serialVersionUID = 1L;

	private static final Logger logger = Logger.getLogger(LoginCheckAction.class);

	private String passwordmd5 = "";
	private String email = "";
	private String message = "";
	private String failUrl = "";
	private String redirect_uri = "";
	private String client_id = "";
	private String random = "";
	private String state = "";
	private String accTokenValue = "";
	private String result = "success";

	@Profiled(tag = "LoginCheckAction.execute")
	public String execute() throws Exception {
		logger.info("client_id:" + client_id);
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
		/*if (client_id.equals("") || redirect_uri.equals("")) {
			client_id = (String) session.get(Constants.SESSION_CLIENT_ID);
			redirect_uri = (String) session.get(Constants.SESSION_REDIRECT_URI);
		}else{
			session.put(Constants.SESSION_CLIENT_ID, client_id);
		}*/
		/*if (client_id == null || client_id.equals("")) {
			client_id = "userinfo";
		}
		if (redirect_uri == null || redirect_uri.equals("")) {
			redirect_uri = "http://account.free4lab.com/users/login";
		}*/
		
		logger.info("client_id:" + client_id);
		logger.info("redirect_uri:" + redirect_uri);
		
		//add by yck
		//请求WMS生成外部用户临时账号的客户端
		if(client_id.equals(Constants.SWITCHBOARD_WMS_ID))
		// || 其他需要用外部账号的客户端)
		{
			//生成一条外部用户请求临时账号并存入数据库，以后可能需要解开！！！！
			//ExterAccount exterAccount = ExterAccountManager.newExternalUser(client_id);

			//生成一条外部用户临时账号并存入access_token表、wcsuser表
			AccessToken accessToken = Oauth2Module.createAccessTokenForExternal(client_id);
			if(accessToken != null)
			{
				session.put(Constants.SESSION_ACCESSTOKEN, accessToken.getAccess_token()); //当session失效时可以通过该值删除access_token表、exter_
				session.put(Constants.SESSION_USER_ID, accessToken.getUid());
				session.put(Constants.SESSION_CODE, accessToken.getCode());
				
				//添加日志！！！！！！
				AuditModule.addLogin(accessToken.getUid(), client_id, accessToken.getCode(),accessToken.getCode(), accessToken.getAccess_token());
				LoginUtilManager.redirectTo3(redirect_uri,accessToken.getCode(),accessToken.getUser_id());
				logger.info("q3");
				return SUCCESS;
			}
			else
			{
				setMessage("数据库异常");
			}
		}
		else 
		{
			logger.info("email:" + email);
			logger.info("paddwordMd5:" + passwordmd5);
			if (!email.equals("") && ParameterUtilManager.isEmail(email)) {
				/*String randomInSession = (String) session
						.get(Constants.SESSION_RANDOM);*/
				String randomInSession = random;
				logger.info("randomInSession" + randomInSession);
				if (AccountModule.loginValid(email, passwordmd5, randomInSession)) {
					logger.info("用户名和密码正确");
					System.out.println("email:"+email+"  client_id:"+client_id);
	                //若之前数据存有token，将其清空
					logger.info(AccessTokenManager.FindAccTokenByUserId(email));
					if(AccessTokenManager.FindAccTokenByUserId(email)!=null){

	                   AccessTokenManager.deleteAccTokenByUserId(AccessTokenManager.FindAccTokenByUserId(email));
					}
					// 登录成功，生成code和access_token，保存至数据库，数据写入Session
					AccessToken accEntity = Oauth2Module.createCodeAndAccessToken(email, client_id);
					//add by cadobe 将token写入数据库，供WCS鉴权用户是否登陆
//				WcsUser tokEntity = Oauth2Module.createToken("cadobe@163.com", "webrtc");
//	              WcsUserManager.newToken(10, "484fe", "webrtc");
//	              AccessToken at = AccessTokenManager.newAccessToken(512, "002fc4795ca24a9cb442f3ea26153b36", "002fc4795ca24a9cb442f3ea26153b36", "webrtc","shanxuanbupt@qq.com");

	              if (null != accEntity) {

						session.put(Constants.SESSION_USER_ID, accEntity.getUid());
						session.put(Constants.SESSION_CODE, accEntity.getCode());
					    
						//给WCL下发token值
//						session.put(Constants.SESSION_WCS_TOKEN, tokEntity.getToken());				
						
						logger.info("生成oauthToken，accessToken和WMS token，登录成功！userId:"
								+ accEntity.getUid() + ",client_id:" + client_id
								+ ",action:登录" + ",time:"
								+ System.currentTimeMillis()+ "") ;
						//添加日志：首次登录
						AuditModule.addLogin(accEntity.getUid(), client_id, accEntity.getCode(),accEntity.getCode(), accEntity.getAccess_token());
						//freeshare_mobile直接返回codeSso
						if(client_id.equalsIgnoreCase("freeshare_mobile")){
							this.accTokenValue = accEntity.getAccess_token();
							return "freesharemobile";
						}
						// 跳转到redirect_uri
						logger.info("需要跳转到应用的loginAction，判断code是否和secretKey相同："
								+ redirect_uri);
						if (!state.equalsIgnoreCase("")) {
							logger.info("q1");
							if (LoginUtilManager.redirectTo2(redirect_uri,accEntity.getCode(), state)) {

								logger.info("q2");
								return SUCCESS;
							}
						} else {
							if (LoginUtilManager.redirectTo(redirect_uri,accEntity.getCode())) {

								logger.info("q3");
								return SUCCESS;
							}
						}
					} else {
						setMessage("数据库异常");
					}
				} else {
					setMessage("邮箱或密码错误");
					result = "wrong";
				}
			} else {
				setMessage("请填写正确的邮箱");
				result = "wrong";
			}
		}
		
		random = UUID.randomUUID().toString().replace("-", "");
		session.put(Constants.SESSION_RANDOM, random);
		
		if(client_id.equals("webrtc")){
			logger.info("跳转到webrtc登录页...");
			failUrl = "/login/_webrtc_login.jsp";
			return "fail";
	    }
		
		
		failUrl = SsoModule.getLoginUrl(client_id);

		return "fail";
	}

	public String getPasswordmd5() {
		return passwordmd5;
	}

	public void setPasswordmd5(String passwordmd5) {
		this.passwordmd5 = passwordmd5;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public String getFailUrl() {
		return failUrl;
	}

	public void setFailUrl(String failUrl) {
		this.failUrl = failUrl;
	}

	public String getRedirect_uri() {
		return redirect_uri;
	}

	public void setRedirect_uri(String redirect_uri) {
		this.redirect_uri = redirect_uri;
	}

	public String getClient_id() {
		return client_id;
	}

	public void setClient_id(String client_id) {
		this.client_id = client_id;
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

	public void setState(String state) {
		this.state = state;
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

	public static void main(String[] args){
//                                    AccessTokenManager.deleteAccTokenByUserId("shanxuanbupt@");
//  /*          AccessToken accEntity = Oauth2Module.createCodeAndAccessToken(
//			"free@free4lab.com", "webrtc");*/
//		WcsUser tokEntity = Oauth2Module.createToken("free@free4lab.com", "webrtc");
//		logger.info(AccessTokenManager.FindAccTokenByUserId("free@free4lab.com"));
//		if(AccessTokenManager.FindAccTokenByUserId("free@free4lab.com")!=null){
//
//            AccessTokenManager.deleteAccTokenByUserId(AccessTokenManager.FindAccTokenByUserId("free@free4lab.com"));
//			}
	}


	
}
