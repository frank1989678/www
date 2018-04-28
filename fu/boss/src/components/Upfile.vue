<template>
	<el-upload
        class="file el-upload-list el-upload-list--picture-card"
        action="http://localhost/api/img_save_to_file.php"
        name="mainPicUrl"
        :show-file-list="false"
        :data="upLoadData"
        :headers="headers"
        :on-success="uploadSuccess"
        :before-upload="beforeUpload">
        <template v-if="addFormData.mainPicUrl">
            <img :src="addFormData.mainPicUrl" class="avatar">
            <span class="el-upload-list__item-actions">
                <span class="el-upload-list__item-preview" @click="handlePreview2('mainPicUrl')"><i class="el-icon-view"></i></span>
                <span class="el-upload-list__item-delete" @click="removePic('mainPicUrl')"><i class="el-icon-delete2"></i></span>
            </span>
        </template>
        <template v-else>
            <i class="el-icon-plus"></i>
        </template>
        <i class="tips">主图</i>
    </el-upload>

	<template v-if="addFormData.mainPicUrl">
        <img :src="addFormData.mainPicUrl" class="avatar">
        <span class="el-upload-list__item-actions">
            <span class="el-upload-list__item-preview" @click="handlePreview2('mainPicUrl')"><i class="el-icon-view"></i></span>
            <span class="el-upload-list__item-delete" @click="removePic('mainPicUrl')"><i class="el-icon-delete2"></i></span>
        </span>
    </template>
    <template v-else>
        <i class="el-icon-plus"></i>
    </template>
</template>

<script>
export default {
	data() {
		return {
			action: ''
		}
	}
}
</script>