package com.free4lab.utils.account;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;

import org.apache.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class BillingHistory extends HashMap<String, String>{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private static final Logger logger = Logger.getLogger(BillingHistory.class);
	
	
	public BillingHistory(){}
	
	public BillingHistory(JSONObject jo) {
		try {
			@SuppressWarnings("unchecked")
			Iterator<String> iter = jo.keys();
			while (iter.hasNext()) {
				String key = iter.next();
				String value = ""; 
				if(jo.get(key) != JSONObject.NULL){
					value = jo.getString(key);
				}else{
					value = ""; 
				}
				
				this.put(key, value);
			}
		} catch (JSONException e) {
			logger.debug("invalid groupInfo",e);
		}
	}
	
	public static List<BillingHistory> getList(JSONObject ro,String param){
		List<BillingHistory> billiingHistorys = new ArrayList<BillingHistory>();
		try {
			if(ro.get(param) != JSONObject.NULL){
				String billingHistory = ro.getString(param);
				if(param.equalsIgnoreCase(AccountUtil.RECORDS_KEY)){
					JSONArray array = new JSONArray(billingHistory);
					for(int i=0;i<array.length();i++){
						JSONObject o = array.getJSONObject(i);
						logger.info(o);
						BillingHistory r = new BillingHistory(o);
						billiingHistorys.add(r);
					}
				}
			}
			
		} catch (JSONException e) {
			logger.debug("parse json failed!",e);
		}
		return billiingHistorys;
	}
	
	public String getId() {
		return "id";
	}

	public void setId(String id) {
		put("id",id);
	}

	public String getU_email() {
		return "u_email";
	}

	public void setU_email(String u_email) {
		put("u_email",u_email);
	}

	public String getRec_email() {
		return "rec_email";
	}

	public void setRec_email(String rec_email) {
		put("rec_email",rec_email);
	}

	public String getName() {
		return "name";
	}

	public void setName(String name) {
		put("name",name);
	}

	public String getReason() {
		return "reason";
	}

	public void setPid(String reason) {
		put("reason",reason);
	}

	public String getPayment_type() {
		return "payment_type";
	}

	public void setPayment_type(String payment_type) {
		put("payment_type",payment_type);
	}

	public String getTimes() {
		return "times";
	}

	public void setTimes(String times) {
		put("times",times);
	}

	public String getCount() {
		return "count";
	}

	public void setCount(String count) {
		put("count",count);
	}

	public String getAmount() {
		return "amount";
	}

	public void setAmount(String amount) {
		put("amount",amount);
	}



	public String getLog() {
		return "log";
	}

	public void setLog(String log) {
		put("log",log);
	}

	public String getTime() {
		return "time";
	}

	public void setTime(String time) {
		put("time",time);
	}

}
