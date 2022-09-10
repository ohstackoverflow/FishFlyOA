<template>
		<view class="uni-padding-wrap uni-common-mt">
			<view>商品列表页：所有的商品都在</view>
			<view class="uni-flex uni-row">
			    <view class="flex-item uni-bg-red">A</view>
			    <view class="flex-item uni-bg-green">Bb</view>
			    <view class="flex-item uni-bg-blue">Ccc</view>
			</view>
			<view class="uni-title uni-common-mt">
				Vertical Scroll
				<text>\n纵向滚动</text>
			</view>
			<view>
				<scroll-view scroll-y="true" class="scroll-Y" >
					<view id="demo1" class="scroll-view-item uni-bg-red">A</view>
					<view id="demo2" class="scroll-view-item uni-bg-green">B</view>
					<view id="demo3" class="scroll-view-item uni-bg-blue">C</view>
				</scroll-view>
			</view>
			<view class="uni-title uni-common-mt">
				Horizontal Scroll
				<text>\n横向滚动</text>
			</view>
			<view>
				<scroll-view class="scroll-view_H" scroll-x="true" scroll-left="120">
					<view id="demo1" class="scroll-view-item_H uni-bg-red">A</view>
					<view id="demo2" class="scroll-view-item_H uni-bg-green">B</view>
					<view id="demo3" class="scroll-view-item_H uni-bg-blue">C</view>
				</scroll-view>
			</view>
			
			<view>
				<view class="uni-margin-wrap">
					<swiper class="swiper" circular :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval"
						:duration="duration">
						<swiper-item>
							<view class="swiper-item uni-bg-red">A</view>
						</swiper-item>
						<swiper-item>
							<view class="swiper-item uni-bg-green">B</view>
						</swiper-item>
						<swiper-item>
							<view class="swiper-item uni-bg-blue">C</view>
						</swiper-item>
					</swiper>
				</view>
			</view>
			
			<view class="item" v-for="(value,index) in iconType" :key="index">
			    <icon :type="value" size="26"/>
			    <!-- <text>{{value}}</text> -->
			</view>
			<view>
				<button type="default" @click="goto('/pages/task/list')">通过方法跳转到task-list页面</button>
				<button type="default" open-type="getPhoneNumber" @getphonenumber="handleGetPhoneNumber">获取手机号</button>
				<button type="default" open-type="feedback">反馈</button>
			</view>
			
			<view class="container">
				<editor id="editor" class="ql-container" @ready="onEditorReady"></editor>
			</view>
			
			<view>
				<form @submit="formSubmit" @reset="formReset">
					<view class="uni-form-item uni-column">
						<view class="title">switch</view>
						<view>
							<switch name="switch" />
						</view>
					</view>
					<view class="uni-form-item uni-column">
						<view class="title">radio</view>
						<radio-group name="radio">
							<label>
								<radio value="radio1" /><text>选项一</text>
							</label>
							<label>
								<radio value="radio2" /><text>选项二</text>
							</label>
						</radio-group>
					</view>
					<view class="uni-form-item uni-column">
						<view class="title">checkbox</view>
						<checkbox-group name="checkbox">
							<label>
								<checkbox value="checkbox1" /><text>选项一</text>
							</label>
							<label>
								<checkbox value="checkbox2" /><text>选项二</text>
							</label>
						</checkbox-group>
					</view>
					<view class="uni-form-item uni-column">
						<view class="title">slider</view>
						<slider value="50" name="slider" show-value></slider>
					</view>
					<view class="uni-form-item uni-column">
						<view class="title">input</view>
						<input class="uni-input" name="input" placeholder="这是一个输入框" />
					</view>
					<view class="uni-btn-v">
						<button form-type="submit">Submit</button>
						<button type="default" form-type="reset">Reset</button>
					</view>
				</form>
			</view>
			
			<view>
				<picker mode="selector" @change="bindPickerChange" :value="index" :range="arrayCountry">
					<view class="uni-input">{{arrayCountry[index]}}</view>
				</picker>
			</view>
			
		</view>

</template>

<script>
	export default {
		data() {
			return {
            background: ['color1', 'color2', 'color3'],
            indicatorDots: true,
            autoplay: true,
            interval: 3000,
            duration: 500,
			
			iconType: ['success','cancel'],
			index:0,
			arrayCountry: ['中国', '美国', '巴西', '日本'],
			}
		},
		onLoad() {
		    // #ifdef APP-PLUS|| MP-WEIXIN
		    this.iconType = ['success', 'success_no_circle', 'info', 'warn', 'waiting', 'cancel', 'download', 'search','clear']
		    // #endif
		    // #ifdef MP-ALIPAY
		    this.iconType = ['info', 'warn', 'waiting', 'cancel', 'download', 'search', 'clear', 'success', 'success_no_circle', 'loading']
		    // #endif
		    // #ifdef MP-BAIDU
		    this.iconType = ['success', 'info', 'warn', 'waiting', 'success_no_circle', 'clear', 'search', 'personal', 'setting', 'top', 'close', 'cancel', 'download', 'checkboxSelected', 'radioSelected', 'radioUnselect']
		    // #endif
		},
		methods: {
			goto(url) {
				uni.navigateTo({
					url:url
				})
			},
			handleGetPhoneNumber(e) {
			  console.log(e.detail)
			},
			onEditorReady() {
			    // #ifdef MP-BAIDU
			    this.editorCtx = requireDynamicLib('editorLib').createEditorContext('editorId');
			    // #endif
			    
			    // #ifdef APP-PLUS || H5 ||MP-WEIXIN
			    uni.createSelectorQuery().select('#editor').context((res) => {
			      this.editorCtx = res.context
			    }).exec()
			    // #endif
			},
			formSubmit: function(e) {
				console.log('form发生了submit事件，携带数据为：' + JSON.stringify(e.detail.value))
				var formdata = e.detail.value
				uni.showModal({
					content: '表单数据内容：' + JSON.stringify(formdata),
					showCancel: false
				});
			},
			formReset: function(e) {
				console.log('清空数据')
			},
			bindPickerChange: function(e) {
			    console.log('picker发送选择改变，携带值为', e.detail.value)
			    this.index = e.detail.value
			},
		}
	}
</script>


<style>
	.flex-item {
		width: 25%;
		height: 200rpx;
		text-align: center;
		line-height: 200rpx;
	}

	.flex-item-V {
		width: 100%;
		height: 150rpx;
		text-align: center;
		line-height: 150rpx;
	}

	.text {
		margin: 15rpx 10rpx;
		padding: 0 20rpx;
		background-color: #ebebeb;
		height: 70rpx;
		line-height: 70rpx;
		text-align: center;
		color: #777;
		font-size: 26rpx;
	}

	.desc {
		/* text-indent: 40rpx; */
	}
	.flex-pc {
		display: flex;
		justify-content: center;
	}
	
	
		.scroll-Y {
			height: 300rpx;
		}
		.scroll-view_H {
			white-space: nowrap;
			width: 100%;
		}
		.scroll-view-item {
			height: 300rpx;
			line-height: 300rpx;
			text-align: center;
			font-size: 36rpx;
		}
		.scroll-view-item_H {
			display: inline-block;
			width: 100%;
			height: 300rpx;
			line-height: 300rpx;
			text-align: center;
			font-size: 36rpx;
		}


	.uni-margin-wrap {
		width: 690rpx;
		width: 100%;
	}
	.swiper {
		height: 300rpx;
	}
	.swiper-item {
		display: block;
		height: 300rpx;
		line-height: 300rpx;
		text-align: center;
	}
	.swiper-list {
		margin-top: 40rpx;
		margin-bottom: 0;
	}
	.uni-common-mt {
		margin-top: 60rpx;
		position: relative;
	}
	.info {
		position: absolute;
		right: 20rpx;
	}

	#editor {
		width: 100%;
		height: 300px;
		background-color: #CCCCCC;
	}
	.container {
		padding: 10px;
	}
	
	.uni-form-item .title {
		padding: 20rpx 0;
	}
</style>