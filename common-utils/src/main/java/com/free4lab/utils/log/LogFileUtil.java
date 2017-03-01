package com.free4lab.utils.log;

import java.io.File;
import java.io.RandomAccessFile;
import java.nio.channels.FileChannel;
import java.nio.channels.FileLock;
import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;

public class LogFileUtil {
	private static Logger LogFileUtil = Logger.getLogger(LogFileUtil.class);

	public static ArrayList<String> readDelLog(File file) throws Exception {
		return readDelLog(file,1);
	}
	
	public static ArrayList<String> readDelLog(File file, int lines) throws Exception {
		ArrayList<String> res = new ArrayList<String>();
		if(file == null || !file.exists() || lines<1) return res;
		
		RandomAccessFile fis = new RandomAccessFile(file,"rw");
		FileChannel fcin = fis.getChannel();
		FileLock flin = null;
		
		try {			
			while(true) {
				try {
					flin = fcin.tryLock();
					if(flin == null)
						Thread.sleep(100);
					else
						break;
				} catch (Exception e) {
					LogFileUtil.error("try get lock failed " ,e);
					Thread.sleep(100);
				}
			}
			
			//int realline = 0;
			for(int i=0;i<lines;) {
				String line = fis.readLine();
				if(line == null)
					break;
				if(line.trim().equals("")) {
					//realline++;
					continue;
				} else {
					res.add(line);
					//realline++;
					i++;
				}
			}
			boolean delres = delFromFile(file, lines);
			if(delres == false) {
				delFromFileInWin(fis, null, lines);
			}
			return res;
		} catch (Exception e) {
			throw(e);
		} finally {
			flin.release();
			fcin.close();
			fis.close();
			fis = null;
		}
		
	}
	
	public static boolean rename(File source, File dest) throws Exception {
		if(dest.exists()) {
			return false;
		}
		if(!source.exists()) {
			System.out.println(source.getName());
			throw new Exception("source file does not exit");
		}
		source.renameTo(dest);
		return true;
	}
	
	
	public static boolean appendFile(File file, String content) throws Exception {
		if(file == null) return false;
		if(content == null) return true;
		if(!file.exists()) file.createNewFile();
		RandomAccessFile out = new RandomAccessFile(file,"rw");
		FileChannel fcout = out.getChannel();
		FileLock flout = null;
		try {
			while(true) {
				try {
					flout = fcout.tryLock();
					if(flout == null)
						Thread.sleep(100);
					else 
						break;
				} catch (Exception e) {
					LogFileUtil.info("other thread is operating this file, wait for some time");
					Thread.sleep(100);
				}
			}
			long fileLength = out.length(); 
			out.seek(fileLength);     
			out.write(content.getBytes());
		} catch (Exception e) {
			throw (e);
		} finally {
			flout.release();
			fcout.close();
			out.close();
			out = null;
		}
		return true;
	}
	
	private static boolean delFromFile(File file, int line) {
		String fileLocation = file.getAbsolutePath();
		String cmd = "sed -i '1," + line +"d' " + fileLocation;
		boolean delres = ShellUtil.run(cmd);
		return delres;
	}

	private static boolean delFromFileInWin(RandomAccessFile randomFile, File file, int line) throws Exception{
		RandomAccessFile randFile = null;
		FileChannel fc = null;
		FileLock flock = null;
		
		if(randomFile != null) 
			randFile = randomFile;
		else {
			randFile = new RandomAccessFile(file, "rw");
			fc = randFile.getChannel();
			
			while(true) {
				try {
					flock = fc.tryLock();
					if(flock == null)
						Thread.sleep(100);
					else 
						break;
				} catch (Exception e) {
					LogFileUtil.info("other thread is operating this file, wait for some time");
					Thread.sleep(1000);
				}
			}
			
			for(int i=0; i<line; i++) {
				String content = randFile.readLine();
				if(content == null)
					break;
			}
		}
		
		try {
			List<String> contents = new ArrayList<String>();
			String content = randFile.readLine();
			while(content != null) {
				contents.add(content);
				content = randFile.readLine();
			}
			
			randFile.setLength(0);
			for(String at : contents) {
				randFile.write((at+LogConf.NEW_LINE).getBytes());
			}
			
			return true;
		}catch(Exception e) {
			LogFileUtil.error("delete top lines failed",e);
			return false;
		} finally {
			if(randomFile == null) {
				flock.release();
				fc.close();
				randFile.close();
			}
		}
	}
}
