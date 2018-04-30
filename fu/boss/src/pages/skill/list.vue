<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="fu-filter">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-button type="primary" size="mini" @click="addRow(0)">新增技能认证记录</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="list" highlight-current-row border v-loading="listLoading" style="width: 100%;">
            <el-table-column prop="id" label="技能id" width="80px"></el-table-column>
            <el-table-column prop="mobile" label="手机号" align="center"></el-table-column>
            <el-table-column prop="categoryName" label="技能类型" align="center"></el-table-column>
            <el-table-column label="认证截图" align="center">
                <template slot-scope="scope">
                    <img v-if="scope.row.gradePicUrl" :src="scope.row.gradePicUrl" width="50px" height="30px" @click="handlePreview(scope.row.gradePicUrl)">
                </template>
            </el-table-column>
            <el-table-column prop="danInfo.attr" label="技能标签" align="center"></el-table-column>
            <el-table-column label="技能段位" align="center">
                <template slot-scope="scope" v-if="scope.row.danInfo">
                    {{scope.row.danInfo.value}}{{scope.row.danInfo.rank}}
                </template>
            </el-table-column>
            <el-table-column prop="admin" label="最后修改人" align="center"></el-table-column>
            <el-table-column label="操作" align="center">
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

        <!-- 预览图片 -->
        <el-dialog :visible.sync="previewImg.visible" class='tc'>
            <img max-width="100%" :src="previewImg.url" alt="">
        </el-dialog>
    </section>
</template>

<script>
import * as api from '@/utils/api';
import * as lib from '@/utils/lib';

export default {
    data() {
        return {
            filters: {},
            total: 0,
            pageNum: 1,
            pageSize: 10,
            listLoading: false,
            list: [],

            previewImg: {
                visible: false,
                url: ''
            }
        }
    },
    methods: {
        // 添加行
        addRow(id) {
            const para = id ? {userId: id} : {};
            this.$router.push({ path: '/skill/list/add', query: para });
        },
        // 预览
        handlePreview(url) {
            this.previewImg.visible = true;
            this.previewImg.url = url;
        },
        //获取列表
        getList() {
            const para = {
                pageNum: this.pageNum,
                pageSize: this.pageSize
            };
            this.listLoading = true;
            api.getSkillList(para).then(res => {
                lib.ajaxResult(this, res);
                this.listLoading = false;
                this.total = res.data.total || 0;
                this.list = res.data.list || [];
            })
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
