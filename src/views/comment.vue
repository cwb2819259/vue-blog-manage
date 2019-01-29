<template>
    <div>
        <Table border :columns="comment" :data="data" :loading="loading" @on-sort-change = "sortChange"></Table>
        <Page :total="pagination.total" show-total show-sizer :current="pagination.current" @on-change="changePage" @on-page-size-change="changePageSize"></Page>
    </div>
</template>
<script>
    export default {
        data () {
            return {
                loading: true,
                show : '',
                data: [],
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
                comment: [
                    {
                        title: 'ID',
                        key: 'id',
                        width : 75
                    },
                    {
                        title: '文章名称',
                        key: 'article',
                        render: (h, params) => {
                            return h('div', [
                                h('Icon', {
                                    props: {
                                        type: 'person'
                                    }
                                }),
                                h('strong', params.row.article)
                            ]);
                        }
                    },
                    {
                        title: '评论用户',
                        key: 'user'
                    },
                    {
                        title: '评论内容',
                        key: 'comment'
                    },
                    {
                        title: '评论时间',
                        key: 'com_time',
                        sortable: true,
                    },
                    {
                        title: '评论展示',
                        key: 'is_show',
                        width: 100,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('i-switch', {
                                    props: {
                                        value: params.row.is_show===1
                                    },
                                    on:{
                                        'on-change': (value)=> { 
                                            this.show = value;
                                            this.changeShow(params.row.id);
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
                this.$http.post(this.api+'?r=admin/comment/index',this.search_params).then((response)=>{
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
            changeShow(id){
                this.$http.post(this.api+'?r=admin/comment/comment-show',{'id':id,'is_show':this.show}).then((response)=>{
                    if (response.data.code==200)
                        this.$Message.success('修改成功');
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