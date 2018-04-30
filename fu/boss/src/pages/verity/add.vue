<template>
<div>
    <el-form ref="addFormData2" :model="addFormData2" :rules="addFormRules2" label-width="180px" class="fu-form" size="mini" :disabled="formDisabled2">
        <el-form-item label="实名认证用户手机号码" prop="mobile">
            <el-input v-model="addFormData2.mobile" @blur="getVerityByMobile" placeholder="请输入手机号"></el-input>
        </el-form-item>
    </el-form>
    <el-form ref="addFormData" :model="addFormData" :rules="addFormRules" label-width="180px" class="fu-form" size="mini" :disabled="formDisabled">
        <el-form-item label="身份证图片" class="fu-upload">
            <el-upload
                class="file el-upload-list el-upload-list--picture-card"
                :data="{'name': 'idCardHeadUrl'}"
                :action="action"
                :headers="headers"
                :show-file-list="false"
                :on-success="uploadSuccess"
                :before-upload="beforeUpload">
                <template v-if="addFormData.idCardHeadUrl">
                    <img :src="addFormData.idCardHeadUrl" class="img">
                    <span class="el-upload-list__item-actions" @click="stopPropagation">
                        <span class="el-upload-list__item-preview" @click="handlePreview2('idCardHeadUrl')"><i class="el-icon-zoom-in"></i></span>
                        <span class="el-upload-list__item-delete" @click="removePic('idCardHeadUrl')"><i class="el-icon-delete"></i></span>
                    </span>
                </template>
                <template v-else>
                    <i class="el-icon-plus"></i>
                </template>
                <i class="tips">身份证人像</i>
            </el-upload>
            <el-upload
                class="file el-upload-list el-upload-list--picture-card"
                :data="{'name': 'idCardEmblemUrl'}"
                :action="action"
                :headers="headers"
                :show-file-list="false"
                :on-success="uploadSuccess"
                :before-upload="beforeUpload">
                <template v-if="addFormData.idCardEmblemUrl">
                    <img :src="addFormData.idCardEmblemUrl" class="img">
                    <span class="el-upload-list__item-actions" @click="stopPropagation">
                        <span class="el-upload-list__item-preview" @click="handlePreview2('idCardEmblemUrl')"><i class="el-icon-zoom-in"></i></span>
                        <span class="el-upload-list__item-delete" @click="removePic('idCardEmblemUrl')"><i class="el-icon-delete"></i></span>
                    </span>
                </template>
                <template v-else>
                    <i class="el-icon-plus"></i>
                </template>
                <i class="tips">身份证国徽</i>
            </el-upload>
            <el-upload
                class="file el-upload-list el-upload-list--picture-card"
                :data="{'name': 'idCardHandUrl'}"
                :action="action"
                :headers="headers"
                :show-file-list="false"
                :on-success="uploadSuccess"
                :before-upload="beforeUpload">
                <template v-if="addFormData.idCardHandUrl">
                    <img :src="addFormData.idCardHandUrl" class="img">
                    <span class="el-upload-list__item-actions" @click="stopPropagation">
                        <span class="el-upload-list__item-preview" @click="handlePreview2('idCardHandUrl')"><i class="el-icon-zoom-in"></i></span>
                        <span class="el-upload-list__item-delete" @click="removePic('idCardHandUrl')"><i class="el-icon-delete"></i></span>
                    </span>
                </template>
                <template v-else>
                    <i class="el-icon-plus"></i>
                </template>
                <i class="tips">身份证手持</i>
            </el-upload>
        </el-form-item>


        <el-form-item label="姓名" prop="realname">
            <el-input v-model="addFormData.realname"></el-input>
        </el-form-item>
        <el-form-item label="身份证号" prop="idCard">
            <el-input v-model="addFormData.idCard"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
            <el-radio v-model="addFormData.gender" label="1">男</el-radio>
            <el-radio v-model="addFormData.gender" label="2">女</el-radio>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
            <el-input v-model="addFormData.mobile"></el-input>
        </el-form-item>
        <el-form-item label="微信" prop="wechat">
            <el-input v-model="addFormData.wechat"></el-input>
        </el-form-item>
        <el-form-item label="QQ" prop="qq">
            <el-input v-model="addFormData.qq"></el-input>
        </el-form-item>

        <el-form-item label="头像与主图" class="fu-upload">
            <el-upload
                class="file el-upload-list el-upload-list--picture-card"
                :data="{name: 'headUrl'}"
                :action="action"
                :show-file-list="false"
                :headers="headers"
                :on-success="uploadSuccess"
                :before-upload="beforeUpload">
                <template v-if="addFormData.headUrl">
                    <img :src="addFormData.headUrl" class="img">
                    <span class="el-upload-list__item-actions" @click="stopPropagation">
                        <span class="el-upload-list__item-preview" @click="handlePreview2('headUrl')"><i class="el-icon-zoom-in"></i></span>
                        <span class="el-upload-list__item-delete" @click="removePic2('headUrl')"><i class="el-icon-delete"></i></span>
                    </span>
                </template>
                <template v-else>
                    <i class="el-icon-plus"></i>
                </template>
                <i class="tips">头像</i>
            </el-upload>
            <el-upload
                class="file el-upload-list el-upload-list--picture-card"
                :data="{name: 'mainPicUrl'}"
                :action="action"
                :show-file-list="false"
                :headers="headers"
                :on-success="uploadSuccess"
                :before-upload="beforeUpload">
                <template v-if="addFormData.mainPicUrl">
                    <img :src="addFormData.mainPicUrl" class="img">
                    <span class="el-upload-list__item-actions" @click="stopPropagation">
                        <span class="el-upload-list__item-preview" @click="handlePreview2('mainPicUrl')"><i class="el-icon-zoom-in"></i></span>
                        <span class="el-upload-list__item-delete" @click="removePic2('mainPicUrl')"><i class="el-icon-delete"></i></span>
                    </span>
                </template>
                <template v-else>
                    <i class="el-icon-plus"></i>
                </template>
                <i class="tips">主图</i>
            </el-upload>
        </el-form-item>

        <el-form-item label="个人写真" prop="portraitUrls">
            <el-upload
                :action="action"
                :data="{name: 'portraitUrls'}"
                list-type="picture-card"
                :headers="headers"
                :on-success="uploadSuccess2"
                :before-upload="beforeUpload"
                :on-preview="handlePreview"
                :before-remove="removePic3"
                :file-list="portraitUrls">
                <i class="el-icon-plus"></i>
            </el-upload>
        </el-form-item>

        <el-form-item label="语音介绍" prop="voiceUrl">
            <audio id="warnMusic" autostart="true" controls="true" v-if="addFormData.voiceUrl" class="vioce">
                <source :src="addFormData.voiceUrl" type="audio/mpeg"/>
            </audio>
            <el-upload
                :data="{name: 'voiceUrl'}"
                :action="action"
                :headers="headers"
                :on-success="uploadSuccess"
                :before-upload="beforeUpload2">
                <el-button type="primary">点击上传</el-button>
            </el-upload>
        </el-form-item>

        <div v-for="(item, index) in addFormData.groupTags">
            <el-form-item :label="item.name" v-if="item.sonTags.length > 0">
                <el-checkbox-group v-model="tags">
                    <el-checkbox :label="son.id" v-for="(son, ii) in item.sonTags" :checked="son.selected" :key="ii">{{son.name}}</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
        </div>

        <el-form-item label="是否支持导出" prop="allowExport">
            <el-radio v-model="addFormData.allowExport" label="true">支持导出</el-radio>
            <el-radio v-model="addFormData.allowExport" label="false">不支持导出</el-radio>
        </el-form-item>

        <el-form-item>
            <el-button type="primary" @click="onFormSubmit">确定</el-button>
            <el-button @click="onCancel">取消</el-button>
        </el-form-item>

        <!-- 预览图片 -->
        <el-dialog :visible.sync="previewImg.visible">
            <img width="100%" :src="previewImg.url" alt="">
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
            formDisabled2: false,
            formDisabled: true,
            addFormData: {
                id: null,
                userId: '',
                mobile1: '',
                mobile: '',
                realname: '',
                idCard: '',
                gender: '',
                wechat: '',
                qq: '',
                mainPicUrl: '',
                allowExport: '',
                idCardHeadUrl: '',
                idCardEmblemUrl: '',
                idCardHandUrl: '',
                headUrl: '',
                voiceUrl: '',
                tags: [],
                portraitUrls: [],
                groupTags: []
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

            portraitUrls: [],

            tags: [],
            addFormRules: {},

            // 上传时附带的额外参数
            upLoadData: {
                userId: ''
            },

            previewImg: {
                visible: false,
                url: ''
            },

            listLoading: false
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
            this.$router.push({ path: '/verity/list' });
        },
        // 手机号查询用户信息
        getVerityByMobile(e) {
            const val = e.target.value;
            if (this.edit && val == this.addFormData2.mobile) {
                // 修改时不执行查询
            } else if (_isMobile(val)) {
                this.listLoading = true;
                api.getVerityByMobile({ mobile: val}).then(res => {
                    this.listLoading = false;
                    if (res.status == 200) {
                        this.getVerityById(res.data.id);
                    } else {
                        this.$message.error('查询用户信息失败');
                    }
                })
            }
        },
        // 查询用户认证信息
        getVerityById(id) {
            this.listLoading = true;
            api.getVerityById({ userId: id }).then(res => {
                this.listLoading = false;
                if (res.status == 200) {
                    this.formDisabled2 = true;
                    this.edit = true;
                    this.formDisabled = false;
                    this.addFormData = Object.assign(this.addFormData, res.data);
                    this.upLoadData.userId = res.data.userId;
                    this.fillPic(res.data);
                } else {
                    this.formDisabled = true;
                    this.$router.push({ path: '/verity/list' });
                    this.$message.error('查询用户信息失败');
                }
            })
        },
        // 回填图片数据
        fillPic(obj) {
            const idCardList = obj.idCardList;
            // 处理身份证照片
            idCardList.forEach((item, index) => {
                if (item.type == 1) {
                    this.addFormData.idCardHeadUrl = item.url;
                    this.addFormData.idCardHeadUrlId = item.id;
                } else if (item.type == 2) {
                    this.addFormData.idCardEmblemUrl = item.url;
                    this.addFormData.idCardEmblemUrlId = item.id;
                } else {
                    this.addFormData.idCardHandUrl = item.url;
                    this.addFormData.idCardHandUrlId = item.id;
                }
            })
            // 数字、boolean对象需转换成String类型，因值可能为空，这里没用toString
            this.addFormData.gender = '' + obj.gender;
            this.addFormData.allowExport = '' + obj.allowExport;
            // 上传控件无法使用对象里面的属性，这里在最外层定义了一个变量
            this.portraitUrls = obj.portraitList || [];
            this.addFormData.portraitUrls = [];
        },
        //新增、编辑表单，id=null时新增，否则为编辑，后端会自动识别
        onFormSubmit() {
            this.$refs.addFormData.validate((valid) => {
                if (valid) {
                    this.addFormLoading = true;
                    let obj = this.addFormData;

                    // 封装表单数据
                    let formData = {
                        id          : obj.id,
                        userId      : obj.userId,
                        mobile      : obj.mobile,
                        realname    : obj.realname,
                        idCard      : obj.idCard,
                        gender      : obj.gender, //int 是   1   性别(1男,2女)
                        wechat      : obj.wechat,
                        qq          : obj.qq,
                        headUrl     : obj.headUrl,
                        mainPicUrl  : obj.mainPicUrl,
                        allowExport : obj.allowExport,
                        voiceUrl    : obj.voiceUrl,
                        tags        : this.tags //int 是   7   标签ID(多选)
                    };

                    // 身份证图片，个人写真图片，有则加入到参数队列中
                    ['idCardHeadUrl', 'idCardEmblemUrl', 'idCardHandUrl', 'portraitUrls'].forEach(key => {
                        if (this['modify_' + key]) {
                            formData[key] = obj[key];
                        }
                    })
                    api.saveVerityInfo(formData).then(res => {
                        this.addFormLoading = false;
                        if (res.status === 200) {
                            this.$message.success(obj.id ? '修改成功' : '添加成功');
                            this.$router.push({ path: '/verity/list' });
                        } else {
                            this.$message.error(res.msg);
                        }
                    }).catch(err => {
                        console.log(err);
                    });
                }
            });
        },
        trim(val) {
            return val ? val.toString().replace(/^\s+|\s+$/g, '') : '';
        },
        // 上传成功
        uploadSuccess(res, file) {
            if (res.status != 200) {
                this.$message.error('图片上传失败');
            }
            this.addFormData[res.msg] = res.data;
            this['modify_' + res.msg] = true;
        },
        // 写真上传成功
        uploadSuccess2(res, file) {
            if (res.status != 200) {
                this.$message.error('图片上传失败');
            }
            if (res.data) {
                this.addFormData[res.msg].push(res.data);
                this['modify_' + res.msg] = true;
            }
        },
        // 判断图片类型(默认：'jpeg', 'jpg', 'png', 'bpm', '.gif')、文件大小(小于2MB)
        beforeUpload(file) {
            return lib.checkFileType(this, file);
        },
        // 判断声音类型(默认：'mp3')、文件大小(小于2MB)
        beforeUpload2(file) {
            return lib.checkFileType(this, file, {allowed: ['mp3']});
        },
        // 预览
        handlePreview(file) {
            this.previewImg.visible = true;
            this.previewImg.url = file.url;
        },
        // 仿框架预览
        handlePreview2(key) {
            this.stopPropagation();
            this.previewImg.visible = true;
            this.previewImg.url = this.addFormData[key];
        },
        // 删除身份证与写真照片
        removePic(key) {
            this.stopPropagation();
            this.$confirm('确定删除？').then(__ => {
                this.addFormData[key] = '';
                this['modify_' + key] = true;
                api.delIdcardImg({id: this.addFormData[key + 'Id'] }).then(res => {
                    if (res.status == '200') {
                        this.$message.success(res.msg)
                    } else {
                        this.$message.error(res.msg);
                    }
                })
            })
        },
        // 删除主图和头像图片
        removePic2(key) {
            this.$confirm('确定删除？').then(__ => {
                this.addFormData[key] = '';
            })
        },
        // 删除写真,删除文件之前的钩子
        removePic3(file, filelist) {
            return this.$confirm('确定删除？').then(__ => {
                api.delIdcardImg({id: file.id }).then(res => {
                    if (res.status == '200') {
                        this.$message.success(res.msg)
                    } else {
                        this.$message.error(res.msg);
                    }
                })
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
        // 修改时，回填数据
        getInfo() {
            const userId = this.$route.query.userId;
            if (userId) {
                this.getVerityById(userId);
            }
        }
    },
    mounted() {
        this.getInfo();
    }
}
</script>

<style>
.vioce{vertical-align:top;}
</style>
