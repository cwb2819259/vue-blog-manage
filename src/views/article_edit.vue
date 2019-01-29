<template>
    <div>
        <Form :model="form_data" :label-width="80">
	        <FormItem label="文章标题">
	            <Input v-model="form_data.title" placeholder="请输入标题"></Input>
	        </FormItem>
	        <FormItem label="文章类别">
	            <Select v-model="form_data.classify_id">
	                <Option v-for="item in classify" :value="item.id" :key="item.id">{{item.name}}</Option>
	            </Select>
	        </FormItem>
	        <FormItem label="内容">
	            <vue-ueditor-wrap class="word_edit" v-model="msg" :config="config"></vue-ueditor-wrap>
	        </FormItem>
	        <FormItem>
	            <Button type="primary" @click="updata">修改</Button>
	            <Button type="primary" style="margin-left: 8px" @click="backArticle">取消</Button>
	        </FormItem>
    	</Form>
    </div>
</template>
<script>
	import VueUeditorWrap from 'vue-ueditor-wrap';
    export default {
    	components: {
    		VueUeditorWrap
		},
    	data () {
            return {
            	loading : true,
            	form_data:{
            		id : '',
            		title : '',
            		classify_id : '',
            		content : '',
                    is_show :''
            	},
            	classify : '',
            	config: {
            		UEDITOR_HOME_URL: './UEditor/',
		            initialFrameWidth : "100%",
					initialFrameHeight : 350,
					maximumWords : 50000
		        },
		        msg:''
            }
        },
        methods:{
        	getContent(){
        		this.$http.post(this.api+'?r=item/article-edit',{id:this.$route.params.id}).then((response)=>{
        			if(response.data.code==200){
        				this.loading = false;
        				this.form_data = response.data.data;
        				this.msg = this.form_data.content;
        			}
        		});
        	},
        	getClassify(){
        		this.$http.post(this.api+'?r=item/get-classify').then((response)=>{
        			if(response.data.code==200){
        				this.classify = response.data.data;
        			}
        		});
        	},
        	updata(){
        		this.form_data.content = this.msg;
        		this.$http.post(this.api+'?r=item/article-updata',this.form_data).then((response)=>{
        			if(response.data.code==200){
                        this.$Message.success('修改成功');
                        this.$router.push({name: 'article'});
        			}
                    else
                        this.$Message.error(response.data.msg);
        		});
        	},
            backArticle(){
                this.$router.push({name: 'article'});
            }
        },
    	mounted:function(){
    		this.getContent();
    		this.getClassify();
    	},
    }
</script>