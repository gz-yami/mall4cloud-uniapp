<template>
  <view class="page-register">
    <view class="tab">
      <view class="item active">
        注册
      </view>
      <view
        class="item"
        @tap="toLogin"
      >
        登录
      </view>
    </view>
    <!-- 设置密码 -->
    <view class="con">
      <view class="item">
        <input
          v-model="userName"
          type="text"
          class="text"
          placeholder="设置账户名称"
        >
      </view>
      <view
        v-if="errorTips == 4"
        class="error"
      >
        <text class="error-icon">
          !
        </text>账号为4~16位字母、数字或下划线
      </view>
      <view class="item">
        <input
          v-model="password"
          type="password"
          class="text"
          placeholder="设置登录密码"
        >
      </view>
      <view
        v-if="errorTips == 5"
        class="error"
      >
        <text class="error-icon">
          !
        </text>密码由字母加数字或符号至少两种以上字符组成6-20位半角字符，区分大小写
      </view>
      <view class="item">
        <input
          v-model="confirmPwd"
          type="password"
          class="text"
          placeholder="再次输入密码"
          @input="validate"
        >
      </view>
      <view
        v-if="errorTips == 6"
        class="error"
      >
        <text class="error-icon">
          !
        </text>确认密码不能为空
      </view>
      <view
        v-if="errorTips == 7"
        class="error"
      >
        <text class="error-icon">
          !
        </text>两次输入的密码不一致，请重新输入
      </view>
      <view
        class="btn"
        @tap="getRegister"
      >
        注册
      </view>
    </view>
    <!-- 注册成功 -->
    <view
      class="popup-min"
      :class="{ 'show': isShowSuccessPopup }"
    >
      <view class="popup-mask" />
      <view class="popup-con-middle register-success">
        <view class="img" />
        <view class="text">
          恭喜您注册成功
        </view>
        <view class="des">
          正在跳转首页{{ loCount }}s...
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { reactive } from 'vue'
import Wechat from '../../utils/wechat.js'

const Data = reactive({
  isWechat: false, // 是否为微信环境
  isSetInfo: false, // 设置信息
  isShowSuccessPopup: false, // 注册成功弹窗
  password: '', // 密码
  confirmPwd: '', // 确认密码
  nickName: '', // 昵称
  userName: '', // 用户名

  errorTips: 0, // 输入错误提示

  registerType: 0, // 注册方式 0.直接注册
  tempUid: '', // 当账户未绑定时，临时的uid

  // 完成跳转首页倒计时
  loTimer: null,
  loCount: 0
})
const { isShowSuccessPopup, password, confirmPwd, userName, errorTips, loCount } = toRefs(Data)

onLoad(() => {
  // #ifdef H5
  Data.isWechat = Wechat.isWechat()
  if (Data.isWechat) {
    Data.registerType = 1
    Data.tempUid = uni.getStorageSync('cloudTempUid')
  }
  // #endif

  // #ifdef MP-WEIXIN
  Data.registerType = 2
  Data.tempUid = uni.getStorageSync('cloudTempUid')
  // #endif
})

const validate = () => {
  const reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z\W]{6,20}$/
  const passwordResult = reg.test(Data.password)
  if (!util.checkUserName(Data.userName)) {
    Data.errorTips = 4
    return false
  }
  if (!Data.password) {
    Data.errorTips = 5
    return false
  }
  if (!passwordResult) {
    Data.errorTips = 5
    return false
  }
  if (!Data.confirmPwd) {
    Data.errorTips = 6
    return false
  }
  if (Data.confirmPwd !== Data.password) {
    Data.errorTips = 7
    return false
  }
  Data.errorTips = 0
  return true
}

// 去登录
const toLogin = () => {
  uni.redirectTo({
    url: '/pages/login/login'
  })
}

// 设置信息
const setInfo = () => {
  Data.isSetInfo = true
}

/**
     * 注册
     */
const getRegister = () => {
  const isvalid = validate()
  if (!isvalid) return
  const params = {
    url: '/mall4cloud_user/ua/user/register',
    method: 'POST',
    data: {
      userName: Data.userName, // 昵称
      password: Data.password, // 密码
      tempUid: Data.tempUid // 当账户未绑定时，临时的uid
    }
  }
  http.request(params).then((res) => {
    Data.isShowSuccessPopup = true
    uni.setStorageSync('cloudToken', res.accessToken)
    uni.setStorageSync('cloudLoginResult', res) // 保存整个登录数据
    setTimeout(() => {
      uni.switchTab({
        url: '/pages/index/index'
      })
    }, 3000)
    const loTimeCount = 3
    if (!Data.loTimer) {
      Data.loCount = loTimeCount
      Data.loTimer = setInterval(() => {
        if (Data.loCount > 0 && Data.loCount <= loTimeCount) {
          Data.loCount--
        } else {
          clearInterval(Data.loTimer)
          Data.loTimer = null
        }
      }, 1000)
    }
  })
}
</script>

<style lang="scss" scoped>
@use "../login/login.scss";
@use "../../popup.scss";
</style>
