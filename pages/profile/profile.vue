<template>
	<view class="user">
		<!--头部-->
		<view v-if="userInfo != null" class="user-section" :class="'bg-' + themeColor.name">
			<image class="bg" src="/static/user-bg.png"></image>
			<!--用户信息-->
			<view class="user-info-box">
				<view class="portrait-box">
					<image class="portrait" :src="userInfo.avatar || '/static/missing-face.png' "></image>
					<view style="display: flex; flex-direction: column;">
						<text class="username">
							{{userInfo.nickname}}{{' '}}<uni-tag v-if="userInfo.posts.length != 0" size="small" circle="true" :text="userInfo.posts[0].name"></uni-tag>
						</text>
						
						<text class="username">{{ userInfo.mobile || '没有填写手机号'}}</text>
					</view>
				</view>
			</view>
			<!--vip信息-->
			<view class="vip-card-box">
				<view class="b-btn">
					{{userInfo.dept.name}}
				</view>
				<view class="tit">
					<i class="iconfont iconzuanshi" />
					{{siteInfo.web_site_title}}
				</view>
				<text class="e-m">{{ siteInfo.web_about_me }}</text>
			</view>
		</view>

		<!-- 个人中心 内容区-->
		<view class="cover-container" :style="[
			{
				transform: coverTransform,
				transition: coverTransition
			}
		]" @touchstart="coverTouchstart" >
			<image class="arc" src="/static/arc.png"></image>
			<!--个人中心-->

			<view class="list-cell b-b m-t" @tap="toggle('right')" hover-class="cell-hover" hover-stay-time="50">
				<text class="cell-more iconfont iconwechat"></text>
				<text class="cell-more cell-tit">联系作者</text>
			</view>
			
			<!-- 个人资料 -->
			<view class="set">
				<view class="list-cell b-b m-t" @tap="navToUserInfo()" hover-class="cell-hover" hover-stay-time="50">
					<text class="cell-more iconfont iconfile"></text>
					<text class="cell-more cell-tit">个人资料</text>
					<text class="cell-tip"></text>
					<text class="cell-more iconfont iconyou"></text>
				</view>
				<view class="list-cell b-b m-t" hover-class="cell-hover" hover-stay-time="50">
					<text class="cell-more iconfont iconresetpwd"></text>
					<text class="cell-more cell-tit">修改密码</text>
					<text class="cell-tip"></text>
					<text class="cell-more iconfont iconyou"></text>
				</view>	
			</view>
			
			<view class="cu-list menu sm-border card-menu">
				<view class="cu-item">
					<view class="content flex align-center">
						<text class="cuIcon-colorlens" :class="'text-' + themeColor.name"></text>
						<view class="padding solid radius shadow-blur" :class="'bg-' + themeColor.name"></view>
						<view class="title">主题色：<text :class="'text-' + themeColor.name">{{
							themeColor.title
						}}</text></view>
					</view>
					<view class="action">
						<button class="cu-btn round shadow" @click="showColorModal" :class="'bg-' + themeColor.name">
							<text class="cuIcon-colorlens"></text> 选择主题
						</button>
					</view>
				</view>
			</view>
			
			<!-- 选择颜色模态框 -->
			<view class="cu-modal" :class="{ show: colorModal }">
				<view class="cu-dialog">
					<view class="cu-bar justify-end solid-bottom">
						<view class="content">选择颜色</view>
						<view class="action" @tap="colorModal = false">
							<text class="cuIcon-close text-red"></text>
						</view>
					</view>
					<view class="grid col-5 padding">
						<view class="padding-xs" v-for="(item, index) in themeList" :key="index" @tap="SetColor(item)"
							:data-color="item.name">
							<view class="padding-tb radius" :class="'bg-' + item.name">
								{{ item.title }}
							</view>
						</view>
					</view>
				</view>
			</view>
			
		</view>
		
		
		
		<view>
			<!-- 普通弹窗 -->
			<uni-popup ref="popup" background-color="#fff" @change="change">
				<view class="popup-content" :class="{ 'popup-height': type === 'left' || type === 'right' }">
					<uni-section>
						<uni-card title="微信:15601925668" :thumbnail="avatarWechat">
							<img src="http://rgwjuliiy.hd-bkt.clouddn.com/mychat.jpg" width="200" height="200" />
						</uni-card>
					</uni-section>
					<uni-section>
						<uni-card title="QQ:6983299" :thumbnail="avatarQQ">							
						</uni-card>
					</uni-section>
				</view>
			</uni-popup>
		</view>

		
		<view v-show="this.$store.state.hasLogin">
			<button class="gray-btn" :class="'bg-' + themeColor.name" @tap="doLogout">退出</button>
		</view>
		<gotoLogin></gotoLogin>
		
	</view>
</template>

<script>
	import {getAccessToken, setToken, removeToken, getRefreshToken} from "../../common/auth.js";
	import {mapMutations} from 'vuex';
	
	export default {
		data() {
			return {
				avatarWechat: 'http://rgwjuliiy.hd-bkt.clouddn.com/wechat.png',
				avatarQQ: 'http://rgwjuliiy.hd-bkt.clouddn.com/QQ.png',
				
				type: 'center',
				
				userInfo: undefined,
				siteInfo: {
					"web_site_title": "飞鱼技术工作室",
					"web_about_me": "提供高品质软件开发服务",
				},
				colorModal: false,
				//mycenterList: this.$mConstDataConfig.mycenterList,
				themeList: this.$constData.themeList,
				//styleUserIsOpen: this.$mSettingConfig.styleUserIsOpen,
				setList: this.$constData.setList,
				//headImg: this.$mAssetsPath.headImg,
				//userBg: this.$mAssetsPath.userBg,
				//vipCardBg: this.$mAssetsPath.vipCardBg,
				//arc: this.$mAssetsPath.arc,
				coverTransform: 'translateY(0px)',
				coverTransition: '0s',
				moving: false,
				loading: true,
				hasLogin: true
			};
		},
		onShow() {
			console.log("Coming back...");
			this.userInfo = this.$store.state.userInfo.data;
			this.switchTheme();
		},
		methods: {
			...mapMutations(['logout']),
			
			toggle(type) {
				this.type = type
				// open 方法传入参数 等同在 uni-popup 组件上绑定 type属性
				this.$refs.popup.open(type)
			},
			change(e) {
				console.log('当前模式：' + e.type + ',状态：' + e.show);
			},
						
						
			navToUserInfo() {
				uni.navigateTo({
					url: "/pages/profile/userInfo"
				});
			},
			
			doLogout() {
				this.$request.post("/system/auth/logout",{})
				.then(res => {
					removeToken();
					this.logout();
					uni.navigateTo({
						url:"/pages/login/login"
					});
				}).catch( error => {
				  console.error('error:', error);
				})
			},
			switchTheme() {
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
			showColorModal() {
				this.colorModal = true;
			},
			SetColor(item) {
				this.colorModal = false;
				this.themeColor = item;
				this.$store.commit('setThemeColor', item);
				uni.setNavigationBarColor({
					frontColor: '#ffffff',
					backgroundColor: this.themeColor.color,
					animation: {
						duration: 400,
						timingFunc: 'easeIn'
					}
				});
				uni.setTabBarStyle({
					selectedColor: this.themeColor.color,
					borderStyle: 'white'
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

<style lang="scss" scoped>
	page {
		background-color: $page-color-base;
	}

	.user {
		.user-section {
			height: 520upx;
			padding: 45upx 30upx 0;
			position: relative;

			.bg {
				position: absolute;
				left: 0;
				top: 0;
				width: 100vw;
				height: 60vw;
				opacity: 0.84;
			}

			.user-info-box {
				height: 180upx;
				display: flex;
				align-items: center;
				position: relative;
				z-index: 1;
				justify-content: space-between;

				.portrait-box {
					display: flex;
					align-items: center;

					.portrait {
						width: 130upx;
						height: 130upx;
						border: 5upx solid #fff;
						border-radius: 50%;
					}

					.username {
						font-size: $font-lg + 6upx;
						color: $color-white;
						margin-left: 20upx;
					}

					button {
						background-color: transparent;
						font-size: $font-lg + 6upx;
						color: $font-color-dark;
						border: none;
					}

					button::after {
						border: none;
					}
				}
			}

			.vip-card-box {
				display: flex;
				flex-direction: column;
				color: #f7d680;
				height: 240upx;
				background: url('/static/vip-card.png');
				background-size: 100% 100%;
				border-radius: 16upx 16upx 0 0;
				overflow: hidden;
				position: relative;
				padding: 20upx 24upx;

				.b-btn {
					position: absolute;
					right: 24upx;
					top: 24upx;
					width: 160upx;
					height: 40upx;
					text-align: center;
					line-height: 40upx;
					font-size: 22upx;
					color: #36343c;
					border-radius: 20px;
					background: linear-gradient(to left, #f9e6af, #ffd465);
					z-index: 1;
				}

				.tit {
					font-size: $font-base + 2upx;
					color: #f7d680;
					margin-bottom: 28upx;

					.iconfont {
						color: #f6e5a3;
						display: inline-block;
						margin-right: 16upx;
					}
				}
			}
		}

		.cover-container {
			margin-top: -150upx;
			padding: 0 30upx 20upx;
			position: relative;
			background-color: $page-color-base;

			.set {
				padding: $spacing-base 0;
			}


			.cu-list.card-menu {
				margin: $spacing-base 0;

				.title {
					margin-left: $spacing-base;
				}
			}


			.arc {
				position: absolute;
				left: 0;
				top: -34upx;
				width: 100%;
				height: 36upx;
			}

			.promotion-center {
				background: #fff;
				margin-bottom: 10upx;

			}


		}
	}



	@mixin flex {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
	}

	@mixin height {
		/* #ifndef APP-NVUE */
		height: 100%;
		/* #endif */
		/* #ifdef APP-NVUE */
		flex: 1;
		/* #endif */
	}

	.box {
		@include flex;
	}

	.button {
		@include flex;
		align-items: center;
		justify-content: center;
		flex: 1;
		height: 35px;
		margin: 0 5px;
		border-radius: 5px;
	}

	.example-body {
		background-color: #fff;
		padding: 10px 0;
	}

	.button-text {
		color: #fff;
		font-size: 12px;
	}

	.popup-content {
		//@include flex;
		align-items: center;
		justify-content: center;
		padding: 10px;
		//height: 50px;
		background-color: #fff;
	}

	.popup-height {
		@include height;
		width: 300px;
	}

	.text {
		font-size: 12px;
		color: #333;
	}

	.popup-success {
		color: #fff;
		background-color: #e1f3d8;
	}

	.popup-warn {
		color: #fff;
		background-color: #faecd8;
	}

	.popup-error {
		color: #fff;
		background-color: #fde2e2;
	}

	.popup-info {
		color: #fff;
		background-color: #f2f6fc;
	}

	.success-text {
		color: #09bb07;
	}

	.warn-text {
		color: #e6a23c;
	}

	.error-text {
		color: #f56c6c;
	}

	.info-text {
		color: #909399;
	}

	.dialog,
	.share {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
	}

	.dialog-box {
		padding: 10px;
	}

	.dialog .button,
	.share .button {
		/* #ifndef APP-NVUE */
		width: 100%;
		/* #endif */
		margin: 0;
		margin-top: 10px;
		padding: 3px 0;
		flex: 1;
	}

	.dialog-text {
		font-size: 14px;
		color: #333;
	}


</style>