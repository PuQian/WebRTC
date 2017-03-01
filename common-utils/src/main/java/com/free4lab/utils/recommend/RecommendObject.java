package com.free4lab.utils.recommend;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class RecommendObject {
	public static String INTEGER_ID = "IntegerID";
	public static String URL = "Url";
	public static String ID = "Id";
	public static String TYPE = "Type";
	public static String NAME = "Name";
	public static String DESCRIPTION = "Description";
	public static String IMAGE = "ImageUrl";
	public static String TIMESTAMP = "Timestamp";

	public static String BELONGS = "Belongs";
	public static String CONTENT = "Content";

	/***************************************/
	protected Long id = Constant.DEFAULT_ID;
	protected Integer integerId = 0;
	protected Integer type = Constant.ITEM_TYPE_UNKOWN;

	protected String url = "";

	protected String name = "";
	protected String description = "";
	protected String imageUrl = "";

	protected List<Long> belongs = new ArrayList<Long>();
	protected String content = "";
	protected Long timestamp;

	public RecommendObject() {

	}

	public RecommendObject(Long id) {
		setId(id);
	}

	/**
	 * used when backend processing
	 * 
	 * @return
	 * @throws JSONException
	 */
	public String toJSON() throws JSONException {
		return getJSON().toString();
	}

	/***
	 * used when recommend
	 * 
	 * @return
	 * @throws JSONException
	 */
	public String toShortJSON() throws JSONException {
		return getShortJSON().toString();
	}

	public JSONObject getShortJSON() throws JSONException {
		JSONObject obj = new JSONObject();
		obj.put(INTEGER_ID, integerId).put(TYPE, type).put(ID, id)
				.put(URL, url).put(DESCRIPTION, description).put(NAME, name)
				.put(IMAGE, imageUrl).put(TIMESTAMP, timestamp);
		return obj;
	}

	public JSONObject getJSON() throws JSONException {
		JSONObject obj = getShortJSON();
		obj.put(BELONGS, belongs);
		obj.put(CONTENT, content);
		return obj;
	}

	static public RecommendObject fromJSON(String json) throws JSONException {
		JSONObject obj = new JSONObject(json);
		return fromJSON(obj);
	}

	static public RecommendObject fromJSON(JSONObject obj) throws JSONException {
		RecommendObject o = fromShortJSON(obj);
		Integer type = o.getType();
		if (obj.has(BELONGS)) {
			JSONArray arr = obj.getJSONArray(BELONGS);
			o.belongs = new ArrayList<Long>(arr.length());
			for (int i = 0; i < arr.length(); i++) {
				o.belongs.add(arr.getLong(i));
			}
		}
		if (obj.has(CONTENT))
			o.content = obj.getString(CONTENT);
		return o;
	}

	private static RecommendObject fromShortJSON(JSONObject obj)
			throws JSONException {
		RecommendObject ro = new RecommendObject();
		ro.setId(obj.getLong(ID));
		ro.url = obj.getString(URL);
		ro.description = obj.getString(DESCRIPTION);
		ro.imageUrl = obj.getString(IMAGE);
		ro.name = obj.getString(NAME);
		ro.timestamp = obj.optLong(TIMESTAMP, new Date().getTime());
		return ro;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
		this.integerId = (int) (id & ((1L << 32) - 1));
		this.type = (int) (id >> 32);
	}

	static public Long toID(Integer id, Integer type) {
		return (type.longValue() << 32) + id;
	}

	public void setId(Integer id, Integer type) {
		this.integerId = id;
		this.type = type;
		this.id = toID(id, type);
	}

	public Integer getIntegerId() {
		return integerId;
	}

	public Integer getType() {
		return type;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public void setIntegerId(Integer integerId) {
		this.integerId = integerId;
	}

	public void setType(Integer type) {
		this.type = type;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public void setTimestamp(Long timestamp) {
		this.timestamp = timestamp;
	}

	public String getDescription() {
		return description;
	}

	public boolean isUser() {
		if (type == Constant.ITEM_TYPE_USER) {
			return true;
		}
		return false;
	}

	public boolean isType(Integer type) {
		return (this.type & type) > 0;
	}

	public List<Long> getBelongs() {
		return belongs;
	}

	public void setBelongs(List<Long> belongs) {
		this.belongs = belongs;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public String getImageUrl() {
		return imageUrl;
	}

	/**
	 * set after setContent
	 * 
	 * @param imageUrl
	 */
	public void setImageUrl(String imageUrl) {
		this.imageUrl = imageUrl;
	}

	public long getTimestamp() {
		return timestamp;
	}

	public void setTimestamp(long timestamp) {
		this.timestamp = timestamp;
	}
}
