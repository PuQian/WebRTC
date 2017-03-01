/*
 * Copyright 2011 BUPT. All rights reserved.
 * BUPT PROPRIETARY/CONFIDENTIAL.
 */

package com.free4lab.utils.http;

import java.util.Map;
import org.json.JSONObject;
import org.junit.AfterClass;
import org.junit.BeforeClass;
import org.junit.Test;
import static org.junit.Assert.*;
import com.free4lab.utils.http.AccountUtil;

/**
 *
 * @author yicou
 */
public class AccountUtilTest {

    public AccountUtilTest() {
    }

    @BeforeClass
    public static void setUpClass() throws Exception {
    }

    @AfterClass
    public static void tearDownClass() throws Exception {
    }

    @Test
    public void test() throws Exception {

        AccountUtil.setFreeAccountUrl("http://authentication.free4lab.com/");
        AccountUtil.setTimeout(2000);

        // 已知的secretKey
        String secretKey = "freeaccountSecretKey";
        // 回跳得到的oauthToken
        String oauthToken = "758830683ca24f44a1568435a1cf5499";
        Map<String, String> ans1 = AccountUtil.getAccessTokenMap(secretKey, oauthToken);

        String message1 = ans1.get(AccountUtil.PARAS_MESSAGE);
        String accessToken = ans1.get(AccountUtil.PARAS_ACCESS_TOKEN);

        if (accessToken.isEmpty()) {
            System.out.println("调用失败1：" + message1);
            return;
        }

        System.out.println("用户的accessToken：" + accessToken);

        Map<String, String> ans2 = AccountUtil.getUserInfoMap(accessToken);
        String message2 = ans2.get(AccountUtil.PARAS_MESSAGE);
        String email = ans2.get(AccountUtil.PARAS_EMAIL);
        String userId = ans2.get(AccountUtil.PARAS_USERID);

        if (email.isEmpty()) {
            System.out.println("调用失败2：" + message2);
            return;
        }
        
        System.out.println("用户的account ID：" + userId);
        System.out.println("用户的注册email：" + email);
    }

}