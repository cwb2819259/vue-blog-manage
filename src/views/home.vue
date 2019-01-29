<template>
    <div class="home">
        <ul class="card-list">
            <li class="col-lg-4 col-md-4 col-sm-8 col-xs-16">
                <Card :bordered="false">
                    <p slot="title" class="title-card">博客总访问量</p>
                    <div style="text-align:center">
                        
                        <p class="big_number">{{datainfo.pv}}</p>
                    </div>
                </Card>
            </li>
            <li class="col-lg-4 col-md-4 col-sm-8 col-xs-16">
                <Card :bordered="false">
                    <p slot="title" class="title-card">受欢迎文章</p>
                    <div style="text-align:center">
                        <p v-for="item in datainfo.article" :key="item.index">
                            <router-link to="">
                                <span>{{item.article}}</span><span class="tip">({{item.read}})</span>
                            </router-link>
                        </p>
                    </div>
                </Card>
            </li>
            <li class="col-lg-4 col-md-4 col-sm-8 col-xs-16">
                <Card :bordered="false">
                    <p slot="title" class="title-card">博客用户量</p>
                    <div style="text-align:center">
                        
                        <p class="big_number">{{datainfo.user}}</p>
                    </div>
                </Card>
            </li>
            <li class="col-lg-8 col-md-8 col-sm-8 col-xs-16">
                <Spin size="large" fix v-if="loading"></Spin>
                <div style="text-align:center;background-color: #ffffff; padding:16px 0 16px 16px; position:relative;">
                    <RadioGroup class="radio_tab" v-model="tabValue" type="button" size="small"  @on-change="getPv" style="z-index:1;">
                        <Radio v-for= "item in tab_list" :key="item.id" :label="item.id">{{item.label}}</Radio>
                    </RadioGroup>
                    <div id="myChart" style="height: 400px; width:100%;"></div>
                </div>
            </li>
            <li class="col-lg-4 col-md-4 col-sm-8 col-xs-16">
                <Card :bordered="false" style="height: 432px;">
                    <div slot="title"  class="title-card">
                        <span >用户信息</span>
                        <Poptip trigger="hover" word-wrap placement="top-start" content="接口文档：用于博客前端api请求,方便获取数据" class="title_right">
                            <a href="http://api.cwb763.com" target="_blank">
                                <span>API接入文档</span>
                            </a>
                        </Poptip>
                        
                    </div>
                    
                    <div class="info_content">
                        <p><span class="info_ti">用户名<i></i><i></i></span>: {{info.name}}</p>
                        <p><span class="info_ti eng">APIToken<i></i><i></i></span>: {{info.token}}</p>
                        <p><span class="info_ti">最后登录时间<i></i></span>: {{info.last_login}}</p>
                        
                    </div>
                </Card>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
	data () {
            return {
                loading:true,
                ip : '',
            	info:{
                    name:'',
                    token:'',
                    last_login:''
                },
                datainfo:{
                    pv:'',
                    user:'',
                    article:[]
                },
                pv:{
                    blog_pv:[],
                    api_pv:[],
                    time:[]
                },
                tabValue:0,
                tab_list:[
                    {id:0,label:'按天'},
                    {id:1,label:'按月'},
                ]
            }
        },
    methods: {
        getDataInfo:function(){
            this.$http.post(this.api+'?r=admin/data/index').then((response)=>{
                    if (response.data.code==200){
                        this.datainfo.pv      = response.data.pv;
                        this.datainfo.user    = response.data.user;
                        this.datainfo.article = response.data.article;
                    }
            });
        },
        getPv:function(){
            this.$http.post(this.api+'?r=admin/data/get-pv',{'tiem_type':this.tabValue}).then((response)=>{
                    if (response.data.code==200){
                        this.pv.blog_pv = response.data.blog_pv;
                        this.pv.api_pv  = response.data.api_pv;
                        this.pv.time    = response.data.time;
                        const that = this;
                        setTimeout(function(){
                            that.drawLine();
                        },600)
                        this.loading = false;
                    }
                    this.loading = false;
            });
        },
        getIp:function(){
            this.$http.post(this.api+'?r=admin/data/add-pv',{'ip':this.ip})
            console.log(this.ip);
        },
        drawLine(){
            // 基于准备好的dom，初始化echarts实例
            let myChart = this.$echarts.init(document.getElementById('myChart'));

            myChart.setOption ({
                tooltip : {//提示框组件
                    trigger: 'axis',//坐标轴触发，主要在柱状图，折线图等会使用类目轴的图表中使用。
                    axisPointer: {//坐标轴指示器配置项
                        type: 'none',//阴影指示器
                        label: {//坐标轴指示器的文本标签
                            show: true
                        }
                    }
                },
                toolbox: {//工具栏。内置有导出图片，数据视图，动态类型切换，数据区域缩放，重置五个工具。
                    show : true,//是否显示工具栏组件
                    right: 50,
                    feature : {//各工具配置项。
                        mark : {show: true},
                        // dataView : {show: true, readOnly: false},//数据视图工具，可以展现当前图表所用的数据，编辑后可以动态更新。
                        magicType: {show: true, type: ['line', 'bar']},//动态类型切换,type:包括'line'（切换为折线图）, 'bar'（切换为柱状图）, 'stack'（切换为堆叠模式）, 'tiled'（切换为平铺模式）。
                        restore : {show: true},//配置项还原。
                        saveAsImage : {show: true}//保存为图片。
                    }
                },
                calculable : true,//日历坐标系组件,我们可以在热力图、散点图、关系图中使用日历坐标系。
                legend: {//图例组件。
                    data:[ '博客访问量', '平台访问量'],
                    itemGap: 50,
                    y:'bottom'
                },
                grid: {//直角坐标系内绘图网格
                    top: '12%',
                    left: '1%',
                    right: '10%',
                    containLabel: true
                },
                xAxis: [//直角坐标系 grid 中的 X轴
                    {
                        type : 'category',//'value' 数值轴，适用于连续数据。'category' 类目轴，适用于离散的类目数据，为该类型时必须通过 data 设置类目数据。'time' 时间轴，适用于连续的时序数据，与数值轴相比时间轴带有时间的格式化，在刻度计算上也有所不同，例如会根据跨度的范围来决定使用月，星期，日还是小时范围的刻度。'log' 对数轴。适用于对数数据。
                        data : this.pv.time,
                    }
                ],
                yAxis: [//直角坐标系 grid 中的 y 轴
                    {
                        type : 'value',
                        name : '访问量',
                        axisLabel: {//坐标轴刻度标签的相关设置。
                            formatter: '{value}人'
                        }
                    }
                ],
                dataZoom: [//主要是对 数轴（axis） 进行操作（控制数轴的显示范围，或称窗口（window））。
                    {
                        show: true,
                        start: 1,
                        end: 100,
                        height:15,
                        bottom:30,
                    },
                    {
                        type: 'inside',//内置于坐标系中，使用户可以在坐标系上通过鼠标拖拽、鼠标滚轮、手指滑动（触屏上）来缩放或漫游坐标系。
                        start: 1,
                        end: 100
                    },
                    // {
                    //     show: true,
                    //     yAxisIndex: 0,
                    //     filterMode: 'empty',
                    //     width: 30,
                    //     height: '80%',
                    //     showDataShadow: false,
                    //     left: '93%'
                    // }
                ],
                series : [
                    {
                        name: '博客访问量',
                        type: 'bar',
                        color:'#38bbe6',
                        barMaxWidth:35,
                        data: this.pv.blog_pv
                    },
                    {
                        name: '平台访问量',
                        type: 'bar',
                        color:'#38bb12',
                        barMaxWidth:35,
                        data: this.pv.api_pv
                    }
                ]
            });
        }
    },
    mounted:function(){
        this.ip = returnCitySN["cip"];
        this.info.name       = localStorage.getItem('admin_name');
        this.info.token      = localStorage.getItem('user_token');
        this.info.last_login = localStorage.getItem('last_login');
        this.getDataInfo();
        this.getPv();
        this.getIp();
    },
};
</script>