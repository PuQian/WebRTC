/**
 * File: Privacy.java
 * Author: weed
 * Create Time: 2013-4-2
 */

/**
 * @author weed
 *
 */

package com.free4lab.account.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Inherited;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.METHOD)   
@Retention(RetentionPolicy.RUNTIME)   
@Inherited
public @interface Privacy {
	 String key();
}
