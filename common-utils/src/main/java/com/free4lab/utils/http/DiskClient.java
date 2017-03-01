package com.free4lab.utils.http;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.Properties;

import org.apache.commons.httpclient.*;
import org.apache.commons.httpclient.methods.GetMethod;
import org.apache.commons.httpclient.methods.PostMethod;
import org.apache.commons.httpclient.methods.multipart.FilePart;
import org.apache.commons.httpclient.methods.multipart.MultipartRequestEntity;
import org.apache.commons.httpclient.methods.multipart.Part;
import org.apache.commons.httpclient.methods.multipart.StringPart;
import org.apache.log4j.Logger;
import org.json.JSONException;
import org.json.JSONObject;

public class DiskClient {
	final static String FileReg = "(?i)filename=\"(.*)\"";
	final static Pattern FilePattern = Pattern.compile(FileReg);
	final static String default_disk = "http://freedisk.free4lab.com";
	static String Host ;
	static String UploadUrl;
	static String DownloadUrl;
	static String DeleteUrl;
	static String getFileName;
	
	private static final Logger logger = Logger.getLogger(DiskClient.class);
	static {
		Properties p = new Properties();
		try {
			p.load(DiskClient.class.getClassLoader()
					.getResourceAsStream("disk.properties"));
			Host = p.getProperty("Disk.HostPort");
		} catch (Exception e1) {
			Host = default_disk;
		}

		UploadUrl = Host+"/doUpload";
		DownloadUrl = Host+"/download";
		DeleteUrl = Host+"/delete";
		getFileName = Host+"/getName";
	}
	public  static String upload(File file, String filename, String handleUrl) throws Exception {
		HttpClient client = new HttpClient();
		
		PostMethod postMethod = new PostMethod(UploadUrl);
		logger.info("upload res " + filename);
		Part[] p = new Part[4];
		p[0] = new StringPart("name", filename);
		p[1] = new StringPart("txt", filename);
		if(handleUrl == null) handleUrl = "";
		p[2] = new StringPart("handleUrl", handleUrl);
		p[3] = new FilePart("upload", filename, file);
		MultipartRequestEntity mrp =   new  MultipartRequestEntity(p , postMethod.getParams());
		
		postMethod.setRequestEntity(mrp);
		
		client.executeMethod(postMethod);
		
		String res = postMethod.getResponseBodyAsString();
		
		Pattern P = Pattern.compile("\"uuid\":\"(.*)\"");
		
	    Matcher m = P.matcher(res);
	    
	    String uuid;
	    if(m.find() == true)
	    	uuid = m.group(1);
	    else
	    	uuid = null;
		return uuid;
	}
	
	public static Map<String,InputStream> download(String uuid) throws Exception {
		HttpClient client = new HttpClient();
		String filename = "";
		GetMethod getMethod = new GetMethod(DownloadUrl+"?uuid="+uuid);
		client.executeMethod(getMethod);
		InputStream s =  getMethod.getResponseBodyAsStream();
		Header header = getMethod.getResponseHeader("Content-Disposition");
		if(header != null){
			Matcher match = FilePattern.matcher(header.getValue());
			if(match.find()){
				filename = match.group(1);
			}else{
				throw new Exception("文件名获取失败");
			}
			Map<String, InputStream> ret = new HashMap<String, InputStream>();
			ret.put(filename , s);
			return ret;
		}else{
			throw new Exception("文件获取失败"+getMethod.getResponseBodyAsString());
		}
	}
	
	public static String getFileName(String uuid) throws Exception {
		HttpClient client = new HttpClient();
		GetMethod getMethod = new GetMethod(getFileName+"?uuid="+uuid);
		client.executeMethod(getMethod);
		String s =  getMethod.getResponseBodyAsString();
		if(s != null){
			try {
				JSONObject obj = new JSONObject(s);
				String fileName = obj.getString("fileName");
				String result = obj.getString("result");
				if("true".equals(result)) {
					return fileName;
				} else {
					throw new Exception("文件获取失败"+getMethod.getResponseBodyAsString());
				}
			} catch(JSONException e) {
				throw new Exception("文件获取失败"+getMethod.getResponseBodyAsString());
			}
		}else{
			throw new Exception("文件获取失败"+getMethod.getResponseBodyAsString());
		}
	}

	/**
	 * 删除文件
	 * @param uuid
	 * @throws HttpException 网络异常
	 * @throws IOException 网络异常
	 */
	public static void delete(String uuid) throws HttpException, IOException{
		HttpClient client = new HttpClient();
		GetMethod method = new GetMethod(DeleteUrl + "?uuid=" + uuid);
		client.executeMethod(method);
	}

}
