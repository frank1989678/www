<template>
    <div>
    <el-form ref="addFormData2" :model="addFormData2" :rules="addFormRules2" :label-width="labelWidth" class="fu-form" size="mini">
        <el-form-item label="实名认证手机号" prop="mobile">
            <el-input v-model="addFormData2.mobile" @blur="getVerityByMobile" placeholder="请输入手机号"></el-input>
        </el-form-item>
    </el-form>

    <el-form ref="addFormData" :model="addFormData" :rules="addFormRules" :label-width="labelWidth" class="fu-form" size="mini" :disabled="formDisabled">
        <el-form-item label="技能名称" prop="categoryId">
            <el-select v-model="addFormData.categoryId" @change="getDanAndTag">
                <el-option
                  v-for="item in gameList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
            </el-select>
        </el-form-item>
        
        <el-form-item label="技能认证截图" prop="gradePicUrl" class="fu-upload">
            <el-upload
                class="el-upload-list el-upload-list--picture-card"
                :action="action"
                :headers="headers"
                :show-file-list="false"
                :on-success="uploadSuccess"
                :before-upload="beforeUpload">
                <template v-if="addFormData.gradePicUrl">
                    <img :src="addFormData.gradePicUrl" class="img" alt="">
                    <span class="el-upload-list__item-actions" @click="stopPropagation">
                        <span class="el-upload-list__item-preview" @click="handlePreview2('gradePicUrl')"><i class="el-icon-zoom-in"></i></span>
                        <span class="el-upload-list__item-delete" @click="removePic('gradePicUrl')"><i class="el-icon-delete"></i></span>
                    </span>
                </template>
                <template v-else>
                    <i class="el-icon-plus"></i>
                </template>
            </el-upload>
        </el-form-item>

        <el-form-item label="技能描述" prop="description">
            <el-input v-model="addFormData.description" type="textarea" rows="5"></el-input>
        </el-form-item>


        <el-form-item label="技能标签" prop="tagIds">
            <el-checkbox-group v-model="addFormData.tagIds" placeholder="请先选择技能名称">
                <el-checkbox-button v-for="tag in tagList" :label="tag.id" :key="tag.id">{{tag.name}}</el-checkbox-button>
            </el-checkbox-group>
        </el-form-item>

        <el-form-item label="技能段位" prop="danId">
            <el-select v-model="addFormData.danId" placeholder="请先选择技能名称">
                <el-option v-for="item in danList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
        </el-form-item>

        <el-form-item>
            <el-button type="primary" @click="onFormSubmit">确定</el-button>
            <el-button @click="onCancel">取消</el-button>
        </el-form-item>

        <!-- 预览图片 -->
        <el-dialog :visible.sync="previewImg.visible" class='tc'>
            <img max-width="100%" :src="previewImg.url" alt="">
        </el-dialog>
    </el-form>
    </div>
</template>
<script>
import * as api from '@/utils/api';
import * as lib from '@/utils/lib';
import { _isMobile } from '@/utils/validate';

export default {
    data() {
        return {
            action: api.baseURL + '/api/v1/global/upload',
            formDisabled: true,
            labelWidth: '160px',
            addFormData: {
                id: '',
                userId: '',
                mobile: '',
                gradePicUrl: '',
                categoryId: '',
                description: '',
                tagIds: [],
                danId: ''
            },
            addFormRules: {
                categoryId: [
                    { required: true, message: '请选择游戏' }
                ],
                gradePicUrl: [
                    { required: true, message: '请上传技能认证截图' }
                ],
                description: [
                    { required: true, message: '请输入技能描述' }
                ],
                tagIds: [
                    { required: true, message: '请选择技能标签' }
                ],
                danId: [
                    { required: true, message: '请选择技能段位' }
                ]
            },

            addFormData2: {
                mobile: '',
            },
            addFormRules2: {
                mobile: [
                    { required: true, message: '请输入手机号' },
                    { pattern: /^1[3-9]\d{9}$/, message: '手机号码格式错误', trigger: 'blur' }
                ]
            },

            edit: false,

            gameList: [],
            tagList: [],
            danList: [],

            previewImg: {
                visible: false,
                url: ''
            }

        }
    },
    computed: {
        headers() {
            return lib.getToken();
        }
    },
    methods: {
        // 取消
        onCancel() {
            this.$router.push({ path: '/skill/list' });
        },
        // 手机号查询用户信息是否存在，否组表单无法提交
        getVerityByMobile(e) {
            const val = e.target.value;
            if (this.edit) {
                // 修改时不执行查询
            } else if (_isMobile(val)) {
                this.listLoading = true;
                api.getVerityByMobile({ mobile: val}).then(res => {
                    this.listLoading = false;
                    if (res.status == 200) {
                        this.addFormData.userId = res.data.id;
                        this.formDisabled = false;
                    } else {
                        this.formDisabled = true;
                        this.$message.error('查询用户信息失败');
                    }
                })
            }
        },
        // 查询用户认证信息（编辑）
        getSkillById(id) {
            api.getSkillById({ id: id }).then(res => {
                if (res.status == 200) {
                    const obj = res.data;
                    this.formDisabled = false;
                    this.addFormData.id = obj.id;
                    this.addFormData.userId = obj.userId;
                    this.addFormData.mobile = obj.mobile;
                    this.addFormData.gradePicUrl = obj.gradePicUrl;
                    this.addFormData.description = obj.description;
                    this.addFormData.categoryId = obj.categoryId;
                    this.edit = true;
                    this.getDanAndTag(null, obj); // 获取标签和段位并匹配已选中
                } else {
                    this.$router.push({ path: '/skill/list' });
                    this.$message.error('查询用户信息失败');
                }
            })
        },
        //新增、编辑表单，id=null时新增，否则为编辑，后端会自动识别
        onFormSubmit() {
            this.$refs.addFormData.validate((valid) => {
                if (valid) {
                    this.addFormLoading = true;
                    const para = Object.assign({}, this.addFormData);
                    api.saveSkill(para).then(res => {
                        this.addFormLoading = false;
                        if (res.status == 200) {
                            this.$message.success(this.addFormData.id ? '修改成功' : '添加成功');
                            this.$router.push({ path: '/skill/list' });
                        } else {
                            this.$message.error('打手技能已存在，无法重复添加');
                        }
                    }).catch(err => {
                        console.log(err);
                    });
                }
            });
        },
        // 图片上传成功
        uploadSuccess(res, file) {
            if (res.status != 200) {
                this.$message.error('图片上传失败');
            }
            this.addFormData.gradePicUrl = res.data || '';//URL.createObjectURL(file.raw);
        },
        // 判断图片类型(默认：'jpeg', 'jpg', 'png', 'bpm', '.gif')、文件大小(小于2MB)
        beforeUpload(file) {
            return lib.checkFileType(this, file);
        },
        // 仿框架预览
        handlePreview2(key) {
            this.previewImg = {
                visible: true,
                url: this.addFormData[key]
            }
        },
        // 删除游戏图片
        removePic(key) {
            this.$confirm('确定删除？').then(__ => {
                this.addFormData[key] = '';
            })
        },
        stopPropagation() {
            let event = event || window.event;
                event.target || event.scrElement;
            if (event.stopPropagation) {
                event.stopPropagation();
            } else{
                event.cancleBubble = true;
            };
        },
        // 查询游戏列表
        getGameList(userId) {
            api.getGameList().then(res => {
                if (res.status == '200') {
                    this.gameList = res.data;
                    userId && this.getSkillById(userId);
                } else {
                    this.$message.error('查询游戏信息失败');
                }
            })
        },
        // 获取游戏下的技能和段位
        getDanAndTag(val, obj) {
            const para = {categoryId: this.addFormData.categoryId};
            let tagIds = [];
            let danId = '';

            if (obj) {
                obj.tagList.forEach(item => {
                    tagIds.push(item.tagId);
                })
                danId = obj.danInfo ? obj.danInfo.techValueId : '';
            }

            this.addFormData.tagIds = [];
            this.addFormData.danId = '';
            api.getGameTag(para).then(res => {
                this.tagList = res.data || [];
                this.addFormData.tagIds = tagIds;
            }) 
            api.getGameDan(para).then(res => {
                this.danList = res.data || [];
                this.addFormData.danId = danId;
            })

        },
        // 修改时，回填数据
        getInfo() {
            const userId = this.$route.query.userId;
            this.getGameList(userId);
        }
    },
    mounted() {
        this.getInfo();
    }
}
</script>
