package com.free4lab.account.manager;


public class ShowBillingHistory {

	private int id;

	private String u_email;
	
	private String rec_email;
	
	private String name;
	
	private String reason;
	
	private String payment_type;
	
	private int times;
	
	private double count;
	
	private int amount;
	
	private String time;

	private String log;

	public ShowBillingHistory(int id, String u_email, String rec_email, String name,
			String reason, String payment_type, int times, double count,
			int amount, String time, String log) {
		this.id = id;
		this.u_email = u_email;
		this.rec_email = rec_email;
		this.name = name;
		this.reason = reason;
		this.payment_type = payment_type;
		this.times = times;
		this.count = count;
		this.amount = amount;
		this.time = time;
		this.log = log;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	
	public String getU_email() {
		return u_email;
	}

	public void setU_email(String u_email) {
		this.u_email = u_email;
	}

	public String getRec_email() {
		return rec_email;
	}

	public void setRec_email(String rec_email) {
		this.rec_email = rec_email;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getReason() {
		return reason;
	}

	public void setReason(String reason) {
		this.reason = reason;
	}

	public String getPayment_type() {
		return payment_type;
	}

	public void setPayment_type(String payment_type) {
		this.payment_type = payment_type;
	}

	public int getTimes() {
		return times;
	}

	public void setTimes(int times) {
		this.times = times;
	}

	public double getCount() {
		return count;
	}

	public void setCount(double count) {
		this.count = count;
	}

	public int getAmount() {
		return amount;
	}

	public void setAmount(int amount) {
		this.amount = amount;
	}

	public String getTime() {
		return time;
	}

	public void setTime(String time) {
		this.time = time;
	}

	public String getLog() {
		return log;
	}

	public void setLog(String log) {
		this.log = log;
	}

}
