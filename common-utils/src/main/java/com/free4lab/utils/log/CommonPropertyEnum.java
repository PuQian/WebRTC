package com.free4lab.utils.log;

public enum CommonPropertyEnum {
	TOPIC, APP_KEY, TC, SIGN, CREATE_TIME, 
	IP_ADDRESS, SOURCE, OFFSET, CONTENT, UN_KNOWN;
	
	public String toString() {
		switch(this) {
		case TOPIC:
			return "topic";
		case APP_KEY:
			return "appKey";//标识应用信息的一个16位字符串，
		case TC:
			return "tc";//日志发送时间
		case SIGN: 
			return "sign";//验证请求合法性的签名信息
		case CREATE_TIME: 
			return "createdTime";// 日志创建的时间
		case IP_ADDRESS:
			return "ipaddress";// 日志产生的客户端ip地址，缺省为un_known
		case SOURCE:
			return "source";// 日志的来源（文件名，端口，应用类名），缺省为un_know
		case OFFSET:
			return "offset";// 日志在本source中的偏移位置，缺省为系统的一个long自增值
		case CONTENT:
			return "content";// 日志的主体内容
		case UN_KNOWN:
			return "un_known";// 未知的属性标识为un_known
		}
		return super.toString();
	}
}
