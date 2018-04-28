<template>
    <section>

        <!--列表-->
        <el-table :data="list" highlight-current-row border v-loading="listLoading" style="width: 100%;">
            <el-table-column prop="id" label="申请id" width="100px" fixed></el-table-column>
            <el-table-column prop="name" label="申请时间" width="200px" align="center" ></el-table-column>
            <el-table-column prop="name" label="申请用户id" width="200px" align="center" ></el-table-column>
            <el-table-column prop="name" label="申请用户昵称" width="200px" align="center" ></el-table-column>
            <el-table-column prop="name" label="申请用户联系方式" width="200px" align="center" ></el-table-column>
            <el-table-column prop="name" label="申请金额" width="200px" align="center" ></el-table-column>
            <el-table-column prop="name" label="支付宝账号" width="200px" align="center" ></el-table-column>
            <el-table-column prop="name" label="支付宝姓名" width="200px" align="center" ></el-table-column>
            <el-table-column prop="name" label="备注" width="200px" align="center" ></el-table-column>
            <el-table-column prop="name" label="状态" width="200px" align="center" ></el-table-column>
            <el-table-column label="操作" width="80px" align="center" fixed="right">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" v-if="scope.row.status === 1">已打款</el-button>
                    <el-button type="primary" size="mini" v-else @click="onOpenRemit(scope.row.id)">打款</el-button>
                </template>
            </el-table-column>
            <el-table-column prop="name" label="操作人" width="200px" align="center" fixed="right"></el-table-column>
        </el-table>

        <!--工具条-->
        <el-col :span="24" class="toolbar page">
            <el-pagination layout="prev, pager, next" @current-change="goPage" :page-size="pageSize" :total="total">
            </el-pagination>
        </el-col>

        <!--打款-->
        <el-dialog title="打款备注" :visible.sync="dialogVisible" :close-on-click-modal="false" width="30%">
            <el-form ref="addFormData" :model="addFormData" :rules="addFormRules" label-width="80px">
                <el-form-item label="打款说明" prop="intro">
                    <el-input v-model="addFormData.intro" type="textarea" rows="5" auto-complete="off" resize="none"></el-input>
                    <span>请将打款记录和时间点填在说明里面，方便后续查找对账</span>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click.native="onRemitSubmit" :loading="listLoading">提交</el-button>
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

            gameList: [],

            dialogVisible: false,
            addFormData: {
                id: '',
                intro: ''
            },
            addFormRules: {
                intro: [{
                    required: true,
                    message: '请输入打款说明',
                    trigger: 'blur'
                }]
            }
        }
    },
    methods: {
        // 提交打款
        onRemitSubmit(id) {
            this.$refs.addFormData.validate((valid) => {
                if (valid) {
                    this.listLoading = true;
                    const para = Object.assign({}, this.addFormData);
                    api.postEditAdmin(para).then(res => {
                        this.listLoading = false;
                        lib.ajaxResult(res);
                        if (res.status == '200') {
                            this.dialogVisible = false;
                        }
                    }).catch(err => {
                        console.log(err);
                    });
                }
            });
        },
        // 打款dialog
        onOpenRemit(id) {
            this.dialogVisible = true;
            this.addFormData.id = id;
        },
        //获取列表
        getList() {
            let para = {
                pageNum: this.pageNum,
                pageSize: this.pageSize
            };
            para = Object.assign(para, this.filters);
            this.listLoading = true;
            api.getWalletList(para).then(res => {
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
        this.getList();
    }
}
</script>
