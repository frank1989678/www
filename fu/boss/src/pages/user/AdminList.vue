<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input v-model="filters.name" placeholder="登录名"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-date-picker v-model="filters.dateUTC" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="onFormatDate">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onGetAdminList">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onOpenForm()">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="users" highlight-current-row border v-loading="listLoading" style="width: 100%;">
            <el-table-column prop="id" label="用户id" width="80px"></el-table-column>
            <el-table-column prop="username" label="登录名"></el-table-column>
            <el-table-column prop="mobile" label="手机号码"></el-table-column>
            <el-table-column prop="cname" label="姓名"></el-table-column>
            <el-table-column prop="regTime" label="注册时间" width="180px" sortable></el-table-column>
            <el-table-column prop="regIp" label="注册ip"></el-table-column>
            <el-table-column prop="lastLoginTime" label="最后登录时间" width="180px" sortable></el-table-column>
            <el-table-column prop="lastLoginIp" label="最后登录ip"></el-table-column>
            <el-table-column label="操作" width="160px" align="center">
                <template slot-scope="scope">
                    <el-button type="primary" size="small" @click="onOpenForm(scope.row)">修改</el-button>
                    <el-button type="danger" size="small" @click="onDelAdmin(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!--工具条-->
        <el-col :span="24" class="toolbar page">
            <el-pagination layout="prev, pager, next" @current-change="onChangePage" :page-size="pageSize" :total="total">
            </el-pagination>
        </el-col>

        <!--新增界面-->
        <el-dialog :title="dialogTitle" v-model="addFormVisible" :close-on-click-modal="false">
            <el-form ref="addFormData" :model="addFormData" :rules="addFormRules" label-width="80px">
                <el-form-item label="登录名" prop="username">
                    <el-input v-model="addFormData.username" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="姓名" prop="cname">
                    <el-input v-model="addFormData.cname" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                    <el-input v-model="addFormData.mobile" auto-complete="off"></el-input>
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
            pageNum: 1,
            pageSize: 1,
            listLoading: false,
            users: [],

            dialogTitle: '新增',
            addFormVisible: false, //新增界面是否显示
            addFormLoading: false,
            addFormData: {
            	id: '',
                username: '',
                cname: '',
                mobile: ''
            },
            addFormRules: {
                username: [{
                    required: true,
                    message: '请输入登录名',
                    trigger: 'blur'
                }],
                cname: {
                    required: true,
                    message: '请输入姓名',
                    trigger: 'blur'
                }
            }
        }
    },
    methods: {
    	// 格式化日期
        onFormatDate(val) {
        	this.filters.date = val.split('至');
        },
        //新增、编辑表单，id=null时新增，否则为编辑
        onOpenForm(row) {
        	if (row && row.id !== null) {
	        	this.dialogTitle = '编辑';
	        	this.addFormVisible = true;
	            this.addFormData = {
	            	id: row.id,
	                username: row.username,
	                cname: row.cname,
	                mobile: row.mobile
	            };
        	} else {
	        	this.dialogTitle = '新增';
	            this.addFormVisible = true;
	            this.addFormData = {
	            	id: null,
	                username: '',
	                cname: '',
	                mobile: ''
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
                this.$message({
                    message: msg,
                    type: 'error'
                });
            } else {
                this.$message({
                    message: msg,
                    type: 'success'
                });
                this.$refs['addFormData'].resetFields();
                this.addFormVisible = false;
                this.onGetAdminList();
            }
        },
        // 删除管理员
        onDelAdmin(key) {
			this.$confirm('确认删除该管理员吗?', '提示', {
                type: 'warning'
            }).then(() => {
                this.listLoading = true;
                const para = { id: key };
                api.postDelAdmin(para).then(res => {
                    this.listLoading = false;
                	const { msg, status } = res;
		            if (status !== 200) {
		                this.$message({
		                    message: msg,
		                    type: 'error'
		                });
		            } else {
		                this.$message({
		                    message: msg,
		                    type: 'success'
		                });
		                this.onGetAdminList();
		            }
                }).catch(err => {
                	console.log(err)
            	});
            })
        },
        //获取用户列表
        onGetAdminList() {
            const para = {
                pageNum: this.pageNum,
                pageSize: this.pageSize,
                name: this.filters.name,
                date: this.filters.date
            };
            this.listLoading = true;
            api.getAdminList(para).then(res => {
                this.listLoading = false;
                this.total = res.total || 0;
                this.users = res.users || [];
            });
        },
        // 页码
        onChangePage(val) {
            this.pageNum = val;
            this.onGetAdminList();
        }
    },
    mounted() {
        this.onGetAdminList();
    }
}
</script>

