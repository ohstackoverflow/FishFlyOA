<template>
	<view class="oa-notice-detail">
		<view class="article-meta">
			<text class="article-title">{{ detail.title  }}</text>
			<text class="article-author">发布于 {{ parseTime(detail.createTime) }}</text>
		</view>
		<view class="article-content">
			<!-- <u-parse :content="detail.content"></u-parse> -->
			<rich-text :nodes="detail.content"></rich-text>
		</view>
	</view>
</template>

<script>
	import htmlParser from '@/common/html-parser.js';
	
	export default {
		data() {
			return {
				id: undefined,
				detail: {}
			}
		},
		onLoad:function(param){
			console.log(param.id);
			this.id = param.id;
			this.getDetails(this.id);
		},
		onShow() {
			this.switchTheme();
		},
		filters: {
			// 时间格式化
			time(val) {
				return moment(val * 1000).format('YYYY-MM-DD HH:mm');
			}
		},
		methods: {
			getDetails(id) {
				this.$request.get('/system/notice/get',{data:{id:id}})
				.then(res => {
					console.log(res);
					this.detail = res.data.data;
					
					this.detail.content = this.detail.content.replace(/\\/g, "").replace(/<img/g, "<img style=\"max-width:100%;\"");
					this.detail.content = htmlParser(this.detail.content);
				})
			},
			switchTheme() {
				uni.setTabBarStyle({
					selectedColor: this.themeColor.color,
					borderStyle: 'white'
				});
				//console.log("12121212");
				//console.log(this.themeColor.color);
				uni.setNavigationBarColor({
					frontColor: '#ffffff',
					backgroundColor: this.themeColor.color,
					animation: {
						duration: 400,
						timingFunc: 'easeIn'
					}
				});
				this.themeColor.tabList && this.themeColor.tabList.forEach((selectedIconPath, index) => {
					uni.setTabBarItem({
						index,
						selectedIconPath
					});
				});
			}
		}
	}
</script>

<style lang="scss">
	table {
	    min-height: 20px;
	    line-height: 20px;
	    text-align: center;
	    border-collapse: collapse;
		width: 100%;
	}
	
	table,
	table tr th,
	table tr td {
	    border: 1px solid #a8aeb2;
	    padding: 5px 10px;
	}
	
	a {
		color: forestgreen;
	}
	
.oa-notice-detail {
	padding: 30upx 10upx;
	
	.article-meta {
		padding: 20upx 30upx;
		display: flex;
		flex-direction: column;
		//justify-content: flex-start;
		//color: gray;

		.article-title {
			font-size: 50upx;
			margin: 30 20upx;
		}
		

		.article-author,
		.article-time {
			font-size: 14upx;
		}
	}

	.article-content {
		padding: 0 30upx;
		overflow: hidden;
		font-size: 20upx;
		margin-bottom: 30upx;
	}
}
</style>