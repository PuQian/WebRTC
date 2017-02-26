package com.free4lab.freesso.manager;

import com.free4lab.account.manager.AccessTokenManager;

public class TestAccessTokenManager {

	/**
	 * @param args
	 * @throws InterruptedException 
	 */
	public static void main(String[] args) throws InterruptedException {
		// TODO Auto-generated method stub
		String oauthToken = "b6279e69e91149f59596fe52bf01f777";
		String accessToken = "bfcb5f422f864cbfb2fa714b4977ed77";
		String clientId = "userinfo";
	//	AccessTokenManager.newAccessToken(125, oauthToken, accessToken,clientId);
	
		long start = System.currentTimeMillis();
		for (int i=0; i<19; i++){
			AccessTokenManager.getAccessTokenByAccessToken(accessToken);
			Thread.sleep(1000);
		}
		System.out.println(System.currentTimeMillis() - start);

	}

}
