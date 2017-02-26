package com.free4lab.account.action.account;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.apache.struts2.ServletActionContext;
import org.perf4j.aop.Profiled;

import com.free4lab.account.common.Constants;
import com.free4lab.account.manager.EmailStatusManager;
import com.free4lab.account.model.EmailStatus;
import com.free4lab.account.module.AccountModule;
import com.free4lab.account.module.AccountModule.LoginResult;
import com.free4lab.utils.action.BaseAction;
import com.opensymphony.xwork2.ActionContext;

public class PwdUpdateAction extends BaseAction {

	/**
	 * 修改密码提交方法
	 */
	private static final long serialVersionUID = 1L;
	
	private static final Logger logger = Logger.getLogger(PwdRetrieveCheckAction.class);
	private String loginUrl = "";
	private String message = "";
	private String email = "";
	private String passwordMd5 = "";
	private String uuid = "";
	
	@SuppressWarnings("deprecation")
	@Override
	@Profiled(tag="PwdUpdateAction.execute")
    public String execute() throws Exception {
		EmailStatus emailStatus = null;
		try {        	
        	emailStatus = EmailStatusManager.setNewValidAndfindByUuid(uuid,EmailStatus.TYPE_FINDBACK);
        }catch (Exception ex) {
        	this.message = ex.getMessage();
        	return ERROR;
        }
		if(emailStatus == null){
        	this.message = "找回密码更新流程失败！";
        	return ERROR;
        }
		Map<String, Object> session = ActionContext.getContext().getSession();
		session.put(Constants.SESSION_CLIENT_ID,emailStatus.getClientId());
        session.put(Constants.SESSION_REDIRECT_URI, emailStatus.getRedirectUri());
		String client_id = (String) session.get(Constants.SESSION_CLIENT_ID);
	    String redirect_uri = (String) session.get(Constants.SESSION_REDIRECT_URI);
	    logger.info("找回密码Update:client_id:"+client_id+";redirect_uri:"+redirect_uri);
		if (client_id == null || redirect_uri == null) {
            client_id = "userinfo";
            String rootUrl = Constants.HTTPS_ACCOUNT;//其实就是account的地址
    		/*HttpServletRequest request = ServletActionContext.getRequest();
            if ((request.getContextPath() == null || request.getContextPath().equals("")) && request.getServerPort() == 80) {
                rootUrl = request.getScheme() + "://" + request.getServerName() + "/";
            } else if ((request.getContextPath() == null || request.getContextPath().equals("")) && request.getServerPort() != 80) {
                rootUrl = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + "/";
            } else if ((request.getContextPath() != null && !request.getContextPath().equals("")) && request.getServerPort() == 80) {
                rootUrl = request.getScheme() + "://" + request.getServerName() + request.getContextPath() + "/";
            } else {
                rootUrl = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + request.getContextPath() + "/";
            }*/
            logger.info("rootUrl:"+rootUrl);
            redirect_uri = rootUrl + "users/login?redirect_url="+rootUrl+"users/userinfo";
            session.put(Constants.SESSION_CLIENT_ID, client_id);
            session.put(Constants.SESSION_REDIRECT_URI, redirect_uri);
        }
		//重置密码
		LoginResult result = AccountModule.valid(email,"");
		if (result == LoginResult.PASSWORD_ERROR) {
			if(AccountModule.updatePwd(email, passwordMd5)){
				setMessage("修改密码成功");
				loginUrl = "/api/oauth2/authorize?client_id="+client_id+"&redirect_uri="+redirect_uri+"&message="+ java.net.URLEncoder.encode("找回密码成功");
				return SUCCESS;
			}else{
				setMessage("修改密码失败");
				return "fail";
			}
		}else{
			setMessage("修改密码失败，用户不存在");
			return "fail";
		}

	}
	
	public String getLoginUrl() {
		return loginUrl;
	}

	public void setLoginUrl(String loginUrl) {
		this.loginUrl = loginUrl;
	}
	
    public String getMessage() {
        return message;
    }

    public void setMessage(String msg) {
        message = msg;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getPasswordMd5() {
        return passwordMd5;
    }
    
    public void setPasswordMd5(String passwordMd5) {
        this.passwordMd5 = passwordMd5;
    }

	public String getUuid() {
		return uuid;
	}

	public void setUuid(String uuid) {
		this.uuid = uuid;
	}
	
}
