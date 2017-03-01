package com.free4lab.utils.log;

import java.util.Map;

/**
 * tutorials for this method: <tt>UserGuide<tt>
 * configuration file: locallog.properties
 */
public interface LogOperation {
	public boolean produceLog(String topic, Map<String, String> properties);
	
	public String getLog(String topic, Map<String,String> query);
}
