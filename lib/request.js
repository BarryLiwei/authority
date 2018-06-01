import axios from 'axios';
import qs from 'qs';

const codeMessage = {
    200: '服务器成功返回请求的数据。',
    201: '新建或修改数据成功。',
    202: '一个请求已经进入后台排队（异步任务）。',
    204: '删除数据成功。',
    400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
    401: '用户没有权限（令牌、用户名、密码错误）。',
    403: '用户得到授权，但是访问是被禁止的。',
    404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
    406: '请求的格式不可得。',
    410: '请求的资源被永久删除，且不会再得到的。',
    422: '当创建一个对象时，发生一个验证错误。',
    500: '服务器发生错误，请检查服务器。',
    502: '网关错误。',
    503: '服务不可用，服务器暂时过载或维护。',
    504: '网关超时。',
};
/**
 * 检查服务器返回的参数
 * @param {*} response 
 */
function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response;
    }
    let errortext = codeMessage[response.status] || response.statusText;
    let error = new Error(errortext);
    error.name = response.status;
    error.response = response;
    throw error;
}


axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.timeout = 30000; //默认6s超时
/**
 *  @desc request拦截器
 *  
 */
service.interceptors.request.use(config=>{
    // TODO 设置公共的请求参数 如登录参数
    
    },error=>{
    // 发生异常时 应该及时把错误通知出去

})

/**
 * @desc 监听 请求返回值
 * 
 */
service.interceptors.response.use(response=>{
    

    },error=>{

})

/**
 *  AJAX请求 
 *  参数格式:
 *  url:请求地址,
 *  method:'GET', 请求方法 GET/POST... 默认GET
 *  type:'JSON', 默认JSON
 *  header:{}, 请求头 
 *  timeout:300000, 超时时间
 *  data:Object, 发送到服务器的数据
 */
// 对请求方法进行封装
export default {
   /**
   *  POST 请求
   * @param {String} url
   * @param {String} paramtype //data,params
   * @param {Object} data
   */
    async post (url, data, paramtype= 'params') {
        try {
            const res = await axios({
                method: 'post',
                url,
                [paramtype]: data,
            })
            return res
        } catch (error) {
            console.log(error)
        }
    },
    /**
     * @desc GET 请求  使用方法
     * async fun () {
     *   try{
     *      const res = reques.get(url, params) 
     *   } catch (err) {
     *      console.log(err)
     *   }
     * }
     *  
     * @param {String} url
     * @param {Object} params
     */
    async get(url, params) {
        const res = await axios({
        method: 'get',
        url,
        params, // get 请求时带的参数
        })
        return res

    },

    /**
     * export 导出列表
     * @param {String} url
     * @param {Object} params
     */
    async export(url, params) {
        const res = await axios({
        method: 'post',
        responseType: 'blob',
        url,
        params, // get 请求时带的参数
        })
        return res
    }
}
