package com.free4lab.freesso.manager;

import com.free4lab.account.manager.UserManager;
import com.free4lab.account.model.User;

public class TestUserManager {
	
	public static void main(String[] args) throws InterruptedException {
		// TODO Auto-generated method stub
		int userId = 10;
		String email = "lmqt890930@163.com";
		User user = UserManager.addUser(userId, email, "", "", "");
	
		if(user.getEmail().equals(email) && user.getUid() == userId){
			System.out.println("right");
		}else{
			System.out.println("wrong");
		}
		
	}
}
