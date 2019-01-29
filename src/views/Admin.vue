<template>
    <div class="layout">
        <Layout>
            <i-header theme="light">
                    <router-link to="/">
                        <img :src="logo" style="width:110px;margin-left: 20px;">
                    </router-link>
                <Dropdown>
                    <Icon type="ios-contact" />
                    {{admin_name}}
                    <DropdownMenu slot="list">
                        <DropdownItem @click.native='logoff'>退出</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
                
            </i-header>
            <Layout>
                <Sider hide-trigger>
                   <Row>
                        <Col span="80">
                            <Menu width="200px" theme="dark" :active-name="linkActive" accordion :open-names="openName" router @on-select="searchOpenName">
                                <router-link to="/">
                                    <MenuItem name="/">
                                        <Icon type="ios-home-outline" />
                                        首&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;页
                                    </MenuItem>
                                </router-link>
                                <Submenu name="sub1">
                                    <template slot="title">
                                        <Icon type="ios-paper" />
                                        内容管理
                                    </template>
                                        <MenuItem name="article" to="/article">文章管理</MenuItem>
                                        <MenuItem name="classify" to="/classify">类别管理</MenuItem>
                                        <MenuItem name="comment" to="/comment">评论管理</MenuItem>
                                </Submenu>
                                <Submenu name="sub2">
                                    <template slot="title">
                                        <Icon type="ios-people" />
                                        用户管理
                                    </template>
                                        <MenuItem name="user" to="/user">账号管理</MenuItem>
                                        <MenuItem name="admin_user" to="/admin_user" v-if="this.admin_name=='root'">后台账号管理</MenuItem>
                                </Submenu>
                            </Menu>
                        </Col>
                    </Row>
                </Sider>
                <Content id="main-content" :style="{height:main_height}">
                    <Breadcrumb class="bread-crumb">
                        <BreadcrumbItem to="/">首页</BreadcrumbItem>
                        <BreadcrumbItem v-if="$route.path != '/'">{{bread_sub}}</BreadcrumbItem>
                    </Breadcrumb>
                    <router-view />
                </Content>
            </Layout>
            <!-- <Footer>Footer</Footer> -->
        </Layout>
    </div>
</template>

<script>
export default {
    data(){
        return{
            logo:require('../assets/logo.png'),
            main_height:(window.innerHeight-50)+'px',
            bread_sub:'',
            openName:[],
            linkActive:'',
            admin_name:'',
        }
    },
    methods:{
         searchOpenName:function(path){
            switch(path){
                case '/':
                    this.linkActive = '/';
                    this.bread_sub="首页";
                    this.openName = [];
                    break;
                case 'article_add':
                    this.linkActive = 'article_add';
                    this.bread_sub="文章添加";
                    this.openName.push('sub1');
                    break;
                case 'article_edit':
                    this.linkActive = 'article_edit';
                    this.bread_sub="文章编辑";
                    this.openName.push('sub1');
                    break;
                case 'article':
                    this.linkActive = 'article';
                    this.bread_sub="文章管理";
                    this.openName.push('sub1');
                    break;
                case 'classify':
                    this.linkActive = 'classify';
                    this.bread_sub="类别管理";
                    this.openName.push('sub1');
                    break;
                case 'comment':
                    this.linkActive = 'comment';
                    this.bread_sub="评论管理";
                    this.openName.push('sub1');
                    break;
                case 'user':
                    this.linkActive = 'user';
                    this.openName.push('sub2');
                    this.bread_sub="账号管理";
                    break;
                case 'admin_user':
                    this.linkActive = 'admin_user';
                    this.openName.push('sub2');
                    this.bread_sub="后台账号管理";
                    break;
                default:
                    break;
            }
        },
        logoff:function(){
            this.$http.post(this.api+'?r=admin/auth/log-off').then((response)=>{
                if (response.data.code==200){
                    localStorage.removeItem('Back_Blogger');
                    this.$router.push({name:'login'});
                }else{
                    this.$Message.error('服务器错误，退出失败');
                }
            });
        }
    },
    mounted(){
        const that = this;
        window.onresize = function temp(){
            that.main_height = (window.innerHeight-50)+'px';
        }
        this.admin_name = localStorage.getItem('admin_name');
    },
    watch:{
        '$route'(to,from){
            this.searchOpenName(to.name);
        },
    },
    created(){
        this.searchOpenName(this.$route.name);
    }
};
</script>
