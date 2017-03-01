package com.free4lab.account.manager;

import java.sql.Timestamp;
import java.util.List;
import java.util.UUID;

import org.apache.log4j.Logger;

import com.free4lab.account.common.Constants;
import com.free4lab.account.model.EmailStatus;
import com.free4lab.account.model.EmailStatusDAO;
import com.free4lab.utils.hash.Md5Util;

public class EmailStatusManager {
	
	private static final Logger logger = Logger.getLogger(EmailStatusManager.class);
	/**
     * 过期时间:1天
     */
    public static final long EXPIRE_TIME = Long.parseLong(Constants.EMAIL_EXPIRE_TIME);
    public static final long PWDTOKEN_EXPIRE_TIME = Long.parseLong(Constants.PWDTOKEN_EXPIRE_TIME);
    /**
     * emailStatusDAO的静态实例
     */
    private static EmailStatusDAO emailStatusDAO = new EmailStatusDAO();

	public static String addEmailStatus(String client_id, String redirect_uri,
			String email, String passwordMd5, String type) {
		String uuid = Md5Util.getMd5Standard(UUID.randomUUID().toString().replace("-", "") + 
				Md5Util.getMd5Standard(redirect_uri));
		logger.info(uuid);
		EmailStatus emailStatus = new EmailStatus(client_id, email, passwordMd5, redirect_uri, 
				new Timestamp(System.currentTimeMillis()), type, uuid, 0);
		emailStatusDAO.save(emailStatus);
		return emailStatus.getUuid();
	}

	public static EmailStatus SetValidAndfindByUuid(String uuid, String type) throws Exception {
		List<EmailStatus> emailStatusList = emailStatusDAO.findByProperty2("uuid", uuid, "type", type);
		if(emailStatusList == null || emailStatusList.size() != 1) {
			if(type.equalsIgnoreCase(EmailStatus.TYPE_REGISTER)){
				throw new Exception("注册邮件链接无效！");
			}else if(type.equalsIgnoreCase(EmailStatus.TYPE_FINDBACK)){
				throw new Exception("找回密码邮件链接无效！");
			}else{
				throw new Exception("链接无效！");
			}
		}
		EmailStatus emailStatus = emailStatusList.get(0);
		Long emailTime = emailStatus.getTime().getTime();
		if( emailTime + EXPIRE_TIME < System.currentTimeMillis()) {
			if(type.equalsIgnoreCase(EmailStatus.TYPE_REGISTER)){
				throw new Exception("邮件已过期，请重新注册！");
			}else if(type.equalsIgnoreCase(EmailStatus.TYPE_FINDBACK)){
				throw new Exception("邮件已过期，请重新发送找回密码邮件！");
			}else{
				throw new Exception("邮件已过期！");
			}
		}
		if(emailStatus.getValid() != 0 && type.equalsIgnoreCase(EmailStatus.TYPE_REGISTER)) {
			throw new Exception("已经注册完毕，无需重复点击确认邮件！");
		}
		if(emailStatus.getValid() > 1 && type.equalsIgnoreCase(EmailStatus.TYPE_FINDBACK)) {
			throw new Exception("密码已找回，无需重复点击确认邮件！");
		}
		emailStatus.setValid(1);
		emailStatusDAO.update(emailStatus);
		return emailStatus;
	}

	public static EmailStatus setNewValidAndfindByUuid(String uuid, String type) throws Exception {
		List<EmailStatus> emailStatusList = emailStatusDAO.findByProperty2("uuid", uuid, "type", type);
		if(emailStatusList == null || emailStatusList.size() != 1) {
			throw new Exception("找回密码邮件链接无效！");
		}
		EmailStatus emailStatus = emailStatusList.get(0);
		Long emailTime = emailStatus.getTime().getTime();
		if(emailStatus.getValid() == 0){
			throw new Exception("找回密码邮件未确认");
		}else if(emailStatus.getValid() > 1){
			throw new Exception("密码已找回，无需重复修改！");
		}else if(emailTime + EXPIRE_TIME + PWDTOKEN_EXPIRE_TIME < System.currentTimeMillis()){
			throw new Exception("找回密码操作已过期，请重新发送找回密码邮件！");
		}
		
		emailStatus.setValid(2);
		emailStatusDAO.update(emailStatus);
		return emailStatus;
	}
	
    
}
