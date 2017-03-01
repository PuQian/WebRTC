package com.free4lab.utils.account;

import java.util.ArrayList;
import java.util.List;

import org.junit.AfterClass;
import org.junit.BeforeClass;
import org.junit.Test;

public class UserInfoTest {
	public UserInfoTest() {
    }

    @BeforeClass
    public static void setUpClass() throws Exception {
    }

    @AfterClass
    public static void tearDownClass() throws Exception {
    }

    @Test
    public void test() throws Exception {
    	String accessToken = "e660a4658dc64e75a798851a9014dd32";
    	List<Integer> userIdList = new ArrayList<Integer>();
    	userIdList.add(23);
    	System.out.println(userIdList.size());
    	/*List<UserInfo> uList = UserInfoUtil.getUserInfoByUid(accessToken, null);*/
    	/*System.out.println(uList.get(0).getUserName());*/
    }
}
