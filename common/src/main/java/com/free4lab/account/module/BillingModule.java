package com.free4lab.account.module;

import java.sql.Timestamp;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import com.free4lab.account.manager.AccountManager;
import com.free4lab.account.manager.Balance;
import com.free4lab.account.manager.BillingBalanceManager;
import com.free4lab.account.manager.BillingHistoryManager;
import com.free4lab.account.manager.ShowBillingHistory;
import com.free4lab.account.manager.UserManager;
import com.free4lab.account.manager.BillingBalanceManager.BalanceResult;
import com.free4lab.account.model.Account;
import com.free4lab.account.model.BillingBalance;
import com.free4lab.account.model.BillingHistory;
import com.free4lab.account.model.User;

public class BillingModule {
	
	
	/**
	 * 用户充值
	 * @param userId
	 * @param amount
	 * @return
	 */
	public static BalanceResult recharge(int userId,int recid,int amount){
		return BillingBalanceManager.updateBalance(userId, recid, amount);
	}
	
	public static String addBillingHistory(Integer userId,Integer recid,String product_type,String name,
			String reason,String payment_type,Integer times,Double count,Integer amount){
		BillingHistory history = new BillingHistory();
		if(userId == null || recid == null){
			return "fail";
		}
		history.setUid(userId);
		history.setRecid(recid);
		if(product_type != null){
			history.setProduct_type(product_type);
		}
		if(name != null){
			history.setName(name);
		}
		if(reason != null){
			history.setReason(reason);
		}
		if(payment_type != null){
			history.setPayment_type(payment_type);
		}
		if(times != null){
			history.setTimes(times);
		}
		if(count != null){
			history.setCount(count);
		}
		if(amount != null){
			history.setAmount(amount);
		}
		Timestamp ts=new Timestamp(new Date().getTime());
		history.setTime(ts);
		history = BillingHistoryManager.addBillingHistory(history);
		if( history == null ){
			return "fail";
		}
		return "success";
	}
	
	/**
	 * 获取用户的余额balance
	 * @param userId
	 * @return
	 */
	public static Integer getBalance(int userId){
		Integer balance = null;
		List<BillingBalance> balances = BillingBalanceManager.getBalanceByUid(userId);
		if(balances != null && balances.size() > 0 ){
			balance = balances.get(0).getBalance();
		}
		return balance;
	}
	
	/**
	 * 查询用户交易记录的条数
	 * @param billing_type
	 * @param product_type
	 * @param userId
	 * @param begin_time
	 * @param end_time
	 * @param page
	 * @param page_size
	 * @return
	 */
	public static int getBillingHistorySize(String billing_type,List<String> product_type,int userId,Timestamp begin_time,Timestamp end_time){
		int total = 0;
		if(billing_type.equalsIgnoreCase("in")){
			total = BillingHistoryManager.getCountBillingHistorys(-1, userId, begin_time, end_time, 
					product_type);
		}else if(billing_type.equalsIgnoreCase("out")){
			total = BillingHistoryManager.getCountBillingHistorys(userId, -1, begin_time, end_time, 
					product_type);
		}else if(billing_type.equalsIgnoreCase("recharge")){
			total = BillingHistoryManager.getCountBillingHistorys(-1, userId, begin_time, end_time, product_type);
		}else if(billing_type.equalsIgnoreCase("all")){
			total = BillingHistoryManager.getCountBillingHistorys(userId, userId, begin_time, end_time,
					product_type);
		}
		return total;
	}
	
	/**
	 * 查询用户交易记录
	 * @param billing_type
	 * @param product_type
	 * @param userId
	 * @param begin_time
	 * @param end_time
	 * @param page
	 * @param page_size
	 * @return
	 */
	public static List<BillingHistory> getBillingHistory(String billing_type,List<String> product_type,int userId,Timestamp begin_time,Timestamp end_time,int page,int page_size){
		List<BillingHistory> historys = new ArrayList<BillingHistory>();
		if(billing_type.equalsIgnoreCase("in") ){
			historys = BillingHistoryManager.getBillingHistorys1(-1, userId, begin_time, end_time, 
					product_type, page, page_size);
		}else if(billing_type.equalsIgnoreCase("out") ){
			historys = BillingHistoryManager.getBillingHistorys1(userId, -1, begin_time, end_time, 
					product_type, page, page_size);
		}else if(billing_type.equalsIgnoreCase("recharge")){
			historys = BillingHistoryManager.getBillingHistorys1(-1, userId, begin_time, end_time, 
					product_type, page, page_size);
		}else if(billing_type.equalsIgnoreCase("all") ){
			historys = BillingHistoryManager.getBillingHistorys1(userId, userId, begin_time, end_time,
					product_type, page, page_size);
		}
		return historys;
	}
	
	public static List<BillingHistory> formatAmountOfBillingHistory(List<BillingHistory> historys,int uid){
		if(historys != null && historys.size() >0 ){
			for(BillingHistory his : historys){
				if(his.getRecid() != uid){
					his.setAmount(-his.getAmount());
				}
			}
		}
		return historys;
	}
	
	/**
	 * 获取用户交易记录中的用户uid和recid得到userMap
	 * @param historys
	 * @return
	 */
	public static Map<Integer, User> getUserMap(List<BillingHistory> historys){
		Map<Integer, User> userMap = new HashMap<Integer, User>();
		Set<Integer> set = new HashSet<Integer>();
		for(BillingHistory bHistory : historys){
			if(bHistory.getUid() != 0){
				set.add(bHistory.getUid());
			}
			if(bHistory.getRecid() != 0){
				set.add(bHistory.getRecid());
			}
		}
		List<Integer> uids = new ArrayList<Integer>(set);
		List<User> users = UserManager.getUserByUserId(uids);
		if(users != null){
			for (User u : users) {
				userMap.put(u.getUid(), u);
			}
		}
		return userMap;
	}
	
	/**
	 * 将交易记录中的用户uid和recid替换成邮箱进行显示，已经处理时间显示
	 * @param historys
	 * @param userMap
	 * @return
	 */
	public static List<ShowBillingHistory> showBillingHistory(List<BillingHistory> historys,Map<Integer, User> userMap){
		List<ShowBillingHistory> records = new ArrayList<ShowBillingHistory>();
		if(historys !=  null && historys.size() >0){
			for(BillingHistory bHistory : historys){
				String uEmail = "";
				String rEmail = "";
				if(bHistory.getUid() != 0){
					if(userMap.get(bHistory.getUid()) != null){
						uEmail = userMap.get(bHistory.getUid()).getEmail();
					}else{
						uEmail = String.valueOf(bHistory.getUid());
					}
					
				}
				if(bHistory.getRecid() != 0){
					if(userMap.get(bHistory.getRecid()) != null){
						rEmail = userMap.get(bHistory.getRecid()).getEmail();
					}else{
						rEmail = String.valueOf(bHistory.getRecid());
					}
					
				}
				DateFormat timeDateFormat = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");
				ShowBillingHistory showBillingHistoryHistory = new ShowBillingHistory( bHistory.getId(), 
						uEmail, rEmail, bHistory.getName(), bHistory.getReason(), 
						bHistory.getPaymentType().toString(),
						bHistory.getTimes(), bHistory.getCount(), bHistory.getAmount(), 
						timeDateFormat.format(bHistory.getTime()), bHistory.getLog());
				records.add(showBillingHistoryHistory);
			}
			return records;
		}else{
			return null;
		}
		
	}
	
	public static int getTotalUidsByEmail(String email){
		return AccountManager.getTotalUidsByEmail(email);
	}
	
	/**
	 * 根据email获得用户的交易记录，分页
	 * @param email
	 * @param page
	 * @param page_size
	 * @return
	 */
	public static List<Balance> getBalancesByEmailPage(String email,int page,int page_size){
		List<Balance> balances = new ArrayList<Balance>();
		List<Account> accounts = AccountManager.getUidsByEmailByPage(email, page, page_size);
		List<Integer> uids = new ArrayList<Integer>();
		if(accounts != null && accounts.size() > 0){
			for(Account ac : accounts){
				uids.add(ac.getId());
			}
			List<BillingBalance> amounts = BillingBalanceManager.getBalancesByUids(uids);
			HashMap<Integer, Integer> amountMap = new HashMap<Integer, Integer>();
			if(amounts != null && amounts.size() > 0){
				for(BillingBalance bb : amounts){
					if(!amountMap.containsKey(bb.getUid())){
						amountMap.put(bb.getUid(), bb.getBalance());
					}
				}
			}
			for(Account account : accounts){
				if(!amountMap.containsKey(account.getId())){//billing_balance中无余额的用户
					amountMap.put(account.getId(), 0);
				}
				Balance balance = new Balance(account.getId(), account.getEmail(), 
						amountMap.get(account.getId()));
				balances.add(balance);
			}
			return balances;
		}else{
			return null;
		}
		
		
		
		
		
		
	}

}
