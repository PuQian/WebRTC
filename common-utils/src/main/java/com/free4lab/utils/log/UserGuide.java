package com.free4lab.utils.log;

import java.util.HashMap;
import java.util.Map;

public class UserGuide {
	public static void main(String[] args) {
		LogOperation log = new LogOperationImpl();
		Map<String, String> pros = new HashMap<String, String>();
		pros.put("user_id", "1");
		pros.put("content", "abc");
		log.produceLog("test", pros);
	}
}
