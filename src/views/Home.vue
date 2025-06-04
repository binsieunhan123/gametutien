<script setup>
import { usePlayerStore } from '../stores/player'
import { useMessage } from 'naive-ui'
import { useRouter } from 'vue-router'
const router = useRouter()
const playerStore = usePlayerStore()
const message = useMessage()

// Nhận gói tân thủ
const receiveNewPlayerGift = () => {
  playerStore.spiritStones += 20000
  playerStore.isNewPlayer = false
  router.push('/cultivation')
  message.success('Nhận được 20000 linh thạch')
  message.success('Nhận gói tân thủ thành công')
}

</script>

<template>
  <n-space class="home-container" vertical>
    <n-space justify="center">
      <h2>Cảm ơn bạn đã chơi Tu Tiên Nhàn Rỗi</h2>
    </n-space>
    <n-space justify="center">
      <p>Hãy bắt đầu hành trình tu tiên của bạn!</p>
    </n-space>
    <n-space justify="center" v-if="playerStore.isNewPlayer">
      <n-button type="success" @click="receiveNewPlayerGift">
        Nhận gói tân thủ
      </n-button>
    </n-space>
  </n-space>
</template>

<style scoped>
.home-container {
  padding: 2rem;
}

.home-container h2 {
  margin-bottom: 1rem;
  color: #2080f0;
}

.home-container p {
  color: #666;
}
</style>
