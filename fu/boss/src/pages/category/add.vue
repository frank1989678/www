<template>
    <div>
    <el-form ref="addFormData" :model="addFormData" :rules="addFormRules" label-width="140px" class="fu-form" size="mini">
        <h3 class="title">陪玩管理&gt;内容管理&gt;基本信息</h3>
        
        <div class="fu-upload-circle">
            <el-upload
                :action="action"
                :headers="headers"
                :show-file-list="false"
                :on-success="uploadSuccess"
                :before-upload="beforeUpload">
                <img v-if="addFormData.icon" :src="addFormData.icon" class="img" alt="">
                <i v-else class="el-icon-plus plus"></i>
            </el-upload>
            <div class="tc">内容icon</div>
        </div>

        <el-form-item label="排序ID" prop="sort">
            <el-input v-model.number="addFormData.sort"></el-input>
        </el-form-item>
        <el-form-item label="内容名称" prop="name">
            <el-input v-model="addFormData.name"></el-input>
        </el-form-item>
        <el-form-item label="是否启用" prop="status">
            <el-select v-model="addFormData.status">
                <el-option label="否" value="false"></el-option>
                <el-option label="是" value="true"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="手续费" prop="charges">
            <el-input v-model.number="addFormData.charges" placeholder="请输入自然数" class="percent"></el-input>
        </el-form-item>

        <div v-if="showTypes">
        <el-form-item label="销售方式">
            <div class="group" v-for="(item, index) in groupType1">
                &#12288;&#12288;单位 <el-input v-model="item.name"></el-input>
                默认价格 <el-input v-model.number="item.price"></el-input>
                &#12288;&#12288;权重 <el-input v-model.number="item.techAttrId"></el-input>
                <el-button type="danger" @click.prevent="delGroupType1(item)" v-if="groupType1.length > 1">删除</el-button>
                <el-button type="primary" @click.prevent="addGroupType1(item)" v-if="index === groupType1.length - 1">添加</el-button>
            </div>
        </el-form-item>
        
        <el-form-item label="段位配置">
            <div class="group" v-for="(item, index) in groupType2">
                &#12288;&#12288;段位 <el-input v-model="item.name" class="w2"></el-input>
                &#12288;&#12288;级别 <el-input v-model.number="item.rank" class="w2"></el-input>
                <el-button type="danger" @click.prevent="delGroupType2(item)" v-if="groupType2.length > 1">删除</el-button>
                <el-button type="primary" @click.prevent="addGroupType2(item)" v-if="index === groupType2.length - 1">添加</el-button>
            </div>
        </el-form-item>

        <el-form-item label="标签配置">
            <div class="group" v-for="(item, index) in groupType3">
                标签内容 <el-input v-model="item.name" class="w3"></el-input>
                <el-button type="danger" @click.prevent="delGroupType3(item)" v-if="groupType3.length > 1">删除</el-button>
                <el-button type="primary" @click.prevent="addGroupType3(item)" v-if="index === groupType3.length - 1">添加</el-button>
            </div>
        </el-form-item>
        <el-form-item label="标签最多勾选" prop="most">
            <el-input v-model.number="addFormData.most" placeholder="请输入自然数"></el-input>
        </el-form-item>
        </div>

        <el-form-item>
            <el-button type="primary" @click="onFormSubmit">确定</el-button>
            <el-button @click="gotoListPage">取消</el-button>
        </el-form-item>
    </el-form>

    <!-- 删除group1 -->
    <el-dialog :visible.sync="dialog.visible">
        <div class="hd">请选择“{{dialog.name}}”关联配置</div>
        
        <el-select v-model="groupType1">
            <el-option v-for="(item) in groupType1" :key="item.id" :label="item.id">{{item.name}}</el-option>
        </el-select>
        <div class="tips">
            ps：关联后所有已选择“{{dialog.name}}”的用户将变更为关联单位，请谨慎操作
        </div>

        <button type="danger" @click="delGroupType">确定关联</button>
        <button @click="dialog.visible=!dialog.visible">取消删除</button>
    </el-dialog>
    </div>
</template>
<script>
import * as api from '@/utils/api';
import * as lib from '@/utils/lib';

export default {
    data() {
        return {
            action: api.baseURL + '/api/v1/global/upload',
            addFormData: {
                id: null,
                sort: '',
                name: '',
                status: 'false',
                charges: '',
                icon: '',
                most: ''
            },
            upLoadData: {
                cpyId: '123456', 
                occurTime: '2017-08'
            },
            addFormRules: {
                sort: [
                    { required: true, message: '请输入排序' },
                    { type: 'number', message: '必须为数字' }
                ],
                name: [
                    { required: true, message: '请输入内容名称' }
                ],
                charges: [
                    { required: true, message: '请输入手续费' },
                    { type: 'number', message: '必须为数字' }
                ],
                most: [
                    { required: true, message: '请输入自然数' },
                    { type: 'number', message: '必须为数字' }
                ]
            },
            groupType1: [{ name: '', rank: '', techAttrId: '', id: ''}],
            groupType2: [{ name: '', price: '', id: ''}],
            groupType3: [{ name: '', id: ''}],

            dialog: {
                visible: false,
                name: '',
                id: '',
                val: [],
                cbx: []
            },
            showTypes: false // 默认隐藏销售方式、段位配置、标签管理，编辑时才显示这些form元素
        }
    },
    computed: {
        headers() {
            return lib.getToken();
        }
    },
    methods: {
        // 取消
        gotoListPage() {
            this.$router.push({ path: '/category/list' });
        },
        //新增、编辑表单，id=null时新增，否则为编辑，后端会自动识别
        onFormSubmit() {
            this.$refs.addFormData.validate((valid) => {
                if (valid) {
                    this.addFormLoading = true;
                    const para = Object.assign({}, this.addFormData);
                    api.saveCategory(para).then(res => {
                        this.handleResult(res);
                    }).catch(err => {
                        console.log(err);
                    });
                }
            });
        },
        // 新增、编辑结果
        handleResult(res) {
            const { msg, status } = res;
            if (status !== 200) {
                this.addFormLoading = false;
                this.$message.error(msg);
            } else {
                this.$message.success(msg);
                this.gotoListPage();
            }
        },
        trim(val) {
            return val ? val.toString().replace(/^\s+|\s+$/g, '') : '';
        },
        // 操作结果提示
        showMsg(res) {
            this.$message({message: res.msg, type: res.status == 200 ? 'success' : 'error'});
        },
        delGroupType() {

        },
        // 删除销售方式
        delGroupType1(row) {
            const index = this.groupType1.indexOf(row);
            const para = { id: row.id };
            if (row.id) {
                this.dialog.visible = true;
                this.dialog.name = row.name;
                this.dialog.id = row.id;
                this.dialog.cbx = this.groupType1;
                // this.$confirm('请选择' + row.name + '关联配置').then(__ => {
                //     console.log(2);
                // })
                // api.delSalesMode(para).then(res => {
                //     this.showMsg(res);
                //     if (res.status == 200) {
                //         this.groupType1.splice(index, 1);
                //     }
                // });
            } else {
                this.groupType1.splice(index, 1);
            }
        },
        // 添加销售方式
        addGroupType1(row) {            
            const name = this.trim(row.name); // 单位
            const price = this.trim(row.price); // 价格
            const techAttrId = this.trim(row.techAttrId); // 权重

            if (name === '') {
                this.$message.error('请输入销售方式名称');
            } else if (row.id) {
                this.groupType1.push({name: '', price: '', techAttrId: '', id: ''});
            } else {
                const para = {
                    categoryId: this.addFormData.id,
                    name: name,
                    price: price,
                    rank: techAttrId
                };
                api.addSalesMode(para).then(res => {
                    this.showMsg(res);
                    if (res.status == 200) {
                        row.id = res.data.id;
                        this.groupType1.push({name: '', price: '', techAttrId: '', id: ''});
                    }
                });
            }
        },
        delGroupType2(row) {
            const index = this.groupType2.indexOf(row);
            const para = { id: row.id };
            if (row.id) {
                api.delDan(para).then(res => {
                    this.showMsg(res);
                    if (res.status == 200) {
                        this.groupType2.splice(index, 1);
                    }
                });
            } else {
                this.groupType2.splice(index, 1);
            }
        },
        // 添加段位
        addGroupType2(row) {
            const name = this.trim(row.name); // 段位名称
            const rank = this.trim(row.rank); // 级别
            if (name === '') {
                this.$message.error('请输入段位名称');
            } else if (row.id) {
                this.groupType2.push({name: '', rank: '', id: ''});
            } else if (isNaN(rank)) {
                this.$message.error('段位级别只能输入数字');
            } else {
                const para = {
                    categoryId: this.addFormData.id,
                    name: name,
                    rank: rank
                };
                api.addDan(para).then(res => {
                    this.showMsg(res);
                    if (res.status == 200) {
                        row.id = res.data.id;
                        this.groupType2.push({name: '', rank: '', id: ''});
                    }
                });
            }
        },
        delGroupType3(row) {
            const index = this.groupType3.indexOf(row);
            const para = { id: row.id };
            if (row.id) {
                api.delTag(para).then(res => {
                    this.showMsg(res);
                    if (res.status == 200) {
                        this.groupType3.splice(index, 1);
                    }
                });
            } else {
                this.groupType3.splice(index, 1);
            }
        },
        // 添加标签
        addGroupType3(row) {            
            const name = this.trim(row.name); // 标签名称
            if (name === '') {
                this.$message.error('请输入标签名称');
            } else if (row.id) {
                this.groupType3.push({name: '', id: ''});
            } else {
                const para = {
                    categoryId: this.addFormData.id,
                    name: name
                };
                api.addTag(para).then(res => {
                    this.showMsg(res);
                    if (res.status == 200) {
                        row.id = res.data.id;
                        this.groupType3.push({name: '', id: ''});
                    }
                });
            }
        },
        uploadSuccess(res, file) {
            if (res.status != 200) {
                this.$message.error('图片上传失败');
            }
            this.addFormData.icon = res.data || '';
        },
        // 判断图片类型(默认：'jpeg', 'jpg', 'png', 'bpm', '.gif')、文件大小(小于2MB)
        beforeUpload(file) {
            return lib.checkFileType(this, file);
        },
        getInfo() {
            const id = this.$route.query.id;
            if (id != 0) {
                api.getCategoryInfo({ categoryId: id }).then(res => {
                    if (res.status == 200) {
                        const obj = res.data;
                        this.showTypes = true;
                        this.addFormData = {
                            id: obj.id,
                            sort: obj.sort,
                            name: obj.name,
                            status: obj.status.toString(),
                            charges: obj.charges,
                            icon: obj.icon,
                            most: ''
                        }
                        if (obj.salesModeList && obj.salesModeList.length > 0) {
                            this.groupType1 = obj.salesModeList;
                        }
                        if (obj.danList && obj.danList.length > 0) {
                            this.groupType2 = obj.danList;
                        }
                        if (obj.tagList && obj.tagList.length > 0) {
                            this.groupType3 = obj.tagList;
                        }
                    } else {
                        this.$message.error('数据查询失败');
                        this.gotoListPage();
                    }
                }).catch(err => {
                    console.log(err)
                })
            }
        }
    },
    mounted() {
        this.getInfo();
    }
}
</script>

<style>
.fu-upload-circle{position:absolute;top:0;left:650px;z-index:9;}

</style>
