<template>
	<div class="login_page">
		<div class="login_div">
			<div class="" style="text-align:center;">
				<img :src="loginIcon" style="width:60px;">
			</div>
			<Form :model="loginForm" :rules="loginRules">
				<FormItem prop="user" label="USERNAME">
					<Input name="user" v-model="loginForm.user" placeholder="请输入用户名" />
				</FormItem>
				<FormItem prop="pwd" label="PASSWORD">
					<Input type="password"  name="pwd" v-model="loginForm.pwd" placeholder="请输入密码" />
				</FormItem>
			</Form>
			<Button type="primary" class="login_bt" @click = "login">LOGIN</Button>
		</div>
	</div>
</template>
<script>
	export default{
		data(){
			return{
				loginIcon:require('../assets/login_icon.png'),
				loginForm:{
					user: '',
					pwd: '',
				},
				loginRules:{
					user:[
						{required:true, message: '请输入用户名', trigger: 'blur'}
					],
					pwd:[
						{required:true, message: '请输入密码', trigger: 'blur'}
					],
				},
			}
		},
		methods: {
            login(){
            	this.loginForm.pwd = this.$md5(this.loginForm.pwd);
                this.$http.post(this.api+'?r=admin/auth/login',this.loginForm).then((response)=>{
                    if (response.data.code==200){
						localStorage.setItem('Back_Blogger',JSON.stringify({token:response.data.token,time:new Date().getTime()}));
						localStorage.setItem('admin_name',response.data.name);
						localStorage.setItem('user_token',response.data.user_token);
						localStorage.setItem('last_login',response.data.last_login);
						this.$router.push({name:'home'});
                    }else{
						this.$Message.error(response.data.msg);
					}
				});
            }
        }
	}
</script>