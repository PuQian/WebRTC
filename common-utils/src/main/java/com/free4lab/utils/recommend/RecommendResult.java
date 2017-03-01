package com.free4lab.utils.recommend;
import java.util.Collection;
import java.util.Comparator;
import java.util.List;
import java.util.PriorityQueue;
import java.util.Queue;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

/**
 * 推荐结果(物品或者用户)
 * @author wangchao
 */
public class RecommendResult {
    public static Integer DEFAULT_REASON_NUM = 3;
    
    public static String OBJECT = "Object";
    public static String SCORE = "Score";
    public static String REASONS = "Reasons";
    
    /** 用户或者物品 */
    private RecommendObject ro = new RecommendObject();
    /** 用户或物品的得分 */
    private double score = 0.0;
    /**推荐原因 **/
//    private Queue<RecommendReason> reasons = new Queue<RecommendReason>(DEFAULT_REASON_NUM,RecommendReason.dc);
    
    /**
     * 构造一个对象并设置不完全的 RecommendObject
     * @param id 
     */
//    public RecommendResult(Long id) {
//        RecommendObject reco = new RecommendObject();
//        reco.setId(id);
//        this.ro = reco;
//    }
    
    public RecommendResult(RecommendObject obj) {
        this.ro = obj;
    }
    
    /**
     * 构造一个对象并设置不完全的 RecommendObject
     * @param id 
     */
    private RecommendResult() {
       
    }
    
    @Override
    public boolean equals(Object obj) {
        if (obj instanceof RecommendResult) {
            RecommendResult r = (RecommendResult) obj;
            return this.ro.getId() == r.ro.getId();
        }
        return false;
    }
    
    @Override
    public int hashCode() {
        return 1;
    }
    
    public static class DecreaseComparator implements Comparator<RecommendResult>{
        public int compare(RecommendResult o1, RecommendResult o2) {
            if( o1.score > o2.score){
                return -1;
            }
            if(o1.score <o2.score)
                return 1;
            return 0;
        }
    }
    public static DecreaseComparator dc = new DecreaseComparator();
    
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

    public String toJSON() throws JSONException{
        return getJSON().toString();
    }
    
    public JSONObject getJSON() throws JSONException {
        JSONObject obj = new JSONObject();
        JSONArray array = new JSONArray();
        obj.put(OBJECT, ro.getShortJSON()).put(SCORE, score)
                .put(REASONS, array);
                
        return obj;
    }

    public void merge(RecommendResult value) {
        score+= value.score;
    }

    public static RecommendResult fromJSON(String json) throws JSONException {
        
        JSONObject obj = new JSONObject(json);
        
        RecommendResult result= new RecommendResult();
        result.ro = RecommendObject.fromJSON(obj.getJSONObject(OBJECT));
        result.score = obj.getDouble(SCORE);
        
        return result;
    }

    public void multiply(Double weight) {
        score *= weight;
    }


}
