/*
 * Copyright 2011 BUPT. All rights reserved.
 * BUPT PROPRIETARY/CONFIDENTIAL.
 */

package com.free4lab.utils.http;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.junit.AfterClass;
import org.junit.BeforeClass;
import org.junit.Test;
import static org.junit.Assert.*;

/**
 *
 * @author yicou
 */
public class HttpCrawlerTest {

    public HttpCrawlerTest() {
    }

    @BeforeClass
    public static void setUpClass() throws Exception {
    }

    @AfterClass
    public static void tearDownClass() throws Exception {
    }

    /**
     * Test of getHtmlDoc method, of class HttpCrawler.
     */
    @Test
    public void testGetHtmlDoc() {
        System.out.println("getHtmlDoc");
        String url = "http://59.64.179.233:9090/frSearch/search";
        String url2 = "http://59.64.179.210/search";
        Map<String, List<String>> paras = new HashMap<String, List<String>>();
        List<String> tagList = new ArrayList<String>();
        tagList.add("计算");
        paras.put("q", tagList);
        
        tagList = new ArrayList<String>();
        tagList.add("json");
        paras.put("type", tagList);

        tagList = new ArrayList<String>();
        tagList.add("133");
        paras.put("size", tagList);
        String result = HttpCrawler.getHtmlDoc(url2, paras);
        System.err.println(result.length());
        System.out.println(result);
        System.out.println(result.substring(result.length() - 50));
    }
}