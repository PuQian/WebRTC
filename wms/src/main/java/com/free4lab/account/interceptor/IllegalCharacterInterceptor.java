package com.free4lab.account.interceptor;

import java.io.File;
import java.util.Iterator;
import java.util.Map;
import java.util.Map.Entry;

import org.apache.log4j.Logger;

import com.free4lab.account.manager.StringUtilManager;
import com.opensymphony.xwork2.ActionContext;
import com.opensymphony.xwork2.ActionInvocation;
import com.opensymphony.xwork2.interceptor.AbstractInterceptor;
import com.opensymphony.xwork2.util.ValueStack;

public class IllegalCharacterInterceptor extends AbstractInterceptor {

	/**
	 * 防止sql注入和xss
	 */
	private static final long serialVersionUID = 1L;
	private static final Logger logger = Logger.getLogger(IllegalCharacterInterceptor.class);
	
	@Override
	public String intercept(ActionInvocation invocation) throws Exception {
		logger.info("IllegalCharacterInterceptor");
		// 通过核心调度器invocation来获得调度的Action上下文
		ActionContext actionContext = invocation.getInvocationContext();
		// 获取Action上下文的值栈
		ValueStack stack = actionContext.getValueStack();
		// 获取上下文的请求参数
		Map<String, Object> valueTreeMap = actionContext.getParameters();
		// 获得请求参数集合的迭代器
		Iterator iterator = valueTreeMap.entrySet().iterator();
		// 遍历组装请求参数
		while (iterator.hasNext()) {
			// 获得迭代的键值对
			Entry entry = (Entry) iterator.next();
			// 获得键值对中的键值
			String key = (String) entry.getKey();
			// 原请求参数，因为有可能一键对多值所以这里用的String[]
			String[] oldValues = null;
			// 对参数值转换成String类型的
			if (entry.getValue() instanceof String) {
				oldValues = new String[] { entry.getValue().toString() };
			} else if (entry.getValue() instanceof File[]) {
				/*
				 * File[] file = (File[])entry.getValue(); String path =
				 * file[0].getPath(); oldValues = new String[]{path};
				 */
				continue;
			} else {
				oldValues = (String[]) entry.getValue();
			}
			// 处理后的请求参数
			String newValueStr = null;
			// 对请求参数过滤处理
			if (oldValues.length > 1) {
				newValueStr = "{";
				for (int i = 0; i < oldValues.length; i++) {
					// 替换掉非法参数
					newValueStr += StringUtilManager.StringFilter(oldValues[i].toString());
					if (i != oldValues.length - 1) {
						newValueStr += ",";
					}
				}
				newValueStr += "}";
			} else if (oldValues.length == 1) {
				// 替换掉非法参数
				newValueStr = StringUtilManager.StringFilter(oldValues[0].toString());
			} else {
				newValueStr = null;
			}
			logger.info("IllegalCharacterInterceptor"+newValueStr);
			// 处理后的请求参数加入值栈中
			stack.setValue(key, newValueStr);
		}
		logger.info("IllegalCharacterInterceptor"+stack);
		String result = null;
		try {
			// 调用下一个拦截器，如果拦截器不存在，则执行Action
			result = invocation.invoke();
		} catch (Exception e) {
			e.printStackTrace();
		}
		return result;
	}

}