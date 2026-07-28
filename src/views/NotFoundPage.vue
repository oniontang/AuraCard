<template>
  <div class="not-found">
    <div class="not-found__code">404</div>
    <p class="not-found__text">页面不存在或已被移除</p>
    <a class="not-found__link" @click="goHome">返回首页</a>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();
const goHome = () => router.push("/");
</script>

<style scoped>
.not-found {
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
}
.not-found__code {
  font-size: 72px;
  font-weight: 700;
  color: #9ca3af;
  line-height: 1;
}
.not-found__text {
  font-size: 16px;
  color: #6b7280;
  margin: 0;
}
.not-found__link {
  color: #2563eb;
  cursor: pointer;
  font-size: 15px;
}
.not-found__link:hover {
  text-decoration: underline;
}
</style>
