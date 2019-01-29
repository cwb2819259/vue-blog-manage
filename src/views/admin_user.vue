<template>
    <div>
        <div class="table-top-bar">
            <Button type="primary" @click="create_user = true">新建管理员</Button>
            <Modal
                title="创建管理员"
                v-model="create_user"
                :mask-closable="false">
                 <p slot="header" style="color:#2d8cf0;text-align:center;font-size: 18px">
                    <span>创建管理员</span>
                </p>
                <div style="margin-left:20px;">
                    <Form ref="formValidate" :model="create_admin" :rules="platRule" :label-width="80">
                        <FormItem label="用户名" prop="name">
                            <Input v-model="create_admin.name" placeholder="Enter your name" clearable style="width:330px"></Input>
                        </FormItem>
                        <FormItem label="邮箱" prop="email">
                            <Input v-model="create_admin.email" placeholder="Enter your e-mail" type="email" clearable style="width:330px"></Input>
                        </FormItem>
                        <FormItem label="密码" prop="password">
                            <Input v-model="create_admin.password" placeholder="Enter your password" type="password" clearable style="width:330px"></Input>
                        </FormItem>
                        <FormItem label="确认密码" prop="re_password">
                            <Input v-model="create_admin.re_password" placeholder="Enter your password" type="password" clearable style="width:330px"></Input>
                        </FormItem>
                    </Form>
                </div>
                <div slot="footer">
                    <Button  @click="create_user = false">取消</Button>
                    <Button type="primary"  @click="adminCreate('formValidate')">确定</Button>
                </div>
            </Modal>
            <Input class="searh_input" search enter-button placeholder="管理员模糊搜索" @on-search="list" v-model="search_params.key"/>
            <div class="clear"></div>
        </div>
        <Table border :columns="admin_user" :data="data" :loading="loading" @on-sort-change = "sortChange"></Table>
        <Page :total="pagination.total" show-total show-sizer :current="pagination.current" @on-change="changePage" @on-page-size-change="changePageSize"></Page>
    </div>
</template>
<script>
    export default {
        data () {
            const validatePassCheck = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('密码不能为空'));
                } else if (value !== this.create_admin.password) {
                    callback(new Error('两次密码必须相同'));
                } else {
                    callback();
                }
            };
            const validateUserName = (rule, value, callback) => {
                let UserName = /^[a-zA-Z0-9_-]{3,16}$/;
                if (value === '') {
                    callback(new Error('用户名不能为空'));
                } else if (!UserName.test(value)) {
                    callback(new Error('格式错误'));
                } else{
                    callback();
                }
            };
            return {
                loading: true,
                create_user:false,
                data: [],
                user_status:'',
                search_params: {
                    page: 1,
                    page_size: 10,
                    key:'',
                    order:'',
                },
                pagination:{
                    current:1,
                    total:0,
                },
                create_admin:{
                    name:'',
                    password:'',
                    re_password:'',
                    email:'',
                },
                platRule:{
                    name:[
                        {required:true, message:'用户名不能为空',trigger:'blur'},
                        {validator: validateUserName,etrigger:'blur'}
                    ],
                    email:[
                        {required:true, message:'邮箱不能为空',trigger:'blur'},
                        {type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
                    ],
                    password:[
                        {required:true, message:'密码不能为空',trigger:'blur'}
                    ],
                    re_password:[
                    {required:true, message:'密码不能为空',trigger:'blur'},
                        {validator: validatePassCheck,etrigger:'blur'} 
                    ]
                },
                admin_user: [
                    {
                        title: '管理员ID',
                        key: 'id',
                        width : 120,
                        sortable: 'custom'
                    },
                    {
                        title: '管理员名称',
                        key: 'name',
                        render: (h, params) => {
                            return h('div', [
                                h('Icon', {
                                    props: {
                                        type: 'person'
                                    }
                                }),
                                h('strong', params.row.name)
                            ]);
                        }
                    },
                    {
                        title: '接入码',
                        key: 'user_token'
                    },
                    {
                        title: '创建时间',
                        key: 'create_time',
                        sortable: 'custom'
                    },
                    {
                        title: '接入限制',
                        key: 'action',
                        width: 150,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('i-switch', {
                                    props: {
                                        disabled:params.row.name=='root',
                                        value: params.row.status===1
                                    },
                                    on:{
                                        'on-change': (value)=> { 
                                            this.user_status = value;
                                            this.changeStatus(params.row.id);
                                        }
                                    }
                                })
                            ]);
                        }
                    }
                ],
            }
        },
        methods: {
            list(){
                this.$http.post(this.api+'?r=admin/maneger/index',this.search_params).then((response)=>{
                    if (response.data.code==200){
                        this.loading = false;
                        this.data    = response.data.data;
                        this.pagination = response.data.pagination;
                    }
                });
            },
            changePage(page){
                this.pagination.current = page;
                this.search_params.page =page;
                this.list();
            },
            changePageSize(size){
                this.search_params.page_size = size;
                this.changePage(1);
            },
            sortChange(column){
                if (column.order == 'normal')return;
                let order = column.key+' '+column.order;
                this.search_params.order = order;
                this.list();
            },
            adminCreate(formValidate){
                console.log(formValidate);
                this.$refs[formValidate].validate((valid)=>{
                    if(valid){
                        this.$http.post(this.api+'?r=admin/maneger/admin-create',this.create_admin).then((response)=>{
                            if (response.data.code==200){
                                this.$Message.success('创建成功');
                                this.$refs[formValidate].resetFields();
                                this.create_user           = false;
                                this.list();
                            }
                            else
                                this.$Message.error(response.data.msg);
                        });
                    }
                }) 
            },
            changeStatus(id){
                this.$http.post(this.api+'?r=admin/maneger/admin-status',{'id':id,'status':this.user_status}).then((response)=>{
                    if (response.data.code==200)
                        if(this.user_status==0)
                            this.$Message.success('恢复登陆成功');
                        else
                            this.$Message.success('禁止登陆成功');
                    else
                        this.$Message.error('修改失败');
                });
            }
        },
        mounted:function(){
            this.list();
        },
    }
</script>