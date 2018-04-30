<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="fu-filter">
            <el-form :inline="true" :model="filters" size="mini">
                <el-form-item>
                    <el-button type="primary" @click="onOpenRemit()">加零钱</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="list" highlight-current-row border v-loading="listLoading" style="width: 100%;">
            <el-table-column prop="id" label="被加款用户id"></el-table-column>
            <el-table-column prop="name" label="用户联系方式" align="center" ></el-table-column>
            <el-table-column prop="name" label="用户昵称" align="center" ></el-table-column>
            <el-table-column prop="name" label="加款金额" align="center" ></el-table-column>
            <el-table-column prop="name" label="操作人" align="center" ></el-table-column>
            <el-table-column prop="name" label="操作时间" align="center" ></el-table-column>
            <el-table-column prop="name" label="备注" align="center" ></el-table-column>
            <el-table-column prop="name" label="状态" align="center" ></el-table-column>
        </el-table>

        <!--工具条-->
        <el-col :span="24" class="toolbar page">
            <el-pagination layout="prev, pager, next" @current-change="goPage" :page-size="pageSize" :total="total">
            </el-pagination>
        </el-col>

        <!--打款-->
        <el-dialog title="打款备注" :visible.sync="dialogVisible" :close-on-click-modal="false" width="30%">
            <el-form ref="addFormData" :model="addFormData" :rules="addFormRules" label-width="80px">
                <el-form-item label="手机号" prop="mobile">
                    <el-input v-model="addFormData.mobile" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="加款金额" prop="money">
                    <el-input v-model.number="addFormData.money" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="打款说明" prop="intro">
                    <el-input v-model="addFormData.intro" type="textarea" rows="5" auto-complete="off" resize="none"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click.native="onRemitSubmit" :loading="addFormLoading">提交</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
import * as api from '@/utils/api';
import * as lib from '@/utils/lib';

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

            addFormLoading: false,
            dialogVisible: false,
            addFormData: {
                mobile: '',
                money: '',
                intro: ''
            },
            addFormRules: {
            	mobile: [
				    { required: true, message: '请输入手机号', trigger: 'blur' },
				    { pattern: /^1[3-9]\d{9}$/, message: '手机号码格式错误', trigger: 'blur' }
    			],
    			money: [
                    { required: true, message: '请输入金额', trigger: 'blur' },
                    { type: 'number', message: '必须为数字', trigger: 'blur' }
    			],
    			intro: [
                    { required: true, message: '请输入打款说明', trigger: 'blur' }
    			]
            }
        }
    },
    methods: {
        // 打款dialog
        onOpenRemit(id) {
            this.dialogVisible = true;
            this.addFormData.id = id;
        },
        // 提交打款
        onRemitSubmit(id) {
            this.$refs.addFormData.validate((valid) => {
                if (valid) {
                    this.addFormLoading = true;
                    const para = Object.assign({}, this.addFormData);
                    api.postEditAdmin(para).then(res => {
                        this.addFormLoading = false;
                        lib.ajaxResult(res);
                        if (res.status == '200') {
                        	this.getList();
                            this.dialogVisible = false;
                        }
                    }).catch(err => {
                        console.log(err);
                    });
                }
            });
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
                this.total = res.data.total || 0;
                this.list = res.data.list || [];
                lib.ajaxResult(res);
            });
        },
        // 页码
        goPage(val) {
            this.pageNum = val;
            this.getList();
        }
    },
    mounted() {
        this.getList();
    }
}
</script>
