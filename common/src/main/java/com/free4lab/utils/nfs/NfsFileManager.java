/*
 * Copyright 2011 BUPT. All rights reserved.
 * BUPT PROPRIETARY/CONFIDENTIAL.
 */

package com.free4lab.utils.nfs;

import java.io.File;
import java.math.BigInteger;
import com.free4lab.utils.hash.Md5Util;
import com.free4lab.utils.io.FileUtil;
import java.io.IOException;
import java.util.Properties;

/**
 *
 * @author yicou
 */
public class NfsFileManager implements IFileManager{

    public static final String FILE_SEPARATOR =
            System.getProperties().getProperty("file.separator");
    public static final String NFS_DIR;
    public static final String FREE_DISK_DIR = "avator";
    public static final BigInteger CHAR_NUM = BigInteger.valueOf(26);
    public static final char A_CHAR = 'a';

    public static final String SUFFIX = ".info";

    static {
        Properties p = new Properties();
        try {
            p.load(NfsFileManager.class.getClassLoader().getResourceAsStream("nfs.properties"));
        } catch (Exception ex) {
            p.setProperty("NFS_DIR", "/nfs");
        }
        NFS_DIR = p.getProperty("NFS_DIR");
    }

    String getDir(String uuid) {
        uuid = uuid.toUpperCase();

        BigInteger md5Num = Md5Util.getMd5Num(uuid);
        // md5 % 26
        int firstCharVal = md5Num.remainder(CHAR_NUM).intValue();
        // (md5 / 26 ) % 26
        int secondCharVal = md5Num.divide(CHAR_NUM).remainder(CHAR_NUM).intValue();

        int aCharVal = (int) A_CHAR;

        char firstChar = (char)(aCharVal + firstCharVal);
        char secondChar = (char)(aCharVal + secondCharVal);
        
        return NFS_DIR + FILE_SEPARATOR
                + FREE_DISK_DIR + FILE_SEPARATOR
                + firstChar + FILE_SEPARATOR
                + secondChar + FILE_SEPARATOR;
    }

    /**
     * 通过存储UUID获取文件
     * @param uuid
     * @return 文件
     */
    public File get(String uuid) {
        String dirPath = getDir(uuid);
        String dist = dirPath + uuid;
        return new File(dist);
    }
    
    /**
     * 通过存储UUID获取文件信息
     * @param uuid
     * @return 文件信息
     */
    public IFileInfo getInfo(String uuid) {
        String dirPath = getDir(uuid);
        String dist = dirPath + uuid + SUFFIX;
        NfsFileInfo info = new NfsFileInfo();
        if (info.read(dist)) {
            return info;
        } else {
            return null;
        }
    }

    /**
     * 通过存储UUID删除文件
     * @param uuid
     * @return 成功信息
     */
    public boolean delete(String uuid) {
        String dirPath = getDir(uuid);
        String dist = dirPath + uuid;
        FileUtil.delete(dist);
        FileUtil.delete(dist+".info");
        return true;
    }

    
    /**
     * 存储一个文件,获得存储UUID做为唯一标识,用于获取
     * @param file 文件
     * @return 存储UUID
     */
    public void save(File file, IFileInfo info, String uuid) throws IOException {
        //String uuid = UUID.randomUUID().toString();

        String dirPath = getDir(uuid);
        File dir = new File(dirPath);
        if (!dir.exists()) {
            dir.mkdirs();
        }

        String dist = dirPath + uuid;
        FileUtil.copy(file, dist);

        dist += SUFFIX;
        NfsFileInfo nfsInfo = new NfsFileInfo();
        nfsInfo.setName(info.getName());
        nfsInfo.save(dist);

    }
}
