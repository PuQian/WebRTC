package com.free4lab.account.manager;

import java.util.List;

import com.free4lab.account.model.BillingBalance;

public class TestBillingBalanceManager {

	public static void main( String[] args ){
		List<BillingBalance> balance1 = BillingBalanceManager.getBalanceByUid(39);
		if( balance1.size() > 0 ){
			System.out.println( "39:"+balance1.get(0).getBalance() );
		}
		List<BillingBalance> balance2 = BillingBalanceManager.getBalanceByUid(100);
		if( balance2.size() > 0 ){
			System.out.println( "100:"+balance2.get(0).getBalance() );
		}
		
		BillingBalanceManager.updateBalance(39, 100, -100);
		
		List<BillingBalance> balance11 = BillingBalanceManager.getBalanceByUid(39);
		if( balance11.size() > 0 ){
			System.out.println( "39:"+balance11.get(0).getBalance() );
		}
		List<BillingBalance> balance12 = BillingBalanceManager.getBalanceByUid(100);
		if( balance12.size() > 0 ){
			System.out.println( "100:"+balance12.get(0).getBalance() );
		}
	}
	
}
