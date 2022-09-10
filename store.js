import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const THEMECOLOR = uni.getStorageSync('themeColor') || {
	title: '深蓝',
	name: 'blue',
	color: '#009ACD'
};

const store = new Vuex.Store({
	state: {
		hasLogin: false,
		userInfo: {},
		
		themeColor: THEMECOLOR
	},
	getters: {
		themeColor: state => {
			return state.themeColor;
		},
	},
	mutations: {
		login(state, payload) {
			console.log(payload);
			state.hasLogin = payload.hasLogin;
			state.userInfo = payload.userInfo;
			uni.setStorageSync("userInfo",payload.userInfo);
			uni.setStorageSync("hasLogin",payload.hasLogin);
		},
		logout(state) {
			state.hasLogin = false;
			state.userInfo = {};
			uni.removeStorageSync("userInfo");
			uni.removeStorageSync("hasLogin");
		},
		setThemeColor(state, val) {
			state.themeColor = val;
			uni.setStorageSync('themeColor', val);
		}
	},
	actions: {
	
	}
})

export default store
