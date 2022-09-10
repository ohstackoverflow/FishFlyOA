<template>
	<view class="oa-notice-detail">
	
	<!-- #ifndef MP-WEIXIN -->
		<view>
			<parser :key="new Date().getTime()" :form-conf="detailForm" />
		</view>
	<!-- #endif -->
	
		<el-card class="box-card">
		  <div slot="header" class="clearfix">
		    <span class="el-icon-picture-outline">审批记录</span>
		  </div>
		  <el-col :span="20" :offset="1" >
		    <div class="block">
		      <el-timeline>
		        <el-timeline-item v-for="(item, index) in tasks" :key="index"
		                          :icon="getTimelineItemIcon(item)" :type="getTimelineItemType(item)">
		          <p style="font-weight: 700">任务：{{ item.name }}</p>
		          <el-card :body-style="{ padding: '10px' }">
		            <label v-if="item.assigneeUser" style="font-weight: normal; margin-right: 30px;">
		              审批人：{{ item.assigneeUser.nickname }}
		              <el-tag type="info" size="mini">{{ item.assigneeUser.deptName }}</el-tag>
		            </label><br/>
		            <label style="font-weight: normal" v-if="item.createTime">创建时间：</label>
		            <label style="color:#8a909c; font-weight: normal">{{ parseTime(item.createTime) }}</label><br/>
		            <label v-if="item.endTime" style="font-weight: normal">审批时间：</label>
		            <label v-if="item.endTime" style="color:#8a909c;font-weight: normal"> {{ parseTime(item.endTime) }}</label>
					<br v-if="item.endTime"/>
		            <label v-if="item.durationInMillis" style="font-weight: normal">耗时：</label>
		            <label v-if="item.durationInMillis" style="color:#8a909c;font-weight: normal"> {{ getDateStar(item.durationInMillis) }} </label>
					<br v-if="item.durationInMillis"/>
		            <p v-if="item.reason">
		              <el-tag :type="getTimelineItemType(item)">{{ item.reason }}</el-tag>
		            </p>
		          </el-card>
		        </el-timeline-item>
		      </el-timeline>
		    </div>
		  </el-col>
		</el-card>

	<!-- #ifndef MP-WEIXIN -->
		<el-card>
			<MyProcessViewer key="designer" v-model="bpmnXML" v-bind="bpmnControlForm" :activityData="activityList"
			            :processInstanceData="processInstance" :taskData="tasks" />
		</el-card>
	<!-- #endif -->
		
		<view class="feedback-body"  v-if="runningTasks.length != 0">
			<textarea placeholder="请详细描述您的意见..." v-model="suggest" class="feedback-textare" />
			</view>
		<view class="footer" v-if="runningTasks.length != 0">
			<button class="action-btn" :class="'bg-' + themeColor.name" @click="handleAudit(runningTasks,true)">
				通过
			</button>
			<button class="action-btn" :class="'bg-' + themeColor.name" @click="handleAudit(runningTasks,false)">
				不通过
			</button>
		</view>
		
		<!--加载动画-->
	</view>
</template>

<script>
	import {getDate} from '@/common/dateUtils.js';
	import moment from '../../common/moment.js';
	import {decodeFields} from "@/common/formGenerator.js";

//#ifndef MP-WEIXIN
	import Parser from '@/component/parser/Parser.vue'

	import MyProcessDesigner from "@/component/bpmnProcessDesigner/package/designer";
	import MyProcessPenal from "@/component/bpmnProcessDesigner/package/penal";
	import MyProcessViewer from '@/component/bpmnProcessDesigner/package/designer/index2';

	const install = function(Vue) {
	  components.forEach(component => {
		Vue.component(component.name, component);
	  });
	};

	if (typeof window !== "undefined" && window.Vue) {
	  install(window.Vue);
	}
//#endif

	export default {
		//#ifndef MP-WEIXIN
		install,

		components: {
		    Parser,MyProcessViewer,MyProcessPenal
		},
		//#endif
		
		data() {
			return {
				// 流程实例
				id: undefined, // 流程实例的编号
				processInstance: {},
				// 流程表单详情
				detailForm: {
				  fields: []
				},
				
				// BPMN 数据
				bpmnXML: null,
				bpmnControlForm: {
				  prefix: "activiti"
				},
				activityList: [],
				
				// 审批记录
				//tasksLoad: true,
				tasks: [],
				
				// 审批流程表单
				runningTasks: [],
				auditForms: [],
				suggest: '',
				
			};
		},
		filters: {
			// 时间格式化
			time(val) {
				return moment(val * 1000).format('YYYY-MM-DD HH:mm');
			}
		},
		created() {
			//this.id = '81642560-0bea-11ed-8e92-00e07045ba07';
			this.getProcessInstace(this.id);
			//console.log("1212121212121");
		},
		onLoad:function(param){
			console.log(param.id);
			this.id = param.id;
		},
		onShow() {
			this.switchTheme();
		},
		methods: {
			getProcessInstace(id) {
				console.log("...getProcessInstace(id)....");
				this.$request.get("/bpm/process-instance/get?id=" + id,{})
				.then(res => {
					console.log(res);
					if (!res.data.data) {
					  console.error('查询不到流程信息！');
					  return;
					}
					this.processInstance = res.data.data;					
					console.log(this.processInstance.processDefinition.formConf);
					// 设置表单信息
					if (this.processInstance.processDefinition.formType === 10) {
					  this.detailForm = {
					    ...JSON.parse(this.processInstance.processDefinition.formConf),
					    disabled: true, // 表单禁用
					    formBtns: false, // 按钮隐藏
					    fields: decodeFields(this.processInstance.processDefinition.formFields)
					  }
					  // 设置表单的值
					  this.detailForm.fields.forEach(item => {
					    const val = this.processInstance.formVariables[item.__vModel__]
					    if (val) {
					      item.__config__.defaultValue = val
					    }
					  });
					}
					//console.log("结果");
					//console.log(this.processInstance.result);
					// 加载流程图
					this.$request.get('/bpm/process-definition/get-bpmn-xml?id=' + this.processInstance.processDefinition.id,{})
					.then(res => {
						//console.log(res.data.data);
						this.bpmnXML = res.data.data;
					}).catch(error => {
						console.log(error);
					})
					
					// 加载活动列表
					this.$request.get('/bpm/activity/list',{data:
						{processInstanceId: this.processInstance.id},
					})
					.then(res => {
						console.log(res);
						this.activityList = res.data.data;
					}).catch(error => {
						console.log(error);
					})
							
				});
				
				 // 获得流程任务列表（审批记录）
				this.tasksLoad = true;
				this.$request.get('/bpm/task/list-by-process-instance-id?processInstanceId=' + id,{})
				.then(res => {
					// 审批记录
					this.tasks = [];
					// 移除已取消的审批
					res.data.data.forEach(task => {
					  if (task.result !== 4) {
					    this.tasks.push(task);
					  }
					});
					// 排序，将未完成的排在前面，已完成的排在后面；
					this.tasks.sort((a, b) => {
					  // 有已完成的情况，按照完成时间倒序
					  if (a.endTime && b.endTime) {
					    return b.endTime - a.endTime;
					  } else if (a.endTime) {
					    return 1;
					  } else if (b.endTime) {
					    return -1;
					    // 都是未完成，按照创建时间倒序
					  } else {
					    return b.createTime - a.createTime;
					  }
					});
					
					this.runningTasks = [];
					// 需要审核的记录
					const userId = this.$store.state.userInfo.data.id;
					console.log("userInfo:");
					console.log(this.$store.state.userInfo.data);
					console.log("userId:"+userId);
					//console.log(this.tasks);
					this.tasks.forEach(task => {
					  if (task.result !== 1) { // 只有待处理才需要：1待处理 2已处理
					    return;
					  }
					  if (!task.assigneeUser || task.assigneeUser.id !== userId) { // 自己不是处理人
					    return;
					  }
					  this.runningTasks.push({...task});
					  this.auditForms.push({
					    reason: ''
					  })
					});
					console.log("runningTasks-start");
					console.log(this.runningTasks);
					console.log("runningTasks-end.");
					// 取消加载中
					//this.tasksLoad = false;
												
				})
					  
			},
		
			getDateStar(ms) {
			  return getDate(ms);
			},
			getTimelineItemIcon(item) {
			  if (item.result === 1) {
				return 'el-icon-time';
			  }
			  if (item.result === 2) {
				return 'el-icon-check';
			  }
			  if (item.result === 3) {
				return 'el-icon-close';
			  }
			  if (item.result === 4) {
				return 'el-icon-remove-outline';
			  }
			  return '';
			},
			getTimelineItemType(item) {
			  if (item.result === 1) {
				return 'primary';
			  }
			  if (item.result === 2) {
				return 'success';
			  }
			  if (item.result === 3) {
				return 'danger';
			  }
			  if (item.result === 4) {
				return 'info';
			  }
			  return '';
			},
			
			/** 处理审批通过和不通过的操作 */
			handleAudit(tasks, pass) {
				console.log(tasks);
				if(tasks != null && tasks.length > 0) {
					const task = tasks[0];
					let data = {
					  id: task.id,
					  reason: this.suggest
					}
					if (pass) {
					  if(data.reason == '') {
						  data.reason = '同意';
					  }
					  
					  this.$request.put('/bpm/task/approve',{data:data})
					  .then(res => {
						  uni.showToast({
						  	duration: 2000,
						  	title: "审批通过，已提交成功！"
						  });
						  this.getProcessInstace(this.id);
						}); 
					}
					else {
						if(data.reason == '') {
							data.reason = '不同意';
						}
						this.$request.put('/bpm/task/reject',{data:data})
						.then(res => {
							uni.showToast({
								duration: 2000,
								title: "审批不通过，已提交成功！"
							});
							this.getProcessInstace(this.id);
						});
					}
					console.log(data.reason);
					console.log("OK");

					
					
				}
				
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
	.box-card {
	  width: 100%;
	  margin-bottom: 20px;
	}
	
	.oa-notice-detail {
		padding: 30upx 10upx;
		
		.uni-timeline {
			padding: $spacing-lg;
			background-color: $color-white;
		}
		.feedback-title {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
			padding: $spacing-base;
			margin-top: $spacing-base;
			font-size: $font-base;
			background-color: $color-white;
		}

		.feedback-star-view.feedback-title {
			justify-content: flex-start;
			margin: 0;
		}

		.feedback-quick {
			position: relative;
			padding-right: 40upx;
			.iconfont {
				font-size: $font-sm;
			}
		}

		.feedback-body {
			background: $color-white;
			padding: $spacing-sm $spacing-base;
			.gender-item {
				margin-right: 20upx;

				.gender-item-text {
					padding-left: 10upx;
				}

				radio .wx-radio-input.wx-radio-input-checked {
					background: $uni-color-primary;
					border-color: $uni-color-primary;
				}
			}
		}

		.feedback-textare {
			height: 400upx;
			font-size: 34upx;
			line-height: 50upx;
			width: 100%;
			box-sizing: border-box;
			padding: 20upx 30upx 0;
		}
		.footer {
			position: fixed;
			left: 0;
			bottom: 0;
			z-index: 98;
			width: 100%;
			background-color: $color-white;
			color: $font-color-base;
			box-shadow: 0 -1px 5px rgba(0, 0, 0, 0.1);
			display: flex;
			justify-content: flex-end;
			align-items: center;
			padding: 15upx $spacing-base;
			.action-btn {
				font-size: $font-sm;
				margin: 0 0 0 15upx;
				padding: 0 $spacing-lg;
				text-align: center;
				height: 60upx;
				line-height: 60upx;
				// background-color: #F37B1D;
				// color: #fff;
			}
		}
		.banner {
			overflow: hidden;
			position: relative;
			background-color: #ccc;

			.banner-img {
				height: 300upx;
				width: 100%;
			}

			.banner-title {
				max-height: 84upx;
				overflow: hidden;
				position: absolute;
				bottom: 0;
				width: 100%;
				font-size: 32upx;
				font-weight: 400;
				line-height: 42upx;
				color: white;
				z-index: 11;
				background-color: rgba(0, 0, 0, 0.25);
				padding: 4upx 20upx;
			}
		}

		.banner-title {
			padding: $spacing-lg $spacing-lg 0;
			font-size: $font-lg;
		}

		.article-meta {
			padding: 20upx 40upx;
			display: flex;
			flex-direction: row;
			justify-content: flex-start;
			color: gray;

			.article-text {
				font-size: 26upx;
				line-height: 50upx;
				margin: 0 20upx;
			}

			.article-author,
			.article-time {
				font-size: 30upx;
			}
		}

		.article-content {
			padding: 0 30upx;
			overflow: hidden;
			font-size: 30upx;
			margin-bottom: 30upx;
		}

		.input-title {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
			padding: $spacing-base;
			margin-top: $spacing-base;
			font-size: $font-base;
			background: $color-white;
		}

		.input-body {
			background: $color-white;
			padding: $spacing-sm $spacing-base;
		}
		.covers-title {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
			padding: $spacing-base;
			margin-top: $spacing-base;
			font-size: $font-base;

		}
		.covers-body {
			background: $color-white;
			padding: $spacing-sm $spacing-base;
			.gender-item {
				margin-right: 20upx;

				.gender-item-text {
					padding-left: 10upx;
				}

				radio .wx-radio-input.wx-radio-input-checked {
					background: $uni-color-primary;
					border-color: $uni-color-primary;
				}
			}
		}
		.covers-uploader {
			padding: 22upx 20upx;
		}
	}
</style>