package com.free4lab.account.manager;

import java.util.regex.Pattern;

import org.apache.log4j.Logger;

public class StringUtilManager {
	private static final Logger logger = Logger.getLogger(StringUtilManager.class);
	
	// 过滤通过页面表单提交的字符
	private static String[][] FilterChars = { { "<", "" }, { ">", "" },
			{ "'", "" }, { "\"", "" }, { "/", "" }, { "\\", "" },
			{ "!", "" }, { "#", "" }, { "$", "" }, { "%", "" }, { "^", "" },
			{ "&", "" }, { "*", "" }, { "(", "" }, { ")", "" } };
	/*{ "-", "" },, { " ", "" }*/
	// 过滤通过javascript脚本处理并提交的字符
	private static String[][] FilterScriptChars = { { "\n", "\'+\'\\n\'+\'" },
			{ "\r", " " }, { "\\", "\'+\'\\\\\'+\'" },
			{ "\'", "\'+\'\\\'\'+\'" } };
	// SQL、XSS语句相关
	static String reg = "(<script\\b.*?>*?</script>)|(<script>)|(</script>)|(--)|[!']|" +
			"(?:')|(?:--)|(/\\*(?:.|[\\n\\r])*?\\*/)|" +
			"(\\b(select|update|and|or|delete|insert|trancate|char|into|substr|ascii|declare|exec|count|master|into|drop|execute)\\b)";
	static Pattern sqlPattern = Pattern.compile(reg, Pattern.CASE_INSENSITIVE);

	/**
	 * 过滤字符串和脚本里的特殊字符，先判断是否含有sql语句、script语句
	 * @param str 要过滤的字符串
	 * @return 过滤后的字符串
	 */
	public static String StringFilter(String str) {
		if (!isValid(str)) {
			return "";
		} else {
			String[] str_arr = stringSpilit(str, "");
			for (int i = 0; i < str_arr.length; i++) {
				// 过滤字符串里的的特殊字符
				for (int j = 0; j < FilterChars.length; j++) {
					if (FilterChars[j][0].equals(str_arr[i]))
						str_arr[i] = FilterChars[j][1];
				}
				// 过滤脚本中的特殊字符（包括回车符(\n)和换行符(\r)）
				for (int k = 0; k < FilterScriptChars.length; k++) {
					if (FilterScriptChars[k][0].equals(str_arr[i]))
						str_arr[i] = FilterScriptChars[k][1];
				}
			}
			//logger.info((stringConnect(str_arr, "")).trim());
			return (stringConnect(str_arr, "")).trim();
		}
	}
	
	/**
	 * 用特殊的字符连接字符串
	 * @param strings 要连接的字符串数组
	 * @param spilit_sign 连接字符
	 * @return 连接字符串
	 */
	private static String stringConnect(String[] strings, String spilit_sign) {
		String str = "";
		for (int i = 0; i < strings.length; i++) {
			str += strings[i] + spilit_sign;
		}
		logger.info(str);
		return str;
	}

	/**
	 * 分割字符串
	 * @param str 要分割的字符串
	 * @param spilit_sign 字符串的分割标志
	 * @return 分割后得到的字符串数组
	 */
	private static String[] stringSpilit(String str, String spilit_sign) {
		String[] spilit_string = str.split(spilit_sign);
		if (spilit_string[0].equals("")) {
			String[] new_string = new String[spilit_string.length - 1];
			for (int i = 1; i < spilit_string.length; i++)
				new_string[i - 1] = spilit_string[i];
			return new_string;
		} else
			return spilit_string;
	}

	// 判断是否有有delete等sql字符
	private static boolean isValid(String str) {
		if (sqlPattern.matcher(str).find()) {
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
		//String t_str1 = "<!-- delete * from use wehre fd= 1 and ''''h1>！aaaa11234!@#$%^&*()-+*（）——+StringDispose字符串 处理\n\r\'\"</h1>";
		String t_str1 = "select@124.com";
		//String t_str11 = t_str1.replaceAll("\\&[a-zA-Z]{1,10};","").replaceAll( "<[^>]*>", "");
		System.out.println("过滤前：" + t_str1);
		System.out.println("过滤后：" + StringUtilManager.isValid(t_str1));
		System.out.println("过滤后：" + StringUtilManager.StringFilter(t_str1));
	}
}