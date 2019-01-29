<template>
    <div>
        <div class="table-top-bar">
            <Button type="primary" to="/article_add">新建文章</Button>
            <Input class="searh_input" search enter-button placeholder="类别/文章模糊搜索" @on-search="list" v-model="search_params.key"/>
            <div class="clear"></div>
        </div>
        <Table border :columns="article" :data="data" :loading="loading" @on-sort-change = "sortChange"></Table>
        <Page :total="pagination.total" show-total show-sizer :current="pagination.current" @on-change="changePage" @on-page-size-change="changePageSize"></Page>
        <Modal v-model="dele_show" width="360">
            <p slot="header" style="color:#f60;text-align:center">
                <Icon type="ios-information-circle"></Icon>
                <span>确认删除？</span>
            </p>
            <div style="text-align:center">
                <p>删除之后不能找回</p>
            </div>
            <div slot="footer">
                <Button type="error" size="large" long :loading="modal_loading" @click="deleteArticle(dele_id)">删除</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
    export default {
        data () {
            return {
                loading: true,
                data: [],
                dele_show :false,
                modal_loading : false,
                dele_id:'',
                show: '',
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
                article: [
                    {
                        title: '文章ID',
                        key: 'id',
                        width : 75
                    },
                    {
                        title: '标题',
                        key: 'title',
                        render: (h, params) => {
                            return h('div', [
                                h('Icon', {
                                    props: {
                                        type: 'person'
                                    }
                                }),
                                h('strong', params.row.title)
                            ]);
                        }
                    },
                    {
                        title: '类别',
                        key: 'classify'
                    },
                    {
                        title: '评论条数',
                        key: 'comment',
                        sortable: 'custom'
                    },
                    {
                        title: '创建时间',
                        key: 'time',
                        sortable: 'custom'
                    },
                    {
                        title: '文章展示',
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
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 150,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small',
                                        to : "/article_edit/"+params.row.id
                                    },
                                    style: {
                                        marginRight: '5px'
                                    }
                                }, '编辑'),
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.dele_show = true;
                                            this.dele_id= params.row.id;
                                        }
                                    }
                                }, '删除')
                            ]);
                        }
                    }
                ],
            }
        },
        methods: {
            list(){
                this.$http.post(this.api+'?r=admin/article/index',this.search_params).then((response)=>{
                    if (response.data.code==200){
                        this.loading    = false;
                        this.data       = response.data.data;
                        this.pagination = response.data.pagination;
                    }
                });
            },
            changePage(page){
                this.pagination.current = page;
                this.search_params.page = page;
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
                this.$http.post(this.api+'?r=admin/article/article-show',{'id':id,'is_show':this.show}).then((response)=>{
                    if (response.data.code==200)
                        this.$Message.success('修改成功');
                    else
                        this.$Message.error('修改失败');
                });
            },
            deleteArticle(id){
                this.modal_loading = true;
                this.$http.post(this.api+'?r=admin/article/delete-article',{'id':id}).then((response)=>{
                    if (response.data.code==200){
                        this.modal_loading = false;
                        this.dele_show = false;
                        this.$Message.success('删除成功');
                        this.list();
                    }
                    else{
                        this.modal_loading = false;
                        this.$Message.error(response.data.msg);
                    }
                });
            }
        },
        mounted:function(){
            this.list();
        },
    }
</script>