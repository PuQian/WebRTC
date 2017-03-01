package com.free4lab.utils.search;

/**
 * 关键词 user表中的内容读进该结构体，以便根据keyword进行搜索
 *
 */
public class Keyword{

	private String keyword; //关键词
	private int id; //该关键词所在user表的位置，通过它取出邮箱/手机
	
	public Keyword(String keyword, int id){
		this.keyword = keyword;
		this.id = id;
	}
	
	public String getKeyword() {
		return keyword;
	}
	public void setKeyword(String keyword) {
		this.keyword = keyword;
	}
	public int getId(){
		return this.id;
	}
	public void setId(Integer id){
		this.id = id;
	}
}
