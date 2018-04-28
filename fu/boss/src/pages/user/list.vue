<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-form :inline="true" :model="filters" size="small">
                <el-form-item label="用户ID">
                    <el-input v-model="filters.name" placeholder="用户ID"></el-input>
                </el-form-item>
                <el-form-item label="登录时间">
                    <el-date-picker v-model="filters.dateUTC" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="onFormatDate">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onGetUserList">查询</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="list" highlight-current-row border v-loading="listLoading" style="width: 100%;">
            <el-table-column prop="id" label="用户id" width="80px"></el-table-column>
            <el-table-column prop="mobile" label="手机号码"></el-table-column>
            <el-table-column prop="createTime" label="注册时间" width="180px"></el-table-column>
            <el-table-column prop="regIp" label="注册ip"></el-table-column>
            <el-table-column prop="nickname" label="昵称"></el-table-column>
            <el-table-column prop="lastLoginIp" label="最后登录ip"></el-table-column>
            <el-table-column prop="updateTime" label="最后登录时间" width="180px"></el-table-column>
            <el-table-column prop="type" label="是否为陪玩师" align="center" :formatter="formatPlayer"></el-table-column>
            <el-table-column prop="balance" label="消费金额"></el-table-column>
            <el-table-column prop="orderCount" label="下单数"></el-table-column>
            <el-table-column label="操作" width="80px" align="center">
                <template slot-scope="scope">
                    <el-button type="danger" size="mini" @click="lockUser(scope.row, 1)" v-if="scope.row.status=='1'">封禁</el-button>
                    <el-button type="primary" size="mini" @click="lockUser(scope.row, 0)" v-else>解封</el-button>
                    <!-- 0 是封禁 -->
                </template>
            </el-table-column>
        </el-table>
    </section>
</template>

<script>
import * as api from '@/utils/api';

export default {
    data() {
        return {
            filters: {
                name: '',
            	dateUTC: '',
                startTime: '',
                endTime: ''
            },
            total: 0,
            pageNum: 1,
            pageSize: 10,
            listLoading: false,
            list: []
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
        //陪玩师
        formatPlayer(row, column) {
            return row.type == 2 ? '是' : '否';
        },
        //封禁、解封按钮
        lockUser(row, type) {
            const para = { id: row.id }
            this.listLoading = true;
            if (type === 1) {
                api.lockUser(para).then(res => {
                    this.result(res, row);
                })
            } else {
                api.unLockUser(para).then(res => {
                    this.result(res, row);
                })
            }
        },
        result(res, row) {
            this.listLoading = false;
            let typeClass= 'error';
            if (res.status == '200') {
                row.status = row.status == 1 ? 0 : 1;
                typeClass = 'success';
            }
            this.$message({
                message: res.msg,
                type: typeClass
            });
        },
        //获取用户列表
        onGetUserList() {
            let para = {
                pageNum: this.pageNum,
                pageSize: this.pageSize,
                id: this.filters.name,
                startTime: this.filters.startTime,
                endTime: this.filters.endTime
            };
            this.listLoading = true;
            api.getUserList(para).then(res => {
                this.total = res.data.total || 0;
                this.list = res.data.list || [];
                this.listLoading = false;
            }).catch(err => {
                console.log(err)
            })
        }
    },
    mounted() {
        this.onGetUserList();
    }
}
</script>
