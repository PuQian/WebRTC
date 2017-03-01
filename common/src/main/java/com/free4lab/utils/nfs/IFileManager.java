/*
 * Copyright 2011 BUPT. All rights reserved.
 * BUPT PROPRIETARY/CONFIDENTIAL.
 */

package com.free4lab.utils.nfs;

import java.io.File;
import java.io.IOException;

/**
 *
 * @author yicou
 */
public interface IFileManager {
    /**
     * 通过存储UUID获取文件
     * @param uuid
     * @return 文件
     */
    public File get(String uuid);
    
    /**
     * 通过存储UUID获取文件信息
     * @param uuid
     * @return 文件信息, 可能为null
     */
    public IFileInfo getInfo(String uuid);

    /**
     * 通过存储UUID删除文件
     * @param uuid
     * @return 成功信息
     */
    public boolean delete(String uuid);

    /**
     * 存储一个文件,获得存储UUID做为唯一标识,用于获取
     * @param file 文件
     * @param info 文件信息
     * @param 存储UUID
     */
    public void save(File file, IFileInfo info, String uuid) throws IOException ;
}
