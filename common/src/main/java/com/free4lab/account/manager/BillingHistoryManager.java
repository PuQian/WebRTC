package com.free4lab.account.manager;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

import com.free4lab.account.model.BillingHistory;
import com.free4lab.account.model.BillingHistoryDAO;

public class BillingHistoryManager {
	/**
	 * BillingHistoryDAO的静态常量
	 */
	private static BillingHistoryDAO billingHistoryDAO = new BillingHistoryDAO();
	
	/**
	 * 新增一条交易记录
	 * @param history
	 * @return
	 */
	public static BillingHistory addBillingHistory(BillingHistory history){
		try {
			billingHistoryDAO.save(history);
            return history;
        } catch (Exception ex) {
            System.err.println(ex.getMessage());
            ex.printStackTrace(System.err);
            return null;
        }
	}
	
	/**
	 * 查询全部交易记录
	 * @return
	 */
	public static List<BillingHistory> getBillingHistorys(int uid){
		List<BillingHistory> history = new ArrayList<BillingHistory>();
		history = billingHistoryDAO.getOnesHistory(uid);
		return history;
	}
	
	/**
	 * 根据条件查询交易记录
	 * @param uid
	 * @param beginTime
	 * @param endTime
	 * @param billingType
	 * @param ptype
	 * @return
	 */
	public static List<BillingHistory> getBillingHistorys( int uid, Timestamp beginTime, Timestamp endTime, String billingType, String ptype ){
		List<BillingHistory> history = new ArrayList<BillingHistory>();
		List<BillingHistory> result = new ArrayList<BillingHistory>();
		if( billingType == null ){
			history = billingHistoryDAO.getOnesHistory(uid);
		}else if( billingType == "in" || billingType.equals("in")){
			history = billingHistoryDAO.findByProperty("recid", uid);
		}else if( billingType == "out" || billingType.equals("out")){
			history = billingHistoryDAO.findByProperty("uid", uid);
		}
		if( beginTime == null && ptype != null ){
			for(BillingHistory h : history){
				if( h.getProduct_type().equals(ptype) ){
					result.add(h);
				}
			}
			return result;
		}else if( beginTime != null && ptype == null ){
			if( beginTime.after(endTime) ){
				return null;
			}
			for(BillingHistory h : history){
				if( h.getTime().after(beginTime) && h.getTime().before(endTime) ){
					result.add(h);
				}
			}
			return result;
		}else if( beginTime != null && ptype != null ){
			if( beginTime.after(endTime) ){
				return null;
			}
			for(BillingHistory h : history){
				if( h.getTime().after(beginTime) && h.getTime().before(endTime) && h.getProduct_type().equals(ptype) ){
					result.add(h);
				}
			}
			return result;
		}
			
		return history;
	}
	
	public static List<BillingHistory> getBillingHistorys1( int uid, int recid, 
			Timestamp beginTime, Timestamp endTime, List<String> ptype , int page, int pageSize){
		List<BillingHistory> history = new ArrayList<BillingHistory>();
		history = billingHistoryDAO.findByPropertiesByPage(uid, recid, ptype, beginTime, endTime,
				page, pageSize);			
		return history;
	}

	public static int getCountBillingHistorys(int uid, int recid, Timestamp beginTime, 
			Timestamp endTime, List<String> ptype) {
		List<BillingHistory> history = new ArrayList<BillingHistory>();
		history = billingHistoryDAO.findByProperties(uid, recid, ptype, beginTime, endTime);			
		return history.size();
	}

	public static int getCountBillingHistorysAndPtype(int uid, int recid, Timestamp beginTime, 
			Timestamp endTime, List<String> ptypeList) {
		List<BillingHistory> history = new ArrayList<BillingHistory>();
		history = billingHistoryDAO.findByProperties1(uid, recid, ptypeList, beginTime, endTime);			
		return history.size();
	}

	public static List<BillingHistory> getBillingHistorysAndPtype(int uid, int recid, 
			Timestamp beginTime, Timestamp endTime,
			List<String> ptypeList, int page, int pageSize) {
		List<BillingHistory> history = new ArrayList<BillingHistory>();
		history = billingHistoryDAO.findByPropertiesByPage1(uid, recid, ptypeList, beginTime, endTime,
				page, pageSize);			
		return history;
	}
}
