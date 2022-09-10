<script>
	import {
		mapMutations
	} from 'vuex';
	
	export default {
		methods: {
			...mapMutations(['login'])
		},
		onLaunch: function() {
			console.log('App Launch')
			

		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
// 导入colorUI
@import '/static/css/colorui/main.css';
@import '/static/css/colorui/icon.css';
@import '/static/css/colorui/animation.css';
// 导入阿里巴巴矢量图标库
/*#ifdef MP*/
@import './static/css/iconfont/iconfont.css';
/*#endif*/
/*#ifndef MP*/
@import url('https://at.alicdn.com/t/font_1823374_3tqhlzh4c56.css');
/*#endif*/
@import './static/css/reset.scss';
@import './static/css/uni.scss';
</style>
