/*
 * Copyright 2011 BUPT. All rights reserved.
 * BUPT PROPRIETARY/CONFIDENTIAL.
 */

package com.free4lab.utils.hash;

import java.security.MessageDigest;
import java.math.BigInteger;
/**
 * Md5 工具
 * @author yicou
 */
public class Md5Util {

    private static MessageDigest md5 = null;
    static {
        try {
            md5 = MessageDigest.getInstance("MD5");
        } catch (Exception e) {
            System.out.println(e.getMessage());
            e.printStackTrace();
        }
    }

    /**
     * 用于获取一个String的md5值
     * @param string
     * @return
     */
    @Deprecated
    public static String getMd5(String str) {
        byte[] bs = md5.digest(str.getBytes());
        StringBuilder sb = new StringBuilder(40);
        for(byte x:bs) {
        	/**
        	 * @author huahui
        	 * 这个是前辈挖下来的坑,目前正在运行的代码不是标准的md5.
        	 * 不要轻易的把注释去掉，因为历史遗留性。
        	 */
        	/*
            if((x & 0xff)>>4 == 0) {
            	sb.append("0").append(Integer.toHexString(x & 0xff));
            } else {
            	sb.append(Integer.toHexString(x & 0xff));
            }*/
        	sb.append(Integer.toHexString(x & 0xff));
        }
        return sb.toString();
    }
    /**
     * 标准的MD5
     * @param str
     * @return
     */
    public static String getMd5Standard(String str) {
        byte[] bs = md5.digest(str.getBytes());
        StringBuilder sb = new StringBuilder(40);
        for(byte x:bs) {
        	/**
        	 * @author huahui
        	 * 这个是前辈挖下来的坑,目前正在运行的代码不是标准的md5.
        	 * 不要轻易的把注释去掉，因为历史遗留性。
        	 */
        	
            if((x & 0xff)>>4 == 0) {
            	sb.append("0").append(Integer.toHexString(x & 0xff));
            } else {
            	sb.append(Integer.toHexString(x & 0xff));
            }
        	//sb.append(Integer.toHexString(x & 0xff));
        }
        return sb.toString();
    }

    /**
     * 0x0F
     */
    public static int MASK = 15;

    /**
     * 用于获取一个String的md5数值
     * @param BigInteger
     * @return
     */
    public static BigInteger getMd5Num(String str) {
        byte[] bs = md5.digest(str.getBytes());
        BigInteger num = BigInteger.ZERO;
        for (int i = 0; i < bs.length; i++) {
            int x = bs[i];
            if (x < 0) {
                x += 256;
            }
            num = num.shiftLeft(4);
            num = num.add(BigInteger.valueOf(x & MASK));
        }
        return num;
    }
}
