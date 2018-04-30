<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="fu-filter">
            <el-form :inline="true" :model="filters" size="mini">
                <el-form-item>
                    <el-input v-model="filters.orderId" placeholder="请输入订单号/福禄通行证" style="width:296px;"></el-input>
                </el-form-item>
                <el-form-item label="提交时间">
                    <el-date-picker v-model="filters.dateUTC" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="onFormatDate">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="getList">查询</el-button>
                </el-form-item>
                <div></div>
                <el-form-item label="游戏名称筛选">
                    <el-select v-model="filters.categoryId" @change="getList">
                        <el-option label="全部" value=""></el-option>
                        <el-option
                          v-for="item in gameList"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="渠道筛选" @change="getList">
                    <el-select v-model="filters.source">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="福禄自营" value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="订单状态" @change="getList">
                    <el-select v-model="filters.status">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="交易关闭" value="0"></el-option>
                        <el-option label="陪玩成功" value="1"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="list" highlight-current-row border v-loading="listLoading" style="width: 100%;">
            <el-table-column prop="id" label="ID" width="80px" fixed sortable></el-table-column>
            <el-table-column prop="name" width="200px" align="center" label="订单号"></el-table-column>
            <el-table-column width="140px" align="center" label="福禄通行证">
                <template slot-scope="scope">
                    <el-tooltip placement="right" open-delay="300">
                        <div slot="content">通行证号<br/>用户昵称</div>
                        <label class="fu-tooltip">福禄通行证</label>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column prop="most" width="100px" align="center" label="订单状态" :formatter="formatStatus"></el-table-column>
            <el-table-column prop="most" width="200px" align="center" label="服务类型-技能"></el-table-column>

            <el-table-column width="140px" align="center" label="账号资料">
                <template slot-scope="scope">
                    <el-tooltip placement="right" open-delay="300">
                        <div slot="content">
                            区服、账号、联系电话、陪玩要求
                        </div>
                        <label class="fu-tooltip">账号资料</label>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column prop="most" width="100px" align="center" label="单价"></el-table-column>
            <el-table-column prop="most" width="100px" align="center" label="数量"></el-table-column>

            <el-table-column width="140px" align="center" label="实付金额">
                <template slot-scope="scope">
                    <el-tooltip placement="right" open-delay="300">
                        <div slot="content">
                            售价、优惠券抵扣、积分抵扣、实付、支付方式、费率、到账金额
                        </div>
                        <label class="fu-tooltip">实付金额</label>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column prop="most" width="300px" align="center" label="支付打手金额/平台收入"></el-table-column>
            <el-table-column prop="most" width="300px" align="center" label="下单/支付/验收时间">
                <template slot-scope="scope">
                    <el-tooltip placement="right" open-delay="300">
                        <div slot="content">下单：支付：验收时间</div>
                        <label class="fu-tooltip">打手通行证</label>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column prop="most" width="100px" align="center" label="下单渠道"></el-table-column>
            <el-table-column prop="most" width="150px" align="center" label="总服务时间"></el-table-column>
            <el-table-column prop="most" width="150px" align="center" label="打手通行证">
                <template slot-scope="scope">
                    <el-tooltip placement="right" open-delay="300">
                        <div slot="content">打手通行证号、打手昵称</div>
                        <label class="fu-tooltip">打手通行证</label>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="300px" align="center" fixed="right">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="onRefund(scope.row.id)">退款</el-button>
                    <el-button type="primary" size="mini" @click="onClosed(scope.row.id)">强制完成</el-button>
                    <el-button type="primary" size="mini" @click="onDeal(scope.row.id)">已协商处理</el-button>
                    <!-- 仅在订单申诉中状态：可以使用退款、强制完成、已协商处理3个操作。其他情况下无其他操作同时以上3个操作也为灰置无法点击 -->
                </template>
            </el-table-column>
        </el-table>

        <!--工具条-->
        <el-col :span="24" class="toolbar page">
            <el-pagination layout="prev, pager, next" @current-change="goPage" :page-size="pageSize" :total="total">
            </el-pagination>
        </el-col>
    </section>
</template>

<script>
import * as api from '@/utils/api';

export default {
    data() {
        return {
            filters: {
                orderId: '',
                source: '',
                status: '',
                startTime: '',
                endTime: '',
                categoryId: ''
            },
            total: 0,
            pageNum: 1,
            pageSize: 10,
            listLoading: false,
            list: [],

            gameList: []
        }
    },
    methods: {
        // 格式化日期
        onFormatDate(val) {
            let k = val.split('至');
            if (k.length.length < 2) {
                k = ['','']
            }
            this.filters.startTime = k[0];
            this.filters.endTime = k[1];
        },
        // 订单状态
        formatStatus(row, column) {
            // 待付款、陪玩中、验收中、订单异常（请联系客服处理）、订单异常（已处理）、陪玩成功、交易关闭、已协商处理
            // switch (row.status) {
            //     case '1':

            // }
        },
        // 退款
        onRefund(id) {
        },
        // 强制完成
        onClosed(id) {
        },
        // 协商
        onDeal(id) {
        },
        // 删除行
        delRow(key) {
        	this.$confirm('确认删除吗?', '提示', {
                type: 'warning'
            }).then(() => {
                this.listLoading = true;
                const para = { id: key };
             //    api.delCategory(para).then(res => {
             //        this.listLoading = false;
             //        this.showMsg(res, true);
		           //  if (res.status == 200) {		                
		           //      this.getList();
		           //  }
             //    }).catch(err => {
             //    	console.log(err)
            	// });
            })
        },
        // 查询游戏列表
        getGameList(userId) {
            api.getGameList().then(res => {
                if (res.status == '200') {
                    this.gameList = res.data;
                }
            })
        },
        //获取列表
        getList() {
            let para = {
                pageNum: this.pageNum,
                pageSize: this.pageSize
            };
            para = Object.assign(para, this.filters);
            this.listLoading = true;
            api.getTagList(para).then(res => {
                this.listLoading = false;
                this.showMsg(res, false);
                this.total = res.data.total || 0;
                this.list = res.data.list || [];
            });
        },
        // 页码
        goPage(val) {
            this.pageNum = val;
            this.getList();
        },
        // 操作结果提示, both==false时，不显示成功提示
        showMsg(res, both) {
        	if (res.status == 200) {
				both && this.$message({
                    message: res.msg,
                    type: 'success'
                });
            } else {
                this.$message({
                    message: res.msg,
                    type: 'error'
                });
            }
        }
    },
    mounted() {
        this.getGameList();
        this.getList();
    }
}
</script>
