import Vue from 'vue'
import App from './App'
import store from 'store.js'

import request from 'common/request.js';
import constData from 'common/constData.js';
import {getTenantId,getTenantIdByName,setTenantId} from "common/tenant.js";
import {getAccessToken, getRefreshToken, setToken} from 'common/auth.js';

import navrouter from "common/router.js";
import { parseTime, worksStatusFilter} from "common/ruoyi.js";

import ElementUI from 'element-ui'; 
//import 'element-ui/lib/theme-chalk/index.css';  //element-ui 相关样式
import 'element-theme.scss';
Vue.use(ElementUI);

//模拟登录
//const simuLogin = true;


// 全局配置
request.setConfig({
  baseUrl: 'http://fishfly.tech:48080/admin-api', // 此为测试地址，需加入到域名白名单，或者更改为您自己的线上地址即可
  dataType: 'json', // 可删除，默认为json
  responseType: 'json', // 可删除，默认为text
  // 设置请求头，支持所有请求头设置，也可不设置，去掉header就行
  header: {
    'content-type': 'application/json' 
  }
});


// getTenantIdByName(tenentName).then(res => {
//   const tId = res.data.data;
//   if (tId && tId >= 0) {
//     // 设置租户
//     setTenantId(tId);
//     console.log('租户存在');

//   } else {
//     console.log('租户不存在');
//   }
// });

//这里都是异步的很可能，下面的请求开始的时候，之前的callback方法还未执行。可能导致tenentId未赋值的情况.

// 设置请求拦截器
request.interceptors.request(config => {
  // 配置参数和全局配置相同，此优先级最高，会覆盖在其他地方的相同配置参数

  // 追加请求头，推荐
  // config.header['content-type'] = 'application/json';
  // config.header.token = 'token from interceptors';

  if (getAccessToken()) {
    config.header['Authorization'] = 'Bearer ' + getAccessToken() // 让每个请求携带自定义token 请根据实际情况自行修改
  } else {
	  console.log("Token not accessed.");
  }
  
  var tenantId = 1; //getTenantId();
  // 设置租户
  if (tenantId) {
    config.header['tenant-id'] = tenantId;
  }

  // 覆盖请求头
  // config.header = {
    // 'content-type': 'application/json',
    // 'token': 'token from interceptors'
  // }
  
  // return false; // 终止请求
  // return Promise.reject('error from request interceptors'); // 向外层抛出错误，用catch捕获
  return config; // 返回修改后的配置，如未修改也需添加这行
});

// 设置响应拦截器
request.interceptors.response(res => {
  // 接收请求，执行响应操作
  // 您的逻辑......

  return res; // 原样返回
});





Vue.prototype.$request = request;

Vue.prototype.$store = store;





var hasLogin = uni.getStorageSync("hasLogin");
var user = uni.getStorageSync("userInfo");
console.log(" hasLogin:"+hasLogin);
console.log(user);
if(user != null && user != "") {
	store.state.userInfo = user;
	store.state.hasLogin = hasLogin;
	console.log("Got user from storage." + user);
	console.log("Got token." + getAccessToken() + " " + getRefreshToken());
}



Vue.prototype.$constData = constData;
Vue.prototype.$navrouter = navrouter;


Vue.prototype.parseTime = parseTime;
Vue.prototype.worksStatusFilter = worksStatusFilter;

const msg = (title, duration=1500, mask=false, icon='none') => {
	//统一提示方便全局修改
	if(Boolean(title) === false){
		return;
	}
	uni.showToast({
		title,
		duration,
		mask,
		icon
	});
}
Vue.prototype.$msg = msg;

// #ifndef VUE3
// import Vue from 'vue'
// Vue.config.productionTip = false
// App.mpType = 'app'
// const app = new Vue({
//     ...App
// })
// app.$mount()
// #endif

// #ifdef VUE3
// import { createSSRApp } from 'vue'
// export function createApp() {
//   const app = createSSRApp(App)
//   return {
//     app
//   }
// }
// #endif


App.mpType = 'app'

Vue.mixin({
	computed: {
		themeColor: {
			get () {
				return store.getters.themeColor;
			},
			set (val) {
				store.state.themeColor = val;
			}
		}
	}
});


const app = new Vue({
    ...App
})
app.$mount()