package com.free4lab.account.manager;

import java.util.Collections;
import java.util.List;

import org.apache.log4j.Logger;

import com.free4lab.account.common.Constants;
import com.free4lab.account.model.TempAccount;
import com.free4lab.account.model.TempAccountDAO;




public class TempAccountManager {
	/**
     * 过期时间:1天
     */
    public static final long EXPIRE_TIME = Long.parseLong(Constants.ACCESSTOKEN_EXPIRE_TIME);
    private static final Logger logger = Logger.getLogger(TempAccount.class); 
    /**
     * accessTokenDAO的静态实例
     */
    private static TempAccountDAO tempaccountDAO = new TempAccountDAO();
    
    public static boolean addTempAccount(String inviter_email, String temp_name, 
    		String temp_account, Integer temp_type, String temp_url, long temp_begintime, 
    		Integer temp_valid, String temp_extend) {
		TempAccount tempaccount = new TempAccount(inviter_email, temp_name, temp_account, temp_type, temp_url, temp_begintime,
				temp_valid, temp_extend);
		try{	
			tempaccountDAO.save(tempaccount);
			System.out.println("save success");
			return true;
		}catch (Exception e) {
			logger.debug(e);
			return false;
		}
    }
		public static List<TempAccount> findTempAccountByTemp_Name(final Object temp_name1){
			try{
				return tempaccountDAO.findByTemp_Name(temp_name1);
			}catch (Exception e) {
				logger.debug(e);
				return Collections.emptyList();
			}
		}
	
    
    
}
