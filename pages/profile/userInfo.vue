<template>
	<view class="user">
		<el-form ref="form" :model="user" label-width="80px">
		  <el-form-item label="用户昵称" prop="nickName">
			<el-input v-model="user.nickname" />
		  </el-form-item>
		  <el-form-item label="手机号码" prop="mobile">
			<el-input v-model="user.mobile" maxlength="11" />
		  </el-form-item>
		  <el-form-item label="邮箱" prop="email">
			<el-input v-model="user.email" maxlength="50" />
		  </el-form-item>
		  <el-form-item label="性别">
			<el-radio-group v-model="user.sex">
			  <el-radio :label="1">男</el-radio>
			  <el-radio :label="2">女</el-radio>
			</el-radio-group>
		  </el-form-item>
		  <el-form-item>
			<el-button type="primary" size="mini" @click="submit">保存</el-button>
		  </el-form-item>
		</el-form>
	</view>

</template>

<script>
import {mapMutations} from 'vuex';
	
export default {
  data() {
    return {
      user: {}
    };
  },
  created() {
  	this.getUser();
  },
  onShow() {
  	this.switchTheme();
  },
  methods: {
	  ...mapMutations(['login']),
	  
	  getUser() {
		  this.$request.get("/system/user/profile/get",{})
		  .then(res => {
			  this.user = res.data.data;
		  })
	  },
	  submit() {
		  this.$request.put("/system/user/profile/update",{data:this.user})
		  .then(res => {
			  console.log(res);
			  uni.showToast({
			  	duration: 2000,
			  	title: "修改成功"
			  });
			  
			  this.$request.get("/system/user/profile/get",{})
			  .then(r => {
			  	console.log("profile data...");
			  	console.log(r.data);
			  	let p = {
			  		hasLogin: true,
			  		userInfo: r.data
			  	};
			  	this.login(p);

				uni.navigateBack();
				
			  })
			  

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
  }
}
</script>

<style>
	.user {
		padding: 30upx 10upx;
	}
</style>