<template>
	<view>
		<!-- #ifndef MP-WEIXIN -->
		<view>
			<parser :key="new Date().getTime()" :form-conf="detailForm" @submit="submitForm"/>
		</view>
		<el-card>
			<my-process-viewer key="designer" v-model="bpmnXML" v-bind="bpmnControlForm" :processInstanceData="selectProcessInstance" />
		</el-card>
		<!-- #endif -->
	</view>
</template>

<script>
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
		components: {
		  Parser,MyProcessViewer,MyProcessPenal
		},
		data() {
			return {
				// 流程表单详情
				detailForm: {
				  fields: []
				},
				
				// BPMN 数据
				bpmnXML: null,
				bpmnControlForm: {
				  prefix: "activiti"
				},
				
				// 流程表单
				selectProcessInstance: undefined, // 选择的流程实例
			}
		},
		onLoad(e) {
			if(e.item) {
				this.selectProcessInstance = JSON.parse(e.item);
				this.parserObj(this.selectProcessInstance);
			}
		},
		onShow() {
			this.switchTheme();
		},
		methods: {

			parserObj(item) {
				console.log(item);
				// 设置选择的流程
				this.selectProcessInstance = item;
				
				// 流程表单
				if (item.formId) {
				  // 设置对应的表单
				  this.detailForm = {
				    ...JSON.parse(item.formConf),
				    fields: decodeFields(item.formFields)
				  }
				
				  // 加载流程图
				  this.$request.get('/bpm/process-definition/get-bpmn-xml?id=' + this.selectProcessInstance.id,{})
				  .then(response => {
					//console.log(response.data.data);
				    this.bpmnXML = response.data.data
				  })
				} else if (item.formCustomCreatePath) {
				  this.$router.push({ path: item.formCustomCreatePath});
				  // 这里暂时无需加载流程图，因为跳出到另外个 Tab；
				}
			},
			
			submitForm(params) {
			  if (!params) {
			    return;
			  }
			  // 设置表单禁用
			  const conf = params.conf;
			  conf.disabled = true; // 表单禁用
			  conf.formBtns = false; // 按钮隐藏
			
			  // 提交表单，创建流程
			  const variables = params.values;
			  this.$request.post("/bpm/process-instance/create",{data:{
					processDefinitionId: this.selectProcessInstance.id,
					variables: variables
				}})
				.then(response => {
			    //this.$modal.msgSuccess("发起流程成功");
				uni.showToast({
					duration: 2000,
					title: "发起流程成功！"
				});
				
				uni.switchTab({
					url:"/pages/task/list"
				});
				
			  }).catch(() => {
			    conf.disabled = false; // 表单开启
			    conf.formBtns = true; // 按钮展示
			  });
			  
			  
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

</style>