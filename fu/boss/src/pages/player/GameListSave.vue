<template>
    <el-form ref="addFormData" :model="addFormData" :rules="addFormRules" label-width="140px" class="fu-form">
        <h3 class="title">基本信息</h3>
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
                <el-option label="3" value="3"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="手续费" prop="charges">
            <el-input v-model.number="addFormData.charges" placeholder="请输入自然数" class="percent"></el-input>
        </el-form-item>

        <el-form-item label="销售方式" prop="groupType1">
            <div class="group" v-for="(item, index) in groupType1">
                &#12288;&#12288;单位 <el-input v-model="item.unit"></el-input>
                默认价格 <el-input v-model.number="item.price"></el-input>
                &#12288;&#12288;权重 <el-input v-model.number="item.weight"></el-input>
                <el-button type="danger" @click.prevent="delGroupType1(item)" v-if="groupType1.length > 1">删除</el-button>
                <el-button type="primary" @click.prevent="addGroupType1()" v-if="index === groupType1.length - 1">添加</el-button>
            </div>
        </el-form-item>
        

        <el-form-item label="段位配置" prop="groupType2">
            <div class="group" v-for="(item, index) in groupType2">
                &#12288;&#12288;段位 <el-input v-model="item.level" class="w2"></el-input>
                &#12288;&#12288;级别 <el-input v-model.number="item.rank" class="w2"></el-input>
                <el-button type="danger" @click.prevent="delGroupType2(item)" v-if="groupType2.length > 1">删除</el-button>
                <el-button type="primary" @click.prevent="addGroupType2()" v-if="index === groupType2.length - 1">添加</el-button>
            </div>
        </el-form-item>

        <el-form-item label="标签配置" prop="groupType3">
            <div class="group" v-for="(item, index) in groupType3">
                标签内容 <el-input v-model="item.name" class="w3"></el-input>
                <el-button type="danger" @click.prevent="delGroupType3(item)" v-if="groupType3.length > 1">删除</el-button>
                <el-button type="primary" @click.prevent="addGroupType3()" v-if="index === groupType3.length - 1">添加</el-button>
            </div>
        </el-form-item>

        <el-form-item label="标签最多勾选" prop="max">
            <el-input v-model.number="addFormData.max" placeholder="请输入自然数"></el-input>
        </el-form-item>

        <el-form-item>
            <el-button type="primary" @click="onFormSubmit">立即创建</el-button>
            <el-button>取消</el-button>
        </el-form-item>
    </el-form>

</template>
<script>
import * as api from '@/api/api';

export default {
    data() {
        return {
            addFormData: {
                id: null,
                sort: '',
                name: '',
                status: 'false',
                charges: '',
                max: ''
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
                max: [
                    { required: true, message: '请输入自然数' },
                    { type: 'number', message: '必须为数字' }
                ]
            },
            groupType1: [   
                {unit: '小时', price: 15, weight: 2},
                {unit: '局', price: 15, weight: 2}
            ],
            groupType2: [   
                {level: '', rank: ''}
            ],
            groupType3: [   
                {name: ''}
            ]
        }
    },
    methods: {
        //新增、编辑表单，id=null时新增，否则为编辑
        onFormSubmit() {
            this.$refs.addFormData.validate((valid) => {
                if (valid) {
                    this.addFormLoading = true;
                    const para = Object.assign({}, this.addFormData);
                    if (this.addFormData.id === null) {
                        api.addCategory(para).then(res => {
                            this.handleResult(res);
                        }).catch(err => {
                            console.log(err);
                        });
                    } else {
                        api.editCategory(para).then(res => {
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
            const { msg, status } = res;
            if (status !== 200) {
                this.addFormLoading = false;
                this.$message({
                    message: msg,
                    type: 'error'
                });
            } else {
                this.$message({
                    message: msg,
                    type: 'success'
                });
                setTimeout(res => {
                    this.$router.push({ path: '/player/list' });
                }, 1e3)
            }
        },
        checkObj(obj) {
            let pass = true;
            let i = 0;
            const size = obj.length;
            for (; i < size; i++) {
                for (let attr in obj[i]) {
                    if (attr == '') {
                        pass = false;
                        return pass;
                    }
                }
            }
            return pass;
        },
        // 验证销售方式
        checkGroup() {
            let pass = this.checkObj(this.groupType1);
            if (pass) {
                pass = this.checkObj(this.groupType2);
                console.log(pass)
                if (pass) {
                    pass = this.checkObj(this.groupType3);
                    if (pass) {

                    } else {
                        this.$message({
                            message: '请输入销售方式',
                            type: 'error'
                        });
                    }
                } else {
                    this.$message({
                        message: '请输入段位配置',
                        type: 'error'
                    });
                }
            } else {
                this.$message({
                    message: '请输入标签配置',
                    type: 'error'
                });
            }
            return pass;
        },
        delGroupType1(row) {
            var index = this.groupType1.indexOf(row)
            if (index !== -1) {
                this.groupType1.splice(index, 1);
            }
        },
        addGroupType1() {
            this.groupType1.push({
                unit: '', 
                price: '', 
                weight: ''
            });
        },
        delGroupType2(row) {
            var index = this.groupType2.indexOf(row)
            if (index !== -1) {
                this.groupType2.splice(index, 1);
            }
        },
        addGroupType2() {
            this.groupType2.push({
                level: '', 
                rank: ''
            });
        },
        delGroupType3(row) {
            var index = this.groupType3.indexOf(row)
            if (index !== -1) {
                this.groupType3.splice(index, 1);
            }
        },
        addGroupType3() {
            this.groupType3.push({
                name: ''
            });
        }
    },
    mounted() {}
}
</script>
