/*
* 关于access_token说明
*
*     1.是什么？ 全局接口调用凭据，是开发者的身份唯一标识
*     2.怎么用？每一次调用微信接口的时候，必须携带。
*     3.获取地址：https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET
*     4.特点：
*         1.有效期为2小时，超过2小时自动失效。
*         2.对于认证的账号，每天只能请求2000次
*         3.要求开发人员保存起来access_token，当达到过期时间时，请求新的，随后再次保存。
*         4.如果未达到2小时（之前access_token依然处于有效状态）此时再次请求新的，会导致之前的失效。
*         5.最好提前5分钟获取，（微信的校验规则是：如果8点请求的access_token，如果在9点55分的时候再次请求，微信会让新的和旧的access_token同时有效）
*
 *    5.设计思路：
*           1.第一次调用接口时，去找微信服务器要一个access_token，随后保存。
*           2.第二次调用接口时，读取本地的access_token
*                 判断access_token有效性
*                     --有效：直接用
*                     --失效：找微信服务器要一个access_token，随后保存
*     6.整理思路：
*           一上来就读取本地的
*               --本地有：
*                   --有效：直接使用
*                   --失效：获取新的，随后保存
*               --本地没有：
*                     获取新的，随后保存
*
* */

//引入发请求的库
let rp = require('request-promise-native')
//引入开发者核心配置信息
let {appID,appsecret} = require('../config')

class Auth {

  //找微信服务器“要”一个access_token
  async getAccessToken(){
    const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appID}&secret=${appsecret}`
    let result = await rp({
      method:'GET',
      url,
      json:true
    })

    if(result){
      console.log('向微信服务器请求access_token成功！')
      result.expires_in = Date.now() + 7200000 - 300000
      return result
    }else{
      console.log('向微信服务器请求access_token失败！')
    }
  }



}

;(async()=>{
  let auth = new Auth()
  let data = await auth.getAccessToken()
  console.log(data);
})()
