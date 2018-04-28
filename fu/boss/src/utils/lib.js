import router from '@/router'

export function axiosDone(res, callback) {
	// 处理ajax结果
	const { msg, status } = res;
    if (res.status.toString() !== 200) {
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
        router.push({ path: '/verity/list' });
    }
  	return Cookies.get(TokenKey)
}

export function ajaxResult(ui, res, callback) {
    if (res.status !== 200) {
        ui.$message.error(res.msg);
    } else {
        res.msg && ui.$message.success(res.msg);
        if (typeof callback === 'function') {
            callback();
        }
    }
}

export function checkFileType(ui, file, options) {
    var defaults = {
        size: 2 * 1024 * 1024,
        allowed: ['jpeg', 'jpg', 'png', 'bpm', '.gif'],
    }
    let pass = false;
    const set = Object.assign(defaults, options || {});
    const filetype = file.type;

    if (file.size > set.size) {
        ui.$message.error('上传图片大小不能超过 ' + set.size/2014/1024 + 'MB!');

    } else if (file.type) {
        for (let i = 0; i < set.allowed.length; i++) {
            if (filetype.indexOf(set.allowed[i]) > -1) {
                pass = true;
                break;
            }
        }
    }

    if (!pass) {
        ui.$message.error('只能上传' + set.allowed.join('、') + '类型文件');
    }
    return pass;
}

export function getToken() {
    const token = Cookies.get('token') || '';
    return {
        token: token
    }
}

export function logout(res) {
    // sessionStorage.setItem('user', JSON.stringify(data.id));
    if (res) {
        Cookies.set('token', res.token);
        Cookies.set('sysUserName', res.sysUserName);
        router.push({ path: '/user/list' });
    } else {
        Cookies.remove('token');
        Cookies.remove('sysUserName');
        router.push({ path: '/login' });
    }
}