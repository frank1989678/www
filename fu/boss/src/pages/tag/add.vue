<template>
    <el-form ref="addFormData" :model="addFormData" :rules="addFormRules" label-width="140px" class="fu-form" size="small">
        <h3 class="title">陪玩管理&gt;标签组管理&gt;基本信息</h3>

        <el-form-item label="排序ID" prop="sort" placeholder="请输入排序ID">
            <el-input v-model.number="addFormData.sort"></el-input>
        </el-form-item>

        <el-form-item label="标签组名" prop="name" placeholder="请输入标签组名">
            <el-input v-model="addFormData.name"></el-input>
        </el-form-item>

        <div v-if="showTypes">
            <el-form-item label="标签配置">
                <div class="group" v-for="(item, index) in groupType1">
                    标签 <el-input v-model="item.name"></el-input>
                    性别
                    <el-select v-model="item.gender">
                        <el-option label="女" value="0"></el-option>
                        <el-option label="男" value="1"></el-option>
                        <el-option label="不限" value="2"></el-option>
                    </el-select>
                    <el-button type="danger" @click.prevent="delGroupType1(item)" v-if="groupType1.length > 1">删除</el-button>
                    <el-button type="primary" @click.prevent="addGroupType1(item)" v-if="index === groupType1.length - 1">添加</el-button>
                </div>
            </el-form-item>
        </div>

        <el-form-item label="最多勾选" prop="most">
            <el-input v-model.number="addFormData.most" placeholder="请输入自然数"></el-input>
        </el-form-item>

        <el-form-item>
            <el-button type="primary" @click="onFormSubmit">确定</el-button>
            <el-button @click="onCancel">取消</el-button>
        </el-form-item>
    </el-form>

</template>
<script>
import * as api from '@/utils/api';

export default {
    data() {
        return {
            addFormData: {
                id: null,
                sort: '',
                groupTagName: '',
                most: '',
                group1: ''
            },
            addFormRules: {
                sort: [
                    { required: true, message: '请输入排序ID' },
                    { type: 'number', message: '必须为数字' }
                ],
                groupTagName: [
                    { required: true, message: '请输入标签组名' }
                ],
                most: [
                    { required: true, message: '请输入自然数' },
                    { type: 'number', message: '必须为数字' }
                ],
                group1: [
                    { required: true, message: '请输入标签配置' },
                ]
            },
            groupType1: [   
                { name: '', gender: '0', id: ''}
            ],
            showTypes: false // 默认隐藏销售方式、段位配置、标签管理，编辑时才显示这些form元素
        }
    },
    computed: {
        headers() {
            const token = Cookies.get('token') || '';
            return {
                'Authorization': token
            }
        }
    },
    methods: {
        // 取消
        onCancel() {
            this.$router.push({ path: '/tag/list' });
        },
        //新增、编辑表单，id=null时新增，否则为编辑，后端会自动识别
        onFormSubmit() {
            this.$refs.addFormData.validate((valid) => {
                if (valid) {
                    this.addFormLoading = true;
                    const para = Object.assign({}, this.addFormData);
                    api.saveTagList(para).then(res => {
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
                this.$router.push({ path: '/tag/list' });
            }
        },
        trim(val) {
            return val ? val.toString().replace(/^\s+|\s+$/g, '') : '';
        },
        // 操作结果提示
        showMsg(res) {
            if (res.status == 200) {
                this.$message({
                    message: res.msg,
                    type: 'success'
                });
            } else {
                this.$message({
                    message: res.msg,
                    type: 'error'
                });
            }
        },
        // 删除标签
        delGroupType1(row) {
            const index = this.groupType1.indexOf(row);
            const para = { id: row.id };
            if (row.id) {
                api.delTag(para).then(res => {
                    this.showMsg(res);
                    if (res.status == 200) {
                        this.groupType1.splice(index, 1);
                    }
                });
            } else {
                this.groupType1.splice(index, 1);
            }
        },
        addGroupType1(row) {
            const name = this.trim(row.name); // 标签名称
            if (name === '') {
                this.$message.error('请输入标签名称');
            } else if (row.id) {
                this.groupType1.push({name: '', gender: '0', id: ''});
            } else {
                const para = {
                    pid: this.addFormData.id,
                    name: name,
                    gender: row.gender,
                    sort: 1
                };
                api.saveTagPerson(para).then(res => {
                    this.showMsg(res);
                    if (res.status == 200) {
                        row.id = res.data.id;
                        this.groupType1.push({name: '', gender: '0',  id: ''});
                    }
                });
            }
        },
        // 修改时，回填数据
        getInfo() {
            const id = this.$route.query.id;
            if (id != 0) {
                this.showTypes = true;
                api.getTagInfo({ id: id }).then(res => {
                    // console.log(res)
                    if (res.status == 200) {
                        this.addFormData = {
                            id: res.data.id,
                            sort: res.data.sort,
                            name: res.data.name,
                            most: res.data.most
                        }
                        let tags = res.data.sonTags;
                        if (tags.length > 0) {
                            tags.forEach((item, index) => {
                                item.gender = item.gender.toString();
                            })
                            this.groupType1 = tags;
                        }
                    } else {
                        this.$message.error('数据查询失败');
                        // this.$router.push({ path: '/category/list' });
                    }
                })
            }
        }
    },
    mounted() {
        this.getInfo();
    }
}
</script>

