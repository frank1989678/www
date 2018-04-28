<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input v-model="filters.username" placeholder="登录名"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="filters.name" placeholder="姓名"></el-input>
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
        <el-table :data="list" highlight-current-row border v-loading="listLoading" style="width: 100%;">
            <el-table-column prop="id" label="用户id" width="80px"></el-table-column>
            <el-table-column prop="username" label="登录名"></el-table-column>
            <el-table-column prop="name" label="姓名"></el-table-column>
            <el-table-column prop="status" label="状态" :formatter="formatStaus"></el-table-column>
            <!-- <el-table-column label="状态" width="180px">
                <template slot-scope="scope">
                    <el-switch v-model="scope.row.status" @change="switchStatus(scope.row)"></el-switch>
                </template>
            </el-table-column> -->
            <el-table-column prop="createTime" label="创建时间"></el-table-column>
            <!-- <el-table-column label="操作" width="160px" align="center">
                <template slot-scope="scope">
                    <el-button type="primary" size="small" @click="onOpenForm(scope.row)">修改</el-button>
                    <el-button type="danger" size="small" @click="onDelAdmin(scope.row.id)">删除</el-button>
                </template>
            </el-table-column> -->
        </el-table>

        <!--工具条-->
        <el-col :span="24" class="toolbar page">
            <el-pagination layout="prev, pager, next" @current-change="onChangePage" :page-size="pageSize" :total="total">
            </el-pagination>
        </el-col>

        <!--新增界面-->
        <el-dialog :title="dialogTitle" :visible.sync="addFormVisible" :close-on-click-modal="false" width="30%">
            <el-form ref="addFormData" :model="addFormData" :rules="addFormRules" label-width="80px">
                <el-form-item label="登录名" prop="username">
                    <el-input v-model="addFormData.username" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="addFormData.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="addFormData.password" auto-complete="off"></el-input>
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
                username: '',
                name: '',
                dateUTC: '',
                date: ''
            },
            total: 0,
            pageNum: 1,
            pageSize: 20,
            listLoading: false,
            list: [],

            dialogTitle: '新增',
            addFormVisible: false, //新增界面是否显示
            addFormLoading: false,
            addFormData: {
            	id: '',
                username: '',
                name: '',
                password: ''
            },
            addFormRules: {
                username: [{
                    required: true,
                    message: '请输入登录名',
                    trigger: 'blur'
                }],
                password: {
                    required: true,
                    message: '请输入密码',
                    trigger: 'blur'
                }
            }
        }
    },
    methods: {
        // 修改状态
        switchStatus(row) {
            const para = { id: row.id };
            this.listLoading = true;
            api.saveCategory(para).then(res => {
                this.listLoading = false;
                this.showMsg(res, true);
            });
        },
        // 管理员状态
        formatStaus(row, column) {
            return row.status == 1 ? '启用' : '失效';
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
                username: this.filters.username,
                name: this.filters.name
            };
            this.listLoading = true;
            api.getAdminList(para).then(res => {
                this.listLoading = false;
                this.total = res.data.total || 0;
                this.list = res.data.list || [];
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

