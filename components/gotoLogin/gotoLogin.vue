<template>
	<view v-if="!this.$store.state.hasLogin">
		<navigator url="/pages/login/login" open-type="navigate">
			<view class="goto-login">去登录</view>
		</navigator>
	</view>
</template>

<script>
	export default {
		name:"gotoLogin",
		data() {
			return {
				
			};
		}
	}
</script>

<style>

</style>