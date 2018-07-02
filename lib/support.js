export default class Support{ 
    /**
     * 是否是字符串
     * @param {Object} obj 
     */
    _isString(obj){
        return Object.prototype.toString.call(obj) === '[object String]'
    }
    /**
     * 是否是json
     * @param {Object} obj 
     */
    _isJson(obj){
        return typeof(obj) === 'object' && Object.prototype.toString.call(obj).toLowerCase() == '[object object]' && !obj.length
    }
    /**
     * 是否为空 (校验Array)
     * @param {Object} obj 
     */
    _isEmpty(obj){
        return (typeof obj === 'undefined' || obj === null || obj === '' || (Array.isArray(obj) && obj.length < 1))
    }

    _isFunction(obj){
        return typeof obj === 'function'
    }

}