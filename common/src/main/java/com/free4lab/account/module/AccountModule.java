package com.free4lab.account.module;

import java.util.List;

import org.apache.log4j.Logger;

import com.free4lab.account.common.Constants;
import com.free4lab.account.manager.AccessTokenManager;
import com.free4lab.account.manager.AccountManager;
import com.free4lab.account.manager.BillingBalanceManager;
import com.free4lab.account.manager.ClientManager;
import com.free4lab.account.manager.CodeManager;
import com.free4lab.account.manager.EmailStatusManager;
import com.free4lab.account.manager.SendMailJavaManager;
import com.free4lab.account.manager.UserManager;
import com.free4lab.account.manager.UtilFriendManager;
import com.free4lab.account.model.Account;
import com.free4lab.account.model.Client;
import com.free4lab.account.model.Code;
import com.free4lab.account.model.EmailStatus;
import com.free4lab.account.model.GroupUser;
import com.free4lab.account.model.User;
import com.free4lab.utils.hash.Md5Util;

public class AccountModule {

	private final static Logger logger = Logger.getLogger(AccountModule.class);
	
	/**
	 * 登录时判断用户名和密码是否正确
	 * @param email
	 * @param passwordmd5md5md5
	 * @param randomInSession
	 * @return
	 */
	public static boolean loginValid(String email, String passwordmd5md5md5, 
			String randomInSession) {
		logger.info("passwordmd5md5md5:"+passwordmd5md5md5);
        Account account = AccountManager.getAccountByEmail(email);
        if(account == null){
        	return false;
        }
        String pwd_salt = account.getPwd_salt();
        String pwd_saltMd5 = Md5Util.getMd5Standard(randomInSession+pwd_salt);
        logger.info("pwd_saltMd5:"+pwd_saltMd5);
        if(pwd_saltMd5.equalsIgnoreCase(passwordmd5md5md5)){
        	return true;
        }
        return false;
	}
	
	public enum LoginResult {
        LOGIN_SUCCESS,
        PASSWORD_ERROR,
        USERNAME_NOT_EXISTED
    };
    
	/**
     * 注册、找回密码时验证提交的用户名密码是否错误
     * @param email
     * @param pwdSalt
     * @return 
     */
    public static LoginResult valid(String email, String pwdSalt) {
        Account account = AccountManager.getAccountByEmail(email);
        if (account == null) {
        	logger.info("USERNAME_NOT_EXISTED");
            return LoginResult.USERNAME_NOT_EXISTED;
        } else {
            if (!account.getPwd_salt().equalsIgnoreCase(pwdSalt)) {
            	logger.info("PASSWORD_ERROR");
                return LoginResult.PASSWORD_ERROR;
            }
        }
        return LoginResult.LOGIN_SUCCESS;
    }

    /**
     * 注册用户
     * @param client_id
     * @param redirect_uri
     * @param email
     * @param pwdSalt
     * @param rootUrl
     * @return
     */
    @SuppressWarnings("deprecation")
	public static boolean register(String client_id, String redirect_uri, String email, 
    		String pwdSalt, String rootUrl){
    	//记录用户注册的数据，并发送邮件
    	String uuid = EmailStatusManager.addEmailStatus(client_id, redirect_uri, email, pwdSalt, 
    			EmailStatus.TYPE_REGISTER);
    	logger.info("用户Email："+email+"UUID："+uuid);
    	SendMailJavaManager mail = new SendMailJavaManager();
    	String mailTo = email;
    	String mailTitle = "Welcome To WebRTC";
		String href = rootUrl + "account/emailconfirming?uuid=" + java.net.URLEncoder.encode(uuid);
        String mailContent = "尊敬的先生/女士，<p style=\"text-indent: 2em\">感谢您注册WebRTC账号！</p>" +
        		"<p style=\"text-indent: 2em\">您的账号为"+email+"。" +
        		"为了您能正常登录和使用WebRTC的各项应用，请点击以下链接激活账号！</p>" +
        		"<p style=\"text-indent: 2em\"><a href= " + href + ">"+href+"</a></p>"+
        		"<p style=\"text-indent: 2em\">如无法点击上面的链接，请将地址复制粘贴到浏览器的地址栏，按回车键即可。</p>" +
        		"<p style=\"text-indent: 2em\">如果您有任何问题，请联系我们ctwebrtc@sina.cn</p><p>WebRTC管理组</p>";
        
		try{
        	mail.mailTo(mailTo, mailTitle, mailContent);
        } catch (Exception e){
        	logger.info(e.getMessage());
        	return false;
        }
        
        return true;
    }

    /**
     * 新建用户
     * @param email
     * @param pwdSalt
     * @param company 
     * @param company2 
     * @param description 
     * @return
     */
	public static boolean createUser(String email, String pwdSalt, 
			String real_name, String description, String company) {
		Account at = AccountManager.addAccount(email,pwdSalt);
        if (at != null) {
        	int userId = at.getId();
        	//保存注册用户的信息到User表
        	User user = UserManager.addUser(userId, email, real_name, description, company);
        	//注册时为用户新建账户，并充值
        	if(user != null){
        		if(AccountManager.charge(userId, (int)(Constants.BILLING_MOUNT*100))){
            		logger.info("充值成功");
            		/*AuditModule.addRigisterLog(userId, "用户注册成功", "注册", 
        					"", client_id, "RegConfirmAction.class");*/
            	}else{
            		logger.info("充值失败");
            		return false;
            	}
        	}else{
                return false;
        	}
        } else {
            return false;
        }
        
		return true;
	}

	/**
	 * 找回密码
	 * @param client_id
	 * @param redirect_uri
	 * @param email
	 * @param rootUrl
	 * @return
	 */
	@SuppressWarnings("deprecation")
	public static boolean pwdretrieve(String client_id, String redirect_uri, String email,
			String rootUrl) {
		//记录用找回密码的数据，并发送邮件
    	String uuid = EmailStatusManager.addEmailStatus(client_id, redirect_uri, email, 
    			"", EmailStatus.TYPE_FINDBACK);
    	logger.info("找回密码：用户Email："+email+"UUID："+uuid);
    	SendMailJavaManager mail = new SendMailJavaManager();
        String mailTo = email;
        String mailTitle = "自邮之翼找回密码确认邮件";
        /* String mailTitle = "云海平台找回密码确认邮件";*/
        String href = rootUrl + "account/pwdretrieveconfirming?uuid=" + java.net.URLEncoder.encode(uuid);
        String mailContent = "尊敬的先生/女士，<p style=\"text-indent: 2em\">感谢您使用WebRTC账号！请点击以下链接重置密码！</p>" +
        		"<p style=\"text-indent: 2em\"><a href= " + href + ">"+href+"</a></p>"+
        		"<p style=\"text-indent: 2em\">如无法点击上面的链接，请将地址复制粘贴到浏览器的地址栏，按回车键即可。</p>" +
        		"<p style=\"text-indent: 2em\">如果您有任何问题，请联系我们webrtcadmin@163.com。</p><p>WebRTC管理组 </p>";
        /*String mailContent = "尊敬的先生/女士，<p style=\"text-indent: 2em\">感谢您使用云海平台账号！请点击以下链接重置密码！</p>" +
        		"<p style=\"text-indent: 2em\"><a href= " + href + ">"+href+"</a></p>"+
        		"<p style=\"text-indent: 2em\">如无法点击上面的链接，请将地址复制粘贴到浏览器的地址栏，按回车键即可。</p>" +
        		"<p style=\"text-indent: 2em\">如果您有任何问题，请联系我们free@free4lab.com。</p><p>云海团队</p>"; */           
        try{
        	mail.mailTo(mailTo, mailTitle, mailContent);
        } catch (Exception e){
        	logger.info(e.getMessage());
        	return false;
        }
        
		return true;
	}

	/**
	 * 根据邮箱和新密码更改密码
	 * @param email
	 * @param passwordMd5
	 * @return
	 */
	public static boolean updatePwd(String email, String passwordMd5) {
		Account ac = AccountManager.getAccountByEmail(email);
		if(ac == null){
			logger.info("修改密码失败，用户不存在");
			return false;
		}else{
			String pwdSalt = Md5Util.getMd5Standard(passwordMd5 + email);
			Account newAc = AccountManager.editPwdSalt(email,pwdSalt);
			if(newAc != null){
				logger.info("修改密码成功");
				return true;
			}else{
				logger.info("修改密码失败");
				return false;
			}
		}
	}

	/**
	 * 根据用户id、旧密码和新密码更改密码
	 * @param userId
	 * @param old_pwd
	 * @param pwd
	 * @return
	 */
	public static boolean updatePwd(int userId, String old_pwd, String pwd) {
		Account ac = AccountManager.getAccountByUid(userId);
		String pwdSalt = Md5Util.getMd5Standard(old_pwd + ac.getEmail());
		if(ac != null && pwdSalt.equalsIgnoreCase(ac.getPwd_salt())){
			String newPwdSalt = Md5Util.getMd5Standard(pwd + ac.getEmail());
			Account newAc = AccountManager.editPwdSalt(ac.getEmail(),newPwdSalt);
			if(newAc != null){
				logger.info("修改密码成功");
				return true;
			}else{
				logger.info("修改密码失败");
				return false;
			}
		}else{
			logger.info("旧密码错误");
			return false;
		}
	}
	
	/**
	 * 根据userId直接修改用户密码
	 * @param userId
	 * @param pwd
	 * @return
	 */
	public static boolean resetPwd(int userId, String pwd){
		Account ac = AccountManager.getAccountByUid(userId);
		if(ac != null){
			String newPwdSalt = Md5Util.getMd5Standard(pwd + ac.getEmail());
			Account newAc = AccountManager.editPwdSalt(ac.getEmail(),newPwdSalt);
			if(newAc != null){
				logger.info("修改密码成功");
				return true;
			}else{
				logger.info("修改密码失败");
				return false;
			}
		}else{
			logger.info("旧密码错误");
			return false;
		}
	}

	/**
	 * 根据邮箱删除用户
	 * @param email
	 * @return
	 */
	public static boolean destroyUser(String email) {
		int userId = AccountManager.delAccount(email);
    	logger.info("userId:"+userId);
    	if(userId>0){
	    	Integer rootId=-1;
			Integer rootPrimaryKey = -1;
			//先删除group_user和group_list表中所要删除用户的分组
			List<GroupUser> groupusers = UtilFriendManager.findGroupUserByProperty("uid", userId);
			for(GroupUser aGroupUser:groupusers){
				if(Integer.parseInt(aGroupUser.getIs_root())==1){
					rootId = aGroupUser.getGroup_id();
					rootPrimaryKey = aGroupUser.getId();
				}
				FriendshipsModule.delGroup(userId, aGroupUser.getGroup_id());
			}
			//删除所要删除用户的好友和其根组
			logger.info(rootId);
			if(rootId>0){
				List<User> group_member = FriendshipsModule.getFriendsPerGroup(rootId);
				for(User user:group_member){
					FriendshipsModule.delFriend(userId, user.getUid());
				}
				UtilFriendManager.delGroupUserByPrimaryKey(rootPrimaryKey);
				UtilFriendManager.delGroupListByPrimaryKey(rootId);
			}
			//删除账户的充值
			BillingBalanceManager.delBalance(userId);
    	}
        /*if (userId >= 0) {
        	//删除User表注册用户的信息
        	int uid = UserManager.delUser(userId, email);
        	if( uid > 0){
        		//删除账户的充值
            	BillingBalanceManager.delBalance(userId);
                //LogOfAccount.logInfo("register", SESSION_CLIENT_ID, email);
        		return true;
        	} 
        }*/
        return false;
	}
	
	public static String getClientIdByAccessToken(String accessToken){
		String codeSso = AccessTokenManager.getCodeByAccessToken(accessToken);
		if(codeSso != null && !"".equalsIgnoreCase(codeSso)){
			Code code = CodeManager.getCode(codeSso);
			if(code != null){
				Client client = ClientManager.getClientByClientSecret(code.getClient_secret());
				if(client != null)
				return client.getClient_id();
			}
		}
		return null;
	}
	
	public static String getClientIdByUser (String accessToken){
		String codeSso = AccessTokenManager.getCodeByAccessToken(accessToken);
		if(codeSso != null && !"".equalsIgnoreCase(codeSso)){
			Code code = CodeManager.getCodeBycode(codeSso);
			if(code != null){
				Client client = ClientManager.getClientByClientSecret(code.getClient_secret());
				if(client != null)
				return client.getClient_id();
			}
		}
		return null;
	}
	
	

}
