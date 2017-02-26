package com.free4lab.account.manager;

import java.util.ArrayList;
import java.util.List;

import com.free4lab.account.model.Account;
import com.free4lab.account.model.AccountDAO;
import com.free4lab.account.model.BillingBalance;
import com.free4lab.account.model.BillingBalanceDAO;

public class GetBalanceData {

	public static void main(String[] args){
		AccountDAO accountDAO = new AccountDAO();
		BillingBalanceDAO bDAO = new BillingBalanceDAO();
		List<Account> accountList = new ArrayList<Account>();
		accountList = accountDAO.findAll();
		for( Account a : accountList ){
			BillingBalance b = new BillingBalance();
			b.setUid(a.getId());
			b.setBalance(10000);
			bDAO.save(b);
		}
	}
}
