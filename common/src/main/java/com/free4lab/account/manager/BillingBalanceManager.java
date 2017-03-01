package com.free4lab.account.manager;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import com.free4lab.account.model.BillingBalance;
import com.free4lab.account.model.BillingBalanceDAO;


public class BillingBalanceManager {

	public enum BalanceResult {
        INVALID_UID,
        UID_NOT_EXIST,
        RECID_NOT_EXIST,
        UID_BALANCE_NOT_ENOUGH,
        RECID_BALANCE_NOT_ENOUGH,
        UPDATE_SUCCESS,
        UPDATE_FAIL
    };
	/**
	 * BillingBalanceDAO的静态实例
	 */
	private static BillingBalanceDAO billingBalanceDAO = new BillingBalanceDAO();
	
	/**
	 * 根据用户id获取余额信息
	 * @param uid
	 * @return
	 */
	public static List<BillingBalance> getBalanceByUid( int uid ){
		List<BillingBalance> balance = billingBalanceDAO.findByProperty("uid", uid);
		if( balance != null && balance.size() > 0){
			return balance;
		}
		balance = new ArrayList<BillingBalance>();
		return balance;
	}
	
	/**
	 * 新建用户账户，在用户注册时新建
	 * @param blance
	 * @return
	 */
	public static BillingBalance addBillingBalance(BillingBalance blance){
		try {
			billingBalanceDAO.save(blance);
            return blance;
        } catch (Exception ex) {
            System.err.println(ex.getMessage());
            ex.printStackTrace(System.err);
            return null;
        }
	}
	
	/**
	 * 完成一次转账中的余额操作
	 * @param uid
	 * @param recid
	 * @param amount
	 * @return
	 */
	public static BalanceResult updateBalance(int uid, int recid, int amount){
		BillingBalance uBalance = null, rBalance = null;
    	if( uid < 0 ){
    		return BalanceResult.INVALID_UID;
    	}
    	List<BillingBalance> uBalanceList = billingBalanceDAO.findByProperty("uid", uid);
    	if( uBalanceList.size() <= 0 ){
    		return BalanceResult.UID_NOT_EXIST;
    	}
    	uBalance = uBalanceList.get(0);
    	int ubalance = uBalance.getBalance();
    	int newuBalance = ubalance - amount;
    	if(newuBalance < 0){
    		return BalanceResult.UID_BALANCE_NOT_ENOUGH;
    	}
    	uBalance.setBalance(newuBalance);
    	
    	if( recid > 0 ){
    		List<BillingBalance> rBalanceList = billingBalanceDAO.findByProperty("uid", recid);
        	if( rBalanceList.size() <= 0 ){
        		return BalanceResult.RECID_NOT_EXIST;
        	}
        	rBalance = rBalanceList.get(0);
        	int rbalance = rBalance.getBalance();
        	int newrBalance = rbalance + amount;
        	if( newrBalance < 0 ){
        		return BalanceResult.RECID_BALANCE_NOT_ENOUGH;
        	}
        	rBalance.setBalance(newrBalance);
    	}
    	if( billingBalanceDAO.updateBalances(uBalance, rBalance) ){
    		return BalanceResult.UPDATE_SUCCESS;
    	}
    	return BalanceResult.UPDATE_FAIL;
	}

	public static List<BillingBalance> getBalancesByUids(List<Integer> uids) {
		List<BillingBalance> balances = billingBalanceDAO.findByProperties("uid", uids);
		if( balances.size() > 0){
			return balances;
		}
		return Collections.emptyList();
	}

	public static void delBalance(int userId) {
		List<BillingBalance> uBalanceList = billingBalanceDAO.findByProperty("uid", userId);
		billingBalanceDAO.deleteByPrimaryKey(uBalanceList.get(0).getId());
	}
}
