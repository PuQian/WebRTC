package com.free4lab.utils.nfs;

import java.io.File;
import java.util.UUID;
import org.apache.log4j.Logger;

public class FileNfs {

	static private Logger log = Logger.getLogger(FileNfs.class);

	public static String upload(File file, String filename) {
		long start_time = System.currentTimeMillis();
		String name = filename;

		String uuid = "";
		try {
			uuid = UUID.randomUUID().toString();
			IFileManager fm = DiskFactory.getNfsFileManager();
			IFileInfo info = DiskFactory.getNewNfsFileInfo();
			info.setName(name);
			fm.save(file, info, uuid);
			log.info("nfs is ok. " + uuid + " was put into nfs.");
		} catch (Exception ex) {
			log.info("nfs is down. " + uuid + " failed. " + ex.getMessage());
			return "";
		}

		long end_time = System.currentTimeMillis();
		log.info("本次上传操作耗时" + (end_time - start_time) + " ms.");
		return uuid;
	}

	public static boolean delete(String uuid) {
		try {
			IFileManager fm = DiskFactory.getNfsFileManager();
			return fm.delete(uuid);
		} catch (Exception e) {
			log.info("nfs is down. delete " + uuid + " failed. " + e.getMessage());
			return false;
		}

	}

	public static File downLoad(String uuid) {
		try {
			IFileManager fm = DiskFactory.getNfsFileManager();
			return fm.get(uuid);
		} catch (Exception e) {
			log.info("nfs is down. download " + uuid + " failed. " + e.getMessage());
			return null;
		}
	}
	
	public static void main(String[] args){
		IFileManager fm = DiskFactory.getNfsFileManager();
		fm.delete("1afb77de-76ed-47b9-9ea6-ba3c571ec5ed");
	}
}
