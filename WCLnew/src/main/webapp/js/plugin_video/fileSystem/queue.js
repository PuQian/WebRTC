function Queue(){
    //存储元素数组
    var aElement = new Array();
    /*
    * @brief: 元素入队
    * @param: vElement元素列表
    * @return: 返回当前队列元素个数
    * @remark: 1.EnQueue方法参数可以多个
    *    2.参数为空时返回-1
    */
    Queue.prototype.enqueue = function(vElement){
        if (arguments.length == 0)
            return - 1;
        //元素入队
        for (var i = 0; i < arguments.length; i++){
            aElement.push(arguments[i]);
        }
        return aElement.length;
    }
    /*
    * @brief: 元素出队
    * @return: vElement
    * @remark: 当队列元素为空时,返回null
    */
    Queue.prototype.dequeue = function(){
        if (aElement.length == 0)
            return null;
        else
            return aElement.shift();
 
    }
    /*
    * @brief: 获取队列元素个数
    * @return: 元素个数
    */
    Queue.prototype.getLength = function(){
        return aElement.length;
    }
    /*
    * @brief: 返回队头素值
    * @return: vElement
    * @remark: 若队列为空则返回null
    */
    Queue.prototype.getHead = function(){
        if (aElement.length == 0)
            return null;
        else
            return aElement[0];
    }
    /*
    * @brief: 返回队尾素值
    * @return: vElement
    * @remark: 若队列为空则返回null
    */
    Queue.prototype.getEnd = function(){
        if (aElement.length == 0)
            return null;
        else
            return aElement[aElement.length - 1];
    }
    /*
    * @brief: 将队列置空  
    */
    Queue.prototype.makeEmpty = function(){
        aElement.length = 0;
    }
    /*
    * @brief: 判断队列是否为空
    * @return: 队列为空返回true,否则返回false
    */
    Queue.prototype.isEmpty = function(){
        if (aElement.length == 0)
            return true;
        else
            return false;
    }
    /*
    * @brief: 将队列元素转化为字符串
    * @return: 队列元素字符串
    */
    Queue.prototype.toString = function(){
        var sResult = (aElement.reverse()).toString();
        aElement.reverse()
        return sResult;
    }
}