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

public class RegConfirmAction extends BaseAction {

	/**
	 * 注册流程第三步：邮箱确认
	 */
	private static final long serialVersionUID = 1L;
	
	private static final Logger logger = Logger.getLogger(RegConfirmAction.class);
	
	private String message = "";
	private String uuid = "";
	private String redirect_uri = "";
	private String client_id = "";
	private String email = "";
	
	@Profiled(tag="RegConfirmAction.execute")
	public String execute() throws Exception{
		//根据UUID查找client_id、redirect_uri，重新填写session中的client_id和redirect_uri
		//若session为空则填入默认的account的client_id和redirect_uri
		EmailStatus emailStatus = null;
		try {        	
        	emailStatus = EmailStatusManager.SetValidAndfindByUuid(uuid, EmailStatus.TYPE_REGISTER);
        }catch (Exception ex) {
        	this.message = ex.getMessage();
        	return ERROR;
        }
        if(emailStatus == null){
        	this.message = "注册确认流程失败！";
        	return ERROR;
        }
		Map<String, Object> session = ActionContext.getContext().getSession();
		session.put(Constants.SESSION_CLIENT_ID,emailStatus.getClientId());
        session.put(Constants.SESSION_REDIRECT_URI, emailStatus.getRedirectUri());
		client_id = (String) session.get(Constants.SESSION_CLIENT_ID);
	    redirect_uri = (String) session.get(Constants.SESSION_REDIRECT_URI);
	    logger.info("client_id:"+client_id+";redirect_uri:"+redirect_uri);
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
        
		email = emailStatus.getEmail();
		String pwdSalt = emailStatus.getPwd_salt();
        if (pwdSalt != null && !pwdSalt.equals("")
        		&& email != null && !email.equalsIgnoreCase("") ) {
        	LoginResult result = AccountModule.valid(email,pwdSalt);
            logger.info("isvalide:"+result);
            if (result == LoginResult.USERNAME_NOT_EXISTED) { 
            	if(AccountModule.createUser(email, pwdSalt, "", "", "")){
            		return SUCCESS;
            	}else{
            		setMessage("用户注册失败！");
                    return "fail";
            	}
            } else {
                setMessage("已经注册完毕，无需重复点击确认邮件！");
                return ERROR;
            }
        }else{
        	setMessage("密码为空，注册失败");
        	return "fail";
        }
        
    }
	
    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

	public String getUuid() {
		return uuid;
	}

	public void setUuid(String uuid) {
		this.uuid = uuid;
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

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

}
