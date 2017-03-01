package com.free4lab.utils.enabler;

import java.util.Date;
import java.util.List;
import java.util.Properties;
import javax.mail.Message.RecipientType;
import javax.mail.MessagingException;
import javax.mail.Authenticator;
import javax.mail.Message;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeUtility;

import org.apache.commons.codec.digest.DigestUtils;

import com.appcloud.api.enabler.mail.MailUtil;

/**
 * 
 * @author zhangyanjiang
 * 
 */
public class MailSend {

	private String mailTo = null;// 要发送Mail地址
	private String host = null;// smtp地址
	private String password = null;// 密码
	private String mailFrom = null;// Mail发送的起始地址
	private String messageBasePath = null;// 附件路径
	private String subject;// Mail主题
	private String msgContent;// Mail内容
	private List<String> attachedFileList;// 附件列表
	private String messageContentMimeType = "text/html;charset=gb2312";
	private String mailbccTo = null;// 抄送
	private String mailccTo = null;// 暗送

	private String serverURL;// 能力地址
	private String appName = null;// 应用名称
	private String appDevId;// 应用开发者
	private String accessToken;//签约能力获得的标识
	private String secretKey;// 标识所对应的密钥

	/**
	 * 根据设置发送电子邮件
	 * 
	 * @param useEnabler
	 *                是否使用电子邮件能力发送，false直接使用java mail发送，不经过能力服务器
	 */
//	public void send(boolean useEnabler) throws Exception {
//		Properties props = new Properties();
//		if(host != null){
//			props.put("mail.smtp.host", host);
//		}
//		props.put("mail.smtp.auth", "true");
//		props.setProperty("mail.debug", "true");  
//		//props.put("messageContentMimeType",messageContentMimeType);
//		
//		//12.15 test
//		props.put("mail.user",mailFrom );
//		props.put("mail.password", password);
//		
//		
//		if (useEnabler) {
//			props.setProperty("serverURL", serverURL);
//			props.setProperty("accessToken", accessToken);
//			props.setProperty("appName", appName);
//			props.setProperty("appDevId", appDevId);
//			long time = System.currentTimeMillis();
//			props.setProperty("time", String.valueOf(time));
//			props.setProperty("signature", DigestUtils.md5Hex(appName
//					+ appDevId + time
//					+ secretKey));
//		}else{
//			//props.put("mail.smtp.class", "com.sun.mail.smtp.SMTPTransport");
//		}
//		Authenticator auth = new Authenticator() {
//			@Override
//			protected PasswordAuthentication getPasswordAuthentication() {
//				
//				return new PasswordAuthentication(mailFrom,
//						password);
//			}
//		};
//		Session session = Session.getInstance(props, auth);
//		
//		
//		
//		// Define message
////		MailUtil mailUtil = new MailUtil();
////		mailUtil.setMailFrom(mailFrom);
////		mailUtil.setMailTo(mailTo);
////		mailUtil.setSubject(subject);
////		mailUtil.setMsgContent(msgContent);
////		mailUtil.setMailbccTo(mailbccTo);
////		mailUtil.setMailccTo(mailccTo);
////		if (attachedFileList != null && !attachedFileList.isEmpty()) {
////			mailUtil.setMessageBasePath(messageBasePath);
////			mailUtil.setAttachedFileList(attachedFileList);
////		}
////		MimeMessage message = mailUtil.getMessage(session);
//		
//		MimeMessage message = new MimeMessage(session);
//		  try {  // 设置发件人
//        InternetAddress form = new InternetAddress(
//                props.getProperty("mail.user"));
//        message.setFrom(form);
//
//        // 设置收件人
//        InternetAddress to = new InternetAddress(mailTo);
//        message.setRecipient(Message.RecipientType.TO, to);
//
//
//        // 设置邮件标题
//        message.setSubject(subject);
//        message.setSentDate(new Date());  
//        // 设置邮件的内容体
//        message.setText(msgContent,"text/plain;charset=utf-8");
//
//		
//		Transport.send(message);
//		  } catch (MessagingException e) {  
//	            e.printStackTrace();  
//	        }  
//	}
	
	public void send(boolean useEnabler) throws Exception {
		Properties props = new Properties();
		if(host != null){
			props.put("mail.smtp.host", host);
		}
		props.put("mail.smtp.auth", "true");
		props.put("messageContentMimeType",messageContentMimeType);
		if (useEnabler) {
			props.setProperty("serverURL", serverURL);
			props.setProperty("accessToken", accessToken);
			props.setProperty("appName", appName);
			props.setProperty("appDevId", appDevId);
			long time = System.currentTimeMillis();
			props.setProperty("time", String.valueOf(time));
			props.setProperty("signature", DigestUtils.md5Hex(appName
					+ appDevId + time
					+ secretKey));
		}else{
			props.put("mail.smtp.class", "com.sun.mail.smtp.SMTPTransport");
		}
		Authenticator auth = new Authenticator() {
			@Override
			protected PasswordAuthentication getPasswordAuthentication() {
				return new PasswordAuthentication(mailFrom,
						password);
			}
		};
		Session session = Session.getInstance(props, auth);
		// Define message
		MailUtil mailUtil = new MailUtil();
		mailUtil.setMailFrom(mailFrom);
		mailUtil.setMailTo(mailTo);
		mailUtil.setSubject(subject);
		mailUtil.setMsgContent(msgContent);
		mailUtil.setMailbccTo(mailbccTo);
		mailUtil.setMailccTo(mailccTo);
		if (attachedFileList != null && !attachedFileList.isEmpty()) {
			mailUtil.setMessageBasePath(messageBasePath);
			mailUtil.setAttachedFileList(attachedFileList);
		}
		MimeMessage message = mailUtil.getMessage(session);
		Transport.send(message);
	}

	public String getMailTo() {
		return mailTo;
	}

	/**
	 * 设置收件人地址
	 * 
	 * @param mailTo
	 *                如有多个逗号隔开
	 */
	public void setMailTo(String mailTo) {
		this.mailTo = mailTo;
	}

	/**
	 * 设置发件人地址
	 * 
	 * @param mailFrom
	 * 
	 */
	public void setMailFrom(String mailFrom) {
		this.mailFrom = mailFrom;
	}

	/**
	 * 设置附件的路径
	 * 
	 * @param messageBasePath
	 */
	public void setMessageBasePath(String messageBasePath) {
		this.messageBasePath = messageBasePath;
	}

	/**
	 * 设置邮件主题
	 * 
	 * @param subject
	 */
	public void setSubject(String subject) {
		this.subject = subject;
	}

	/**
	 * 设置邮件内容
	 * 
	 * @param msgContent
	 *                可以是html格式
	 */
	public void setMsgContent(String msgContent) {
		this.msgContent = msgContent;
	}

	/**
	 * 设置附件文件名称列表
	 * 
	 * @param attachedFileList
	 */
	public void setAttachedFileList(List attachedFileList) {
		this.attachedFileList = attachedFileList;
	}

	/**
	 * 设置字符集
	 * 
	 * @param messageContentMimeType
	 */
	public void setMessageContentMimeType(String messageContentMimeType) {
		this.messageContentMimeType = messageContentMimeType;
	}

	/**
	 * 设置暗送地址
	 * 
	 * @param mailbccTo
	 *                如有多个逗号隔开
	 */
	public void setMailbccTo(String mailbccTo) {
		this.mailbccTo = mailbccTo;
	}

	/**
	 * 设置抄送地址
	 * 
	 * @param mailccTo
	 *                如有多个逗号隔开
	 */
	public void setMailccTo(String mailccTo) {
		this.mailccTo = mailccTo;
	}

	/**
	 * 设置smtp地址
	 * 
	 * @param host
	 */
	public void setHost(String host) {
		this.host = host;
	}

	/**
	 * 设置应用名称，仅当要使用电子邮件能力时有效
	 * 
	 * @param appName
	 */
	public void setAppName(String appName) {
		this.appName = appName;
	}

	/**
	 * 设置发件人密码
	 * 
	 * @param password
	 */
	public void setPassword(String password) {
		this.password = password;
	}

	/**
	 * 设置电子邮件能力服务器地址，仅当要使用电子邮件能力时有效
	 * 
	 * @param serverURL
	 */
	public void setServerURL(String serverURL) {
		this.serverURL = serverURL;
	}

	/**
	 * 设置开发者Id，freeaccount的注册邮箱
	 * 
	 * @param appDevId
	 */
	public void setAppDevId(String appDevId) {
		this.appDevId = appDevId;
	}

	public void setAccessToken(String accessToken){
		this.accessToken = accessToken;
	}
	/**
	 * 签约能力时获得的密钥
	 * 
	 * @param secretKey
	 */
	public void setSecretKey(String secretKey) {
		this.secretKey = secretKey;
	}

}
