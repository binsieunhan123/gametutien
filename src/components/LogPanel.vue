<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: 'Nhật ký hệ thống'
  },
  messages: {
    type: Array,
    default: () => []
  }
})

// Mảng log và tham chiếu cuộn
const logs = ref([])
const scrollRef = ref(null)

// Tạo Web Worker
const logWorker = ref(null)

// Khởi tạo Worker
onMounted(() => {
  logWorker.value = new Worker(new URL('../workers/log.js', import.meta.url), { type: 'module' })

  // Lắng nghe thông điệp từ Worker
  logWorker.value.onmessage = (e) => {
    if (e.data.type === 'LOGS_UPDATED') {
      logs.value = e.data.logs
      // Cuộn xuống cuối ở frame tiếp theo
      setTimeout(() => {
        if (scrollRef.value) {
          scrollRef.value.scrollTo({ top: 99999, behavior: 'smooth' })
        }
      })
    }
  }
})

// Hủy Worker khi component unmount
onUnmounted(() => {
  if (logWorker.value) {
    logWorker.value.terminate()
  }
})

// Hàm thêm log
const addLog = (type, content) => {
  if (logWorker.value) {
    logWorker.value.postMessage({
      type: 'ADD_LOG',
      data: { type, content }
    })
  }
}

// Expose
defineExpose({
  addLog
})
</script>

<template>
  <n-divider>{{ title }}</n-divider>
  <n-card class="log-panel" :style="$attrs.style">
    <n-scrollbar ref="scrollRef" trigger="none" style="max-height: 200px;">
      <div class="log-container" v-if="logs.length">
        <div v-for="(log, index) in logs" :key="index" class="log-item">
          <n-tag :type="log.type" size="small" class="log-type">
            {{ log.time }}
          </n-tag>
          <span class="log-content">
            <n-gradient-text :type="log.type">
              {{ log.content }}
            </n-gradient-text>
          </span>
        </div>
      </div>
      <n-empty v-else description="Chưa có nhật ký" />
    </n-scrollbar>
  </n-card>
</template>

<style scoped>
.log-panel {
  margin-top: 12px;
}

.log-container {
  padding: 8px;
}

.log-item {
  margin-bottom: 8px;
  display: flex;
  align-items: flex-start;
}

.log-type {
  margin-right: 8px;
  flex-shrink: 0;
}

.log-content {
  flex-grow: 1;
  word-break: break-all;
}
</style>
