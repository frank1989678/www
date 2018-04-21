<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input v-model="filters.name" placeholder="用户ID"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-date-picker v-model="filters.dateUTC" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="onFormatDate">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onGetUserList">查询</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="users" highlight-current-row border v-loading="listLoading" style="width: 100%;">
            <el-table-column prop="id" label="用户id" width="80px"></el-table-column>
            <el-table-column prop="mobile" label="手机号码"></el-table-column>
            <el-table-column prop="regTime" label="注册时间" width="180px" sortable></el-table-column>
            <el-table-column prop="regIp" label="注册ip"></el-table-column>
            <el-table-column prop="nickName" label="昵称"></el-table-column>
            <el-table-column prop="lastLoginIp" label="最后登录ip"></el-table-column>
            <el-table-column prop="lastLoginTime" label="最后登录时间" width="180px" sortable></el-table-column>
            <el-table-column prop="isPlayer" label="是否为陪玩师" align="center" :formatter="formatPlayer" sortable></el-table-column>
            <el-table-column prop="cost" label="消费金额" sortable></el-table-column>
            <el-table-column prop="orderCount" label="下单数" sortable></el-table-column>
            <el-table-column label="操作" width="80px" align="center">
                <template slot-scope="scope">
                    <el-button type="danger" size="small" @click="onEditUser(scope.row)" v-if="scope.row.enabled=='1'">封禁</el-button>
                    <el-button type="primary" size="small" @click="onEditUser(scope.row)" v-if="scope.row.enabled=='0'">解封</el-button>
                </template>
            </el-table-column>
        </el-table>
    </section>
</template>

<script>
import * as api from '@/api/api';

export default {
    data() {
        return {
            filters: {
                name: '',
            	dateUTC: '',
                date: ''
            },
            total: 0,
            page: 1,
            listLoading: false,
            users: []
        }
    },
    methods: {
    	// 格式化日期
        onFormatDate(val) {
        	this.filters.date = val.split('至');
        },
        //陪玩师
        formatPlayer(row, column) {
            return row.isPlayer == 1 ? '是' : '否';
        },
        //封禁、解封按钮
        onEditUser(row) {
            const para = { id: row.id }
            this.listLoading = true;
            api.postEditUser(para).then(res => {
	            this.listLoading = false;
	            let typeClass= 'error';
	            if (res.code == '200') {
	            	row.enabled = row.enabled == 1 ? 0 : 1;
	            	typeClass = 'success';
	            }
	            this.$message({
	                message: res.msg,
	                type: typeClass
	            });
            });
        },
        //获取用户列表
        onGetUserList() {
            const para = {
                page: this.page,
                name: this.filters.name,
                date: this.filters.date
            };
            this.listLoading = true;
            api.getUserList(para).then(res => {
                this.total = res.total || 0;
                this.users = res.users || [];
                this.listLoading = false;
            });
        }
    },
    mounted() {
        this.onGetUserList();
    }
}
</script>
