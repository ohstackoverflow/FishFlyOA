<template>
	<view class="notify">
		<view class="promotion-center">
			<view>
				<!-- 轮播图1 -->
				<view class="swiper">
					<view class="swiper-box">
						<swiper class="swiper" circular :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval"
							:duration="duration">
							<swiper-item v-for="item in noticeList" v-if="item.coverImg != null && item.coverImg != ''">
								<view class="swiper-item" @click="navToDetail(item.id)"><image :src="item.coverImg" /> </view>
							</swiper-item>
						</swiper>
					</view>
				</view>
			</view>
		</view>
		
		<view class="notify-list" v-if="noticeList.length > 0">
				
			<view v-for="(item, index) in noticeList" :key="index" class="row">
				<view class="carrier" @click="navToDetail(item.id)">
					<view class="notify-wrapper">
						
						<uni-badge class="uni-badge-left-margin" :text="item.type | newsTypeFilter" absolute="leftTop">
							<view class="title in1line">{{item.title}}</view>
						</uni-badge>
						<view class="time">{{parseTime(item.createTime)}}</view>
						<!-- <uni-tag text="通知"></uni-tag> -->
					</view>
				</view>
			</view>

		</view>

		<gotoLogin></gotoLogin>
	</view>
</template>

<script>
	import {
		mapMutations
	} from 'vuex';
	import constData from '../../common/constData.js';
	import {getAccessToken, getRefreshToken, setToken} from '../../common/auth.js';
	export default {
		data() {
			return {
				indicatorDots: true,
				autoplay: true,
				interval: 3000,
				duration: 500,
				
				noticeList: [],
				//noticeListWithCoverImg: this.noticeList.filter( n=>  n.coverImg != null && n.coverImg != "" ),
				noticeListWithoutCoverImg: []
			}
		},
		created() {
			console.log("created");
		},
		onLoad() {
			
			var tenentName = "飞鱼技术";
			
			this.$request
				.post("/system/auth/login", {
					data: {
						username:"yanfa", 
						password: "123456", 
						//code: this.loginForm.code, 
						//uuid: "",
						tenantName: tenentName,
					},
					dataType: 'json',
					responseType: 'json'
				  }
				)
				.then(res => {
					if(res.statusCode == 200 && res.data.code == 0) {
						setToken(res.data.data);
						this.$request.get("/system/user/profile/get",{})
						.then(r => {
							console.log("profile data...");
							console.log(r.data);
							let p = {
								hasLogin: true,
								userInfo: r.data
							};
							this.login(p);
							//store.commit('login',p);
							console.log("Done");
							this.getNotificationList();
						});
					} else {
						console.log(res);
					}
					
				});
			
			
		},
		onShow() {
			console.log("Showing..");
			if(this.$store.state.hasLogin) {
				console.log("Login");
				this.getNotificationList();
			} else {
				console.log("Not login");
			}
			
			this.switchTheme();
		},
		filters: {
			newsTypeFilter(type) {
				 let newsType;
				constData.newsType.forEach(item => {
					if (item.key === type) {
						newsType = item.value;
					}
				});
				return newsType;
			}
		},
		methods: {
			...mapMutations(['login']),
			
			getNotificationList() {
				this.$request.get('/system/notice/page',{})
				.then(res => {
					console.log(res);
					if(res.statusCode == 200 && res.data["code"] == 0 && res.data.data.total != 0) {
						this.noticeList = res.data.data.list;
					} else {
						this.noticeList = [];
					}
				}).catch(error => {
					console.error('error:', error);
				})
			},
			// 跳转页面
			navToDetail(id) {
				uni.navigateTo({
					url:`/pages/index/details?id=${id}`
				});
			},
			navToAbout() {
				uni.navigateTo({
					url:`/pages/about/index`
				});
			},
			switchTheme() {
				document.body.style.setProperty("--color-theme",this.themeColor.color);
				uni.setTabBarStyle({
					selectedColor: this.themeColor.color,
					borderStyle: 'white'
				});

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
	}
</script>

<style lang="scss">
	page {
		background-color: $page-color-base;
	}

	/*轮播图*/
	.swiper {
		width: 100%;
		margin-top: 5upx;
		margin-bottom: 40upx;
		display: flex;
		justify-content: center;

		.swiper-box {
			width: 92%;
			height: 45vw;
			overflow: hidden;
			border-radius: 15upx;
			box-shadow: 0upx 8upx 25upx rgba(0, 0, 0, 0.2);
			//兼容ios，微信小程序
			position: relative;
			z-index: 1;

			swiper {
				width: 100%;
				height: 45vw;

				swiper-item {
					image {
						//高宽比：0.434789
						width: 100%;
						height: 40vw;
					}
				}
			}
		}
	}

	.notify {

		.promotion-center {
			background: #fff;
			margin-bottom: 20upx;

			/*分类列表*/
			.category-list {
				width: 100%;
				padding: 0 0 30upx 0;
				border-bottom: solid 2upx #f6f6f6;
				display: flex;
				flex-wrap: wrap;

				.category {
					width: 33.3%;
					margin-top: 50upx;
					display: flex;
					justify-content: center;
					flex-wrap: wrap;

					.img {
						width: 100%;
						display: flex;
						justify-content: center;

						.iconfont {
							font-size: $font-lg + 24upx;
						}
					}

					.text {
						width: 100%;
						display: flex;
						justify-content: center;
						font-size: 24upx;
						color: #3c3c3c;
					}

					.share-btn {
						height: 142upx;
						text-align: left;
						background: none;
						padding: 0;
						margin: 0;
					}

					.share-btn:after {
						border: none;
						border-radius: none;
					}
				}
			}
		}

		.header {
			width: 100%;
			padding-left: $font-lg;
			height: 100upx;
			display: flex;
			align-items: center;
			position: fixed;
			top: 0;
			z-index: 10;
			background-color: #fff;
			/*  #ifdef  APP-PLUS  */
			top: var(--status-bar-height);

			/*  #endif  */
			.title {
				font-size: 36upx;
			}
		}

		.place {
			background-color: #ffffff;
			height: 100upx;
			/*  #ifdef  APP-PLUS  */
			margin-top: var(--status-bar-height);
			/*  #endif  */
		}

		.notify-list {
			.read {
				text-align: right;
				margin-right: $spacing-base;
				margin-top: $spacing-base;
				margin-bottom: $spacing-sm;

				text {
					margin-left: $spacing-base;
				}
			}

			.row {
				width: calc(94%);
				height: calc(22vw + 40upx);
				margin: 0 auto $spacing-base;
				border-radius: 15upx;
				box-shadow: 0upx 5upx 20upx rgba(0, 0, 0, 0.1);
				display: flex;
				align-items: center;
				position: relative;
				overflow: hidden;
				z-index: 4;
				border: 0;

				.menu {
					.iconfont {
						color: #fff;
						font-size: 60upx;
					}

					position: absolute;
					width: 29%;
					height: 100%;
					right: 0;
					display: flex;
					justify-content: center;
					align-items: center;
					color: #fff;
					z-index: 2;
				}

				.carrier {
					@keyframes showMenu {
						0% {
							transform: translateX(0);
						}

						100% {
							transform: translateX(-30%);
						}
					}

					@keyframes closeMenu {
						0% {
							transform: translateX(-30%);
						}

						100% {
							transform: translateX(0);
						}
					}

					&.open {
						animation: showMenu 0.25s linear both;
					}

					&.close {
						animation: closeMenu 0.15s linear both;
					}

					background-color: #fff;
					position: absolute;
					width: 100%;
					padding: 0 0;
					height: 100%;
					z-index: 3;
					display: flex;
					align-items: center;
				}
			}

			.notify-wrapper {
				background-color: $color-white;
				width: 100%;
				padding: $spacing-base $spacing-lg $spacing-base 80upx;
				margin: $spacing-base 0 0;
				border-radius: 15upx;
				position: relative;

				.title {
					font-size: $font-lg;
					color: $font-color-dark;
					font-weight: 500;
					margin: 0 0 $spacing-sm;
				}

				.content {
					font-size: $font-sm;
					color: $font-color-base;
					height: 75upx;
					line-height: 36upx;
				}

				.time {
					font-size: $font-base;
					color: $font-color-light;
				}

				.type {
					position: absolute;
					top: 26upx;
					left: -10upx;
					border: none;
					font-size: $font-sm;
					opacity: 0.8;
				}

				.un-read {
					display: inline-block;
					width: 12upx;
					height: 12upx;
					border-radius: 50%;
					position: absolute;
					top: 32upx;
					right: 30upx;
				}
			}
		}

		.notify-empty {
			position: fixed;
			left: 0;
			top: 50;
			width: 100%;
			height: 100vh;
			padding-bottom: 100upx;
			display: flex;
			justify-content: center;
			flex-direction: column;
			align-items: center;
			background: #fff;

			.iconfont {
				font-size: $font-lg + 100upx;
			}

			.empty-tips {
				display: flex;
				font-size: $font-sm + 2upx;
				color: $font-color-disabled;

				.navigator {
					margin-left: 16upx;
				}
			}
		}
	}
</style>
