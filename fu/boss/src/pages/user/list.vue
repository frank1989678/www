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
                <el-form-item>
                    <el-button type="primary" @click="onOpenForm()">新增</el-button>
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

        <!--工具条-->
        <el-col :span="24" class="toolbar page">
            <el-pagination layout="prev, pager, next" @current-change="onChangePage" :page-size="pageSize" :total="total">
            </el-pagination>
        </el-col>

        <!--新增界面-->
        <el-dialog :title="dialogTitle" :visible.sync="addFormVisible" :close-on-click-modal="false" width="30%">
            <el-form ref="addFormData" :model="addFormData" :rules="addFormRules" label-width="80px">
                <el-form-item label="手机号" prop="mobile">
                    <el-input v-model="addFormData.mobile" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="昵称" prop="name">
                    <el-input v-model="addFormData.nickname" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="性别" prop="gender">
                    <el-radio v-model="addFormData.gender" label="0" checked>不公开</el-radio>
                    <el-radio v-model="addFormData.gender" label="1">男</el-radio>
                    <el-radio v-model="addFormData.gender" label="2">女</el-radio>
                </el-form-item>
                <el-form-item label="年龄" prop="age">
                    <el-input v-model="addFormData.age" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="真实姓名" prop="realname">
                    <el-input v-model="addFormData.realname" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="身份证" prop="idcard">
                    <el-input v-model="addFormData.idcard" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="省" prop="province">
                    <el-input v-model="addFormData.province" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="市" prop="country">
                    <el-input v-model="addFormData.country" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="onFormSubmit" :loading="addFormLoading">提交</el-button>
            </div>
        </el-dialog>
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
            list: [],

            dialogTitle: '新增',
            addFormVisible: false, //新增界面是否显示
            addFormLoading: false,
            addFormData: {
                id: '',
                mobile: '',
                nickname: '',
                gender: '0',
                age: '',
                realname: '',
                idcard: '',
                province: '',
                country: ''
            },
            addFormRules: {
                mobile: [
                    { required: true, message: '请输入手机号' },
                    { pattern: /^1[3-9]\d{9}$/, message: '手机号码格式错误', trigger: 'blur' }
                ]
            }
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
        //新增、编辑表单，id=null时新增，否则为编辑
        onOpenForm(row) {
            this.addFormVisible = true;
            if (row && row.id !== null) {
                this.dialogTitle = '编辑';
                this.addFormData = {
                    id: row.id,
                    username: row.username,
                    name: row.name,
                    password: row.password
                };
            } else {
                this.dialogTitle = '新增';
                this.addFormData = {
                    id: null,
                    username: '',
                    name: '',
                    password: ''
                };
            }
        },
        // 提交表单
        onFormSubmit: function() {
            this.$refs.addFormData.validate((valid) => {
                if (valid) {
                    this.addFormLoading = true;
                    const para = Object.assign({}, this.addFormData);
                    if (this.addFormData.id === null) {
                        api.postAddAdmin(para).then(res => {
                            this.handleResult(res);
                        }).catch(err => {
                            console.log(err);
                        });
                    } else {
                        api.postEditAdmin(para).then(res => {
                            this.handleResult(res);
                        }).catch(err => {
                            console.log(err);
                        });
                    }                   
                }
            });
        },
        // 新增、编辑结果
        handleResult(res) {
            this.addFormLoading = false;
            const { msg, status } = res;
            if (status !== 200) {
                this.$message.error(msg);
            } else {
                this.$message.success(msg);
                this.$refs['addFormData'].resetFields();
                this.addFormVisible = false;
                this.onGetAdminList();
            }
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
