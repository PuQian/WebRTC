/**
 * File: A.java
 * Author: weed
 * Create Time: 2013-4-2
 */

/**
 * @author weed
 * 
 */

package com.free4lab.account.annotation;

public class A {
	private String value = "old";

	public A(String value) {
		super();
		this.value = value;
	}
	
	public String getValue() {
		return value;
	}

	@Privacy(key="value")
	public void setValue(String value) {
		this.value = value;
	}

	
}
