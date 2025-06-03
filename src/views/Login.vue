<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useMessage } from 'naive-ui'
import { remoteLogin, remoteRegister, setUsername } from '../stores/remoteDB'

const router = useRouter()
const message = useMessage()
const username = ref('')
const password = ref('')
const isRegister = ref(false)

const submit = async () => {
  try {
    if (isRegister.value) {
      await remoteRegister(username.value, password.value)
      message.success('Đăng ký thành công')
    } else {
      await remoteLogin(username.value, password.value)
      message.success('Đăng nhập thành công')
    }
    setUsername(username.value)
    router.push('/')
  } catch (err) {
    message.error(err?.message || 'Thao tác thất bại')
  }
}
</script>

<template>
  <n-space vertical class="login-container">
    <h2>{{ isRegister ? 'Đăng ký' : 'Đăng nhập' }}</h2>
    <n-input v-model:value="username" placeholder="Tên đăng nhập" />
    <n-input type="password" v-model:value="password" placeholder="Mật khẩu" />
    <n-button type="primary" @click="submit">
      {{ isRegister ? 'Đăng ký' : 'Đăng nhập' }}
    </n-button>
    <n-button text @click="isRegister = !isRegister">
      {{ isRegister ? 'Đã có tài khoản? Đăng nhập' : 'Chưa có tài khoản? Đăng ký' }}
    </n-button>
  </n-space>
</template>

<style scoped>
.login-container {
  max-width: 320px;
  margin: 100px auto;
}
</style>
