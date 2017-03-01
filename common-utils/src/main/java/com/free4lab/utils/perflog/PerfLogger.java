/*
 * Copyright 2011 BUPT. All rights reserved.
 * BUPT PROPRIETARY/CONFIDENTIAL.
 */

package com.free4lab.utils.perflog;

import java.io.File;
import java.io.FileWriter;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

/**
 *
 * @author yicou
 */
public class PerfLogger {
    public static final String FILE_SEPARATOR =
            System.getProperties().getProperty("file.separator");
    private static ThreadPoolExecutor pool = null;
    static {
        pool = new ThreadPoolExecutor(
            1,
            1,
            0,
            TimeUnit.MINUTES,
            new LinkedBlockingQueue<Runnable>());
    }
    
    private String rootPath = null;
    public PerfLogger() {
        init("/tmp/perflog");
    }
    public PerfLogger(String rootDir) {
        init(rootDir);
    }
    private void init(String rootDir) {
        File logDir = new File(rootDir);
        if (!logDir.exists()) {
            if (!logDir.mkdirs()) {
                logDir = null;
                return;
            }
        }
        if (!logDir.isDirectory()) {
            logDir = null;
            return;
        }
        rootPath = logDir.getAbsolutePath();
        if (!rootPath.endsWith(FILE_SEPARATOR)) {
            rootPath += FILE_SEPARATOR;
        }
    }

    public class LogItem implements Runnable{
        private String logStr;
        private String time;

        public LogItem(String time, String logStr) {
            this.time = time;
            this.logStr = logStr;
        }

        public void run() {
            if (rootPath != null) {
                try {
                    File f = new File(rootPath.concat("pl" + time.substring(0, 10)));
                    FileWriter rw = new FileWriter(f, true);
                    rw.append(logStr);
                    rw.append("\n");
                    rw.flush();
                    rw.close();
                } catch (Exception ex) {
                    System.out.println(ex.getMessage());
                    ex.printStackTrace();
                }
            }
        }
    }

    private static final SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmm");

    public void writeIntoLog(String product, String content) {
        String time = sdf.format(Calendar.getInstance().getTime());
        String logStr = time + "[[" + product + "]]" + content;
        pool.execute(new LogItem(time, logStr));
    }

    private static final String TAG = "[tag]";
    private static final String NUM = "[num]";

    /**
     * 记录一个tag出现的次数, 多极tag请用/分割.比如 search/index/1
     * @param product
     * @param tag
     */
    public void logTag(String product, String tag) {
        writeIntoLog(product, TAG.concat(tag));
    }

    /**
     * 记录一个数字的方差,均值等
     * @param product
     * @param name
     * @param num
     */
    public void LogNumber(String product, String name, Long num) {
        writeIntoLog(product, NUM.concat(name + ":" + num));
    }
}
