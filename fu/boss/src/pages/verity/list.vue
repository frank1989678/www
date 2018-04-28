<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="fu-filter">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-button type="primary" size="small" @click="addRow(0)">新增</el-button>
                    <el-button type="primary" size="small" @click="onExport">导出</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="list" highlight-current-row border v-loading="listLoading" style="width: 100%;">
            <el-table-column prop="id" label="打手ID" width="80px" fixed></el-table-column>
            <el-table-column label="是否支持导出" width="150px" align="center">
                <template slot-scope="scope">
                    <el-switch v-model="scope.row.allowExport" @change="switchExport(scope.row)"></el-switch>
                </template>
            </el-table-column>
            <el-table-column prop="mobile" label="手机号" width="200px" align="center"></el-table-column>
            <el-table-column label="身份证" width="150px" align="center">
                <template slot-scope="scope">
                    <el-tooltip placement="right">
                        <div slot="content">
                            <template v-for="item in scope.row.idCardList">
                                <img v-if="item.url" :src="item.url" width="120px" height="120px" @click="handlePreview(item.url)">
                            </template>
                        </div>
                        <el-button type="primary" size="mini">查看</el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column prop="realname" label="昵称" width="100px" align="center"></el-table-column>

            <el-table-column label="头像" width="150px" align="center">
                <template slot-scope="scope">
                    <img v-if="scope.row.headUrl" :src="scope.row.headUrl" width="50px" height="50px"  class="circle">
                </template>
            </el-table-column>

            <el-table-column label="主图" width="150px" align="center">
                <template slot-scope="scope">
                    <el-tooltip placement="right" v-if="scope.row.mainPicUrl">
                        <div slot="content">
                            <img :src="scope.row.mainPicUrl" width="120px" height="120px">
                        </div>
                        <el-button type="primary" size="mini">查看</el-button>
                    </el-tooltip>
                </template>
            </el-table-column>

            <el-table-column label="个人写真" width="150px" align="center">
                <template slot-scope="scope">
                    <el-tooltip placement="right">
                        <div slot="content">
                            <template v-for="item in scope.row.portraitList">
                                <img v-if="item.url" :src="item.url" width="120px" height="120px" @click="handlePreview(item.url)">
                            </template>
                        </div>
                        <el-button type="primary" size="mini">查看</el-button>
                    </el-tooltip>
                </template>
            </el-table-column>

            <el-table-column label="语音介绍" width="150px" align="center">
                <template slot-scope="scope">
                    <audio autostart="true" controls="true" v-if="scope.row.voiceUrl" class="vioce">
                        <source :src="scope.row.voiceUrl" type="audio/mpeg"/>
                    </audio>
                </template>
            </el-table-column>

            <el-table-column prop="voiceTag" label="标签组" width="120px" align="center">
                <template slot-scope="scope">
                    <el-tooltip placement="right">
                        <div slot="content">
                            <template v-for="item in scope.row.groupTags">
                                <dl v-if="item.sonTags.length > 0" class="tags">
                                    <dt>{{item.name}}：</dt>
                                    <dd>
                                        <em v-for="son in item.sonTags">{{son.name}}</em>
                                    </dd>
                                </dl>
                            </template>
                        </div>
                        <el-button type="primary" size="mini">查看</el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
            
            <el-table-column prop="admin" label="最后修改人" width="120px" align="center"></el-table-column>
            <el-table-column label="操作" width="160px" align="center" fixed="right">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="addRow(scope.row.userId)">修改</el-button>
                    <el-button type="danger" size="mini" @click="delRow(scope.row.userId)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!--工具条-->
        <el-col :span="24" class="toolbar page">
            <el-pagination layout="prev, pager, next" @current-change="goPage" :page-size="pageSize" :total="total">
            </el-pagination>
        </el-col>


        <!-- 预览图片 -->
        <el-dialog :visible.sync="previewImg.visible">
            <img width="100%" :src="previewImg.url" alt="">
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
        // 是否能导出
        switchExport(row) {
            const para = { id: row.id };
        },
        // 导出
        onExport() {

        },
        // 添加行
        addRow(id) {
            const para = id ? {userId: id} : {};
        	this.$router.push({ path: '/verity/list/add', query: para });
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
            api.getVerityList(para).then(res => {
                this.listLoading = false;
                lib.ajaxResult(this, res);
                if (res.status == 200) {
                    var list = res.data.list || [];
                    list.forEach(row => {
                        const idCardList = row.idCardList;
                        // 处理身份证照片
                        idCardList.forEach(item => {
                            if (item.type == 1) {
                                row.idCardHeadUrl = item.url;
                            } else if (item.type == 2) {
                                row.idCardEmblemUrl = item.url;
                            } else {
                                row.idCardHandUrl = item.url;
                            }
                        })
                    })
	                this.total = res.data.total || 0;
	                this.list = list;
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
        }
    },
    mounted() {
        this.getList();
    }
}
</script>

<style>
    .circle{border-radius:50%;}
    .tags{width:300px;display:block;overflow:hidden;padding:10px 0;}
    .tags dt{display:inline-block;}
    .tags dd{display:inline-block;}
    .tags em{white-space:nowrap;margin-left:10px;}
</style>
