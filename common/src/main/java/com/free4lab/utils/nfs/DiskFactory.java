/*
 * Copyright 2011 BUPT. All rights reserved.
 * BUPT PROPRIETARY/CONFIDENTIAL.
 */

package com.free4lab.utils.nfs;



/**
 *
 * @author yicou
 */
public class DiskFactory {
	
    public static IFileManager getNfsFileManager(){
    	return new NfsFileManager();
    		
    }
    public static IFileInfo getNewNfsFileInfo() {
    	return new NfsFileInfo();
    }
}
