package com.free4lab.utils.recommend;

import java.util.Collections;
import java.util.List;

import org.json.JSONException;
import org.json.JSONObject;

//USER+LIST<ITEM>
//依据 UserID 推荐可能喜欢的     ITEM(资源,群组,列表)
// 可能的策略及额外信息
// ITEM-based: (最近/本次浏览) (查看/喜欢) 的 ITEM
// USER-based: 

//依据 UserID 推荐喜好相近的     USER
//可能的策略及额外信息
// USER-based(用户相关表)    

//LIST<ITEM>
//依据 ITEMID 推荐与此物品相近的 ITEM(资源,群组,列表)
//CONTENT-based/ITEM-based            (全表)离线计算
//推荐用户 TODO
//根据物品列表得到用户向量,推荐喜好相近用户   

/**
 * 
 * @author wangchao,zhaowei
 */
// TODO 添加参数：排序方式；最后一条推荐结果的时间。
public class RecommendQuery {

	private static final String USER_ID = "UserID";
	private static final String ITEM_IDS = "ItemIDs";
	private static final String RECOMMEND_USER = "RecommendUser";
	private static final String TYPE = "Type";
	private static final String RECOMMEND_NUM = "RecommendNumber";
	private static final String ENGINE_TYPES = "EngineTypes";
	private static final String TIME_STAMP = "Timestamp";

	/*** 为此用户进行推荐 */
	private Long userID = Constant.DEFAULT_ID;
	/** 最近访问的item */
	private List<Long> itemIDs = Collections.emptyList();
	/*** 为true时根据用户历史行为推荐,为false时根据给出的itemIDs推荐相关资源 */
	private Boolean recommendUser = false;
	/** 一个整型值,每一位表示一种类型的资源 */
	private Integer type = 0;
	/** 表示需要返回的资源数 **/
	private Integer resultNum = RecommendResults.DEFAULT_REC_NUM;
	/** 限定推荐的策略,空时使用所有的推荐策略，非空时使用指定的策略 */
	private List<String> engineTypes = Collections.emptyList();
	private Long timestamp;
	/** 是否需要給出推薦理由 */
	private boolean needReason = false;

	/**
	 * 推荐物品
	 * 
	 * @param recommendUser
	 *            (根据USER/ITEM)
	 * @param type
	 *            当推荐ITEM时有效,决定被推荐的ITEM类型(资源,列表,群组)
	 * @param userID
	 *            当不为-1时,为所指定的用户进行推荐
	 * @param itemIDs
	 *            当有值时,使用此值作为本次登录浏览的ITEM进行推荐
	 */
	public RecommendQuery(Boolean recommendUser, Integer type, Long userID,
			List<Long> itemIDs) {
		this.type = type;
		this.itemIDs = itemIDs;
		this.userID = userID;
		this.recommendUser = recommendUser;
	}

	/***
	 * 
	 * @return
	 * @throws JSONException
	 */
	public String toJSON() throws JSONException {
		JSONObject obj = new JSONObject();

		obj.put(USER_ID, userID).put(ITEM_IDS, itemIDs)
				.put(RECOMMEND_USER, recommendUser)
				.put(RECOMMEND_NUM, resultNum).put(TYPE, type)
				.put(ENGINE_TYPES, engineTypes).put(TIME_STAMP, timestamp);
		return obj.toString();
	}

	public Long getTimestamp() {
		return timestamp;
	}

	public void setTimestamp(Long timestamp) {
		this.timestamp = timestamp;
	}

	public Long getUserID() {
		return userID;
	}

	public void setUserID(Long userID) {
		this.userID = userID;
	}

	public List<Long> getItemIDs() {
		return itemIDs;
	}

	public void setItemIDs(List<Long> itemIDs) {
		this.itemIDs = itemIDs;
	}

	public Boolean getRecommendUser() {
		return recommendUser;
	}

	public void setRecommendUser(Boolean recommendUser) {
		this.recommendUser = recommendUser;
	}

	public Integer getType() {
		return type;
	}

	public void setType(Integer type) {
		this.type = type;
	}

	public Integer getResultNum() {
		return resultNum;
	}

	public void setResultNum(Integer resultNum) {
		this.resultNum = resultNum;
	}

	public List<String> getEngineType() {
		return engineTypes;
	}

	public void setEngineType(List<String> engineType) {
		this.engineTypes = engineType;
	}

	public boolean matchRecommender(String type2) {
		if (engineTypes.size() == 0)
			return true;
		if (engineTypes.contains(type2))
			return true;
		return false;
	}

	public boolean isNeedReason() {
		return needReason;
	}

	public void setNeedReason(boolean needReason) {
		this.needReason = needReason;
	}

}
