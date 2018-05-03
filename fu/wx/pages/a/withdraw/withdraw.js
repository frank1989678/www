// pages/a/withdraw/withdraw.js

const _api = require('../../../lib/api.js');
const _lib = require('../../../lib/lib.js');
const _reg = require('../../../lib/reg.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        money: 0, // 提现金额
        surplus: '', // 余额
        account: '',
        realname: '',
        minMoney: 100,
        disabled: true
    },
    // 数据绑定
    changeInput: function(e) {
        const key = e.target.id;
        const val = _lib.trim(e.detail.value);
        this.setData({
            [key]: val
        })
    },
    // 获取零钱
    getBalance: function() {
        _lib.ajax(_api.b.getBalance, {}, res => {
            const money = res.data || 0;
            if (money === 0) {
                _lib.goback();
            } else {
                this.setData({
                    surplus: money
                })
            }
        })
    },

    // 最多提现
    getAll: function() {
        this.setData({
            money: this.data.surplus
        })
    },

    submitForm: function() {
        const para = {
            money: this.data.money,
            accNo: this.data.account,
            accUser: this.data.realname
        }
        if (para.money == '') {
            _lib.showMsg('请输入提现金额')
        } else if (!_reg.isMoney(para.money)) {
            _lib.showMsg('金额输入错误，小数部分最多到分');
        } else if (para.money > para.surplus) {
            _lib.showMsg('提款金额超出余额');
        } else if (para.money < para.minMoney) {
            _lib.showMsg('提现金额至少' + this.data.minMoney + '元');
        } else if (para.account == '') {
            _lib.showMsg('请输入支付宝账号')
        } else if (para.realname == '') {
            _lib.showMsg('请输入真实姓名')
        } else {
            _lib.ajax(_api.b.getBackMoney, para, function(res) {
                if (res.status === 200) {
                    wx.redirectTo({
                        url: '/pages/a/suc/suc?price=' + res.data.money
                    })
                } else {
                    _lib.showMsg(res.msg);
                }
            })
        }
    },

    goback: function() {
        _lib.goback();
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.getBalance();
    }
})