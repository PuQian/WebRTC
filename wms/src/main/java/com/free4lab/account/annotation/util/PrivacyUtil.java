/**
 * File: PrivacyUtil.java
 * Author: weed
 * Create Time: 2013-4-3
 */
package com.free4lab.account.annotation.util;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;

import com.free4lab.account.annotation.Privacy;


/**
 * @author weed
 * 
 */
public class PrivacyUtil {
	public static void setPrivacyByAnnotaion(Object o, String key, String value)
			throws IllegalArgumentException, IllegalAccessException,
			InvocationTargetException {

		Method[] methods = o.getClass().getMethods();
		for (Method m : methods) {
			if (m.getName().startsWith("set")) {
				String annoKey = m.getAnnotation(Privacy.class).key();
				if (annoKey != null && annoKey.equals(key)) {
					m.invoke(o, value);
					break;
				}
			}
		}
	}
}
