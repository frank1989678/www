<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-form :model="filters">
                <el-form-item>
					<el-button type="primary" size="mini" @click="addRow(0)">添加标签</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="list" highlight-current-row border v-loading="listLoading" style="width: 100%;">
            <el-table-column prop="id" label="ID" width="80px"></el-table-column>
            <el-table-column prop="name" label="标签组名"></el-table-column>
            <el-table-column prop="most" label="最多勾选"></el-table-column>
            <el-table-column label="操作" width="160px" align="center">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="addRow(scope.row.id)">修改</el-button>
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
            filters: {},
            total: 0,
            pageNum: 1,
            pageSize: 10,
            listLoading: false,
            list: []
        }
    },
    methods: {
        // 添加行
        addRow(id) {
        	this.$router.push({ path: '/tag/list/add', query: {id: id} });
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
        //获取列表
        getList() {
            const para = {
                pageNum: this.pageNum,
                pageSize: this.pageSize,
                status: this.filters.status
            };
            this.listLoading = true;
            api.getTagList(para).then(res => {
                this.listLoading = false;
                this.showMsg(res, false);
                if (res.status == 200) {
	                this.total = res.data.total || 0;
	                this.list = res.data.list || [];
                } else {
                	this.total = 0;
                	this.list = [];
                }
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
