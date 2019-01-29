<template>
    <div>
        <Table border :columns="user" :data="data" :loading="loading"></Table>
        <Page :total="pagination.total" show-total show-sizer :current="pagination.current" @on-change="changePage" @on-page-size-change="changePageSize"></Page>
    </div>
</template>
<script>
    export default {
        data () {
            return {
                loading: true,
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
                user: [
                    {
                        title: '用户ID',
                        key: 'id',
                        width : 75
                    },
                    {
                        title: '用户名',
                        key: 'user_name',
                        render: (h, params) => {
                            return h('div', [
                                h('Icon', {
                                    props: {
                                        type: 'person'
                                    }
                                }),
                                h('strong', params.row.user_name)
                            ]);
                        }
                    },
                    {
                        title: '注册邮箱',
                        key: 'email'
                    },
                    {
                        title: '评论次数',
                        key: 'comment'
                    },
                    {
                        title: '注册时间',
                        key: 'time',
                        sortable: true,
                    },
                    {
                        title: '登录限制',
                        key: 'action',
                        width: 150,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('i-switch', {
                                    props: {
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
                this.$http.post(this.api+'?r=item/user',this.search_params).then((response)=>{
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
            changeStatus(id){
                this.$http.post(this.api+'?r=item/change-user-status',{'id':id,'status':this.user_status}).then((response)=>{
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