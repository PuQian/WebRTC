package com.free4lab.account.manager;

import java.util.List;

import org.apache.log4j.Logger;

import com.free4lab.account.model.AccountAdmin;
import com.free4lab.account.model.AccountAdminDAO;

public class AccountAdminManager {

	private static final Logger logger = Logger.getLogger(AccountAdminManager.class);
	
	private static AccountAdminDAO adminAccountDAO = new AccountAdminDAO();
	
	public enum LoginResult {
        LOGIN_SUCCESS,
        PASSWORD_ERROR,
        USERNAME_NOT_EXISTED
    };
    
	public static int validateAdmin(String email, String pwdSalt){
		List<AccountAdmin> accountAdmins = adminAccountDAO.findByProperty("email", email);
		if(accountAdmins == null || accountAdmins.size() != 1){
			return -1;
		}else{
			AccountAdmin account = accountAdmins.get(0);
			if (!account.getPwd_salt().equalsIgnoreCase(pwdSalt)) {
            	logger.info("PASSWORD_ERROR");
                return -1;
            }else{
            	return account.getId();
            }
		}
		
	}
	
	public static Integer getAdminIdByEmail(String email){
		List<AccountAdmin> accountAdmins = adminAccountDAO.findByProperty("email", email);
		if(accountAdmins == null || accountAdmins.size() != 1){
			return -1;
		}else{
			return accountAdmins.get(0).getId();
		}
	}
	
}
