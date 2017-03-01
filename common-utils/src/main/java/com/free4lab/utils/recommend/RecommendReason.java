package com.free4lab.utils.recommend;

import java.util.Comparator;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;


/**
 * 推荐原因,每种推荐子引擎有特定的推荐解释
 *  <pre>
 *  推荐物品(每一种子引擎看作是一种特征): 
 *      你也浏览过某物品所以推荐此物品
 *      和你相似的人浏览过此物品
 *      某物很热门
 *      某物新上架
 *  推荐用户:
 *      你们都看过某些物品
 *  </pre>
 * @author wangchao
 */
public class RecommendReason {
    
    public static String ENGINE = "Engine";
    public static String OBJECT = "Object";
    public static String SCORE = "Score";
    
    String engine = "unkown"; // 从哪种推荐子引擎推荐 
    //依据的物品或人
    RecommendObject ro = new RecommendObject(); 
    double score ; // 该推荐子引擎产生的权值
    
    public String getEngine() {
        return engine;
    }
    public void setEngine(String engine) {
        this.engine = engine;
    }

    public RecommendObject getRecommendObject() {
        return ro;
    }
    public void setRecommendObject(RecommendObject ro) {
        this.ro = ro;
    }
    public double getScore() {
        return score;
    }
    public void setScore(double score) {
        this.score = score;
    }
    
    public String toJSON() throws JSONException {
        return getJSON().toString();
    }
    
    public JSONObject getJSON() throws JSONException{
        JSONObject o = new JSONObject();
        o.put(ENGINE, engine);
        o.put(OBJECT, ro.getShortJSON());
        o.put(SCORE, score);
        return o;
    }
    
    public static class IncreaseComparator implements Comparator<RecommendReason>{
        public int compare(RecommendReason o1, RecommendReason o2) {
            if( o1.score > o2.score){
                return 1;
            }
            if(o1.score <o2.score)
                return -1;
            return 0;
        }
    } 
    public static class DecreaseComparator implements Comparator<RecommendReason>{
        public int compare(RecommendReason o1, RecommendReason o2) {
            if( o1.score > o2.score){
                return -1;
            }
            if(o1.score <o2.score)
                return 1;
            return 0;
        }
    } 
    public static DecreaseComparator dc = new DecreaseComparator(); 
    public static IncreaseComparator ic = new IncreaseComparator();

    public static RecommendReason fromJSON(String json) throws JSONException {
        JSONObject obj = new JSONObject(json);
        RecommendReason result= new RecommendReason();
        result.ro = RecommendObject.fromJSON(obj.getJSONObject(OBJECT));
        result.score = obj.getDouble(SCORE);
        result.engine = obj.getString(ENGINE);
        
        return result;
    }
}
