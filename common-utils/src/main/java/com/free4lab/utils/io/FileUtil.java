/*
 * Copyright 2011 BUPT. All rights reserved.
 * BUPT PROPRIETARY/CONFIDENTIAL.
 */

package com.free4lab.utils.io;

import java.io.File;
import java.io.IOException;
import org.apache.commons.io.FileUtils;
/**
 * 文件工具
 * @author yicou
 */
public class FileUtil {

    public static boolean exists(String path) {
        File file = new File(path);
        return file.exists();
    }

    /**
     * 将文件move到目的地址
     * @param srcFile 将被拷贝的文件路径
     * @param destPath 目标文件地址
     */
    public static void move(String srcPath, String destPath) throws IOException{
        move(new File(srcPath), destPath);
    }

    /**
     * 将文件move到目的地址
     * @param srcFile 将被拷贝的文件，不可为空
     * @param destPath 目标文件地址
     */
    public static void move(File srcFile, String destPath) throws IOException{
        File destFile = new File(destPath);
        if (destFile.exists()) {
            throw new IOException("File: " + destPath + " existed!");
        }
        FileUtils.moveFile(srcFile, destFile);
    }

    /**
     * 将文件copy到目的地址
     * @param srcFile 将被拷贝的文件路径
     * @param destPath 目标文件地址
     */
    public static void copy(String srcPath, String destPath) throws IOException{
        copy(new File(srcPath), destPath);
    }

    /**
     * 将文件copy到目的地址
     * @param srcFile 将被拷贝的文件，不可为空
     * @param destPath 目标文件地址
     */
    public static void copy(File srcFile, String destPath) throws IOException{
        File destFile = new File(destPath);
        if (destFile.exists()) {
            String tmpPath = destPath.concat(".tmp");
            File tmpFile = new File(tmpPath);
            if (tmpFile.exists()) {
                tmpFile.delete();
            }
            FileUtils.copyFile(srcFile, new File(tmpPath));
            destFile.delete();
            move(tmpPath, destPath);
        } else {
            FileUtils.copyFile(srcFile, new File(destPath));
        }
    }

    /**
     * 删除文件
     * @param filePath 删除文件地址
     * @return
     */
    public static void delete(String filePath) {
        new File(filePath).delete();
    }
}
