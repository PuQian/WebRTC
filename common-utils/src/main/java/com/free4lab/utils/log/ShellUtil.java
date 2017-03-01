package com.free4lab.utils.log;

import java.io.IOException;

import org.apache.log4j.Logger;

public class ShellUtil {
	private static long TIMEOUT = 1000;
	private static Logger logger = Logger.getLogger(ShellUtil.class);
	
	static public boolean run(String c) {
		//logger.info("running cmd:" + c);
		String[] cmd = { "/bin/bash", "-c", c };
		String user = System.getProperty("user.name");
		if (!user.equals("root")) {
			// try use the username as sudo passwd
			cmd[2] = String.format("echo %s | sudo -S %s", user, c);
		}
		Process p = null;
		try {
			p = Runtime.getRuntime().exec(cmd);
			try {
				synchronized (p) {
					p.wait(TIMEOUT);
				}
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
			try {
				int ret = p.exitValue();
				if (ret == 0)
					return true;
			} catch (IllegalThreadStateException e) {
				logger.warn(e);

			}
		} catch (IOException e) {

		}
		if (p != null)
			p.destroy();
		//logger.info("cmd:" + c + " returns false");
		return false;
	}
	
	static public void runInBackground(String c ,String logFile, boolean asRoot) throws IOException{
		String osName = System.getProperty("os.name");
		logger.info("os.name = " + osName);
		
		if (osName.equalsIgnoreCase("linux")) {
			c = "nohup " + c +"> "+logFile
	                + " 2>&1 &";
	        String[] cmd = { "/bin/bash", "-c", c };
	        if(asRoot){
	        	String user = System.getProperty("user.name");
	    		if (!user.equals("root")) {
	    			// try use the username as sudo passwd
	    			cmd[2] = String.format("echo %s | sudo -S %s", user, c);
	    		}
	        }
	        logger.info("running backgroud cmd: "+ cmd[2]);
	        Process p = Runtime.getRuntime().exec(cmd);
		} else {
			logger.info("running backgroud cmd: "+ c);
	        Process p = Runtime.getRuntime().exec(c);
		}
		return ;
	}
}
