package com.free4lab.account;

import java.io.IOException;

import org.apache.commons.httpclient.HttpException;

public class LoginLogoutTest {
  
    
	public static void main(String[] args) throws HttpException, IOException {
		AccountTester tester = new AccountTester();
		tester.doTest();
	}  
}
