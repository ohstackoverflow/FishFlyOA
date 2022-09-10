<template>
	<view class="normal-login-container">
		<view class="logo-content align-center justify-center flex">
		  <image style="width: 200rpx;height: 200rpx;" src="../../static/flyinfish.png" mode="widthFix">
		  </image>
		  <!-- <text class="title">欢迎登录</text> -->
		</view>
		
		<view  class="login-form-content">
			<view class="input-item flex align-center">
			  <view class="iconfont iconyonghu icon"></view>
			  <input v-model="loginForm.username" class="input" type="text" placeholder="请输入账号" maxlength="30" />
			</view>
			<view class="input-item flex align-center">
			  <view class="iconfont iconmima icon"></view>
			  <input v-model="loginForm.password" type="password" class="input" placeholder="请输入密码" maxlength="20" />
			</view>
			<view class="input-item flex align-center" v-if="captchaEnable">
			  <view class="iconfont iconanquan icon"></view>
			  <input v-model="loginForm.code" class="input" placeholder="请输入验证码" maxlength="5" />
			  <image :src="codeUrl" @click="getCode" class="login-code-img"></image>
			</view>
			<view class="action-btn">
			  <button @click="doLogin" :class="'login-btn cu-btn block lg round bg-' + themeColor.name">登录</button>
			</view>
			
			
			<!-- <button class="confirm-btn" :class="'bg-' + themeColor.name" @tap="doLogin">登 录</button>	 -->		
			<!-- <view class="res">
				<view @tap="toPage('register')">用户注册</view>
				<view @tap="toPage('resetpasswd')">忘记密码</view>
			</view> -->
		</view>
		<!-- 第三方登录 -->
		<view class="oauth" v-if="isShowOauth">
			<view class="text">— 快速登录 —</view>
			<view class="list">
				<view @tap="oauthLogin('weixin')" v-if="showProvider.weixin" class="icon weixin"></view>
				<view @tap="oauthLogin('qq')" v-if="showProvider.qq" class="icon qq"></view>
				<view @tap="oauthLogin('sinaweibo')" v-if="showProvider.sinaweibo" class="icon sinaweibo"></view>
				<!-- <view @tap="oauthLogin('xiaomi')" v-if="showProvider.xiaomi" class="icon xiaomi"></view> -->
			</view>
		</view>
		
		<view>
			<uni-collapse>
				<uni-collapse-item title="更多登录账号...">
					<uni-table border emptyText="暂无更多数据">
						<!-- 表头行 -->
						<uni-tr>
							<uni-th width=80>用户名/密码</uni-th>
							<uni-th width=70>昵称</uni-th>
							<uni-th width=60>部门</uni-th>
							<uni-th width=60>备注</uni-th>
						</uni-tr>
						<!-- 表格数据行 -->
						<uni-tr>
							<uni-td><span class="username">xiaoyan</span>/123456</uni-td>
							<uni-td>小研</uni-td>
							<uni-td>研发部门</uni-td>
							<uni-td>员工</uni-td>
						</uni-tr>
						<uni-tr>
							<uni-td><span class="username">yanfa</span>/123456</uni-td>
							<uni-td>研发达人</uni-td>
							<uni-td>研发部门</uni-td>
							<uni-td>负责人</uni-td>
						</uni-tr>
						
						<uni-tr>
							<uni-td><span class="username">xiaowei</span>/123456</uni-td>
							<uni-td>小维</uni-td>
							<uni-td>运维部门</uni-td>
							<uni-td>员工</uni-td>
						</uni-tr>
						<uni-tr>
							<uni-td><span class="username">yunwei</span>/123456</uni-td>
							<uni-td>运维达人</uni-td>
							<uni-td>运维部门</uni-td>
							<uni-td>负责人</uni-td>
						</uni-tr>
						
						<uni-tr>
							<uni-td><span class="username">yinzhang</span>/123456</uni-td>
							<uni-td>印章管理员</uni-td>
							<uni-td></uni-td>
							<uni-td>管理</uni-td>
						</uni-tr>
						
						<uni-tr>
							<uni-td><span class="username">diaodu</span>/123456</uni-td>
							<uni-td>调度达人</uni-td>
							<uni-td></uni-td>
							<uni-td>管理</uni-td>
						</uni-tr>
						
						<uni-tr>
							<uni-td><span class="username">xiaocai</span>/123456</uni-td>
							<uni-td>小财</uni-td>
							<uni-td>财务部门</uni-td>
							<uni-td>员工</uni-td>
						</uni-tr>
						<uni-tr>
							<uni-td><span class="username">caiwu</span>/123456</uni-td>
							<uni-td>财务达人</uni-td>
							<uni-td>财务部门</uni-td>
							<uni-td>负责人</uni-td>
						</uni-tr>
						<uni-tr>
							<uni-td><span class="username">hrmgr</span>/123456</uni-td>
							<uni-td>HR</uni-td>
							<uni-td>总裁办</uni-td>
							<uni-td>hr</uni-td>
						</uni-tr>
						<uni-tr>
							<uni-td><span class="username">admin</span>/admin123</uni-td>
							<uni-td>总总</uni-td>
							<uni-td>总裁办</uni-td>
							<uni-td>总经理</uni-td>
						</uni-tr>
					
					</uni-table>
				</uni-collapse-item>
			</uni-collapse>
			
		</view>
		
	</view>
</template>

<script>
	import {
		mapMutations
	} from 'vuex';
	
	import {getTenantIdByName,setTenantId} from "../../common/tenant.js";
	import {getAccessToken, setToken, removeToken, getRefreshToken} from "../../common/auth.js";
	
	export default {
		data() {
			return {
				codeUrl: "",
				captchaEnable: true,
				
				loginForm: {
					loginType: "uname",
					username: "yanfa",
					password: "123456",
					mobile: "",
					mobileCode: "",
					rememberMe: false,
					code: "",
					uuid: "",
					tenantName: "飞鱼技术",
				},
				
				
				isShowOauth:false,
				showProvider:{
					weixin:false,
					qq:false,
					sinaweibo:false,
					xiaomi:false
				},
				
			}
		},
		onLoad() {
			//APP显示第三方登录
			// #ifdef APP-PLUS
				this.isShowOauth=true;
			// #endif
			this.getProvider();
		},
		created() {
			this.getCode();
			
			getTenantIdByName(this.loginForm.tenantName).then(res => {
			  const tenantId = res.data.data;
			  if (tenantId && tenantId >= 0) {
			    // 设置租户
			    setTenantId(tenantId)
			    console.log('租户存在');
			  } else {
			    console.log('租户不存在');
			  }
			});
			
		},
		onReady() {
			//this.$refs.form.setRules(this.LoginRules);
		},
		onShow() {
			this.switchTheme();
		},
		methods: {
			...mapMutations(['login']),
			
			
			getCode() {
			  // 只有开启的状态，才加载验证码。默认开启
			  if (!this.captchaEnable) {
			    return;
			  }
			  console.log(this.captchaEnable);
			  // 请求远程，获得验证码
			  this.$request
			  .get("/system/captcha/get-image", {
					
					dataType: 'json',
					responseType: 'json'
			    }
			  )
			  .then(res => {
			    res = res.data;
				console.log(res.data["enable"]);
			    this.captchaEnable = res.data["enable"];
			    if (this.captchaEnable) {
			      this.codeUrl = "data:image/gif;base64," + res.data["img"];
			      this.loginForm.uuid = res.data["uuid"];
				  console.log(this.codeUrl);
			    }
			  })
			  .catch( error => {
				  console.error('error:', error);
			  });
			},
			
			
			doLogin() {
				
				//success方法指向闭包，所以this属于闭包，由此在success回调函数里是不能直接使用this.xxxxx()的，如果我们要使用的话，可以在闭包之外先把this赋值给另一个变量。
				var that = this;
				
				uni.hideKeyboard();
				uni.showLoading({
					title:'提交中...'
				});
				
				
				this.$request
				.post("/system/auth/login", {
					data: {
						username:this.loginForm.username, 
						password: this.loginForm.password, 
						code: this.loginForm.code, 
						uuid: this.loginForm.uuid,
						tenantName: this.loginForm.tenantName,
					},
					dataType: 'json',
					responseType: 'json'
				  }
				)
				.then(res => {
					uni.hideLoading();
					console.log(res);
					if(res.statusCode == 200) {
						
						if(res.data["code"] == 0) {							
							uni.showToast({
								duration: 2000,
								title: "成功登录"
							})
													
							setToken(res.data.data);
							
							this.$request.get("/system/user/profile/get",{})
							.then(r => {
								console.log("profile data...");
								console.log(r.data);
								let p = {
									hasLogin: true,
									userInfo: r.data
								};
								that.login(p);
								uni.navigateBack();
							});
						} else {
							uni.showToast({
								duration: 2000,
								title: res.data.msg,
								icon:'error'
							})
						}
						
						
					}
				})
				.catch( error => {
				  console.error('error:', error);
				});
				
				
				
				
				
			},
			
			oauthLogin(provider){
				uni.showLoading();
				//第三方登录
				uni.login({
					provider: provider,
					success: (loginRes)=>{
						console.log("success: "+JSON.stringify(loginRes));
						//案例直接获取用户信息，一般不是在APP端直接获取用户信息，比如微信，获取一个code，传递给后端，后端再去请求微信服务器获取用户信息
						uni.getUserInfo({
							provider: provider,
							success: (infoRes)=>{
								console.log('用户信息：' + JSON.stringify(infoRes.userInfo));
								uni.setStorage({
									key: 'UserInfo',
									data: {
										username:infoRes.userInfo.nickName,
										face:infoRes.userInfo.avatarUrl,
										signature:'个性签名',
										integral:0,
										balance:0,
										envelope:0
									},
									success: function () {
										uni.hideLoading()
										uni.showToast({title: '登录成功',icon:"success"});
										setTimeout(function(){
											uni.navigateBack();
										},300)
									}
								});
							}
						});
					},
					fail:(e)=>{
						console.log("fail: "+JSON.stringify(e));
					}
				});
			},
			
			getProvider(){
				//获取第三方登录服务
				uni.getProvider({
					service: 'oauth',
					success: (res)=>{
						let len = res.provider.length;
						for(let i=0;i<len;i++){
							//有服务才显示按钮图标
							this.showProvider[res.provider[i]] = true;
						}
						if(res.provider.length==0){
							this.isShowOauth=false;
						}
					}
				});
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
		}
	}
</script>

<style lang="scss">
  page {
    background-color: #ffffff;
  }

  .normal-login-container {
    width: 100%;

    .logo-content {
      width: 100%;
      font-size: 21px;
      text-align: center;
      padding-top: 5%;

      image {
        border-radius: 4px;
      }

      .title {
        margin-left: 10px;
      }
    }

    .login-form-content {
      text-align: center;
      margin: 20px auto;
      margin-top: 5%;
      width: 80%;

      .input-item {
        margin: 20px auto;
        background-color: #f5f6f7;
        height: 45px;
        border-radius: 20px;

        .icon {
          font-size: 38rpx;
          margin-left: 10px;
          color: #999;
        }

        .input {
          width: 100%;
          font-size: 14px;
          line-height: 20px;
          text-align: left;
          padding-left: 15px;
        }

      }

      .login-btn {
        margin-top: 40px;
        height: 45px;
      }

      .xieyi {
        color: #333;
        margin-top: 20px;
      }
    }

    .easyinput {
      width: 100%;
    }
  }

  .login-code-img {
    height: 45px;
  }
</style>
