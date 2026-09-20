<template>
  <view class="invite-page">
    <view class="invite-header">
      请输入邀请码
    </view>
    <view class="invite-tips">
      该品牌内购活动需要邀请码才能进入
    </view>
    <view class="code-boxes">
      <view
        v-for="index in codeLength"
        :key="index"
        class="code-box"
        :class="{ active: inviteCode.length === index - 1, filled: inviteCode.length > index - 1 }"
      >
        {{ inviteCode[index - 1] || '' }}
      </view>
    </view>

    <view class="keyboard">
      <view
        v-for="(row, rowIndex) in keyboardRows"
        :key="rowIndex"
        class="keyboard-row"
      >
        <view
          v-for="(key, keyIndex) in row"
          :key="keyIndex"
          class="keyboard-key"
          :class="{
            placeholder: key === '',
            delete: key === 'delete'
          }"
          @tap="onKeyPress(key)"
        >
          <view
            v-if="key === 'delete'"
            class="delete-btn"
          >
            <view class="delete-icon" />
          </view>
          <text v-else-if="key !== ''">
            {{ key }}
          </text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
const codeLength = 6
const keyboardRows = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['', '0', 'delete']
]

const Data = reactive({
  activityId: '',
  inviteCode: ''
})
const { inviteCode } = toRefs(Data)

onLoad((options) => {
  Data.activityId = options.activityId || ''
})

const onKeyPress = (key) => {
  if (key === '') {
    return
  }
  if (key === 'delete') {
    deleteCode()
    return
  }
  inputCode(key)
}

const deleteCode = () => {
  if (Data.inviteCode.length) {
    Data.inviteCode = Data.inviteCode.slice(0, -1)
  }
}

const inputCode = (key) => {
  if (Data.inviteCode.length >= codeLength) {
    return
  }
  Data.inviteCode += key
}
</script>

<style lang="scss" scoped>
@use "activity";
</style>
