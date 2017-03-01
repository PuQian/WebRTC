package com.free4lab.account.manager;

import java.util.regex.Pattern;


public class ParameterUtilManager {
	/**
	 * 判断API参数合法性，需进行SQL等字符串验证，可为空！
	 */
	//private static final Logger logger = Logger.getLogger(ParameterUtilManager.class);
	
	static Pattern patternEmail = Pattern.compile("^\\w+([-+.]\\w+)*@\\w+([-.]\\w+)*.\\w+([-.]\\w+)*$");//email
	static Pattern patternInt = Pattern.compile("^\\d{1,32}$");//Int等1-31位数字
	static Pattern patternInt11 = Pattern.compile("^\\d{11}$");//电话等11位数字
	static Pattern patternString = Pattern.compile("^\\w+$");//由字母、数字、下划线组成的大于一位的字符串
	static Pattern patternString1 = Pattern.compile("^\\w$");//由字母、数字、下划线组成的只有一位的字符串
	static Pattern patternStrings = Pattern.compile("^\\S+$");//无空格符且大于一位的字符串
	static Pattern patternStringChinese = Pattern.compile("^[\u4e00-\u9fa5]+$");//由汉字组成的大于一位的字符串
	static Pattern patternStringLetterChinese = Pattern.compile("^([A-Za-z]+[[A-Za-z]\\s]*[A-Za-z]*){1,50}$||([\u4e00-\u9fa5]){1,50}$"); //字母或者汉字1-50位
	static Pattern patternStringDigitLetterChinese = Pattern.compile("^[0-9A-Za-z\u4e00-\u9fa5]{1,50}$"); //数字、字母或者汉字1-50位
	static Pattern patternUuid = Pattern.compile("^[A-Za-z0-9]{32}$");//UUID，由字母、数字组成的32位的字符串
	static Pattern patternUuid16 = Pattern.compile("^[A-Za-z0-9]{16}$");//UUID，由字母、数字组成的16位的字符串
	static Pattern patternTime = Pattern.compile("^\\d{4}-\\d{2}-\\d{2}\\s\\d{2}:\\d{2}:\\d{2}\\s\\d{3}$");//时间，格式形如2013-01-01 23:25:59 000
	static Pattern patternUuid36 = Pattern.compile("^[A-Za-z0-9\\-]{36}$");//头像的uuid
	static Pattern patternDouble = Pattern.compile("([1-9]+[0-9]*|0)(\\.[\\d]+)?");
	static Pattern patternStringss = Pattern.compile("^[A-Za-z0-9\\-]+$");//字数数字短横线至少一个
	static Pattern patternTime2 = Pattern.compile("^\\d{4}-\\d{2}-\\d{2}\\s\\d{2}:\\d{2}:\\d{2}$");//时间，格式形如2013-01-01 23:25:59
	
	public static boolean isEmail(String str) {
		str = StringUtilManager.StringFilter(str);
		if (!str.equalsIgnoreCase("") && !patternEmail.matcher(str).matches()) {
			return false;
		}
		return true;
	}
	
	public static boolean isInt(String str) {
		str = StringUtilManager.StringFilter(str);
		if (!str.equalsIgnoreCase("") && !patternInt.matcher(str).matches()) {
			return false;
		}
		return true;
	}
	
	public static boolean isInt11(String str) {
		str = StringUtilManager.StringFilter(str);
		if (!str.equalsIgnoreCase("") && !patternInt11.matcher(str).matches()) {
			return false;
		}
		return true;
	}
	
	public static boolean isString(String str) {
		str = StringUtilManager.StringFilter(str);
		if (!str.equalsIgnoreCase("") && !patternString.matcher(str).matches()) {
			return false;
		}
		return true;
	}
	
	public static boolean isString1(String str) {
		str = StringUtilManager.StringFilter(str);
		if (!str.equalsIgnoreCase("") && !patternString1.matcher(str).matches()) {
			return false;
		}
		return true;
	}
	
	public static boolean isStrings(String str) {
		str = StringUtilManager.StringFilter(str);
		if (!str.equalsIgnoreCase("") && !patternStrings.matcher(str).matches()) {
			return false;
		}
		return true;
	}
	
	public static boolean isStringChinese(String str) {
		str = StringUtilManager.StringFilter(str);
		if (!str.equalsIgnoreCase("") && !patternStringChinese.matcher(str).matches()) {
			return false;
		}
		return true;
	}
	
	public static boolean isUuid(String str) {
		str = StringUtilManager.StringFilter(str);
		if (!str.equalsIgnoreCase("") && !patternUuid.matcher(str).matches()) {
			return false;
		}
		return true;
	}
	
	public static boolean isUuid16(String str) {
		str = StringUtilManager.StringFilter(str);
		if (!str.equalsIgnoreCase("") && !patternUuid16.matcher(str).matches()) {
			return false;
		}
		return true;
	}
	
	public static boolean isTime(String str) {
		str = StringUtilManager.StringFilter(str);
		if (!str.equalsIgnoreCase("") && !patternTime.matcher(str).matches()) {
			return false;
		}
		return true;
	}
	
	public static boolean isLetterChinese(String str){
		str = StringUtilManager.StringFilter(str);
		if(!str.equalsIgnoreCase("") && !patternStringLetterChinese.matcher(str).matches()){
			return false;
		}
		return true;
	}
	
	public static boolean isDigitLetterChinese(String str){
		str = StringUtilManager.StringFilter(str);
		if(!str.equalsIgnoreCase("") && !patternStringDigitLetterChinese.matcher(str).matches()){
			return false;
		}
		return true;
	}
	
	public static boolean isUuid36(String str){
		str = StringUtilManager.StringFilter(str);
		if(!str.equalsIgnoreCase("") && ! patternUuid36.matcher(str).matches()){
			return false;
		}
		return true;
	}
	
	public static boolean isDouble(String str){
		str = StringUtilManager.StringFilter(str);
		if(!str.equalsIgnoreCase("") && ! patternDouble.matcher(str).matches()){
			return false;
		}
		return true;
	}
	
	public static boolean isStringss(String str){
		str = StringUtilManager.StringFilter(str);
		if(!str.equalsIgnoreCase("") && ! patternStringss.matcher(str).matches()){
			return false;
		}
		return true;
	}
	
	public static boolean isTime2(String str){
		str = StringUtilManager.StringFilter(str);
		if(!str.equalsIgnoreCase("") && ! patternTime2.matcher(str).matches()){
			return false;
		}
		return true;
	}
	
	/**
	 * 测试字符串处理类
	 * @param args 控制台输入参数
	 */
	public static void main(String[] args) {
		// 测试字符串过滤
		/*String t_str1 = "2012-01-02 23:59:59 000";
		System.out.println("过滤前：" + t_str1);
		System.out.println("过滤后：" + ParameterUtilManager.isEmail(t_str1));
		System.out.println("过滤后：" + ParameterUtilManager.isInt(t_str1));
		System.out.println("过滤后：" + ParameterUtilManager.isInt11(t_str1));
		System.out.println("过滤后：" + ParameterUtilManager.isString(t_str1));
		System.out.println("过滤后：" + ParameterUtilManager.isString1(t_str1));
		System.out.println("过滤后：" + ParameterUtilManager.isStrings(t_str1));
		System.out.println("过滤后：" + ParameterUtilManager.isStringChinese(t_str1));
		System.out.println("过滤后：" + ParameterUtilManager.isUuid(t_str1));
		System.out.println("过滤后：" + ParameterUtilManager.isTime(t_str1));
		String t_str2 = "69115376-56c6-4c20-b0db-7e3680b735dc" ;
		System.out.println("过滤后uuid36：" + ParameterUtilManager.isUuid36(t_str2));*/
		/*String t_str3 = "";
		System.out.println("过滤前：" + t_str1);
		System.out.println("过滤后：" + ParameterUtilManager.isEmail(t_str3));
		System.out.println("过滤后：" + ParameterUtilManager.isInt(t_str3));
		System.out.println("过滤后：" + ParameterUtilManager.isInt11(t_str3));
		System.out.println("过滤后：" + ParameterUtilManager.isString(t_str3));
		System.out.println("过滤后：" + ParameterUtilManager.isString1(t_str3));
		System.out.println("过滤后：" + ParameterUtilManager.isStrings(t_str3));
		System.out.println("过滤后：" + ParameterUtilManager.isStringChinese(t_str3));
		System.out.println("过滤后：" + ParameterUtilManager.isUuid(t_str3));
		System.out.println("过滤后：" + ParameterUtilManager.isTime(t_str3));*/
		/*System.out.println("123:"+isDouble("123"));  
		  System.out.println("0.123:"+isDouble("0.123"));  
		  System.out.println(".123:"+isDouble(".123"));  
		  System.out.println("1.23:"+isDouble("1.23"));  
		  System.out.println("123.:"+isDouble("123."));  
		  System.out.println("00.123:"+isDouble("00.123"));  
		  System.out.println("123.0:"+isDouble("123.0"));  
		  System.out.println("123.00:"+isDouble("123.00"));  
		  System.out.println("0123:"+isDouble("0123"));  
		  System.out.println("2012-01-02 23:59:59:"+isTime2("2012-01-02 23:59:59"));  
		  System.out.println("2012-01-02 23:59:59 000:"+isTime2("2012-01-02 23:59:59 000"));  */
		//System.out.println("Sara C:"+isLetterChinese("S")); 
		String str = "111    1 1144 444 3324  241 bbb,.".replaceAll("\\s+", "");
		System.out.println(str);
		  

	}
}
