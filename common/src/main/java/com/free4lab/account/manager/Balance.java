package com.free4lab.account.manager;

public class Balance {

	int uid;
	int balance;
	String email;
	
	public Balance() {
	}

	public Balance(int uid, String email, int balance) {
		this.uid = uid;
		this.balance = balance;
		this.email = email;
	}

	public int getUid() {
		return uid;
	}
	
	public void setUid(int uid) {
		this.uid = uid;
	}
	
	public int getBalance() {
		return balance;
	}
	
	public void setBalance(int balance) {
		this.balance = balance;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}
}
