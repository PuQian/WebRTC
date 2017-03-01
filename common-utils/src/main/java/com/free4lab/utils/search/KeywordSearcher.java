package com.free4lab.utils.search;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import com.free4lab.utils.sql.AbstractDAO;


public class KeywordSearcher {
	
	/**
	 * 关键词
	 */
	private List<Keyword> keywords;
	
	/**
	 * 关键词对应的正则式
	 */
	private List<String> regex;
	
	public KeywordSearcher()
	{
		keywords = new ArrayList<Keyword>();
		regex = new ArrayList<String>();
	}
	
	
	//将keyword(content,id)添加至待查关键字集keywords中
	public void addKeyword(String content,int id)
	{
		if(content == null || content.equals("")) //不能为空
			return;
		
		keywords.add(new Keyword(content, id));
	}
	
	
	/**
	 * 在指定数据库，指定字段，模糊匹配关键字，返回匹配上的关键字对象（关键字值+索引）
	 * @param <Entity>
	 * @param keyword 关键字
	 * @param packageName 包名（实体所在包名）
	 * @param entityName 实体名
	 * @param keywordPropertyName 关键字字段名
	 * @param idPropertyName 索引字段名
	 * @return 
	 * @throws InvocationTargetException 
	 * @throws IllegalArgumentException 
	 * @throws IllegalAccessException 
	 * @throws SecurityException 
	 * @throws NoSuchMethodException 
	 * @throws InstantiationException 
	 */
	@SuppressWarnings("unchecked")
	public <Entity> List<Integer> searchKeywords(String keyword,String packageName, String entityName,String keywordPropertyName,String idPropertyName) throws IllegalAccessException, IllegalArgumentException, InvocationTargetException, NoSuchMethodException, SecurityException, InstantiationException{
		
		//创建实体类
		entityName = entityName.substring(0,1).toUpperCase() + entityName.substring(1);
		Class<?> Entity = null;
		try{
			Entity = Class.forName(packageName + "." +entityName);
		}
		catch(ClassNotFoundException exception){
			exception.printStackTrace();
		}
		System.out.println(entityName);
		//创建实体查询类
		//加一个检测首字母大写（目前写死只能大写）
		Class<?> EntityDAO = null;
		try{
			EntityDAO = Class.forName(packageName + "." + entityName+"DAO");
		}
		catch(ClassNotFoundException exception){
			exception.printStackTrace();
		}
		
		//创建实体查询类对象
		AbstractDAO<Entity> entityDAO = (AbstractDAO<Entity>)EntityDAO.newInstance();

		
		//构造两个get方法的名称
		//getKeyword
		String methodName = "get" + keywordPropertyName.substring(0,1).toUpperCase() + keywordPropertyName.substring(1);
		Method getKeywordMethod = Entity.getDeclaredMethod(methodName);

		methodName = "get" + idPropertyName.substring(0,1).toUpperCase() + idPropertyName.substring(1);
		Method getIdMethod = Entity.getDeclaredMethod(methodName);

		
		//查询数据库中所有该实体对象列表
		List<Entity> entities = entityDAO.findAll();
			
		//构造待查关键词表（必须全为中文）
		String chineseReg = "[\\u4E00-\\u9FA5]+";
		keywords = new ArrayList<Keyword>();
		for(int i=0;i<entities.size();i++)
		{
			Entity entity = entities.get(i);
			
			//获取keyword的值
			String kw = (String)getKeywordMethod.invoke(entity);
			if(kw != null && kw.matches(chineseReg)) //keyword全为中文才算
			{
				int id = (Integer)getIdMethod.invoke(entity);
				keywords.add(new Keyword(kw,id));
			}
		}

		//预处理待搜索的关键字
		preProcessKeywords();

		//返回匹配上的关键词对象
		List<Integer> resultList = matchKeywords(keyword.toLowerCase());
		
		return resultList;
	}
	
	
	
	/**
	 * 要搜索的关键词
	 * 
	 * @param term
	 * 			关键词
	 * @return 符合的关键词所在记录的id列表集合
	 */
	public List<Integer> matchKeywords(String term) {

		List<Integer> resultList = new ArrayList<Integer>();
		Set<Integer> resultSet = new HashSet<Integer>(); //方便快速查询是否已选入id记录

		for (int i = 0; i < regex.size(); i++) 
		{
			int id = keywords.get(i).getId();
			//先看看该条记录是否已经在之前就成功选入最终集合了？
			if(resultSet.contains(id)) //已有
				continue;
				
			if (term.matches(regex.get(i))) 
			{
				resultList.add(id);
				resultSet.add(id);
			}
		}
		
		return resultList;
	}
	
	/**
	 * 预处理被搜索的关键词
	 * 将其拆解为正则表达式
	 * @param peoples
	 * 			被搜索的关键词
	 */
	public void preProcessKeywords() {

		//初始化正则式
		for (Keyword keyword : keywords) {
			
			//拆分汉字与非汉字字符串
			//如 姚sunny陈ken堃   {"姚","sunny","陈","ken","堃"}
			Word[] words = splitStrIntoHanziAndOthers(keyword.getKeyword());
			int length = words.length;

			//若为汉字转成拼音及相应正则，若为非汉字串转成前缀、全排列、后缀
			String chineseReg = "[\\u4e00-\\u9fa5]";
			for (int i = 0; i < length; i++) {
	
				if(words[i].getContent().matches(chineseReg)) //汉字
				{
					 words[i].formHanziReg(); //生成拼音正则
				}
				else //非汉字串
				{
					words[i].formFixReg(); //生成非汉字串前缀、后缀、全排列
				}
			}
			
			String mRegex = "";
			String subRegex = "";
			boolean ADD_SUBREG_FLAG = false; //是否输出子正则表达式（如 姚|yao  sunny）
			for (int i = 0; i < length; i ++) 
			{
				for (int j = i; j < length; j++) 
				{
					ADD_SUBREG_FLAG = false;
					subRegex = "";
					for (int k = j; k >= i; k--) 
					{
						String hanziReg = words[k].getHanziReg();
						if("".equals(hanziReg)) //非汉字串
						{
							//判断该非汉字串所在位置
							if(j > i) //中间
							{
								if(k < j && k > i) //中间 取子正则式
								{
									subRegex = words[k].getCompleteReg() + subRegex;
									ADD_SUBREG_FLAG = true;
								}
								else if(k >= j) //最后一个  取前缀
								{
									subRegex = words[k].getPrefixReg() + subRegex;
									ADD_SUBREG_FLAG = true;
								}
								else //第一个k <= i  取后缀
								{
									subRegex = words[k].getSuffixReg() + subRegex;
								}
							}
							else //第一个且最后一个  取全排列
							{
								subRegex = words[k].getFullfixReg() + subRegex;
							}
						}
						else //汉字
						{
							if(ADD_SUBREG_FLAG) //输出子正则式
								subRegex = words[k].getCompleteReg() + subRegex;
							else
								subRegex = hanziReg + subRegex;
						}
					}
					mRegex += subRegex + "|";
				}
			}

			mRegex = mRegex.substring(0, mRegex.length()-1);
			mRegex = mRegex.replaceAll("\\.", "#"); //屏蔽掉邮箱的.号，防止其加入正则表达式
			regex.add(mRegex);
		}
	}

	/**
	 * 将字符串拆分成单个汉字与非字符串
	 */
	public Word[] splitStrIntoHanziAndOthers(String str)
	{
        Pattern p = Pattern.compile("[\\u4e00-\\u9fa5]|[^\\u4e00-\\u9fa5]+");
        Matcher m = p.matcher(str);
        List<String> list = new ArrayList<String>();
        while ( m.find() ) {
        	list.add(m.group());
        }
        Word[] res = new Word[list.size()];
        for(int i=0;i<list.size();i++)
        	res[i] = new Word(list.get(i).toLowerCase());
        
        return res;
        	
	}
	
	
	/**
	 * keyword:输入的关键字
	 * kws:被查关键字集
	 * ids:被查关键字所在索引集
	 */
	public List<Integer> searchKeywords(String keyword)
	{
		//预处理待搜索的关键字
		preProcessKeywords();

		//返回匹配上的关键词对象
		List<Integer> resultList = matchKeywords(keyword.toLowerCase());
		
		return resultList;
	}

}
