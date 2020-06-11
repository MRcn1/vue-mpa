<template>
    <div class="codeOut">
        <div class="heard_img">
            <img src="../images/jtf.jpg" alt="">
        </div>

        <div class="explanation">
            <p><span class="title">营业时间</span> <span class="content">周一、三、五，早上10点至下午2点</span></p>
            <p><span class="title">预约时间</span> <span class="content">每周一、三、五零时开放，并更新可预约时段，名额有限，先到先得</span></p>
            <p><span class="title">理发时长</span> <span class="content">每人约40分钟</span></p>
            <p><span class="title">付费标准</span> <span class="content">$20/位（现金支付）</span></p>
            <p>
                <span class="title"><span style="float:left">位</span><span style="float:right">置</span></span>
                <span class="content">集团大厦1楼扶手电梯旁理发室</span>
            </p>
            <p>
                <span class="title"><span style="float:left">帮</span><span style="float:right">助</span></span>
                <span class="content">请咨询集团服务中心戴永康，联系电话：28533998 / 手机号：96314782</span>
            </p>
            <!-- <p>
                <span class="title">注意事项</span>
                <span class="content">
                    <p>1、只提供简单的理发服务，无法冲洗，请提前洗发。</p>
                    <p>2、每位理发完毕后，均会消毒理发工具，并做好其他消毒清洁工作。</p>
                    <p>3、理发师每次上岗前需做健康信息登记、体温检测，并佩戴口罩和消毒双手。</p>
                </span>
            </p> -->
            <div class="prompt">
                <p class="blackColor">注意事项</p>
                <div class="prompt_box">
                    <div><span class="blackColoryuan">1</span></div>
                    <div>只提供简单的理发服务，无法冲洗，请提前洗发。</div>
                </div>
                <div class="prompt_box">
                    <div><span class="blackColoryuan">2</span></div>
                    <div>每位理发完毕后，均会消毒理发工具，并做好其他消毒清洁工作。</div>
                </div>
                <div class="prompt_box">
                    <div><span class="blackColoryuan">3</span></div>
                    <div>理发师每次上岗前需做健康信息登记、体温检测，并佩戴口罩和消毒双手。</div>
                </div>
                <div class="prompt_box">
                    <div><span class="blackColoryuan">4</span></div>
                    <div>健康承诺：本人近14天内没有离开香港到过疫情发生地区，没有去过酒吧、健身房等人群密集的密闭场所，也没有参加过聚集性活动。本人身体健康，体温正常，没有咳嗽等不适情况。</div>
                </div>
            </div>

            <div class="btn" @click="toDomake">
                马上预约
            </div>
        </div>

        <div class="myths">
            <span class="myths_i">我的预约</span>
        </div>

        <div>
            <div class="listBox">
                <div class="list" @click="toAppDetails(item)" v-for="(item,index) in pageData" :key="index">
                    <div class="lanceImg">
                        <img :src="item.headPic" alt="" width="50" :onerror='errorImg01'>
                    </div>
                    <div class="list_left">
                        <p class="list_left_name">{{item.personName}}</p>
                        <p class="list_left_small">性别：{{item.gender==0?'女':'男'}}</p>
                        <p class="list_left_small">预约时间：{{item.effectiveDate+'（'+getWeek(item.effectiveDate)+'）'+item.beginTime+'-'+item.endTime}}</p>
                    </div>
                    <span class="status">
                        <img v-if="item.status==0" src="../images/yycg.png" alt="" height="20">
                        <img v-if="item.status==2" src="../images/ywc.png" alt="" height="20">
                        <img v-if="item.status==4" src="../images/dsh.png" alt="" height="20">
                        <img v-if="item.status==5" src="../images/sy.png" alt="" height="20">
                        <img v-if="item.status==1 || item.status==3" src="../images/yqx.png" alt="" height="20">
                    </span>
                </div>
            </div>
        </div>

        <load-more :loading="loadMore.loading" :currPage="loadMore.currPage" :maxPage="loadMore.maxPage" @loadMoreClick="loadMoreList" v-if="pageData.length!=0">
            <span v-show="hasMoreBottom">已经到底了</span>
        </load-more>
        <p class='noevening' v-if="pageData.length==0">暂无数据</p>

    </div>
</template>

<script>
    export default {
        data() {
            return {
                errorImg01: 'this.src="' + require('../images/defhar.png') + '"',
                pageData: [],
                loadMore: { // 加载更多
                    //下拉加载更多配置
                    loading: false,
                    currPage: 1,
                    maxPage: 1
                },
                isManager: false
            }
        },
        components: {
            
        },
        computed: {
            hasMoreBottom() {
                return this.loadMore.currPage < this.loadMore.maxPage ? false : true
            }
        },
        created() {
            window.addEventListener('scroll', this.loadMoreList)
        },
        beforeDestroy() {
            window.removeEventListener('scroll', this.loadMoreList)
        },
        methods: {
            checkManager() {
                checkManager({}, res => {
                    this.isManager = res.isManager
                })
            },
            searchSelfReservation() {
                searchSelfReservation({
                    page: this.loadMore.currPage,
                    pageSize: 20,
                }, res => {
                    this.loadMore.maxPage = res.maxPage
                    this.pageData = this.pageData.concat(res.pageData)
                })
            },
            toDomake() {
                this.$router.push({ path: '/domake', query: { type: 1 } })
            },
            toAppDetails(item) {
                let type = -1
                if (this.isManager && (item.status == 0 || item.status == 4)) {
                    type = 2
                } else if (item.status == 0) {
                    type = 1
                } else if (item.status == 2) {
                    type = 0
                }
                this.$router.push({ path: '/appDetails', query: { id: item.id, type: type } })
            },
            loadMoreList() { //加载更多
                let scrollTop =
                    document.documentElement.scrollTop ||
                    window.pageYOffset ||
                    document.body.scrollTop
                if (this.scrollLock || scrollTop == 0) {
                    return
                }
                if (scrollTop + window.innerHeight >= document.body.scrollHeight) {
                    if (this.loadMore.maxPage > this.loadMore.currPage) {
                        this.loadMore.currPage++
                        this.searchSelfReservation()
                    }
                }
            },
            getWeek(n) {
                var array = new Array();
                var date = n; //日期为输入日期，格式为 2016-8-10
                array = date.split('-');
                var ndate = new Date(array[0], parseInt(array[1] - 1), array[2]);
                var weekArray = new Array("周日", "周一", "周二", "周三", "周四", "周五", "周六");
                var weekDay = weekArray[ndate.getDay()];
                return weekDay
            },
        },
    }
</script>

<style scoped lang='less'>
    .codeOut {
        padding-bottom: 60px;

        .heard_img {
            height: 190px;

            img {
                width: 100%;
                height: 190px;
                object-fit: cover;
            }
        }

        .explanation {
            padding: 15px;
            background-color: #fff;
            color: #000;
            font-size: 15px;

            .title-box,
            p {
                line-height: 25px;
                display: flex;
            }

            .title {
                display: inline-block;
                white-space: nowrap;
                // text-align: justify;
                // text-align-last: justify;
                // text-justify: inter-ideograph ;//ie上'帮助'，'定位' 对不齐
                // text-justify: distribute-all-lines; 
                width: 60px;
                color: #666666;
                font-size: 15px;
                margin-right: 20px;
            }

            .content {
                display: inline-block;
                width: 250px;
            }
        }

        .btn {
            width: 100%;
            height: 45px;
            margin: 0 auto;
            font-size: 16px;
            line-height: 45px;
            color: #fff;
            border-radius: 4px;
            text-align: center;
            background-color: #427ADB;
            margin-top: 15px;

        }

        .myths {
            margin-top: 15px;
            padding-left: 15px;

            .myths_i {
                color: #0A1735;
                font-weight: bold;
                font-size: 16px;
            }
        }

        .listBox {
            padding: 10px 0;

            .list {
                width: 92%;
                box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.07);
                background-color: #fff;
                display: flex;
                margin: 0 auto;
                margin-bottom: 10px;
                border-radius: 4px;
                position: relative;

                .lanceImg {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 0 10px;

                    img {
                        width: 50px;
                        height: 50px;
                        border-radius: 50%;
                        object-fit: cover;
                    }
                }

                .list_left {
                    width: 90vw;
                    padding: 10px;

                    .list_left_name {
                        font-size: 16px;
                        color: #000000;
                        line-height: 29px;
                    }

                    .list_left_small {
                        color: #666666;
                        font-size: 12px;
                        line-height: 20px;
                    }
                }

                .status {
                    position: absolute;
                    top: 20px;
                    right: 0;
                }


                .list_right {
                    width: 10vw;
                    display: flex;
                    justify-content: space-around;
                    align-items: center;
                }
            }
        }

        .prompt {
            font-size: 13px;

            .blackColor {
                color: #13182C;
                font-weight: bold;
            }

            .prompt_box {
                display: flex;
                margin-top: 2px;
                color: #808080;

                .blackColoryuan {
                    display: inline-block;
                    width: 15px;
                    height: 15px;
                    background-color: #13182C;
                    color: #fff;
                    border-radius: 50%;
                    text-align: center;
                    line-height: 15px;
                    margin-right: 5px;
                }

                .prompt_box {
                    margin-bottom: 10px;
                }
            }

        }

        .noevening {
            font-size: 14px;
            color: #999;
            line-height: 44px;
            text-align: center;
        }

    }
</style>