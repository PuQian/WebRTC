/**
 * File: PrivacyTest.java
 * Author: weed
 * Create Time: 2013-4-2
 */

/**
 * @author weed
 *
 */
package com.free4lab.account.annotation;

import java.lang.reflect.InvocationTargetException;
import com.free4lab.account.annotation.util.PrivacyUtil;

public class PrivacyTest {

	/**
	 * @param args
	 * @throws InvocationTargetException 
	 * @throws IllegalAccessException 
	 * @throws IllegalArgumentException 
	 */
	public static void main(String[] args) throws IllegalArgumentException, IllegalAccessException, InvocationTargetException {
		// TODO Auto-generated method stub
		A a = new A("old");
		
		PrivacyUtil.setPrivacyByAnnotaion(a, "value", "new");
		
		System.out.println(a.getValue());
	}

}
