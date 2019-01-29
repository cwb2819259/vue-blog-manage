<template>
    <div>
        <div class="table-top-bar">
            <Button type="primary" @click="addClassify">添加分类</Button>
        </div>
        <Table border :columns="classify" :data="data" :loading="loading"></Table>
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
            <Button type="error" size="large" long :loading="modal_loading" @click="deleteClassify(dele_id)">删除</Button>
        </div>
    </Modal>
    </div>
</template>
<script>
    export default {
        data () {
            return {
                loading: true,
                dele_show :false,
                modal_loading : false,
                dele_id :'',
                data: [],
                classify_name:'',
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
                classify: [
                    {
                        title: '类别ID',
                        key: 'id',
                        width : 75
                    },
                    {
                        title: '类别',
                        key: 'name'
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
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.updateClassify(params.row.id,params.row.name)
                                        }
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
                this.$http.post(this.api+'?r=admin/classify/index',this.search_params).then((response)=>{
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
            addClassify () {
                this.$Modal.confirm({
                    render: (h) => {
                        return h('Input', {
                            props: {
                                value:this.classify_name,
                                autofocus: true,
                                placeholder: '输入添加分类'
                            },
                            on: {
                                input: (val) => {
                                    this.classify_name = val;
                                }
                            }
                        })
                    },
                    onOk:() => {
                        this.$http.post(this.api+'?r=admin/classify/add-classify',{'name':this.classify_name}).then((response)=>{
                            if (response.data.code==200){
                                this.$Message.success('添加成功');
                                this.list();
                            }
                            else
                                this.$Message.error(response.data.msg);
                        });
                    }
                })
            },
            updateClassify (id,name) {
                this.$Modal.confirm({
                    render: (h) => {
                        return h('Input', {
                            props: {
                                value: name,
                                autofocus: true
                            },
                            on: {
                                input: (val) => {
                                    name = val;
                                }
                            }
                        })
                    },
                    onOk:() => {
                        this.$http.post(this.api+'?r=admin/classify/update-classify',{'id':id,'name':name}).then((response)=>{
                            if (response.data.code==200){
                                this.$Message.success('修改成功');
                                this.list();
                            }
                            else
                                this.$Message.error(response.data.msg);
                        });
                    }
                })
            },
            deleteClassify(id){
                this.modal_loading = true;
                this.$http.post(this.api+'?r=iadmin/classify/delete-classify',{'id':id}).then((response)=>{
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