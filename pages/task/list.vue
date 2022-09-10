<template>
	<view class="works">

		<!--导航栏-->
		<view class="navbar" v-if="this.$store.state.hasLogin">
			<view key="0" class="nav-item"
				:class="tabCurrentIndex === 0 ? `text-${themeColor.name} current` : ''" @tap="tabClick(0)">
				我发起的
			</view>
			<uni-badge class="uni-badge-left-margin" :text="badgeValue" absolute="rightTop" size="small">
				<view key="1" class="nav-item"
					:class="tabCurrentIndex === 1 ? `text-${themeColor.name} current` : ''" @tap="tabClick(1)">
					待处理
				</view>
			</uni-badge>
			
			<view key="2" class="nav-item"
				:class="tabCurrentIndex === 2 ? `text-${themeColor.name} current` : ''" @tap="tabClick(2)">
				已处理
			</view>
		</view>

		<!--工作列表-->
		<swiper class="swiper-box" duration="300" v-if="this.$store.state.hasLogin">
			<swiper-item class="tab-content" v-for="(tabItem, tabIndex) in navList" :key="tabIndex">
				<scroll-view v-if="tabCurrentIndex == 0" class="list-scroll-content" scroll-y >
					<view v-for="item in worksList" class="works-item" @click="navToDetail(item)">
						<view class="i-top b-b">
							<text>{{item.name}}</text>
							<text class="time in1line">{{parseTime(item.createTime)}}</text>
							
							<text class="state" :class="'text-' + themeColor.name">{{ item.result | worksStatusFilter}}</text>
						</view>
						<view>
							<text v-for="t in item.tasks">当前节点: {{t.name}}</text>
						</view>
						<view>
							<el-button type="text" size="small" icon="el-icon-delete" v-if="item.result === 1"
							           @click.stop="handleCancel(item)">取消</el-button>
							<el-button size="mini" type="text" icon="el-icon-edit">详情</el-button>
						</view>
					</view>
					<!-- <oa-load-more v-if="worksList.length > 0" :status="loadingType"></oa-load-more>
					<oa-empty :info="'还没有内容~'" v-if="worksList.length === 0 && !loading"></oa-empty> -->
				</scroll-view>
				
				<scroll-view v-if="tabCurrentIndex != 0" class="list-scroll-content" scroll-y >
					<view v-for="(item, index) in worksList" :key="index" class="works-item">
						<view class="i-top b-b">
							<text class="time in1line">{{item.processInstance.startUserNickname}}</text>
							<text class="state" :class="'text-' + themeColor.name" v-if="item.suspensionState == null">{{ item.result | worksStatusFilter }}</text>
							<text class="state" :class="'text-' + themeColor.name" v-if="item.suspensionState != null">{{item.suspensionState | worksStatusFilter}}</text>
						</view>
						<navigator :url="'/pages/task/process?id='+item.processInstance.id" class="works-box-single">
							<view class="right">
								<text class="title in2line">{{item.processInstance.name}}</text>
								<text class="attr-box">{{parseTime(item.createTime)}}</text>
							</view>
						</navigator>
					</view>
					<!-- <oa-load-more v-if="worksList.length > 0" :status="loadingType"></oa-load-more>
					<oa-empty :info="'还没有内容~'" v-if="worksList.length === 0 && !loading"></oa-empty> -->
				</scroll-view>
			</swiper-item>
		</swiper>
		
		<gotoLogin></gotoLogin>
	</view>
</template>

<script>
	//import {  mapState  } from 'vuex';
	import moment from '../../common/moment.js';
	import constData from '../../common/constData.js';
	
	export default {
		data() {
			return {
				worksList:[],
				badgeValue: undefined,
				
				tabCurrentIndex: 0,
				page: 1,
				//hasLogin: true,
				//loading: true,
				//loadingType: 'more',
				navList: this.$constData.worksNavList,
			};
		},

		computed:{
			//...mapState(['hasLogin','userName','age'])
		},
		created() {
			//this.getList();
			console.log("###created");
		},
		onLoad() {
			console.log("###onLoad");
			console.log(this.$constData.worksNavList);
		},
		onShow() {
			console.log("###onShow");
			this.getTodoNumber();
			this.getWorksList();
			this.switchTheme();
		},
		
		filters: {
			// 时间格式化
			time(val) {
				return moment(val * 1000).format('YYYY-MM-DD HH:mm:ss');
			},
			// 状态显示格式化
			worksStatusFilter(status) {
				//console.log(status);
				 let state;
				constData.worksStatus.forEach(worksItem => {
					//console.log(worksItem.key);
					if (worksItem.key === status) {
						state = worksItem.value;
					}
				});
				return state;
			}
		},
		
		methods: {
			getWorksList() {
				let url = "/bpm/process-instance/my-page";
				if(this.tabCurrentIndex == 0) {
					url = "/bpm/process-instance/my-page";
				} else if(this.tabCurrentIndex == 1) {
					url = "/bpm/task/todo-page";
				} else if(this.tabCurrentIndex == 2) {
					url = "/bpm/task/done-page";
				}
				//let url = this.tabCurrentIndex == 0 ? "/bpm/task/todo-page":"/bpm/task/done-page";
				console.log(url);
				this.$request.get(url, {})
				.then(res => {
					console.log(res);
					if(res.statusCode == 200 && res.data["code"] == 0 && res.data.data.total != 0) {
						this.worksList = res.data.data.list;
					} else {
						this.worksList = [];
					}
				})
				.catch(error => {
					console.error('error:', error);
				})
			},
			
			
			getTodoNumber() {
				let url = "/bpm/task/todo-page";
				this.$request.get(url, {})
				.then(res => {
					if(res.statusCode == 200 && res.data["code"] == 0 && res.data.data.total != 0) {
						this.badgeValue = res.data.data.total;
					} else {
						this.badgeValue = undefined;
					}					
					
				})
				.catch(error => {
					console.error('error:', error);
				})
			},
			
			// 顶部tab点击
			tabClick(index) {
				this.worksList = [];	//首先清一下.
				console.log("当前index:"+index);
				this.page = 1;
				//this.worksList.length = 0;
				this.tabCurrentIndex = index;
				//this.loading = true;
				this.getWorksList();
			},
			// 跳转页面
			navToDetail(item) {
				console.log(item);
				uni.navigateTo({
					url:`/pages/task/process?id=${item.id}`
				});
			},
			
			/** 取消按钮操作 */
			handleCancel(row) {
			  const id = row.id;
			  this.$prompt('请输入取消原因？', "取消流程", {
			    type: 'warning',
			    confirmButtonText: "确定",
			    cancelButtonText: "取消",
			    inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/, // 判断非空，且非空格
			    inputErrorMessage: "取消原因不能为空",
			  }).then(({ value }) => {
				  console.log("aaaa:");
				  console.log(id);
				  console.log(value);
				  this.$request.delete('/bpm/process-instance/cancel',{data:{id:id,reason:value}})
				  .then(res => {
					  console.log(res);
					  uni.showToast({
					  	duration: 2000,
					  	title: "取消成功"
					  });
					  this.getWorksList();
				  }).catch( error => {
						console.error('error:', error);
					});
			    
			  });
			},
			/** 处理详情按钮 */
			// handleDetail(row) {
			//   this.$router.push({ path: "/pages/task/process", query: { id: row.id}});
			// },
			
			switchTheme() {
				document.body.style.setProperty("--color-theme",this.themeColor.color);				
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
			},
		}
	};
</script>

<style lang="scss">
	page,
	.works {
		background: $page-color-base;
		height: 100%;

		.works-search {
			padding: $spacing-sm $spacing-base;
			position: relative;

			.works-search-input {
				width: 100%;
				background-color: $color-white;
				bworks-radius: 40upx;
				padding: $spacing-sm 0 $spacing-sm $spacing-lg;
				color: $font-color-light;
			}

			.iconfont {
				position: absolute;
				right: 48upx;
				top: 22upx;
			}
		}

		.swiper-box {
			height: calc(100% - 80upx);
		}

		.list-scroll-content {
			height: 100%;
			margin-top: 20upx;

			// 工作列表
			.works-item {
				display: flex;
				flex-direction: column;
				padding: 0 30upx;
				background: #fff;
				width: calc(94%);
				height: calc(22vw + 40upx);
				margin: 0 auto $spacing-base;
				border-radius: 15upx;
				box-shadow: 0upx 5upx 20upx rgba(0, 0, 0, 0.1);

				.i-top {
					display: flex;
					align-items: center;
					height: 80upx;
					padding-right: 30upx;
					font-size: $font-base;
					color: $font-color-dark;
					position: relative;

					.time {
						padding-left: 20upx;
						flex: 1;
					}

					.del-btn {
						padding: 10upx 0 10upx 36upx;
						font-size: $font-lg;
						color: $font-color-light;
						position: relative;

						&:after {
							content: '';
							width: 0;
							height: 30upx;
							border-left: 1px solid $border-color-dark;
							position: absolute;
							left: 20upx;
							top: 50%;
							transform: translateY(-50%);
						}
					}
				}

				/* 单条 */
				.works-box-single {
					display: flex;
					margin: 10upx 0;
					// border-bottom: 1px solid rgba(0, 0, 0, 0.05);
					box-shadow: 0 1px 5px rgba(0, 0, 0, 0.02);

					.works-img {
						display: block;
						width: 180upx;
						height: 140upx;
					}

					.red {
						margin: 0 10upx 0 0;
						font-size: $font-sm;
					}

					.point {
						margin: 0 10upx 0 0;
						font-size: $font-sm;
					}

					.right {
						flex: 1;
						display: flex;
						flex-direction: column;
						padding: 0 30upx 0 0;
						overflow: hidden;

						.title {
							font-size: $font-sm;
							line-height: 32upx;
							height: 60upx;
							color: $font-color-dark;
						}

						.attr-box {
							font-size: $font-sm;
							color: $font-color-light;
						}

						.price {
							font-size: $font-sm;
						}
					}
				}

				.price-box {
					display: flex;
					justify-content: flex-end;
					align-items: baseline;
					padding: 15upx 30upx;
					font-size: $font-sm + 2upx;
					color: $font-color-light;

					.num {
						margin: 0 8upx;
						color: $font-color-dark;
					}

					.price {
						font-size: $font-lg;
						color: $font-color-dark;
					}
				}

				.action-box {
					display: flex;
					justify-content: flex-end;
					align-items: center;
					height: 100upx;
					position: relative;

					.action-btn {
						width: 150upx;
						height: 56upx;
						margin: 0 0 0 $spacing-base;
						padding: 0;
						text-align: center;
						line-height: 56upx;
						font-size: $font-sm + 2upx;
					}

					.action-btn::after {
						border: 1upx solid;
					}
				}
			}
		}

		.uni-swiper-item {
			height: auto;
		}
	}
</style>