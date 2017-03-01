package com.free4lab.account.manager;

import java.util.Collections;
import java.util.List;

import org.apache.log4j.Logger;

import com.free4lab.account.common.Constants;
import com.free4lab.account.model.Account;
import com.free4lab.account.model.AccountDAO;
import com.free4lab.account.model.BillingBalance;
import com.free4lab.account.model.BillingBalanceDAO;
import com.free4lab.account.model.Encontact;
import com.free4lab.utils.hash.Md5Util;

public class AccountManager {
	
	private static final Logger logger = Logger.getLogger(AccountManager.class);
	
    /**
     * accountDAO的静态实例
     */
    private static AccountDAO accountDAO = new AccountDAO();
    
    /**
     * 根据用户邮箱获取数字id
     * @param email
     * @return
     */
    public static int getUserIdByEmail(String email){
    	List<Account> list = accountDAO.findByProperty("email", email);
    	if (list.size() <= 0) {
            return -1;
        } else {
            return list.get(0).getId();
        }
    }
    
    /**
     * 添加新的账户信息
     * @param email
     * @param pwdSalt
     * @return
     */
    public static Account addAccount(String email, String pwdSalt){
    	Account account = new Account();
    	account.setEmail(email);
    	account.setPwd_salt(pwdSalt);
    	try {
    		accountDAO.save(account);
            return account;
        } catch (Exception ex) {
            System.err.println(ex.getMessage());
            ex.printStackTrace(System.err);
            return null;
        }
    }
    
    /**
     * 修改密码
     * @param email
     * @param pwdSalt
     * @return
     */
    public static Account editPwdSalt(String email, String pwdSalt){
    	List<Account> list = accountDAO.findByProperty("email", email);
    	if (list.size() <= 0) {
            return null;
        } else {
        	Account account = list.get(0);
        	account.setPwd_salt(pwdSalt);
        	try{
        		accountDAO.update(account);
        		logger.info("修改密码成功!!!--"+account.getEmail());
        		return account;
        	}catch(Exception ex){
        		System.err.println(ex.getMessage());
                ex.printStackTrace(System.err);
                return null;
        	}
        }
    }
    
    /**
     * 为用户充值
     * @param userId
     * @param amount
     * @return
     */
	public static boolean charge(Integer userId, Integer amount) {
		BillingBalanceDAO bDAO = new BillingBalanceDAO();
		BillingBalance b = new BillingBalance();
		b.setUid(userId);
		b.setBalance(amount);
    	try{
			bDAO.save(b);
			logger.info("充值成功！");
			return true;
    	}catch (Exception ex) {
    		logger.info("充值失败！");
    		System.err.println(ex.getMessage());
            ex.printStackTrace(System.err);
            return false;
		}
		
	}
	
	/**
     * 删除账户信息
     * @param email
     * @return
     */
    public static int delAccount(String email){
    	List<Account> accounts = accountDAO.findByProperty("email", email);
    	if(accounts.size()>0){
    		int userId = accounts.get(0).getId();
        	try {
        		accountDAO.deleteByPrimaryKey(accounts.get(0).getId());
                return userId;
            } catch (Exception ex) {
                System.err.println(ex.getMessage());
                ex.printStackTrace(System.err);
                return -1;
            }
    	}
    	return -1;
    }

	/**
	 * 通过email获取uids,bypage
	 * @param email
	 * @return
	 */
    public static List<Account> getUidsByEmailByPage(String email, int page, 
    		int pageSize) {
		List<Account> list = accountDAO.findByPropertyLikeByPage("email",
				email, page, pageSize);
    	if (list.size() == 0) {
            return Collections.emptyList();
        } else {
            return list;
        }
	}

    /**
	 * 通过email获取uids
	 * @param email
	 * @return
	 */
	public static int getTotalUidsByEmail(String email) {
		List<Account> list = accountDAO.findByPropertyLike("email", email);
    	return list.size();
	}
	/**
	 * 通过email获取accounts
	 * @param email
	 * @return
	 */
	public static List<Account> getAccountsByEmail(String email) {
		List<Account> list = accountDAO.findByPropertyLike("email", email);
    	return list;
	}

	/**
	 * 通过uid获取email
	 * @param uid
	 * @return
	 */
	public static String getEmailByUserId(int uid) {
		List<Account> list = accountDAO.findByProperty("id", uid);
    	if (list.size() <= 0) {
            return null;
        } else {
            return list.get(0).getEmail();
        }
    }

	/**
	 * 通过uid获取整个account的一行
	 * @param uid
	 * @return
	 */
	public static Account getAccountByUid(int userId) {
		List<Account> list = accountDAO.findByProperty("id", userId);
    	if (list.size() <= 0) {
            return null;
        } else {
            return list.get(0);
        }
	}
	
	/**
	 * 检查密码是否过于简单
	 * @param email
	 * @param pwdSalt
	 * @return
	 */
	public static int testCode(String email, String pwdSalt) {
    	String [] sysCodes = Constants.SYSTEM_EASYCODE.split(",");
    	for( int i = 0; i < sysCodes.length; i++ ){
    		String sysPwdSalt = Md5Util.getMd5Standard(sysCodes[i] + email);
    		if(sysPwdSalt.equalsIgnoreCase(pwdSalt)){
    			return 1;
    		}
    	}
		return 0;
	}
	
	public static Account getAccountByEmail(String email){
		List<Account> accounts = accountDAO.findByProperty("email", email);
    	if(accounts == null || accounts.size() == 0){
    		return null;
    	}
    	return accounts.get(0);
	}
	
	//add by yck
	//根据ids找一组账户
	public static List<Account> getAccountByIds(List<Integer> ids)
	{
		try{	
			return accountDAO.findByIds("id", ids);
		}catch (Exception e) {
			return Collections.emptyList();
		}
	}
}
