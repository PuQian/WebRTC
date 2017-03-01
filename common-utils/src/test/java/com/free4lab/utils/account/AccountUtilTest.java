package com.free4lab.utils.account;

public class AccountUtilTest {
    public static void main(String[] args){
    	String accessToken = "deb71e9d5e23488b941134507cb450ae";
    	String result = AccountUtil.getAccessTokenInfo(accessToken);
    	System.out.println(result);
    }
}
