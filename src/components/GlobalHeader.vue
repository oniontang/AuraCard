<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import {
  aiApiKey,
  aiModel,
  aiProvider,
  aiProviderOptions,
  aiTestMessage,
  aiTestStatus,
  availableAiModels,
  customAiBaseUrl,
  isAiKeyVisible,
  isAiSettingsOpen,
  isCustomAiProvider,
  isTestingAiConnection,
  selectedAiProvider,
  testAiConnection,
} from '../store'

const props = defineProps<{
  compact?: boolean;
}>();

const selectedAiModel = computed(() =>
  availableAiModels.value.find((model) => model.value === aiModel.value) ?? null
)

const isImageModelSelected = computed(() =>
  ['wan2.7-image-pro', 'qwen-image-2.0', 'z-image-turbo'].includes(
    selectedAiModel.value?.value || ''
  )
)
</script>

<template>
  <header class="globalHeader">
    <div class="globalHeader__inner">
      <RouterLink to="/" class="brand">
        <img src="/logo.png" alt="光语" class="brand__logo" />
        <div>
          <div class="brand__title">光语</div>
          <div v-if="!compact" class="brand__sub">现代简约的图文与封面生成工作台</div>
        </div>
      </RouterLink>
      
      <div class="globalHeader__actions">
        <!-- 默认导航，如果不需要可以通过 slot 覆盖 -->
        <slot name="nav">
        </slot>

        <!-- AI 设置弹窗：现在在所有页面可用 -->
        <slot name="actions">
          <div class="chatTop__settings" :class="{ 'is-open': isAiSettingsOpen }">
            <button class="chatTop__summary btn btn--outline" @click="isAiSettingsOpen = !isAiSettingsOpen">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
              设置
            </button>
            
            <!-- 弹出式配置面板 -->
            <div class="chatTop__drawer" :class="{ 'is-open': isAiSettingsOpen }">
              <div class="chatConfig">
                <button class="chatConfig__close" @click="isAiSettingsOpen = false">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
                <section class="chatConfig__section">
                  <div class="chatConfig__head">
                    <div class="chatConfig__title">API 供应商</div>
                    <div class="chatConfig__desc">选择内置 AI 服务提供商</div>
                  </div>
                  <label class="chatConfig__field">
                    <div class="chatConfig__selectWrap">
                      <select v-model="aiProvider" class="chatConfig__control chatConfig__control--select">
                        <option v-for="provider in aiProviderOptions" :key="provider.id" :value="provider.id">
                          {{ provider.name }}
                        </option>
                      </select>
                      <span class="chatConfig__caret">⌄</span>
                    </div>
                  </label>
                  <div class="chatConfig__tip">{{ selectedAiProvider.description }}</div>
                </section>

                <section v-if="isCustomAiProvider" class="chatConfig__section">
                  <div class="chatConfig__head">
                    <div class="chatConfig__title">API 地址</div>
                    <div class="chatConfig__desc">填写兼容 OpenAI Chat Completions 的服务地址</div>
                  </div>
                  <label class="chatConfig__field">
                    <input v-model="customAiBaseUrl" class="chatConfig__control" placeholder="https://api.example.com" />
                  </label>
                </section>

                <section class="chatConfig__section">
                  <div class="chatConfig__head">
                    <div class="chatConfig__title">API Key</div>
                    <div class="chatConfig__desc">用于 {{ selectedAiProvider.name }}</div>
                  </div>
                  <div class="chatConfig__keyRow">
                    <input
                      v-model="aiApiKey"
                      class="chatConfig__control chatConfig__control--key"
                      :type="isAiKeyVisible ? 'text' : 'password'"
                      autocomplete="off"
                      :placeholder="selectedAiProvider.apiKeyPlaceholder"
                    />
                    <button class="chatConfig__iconBtn" type="button" :title="isAiKeyVisible ? '隐藏 Key' : '显示 Key'" @click="isAiKeyVisible = !isAiKeyVisible">
                      {{ isAiKeyVisible ? '🙈' : '👁' }}
                    </button>
                    <button class="chatConfig__testBtn" type="button" :disabled="isTestingAiConnection" @click="testAiConnection">
                      {{ isTestingAiConnection ? '测试中…' : '测试连接' }}
                    </button>
                  </div>
                  <div v-if="aiTestMessage" class="chatConfig__feedback" :class="`chatConfig__feedback--${aiTestStatus}`">
                    {{ aiTestMessage }}
                  </div>
                </section>

                <section class="chatConfig__section">
                  <div class="chatConfig__head">
                    <div class="chatConfig__title">AI 模型</div>
                    <div class="chatConfig__desc">选择本次对话使用的模型</div>
                  </div>
                  <label v-if="!isCustomAiProvider" class="chatConfig__field">
                    <div class="chatConfig__selectWrap">
                      <select v-model="aiModel" class="chatConfig__control chatConfig__control--select">
                        <option
                          v-for="model in availableAiModels"
                          :key="model.value"
                          :value="model.value"
                        >
                          {{ model.label }}
                        </option>
                      </select>
                      <span class="chatConfig__caret">⌄</span>
                    </div>
                  </label>
                  <label v-else class="chatConfig__field">
                    <input v-model="aiModel" class="chatConfig__control" placeholder="输入模型名称，例如 gpt-4o-mini" />
                  </label>
                  <div v-if="isImageModelSelected" class="chatConfig__tip">
                    当前模型会用于封面 AI 创作与图片模型连接测试，不适用于聊天整理。
                  </div>
                </section>
              </div>
            </div>
          </div>
        </slot>
      </div>
    </div>
  </header>
  
  <!-- 抽屉展开时的遮罩层 -->
  <div v-if="isAiSettingsOpen" class="chatTop__overlay" @click="isAiSettingsOpen = false"></div>
</template>

<style scoped>
.globalHeader {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 28px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: var(--header-height);
  z-index: 40;
  background: var(--header-bg);
  backdrop-filter: var(--header-blur);
  -webkit-backdrop-filter: var(--header-blur);
  border-bottom: var(--header-border);
  box-shadow: var(--header-shadow);
}

.globalHeader__inner {
  width: min(var(--content-max-width), calc(100vw - var(--space-2xl)));
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-lg);
}

.brand {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  text-decoration: none;
  cursor: pointer;
  transition: transform 0.2s ease;
}
.brand:hover {
  transform: translateY(-1px);
}

.brand__logo {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-sm);
  object-fit: cover;
}

.brand__title {
  font-weight: 800;
  font-size: 18px;
  letter-spacing: 0.3px;
  line-height: 1.2;
  color: var(--text);
}

.brand__sub {
  font-size: 12px;
  color: var(--muted);
  margin-top: 2px;
  font-weight: 500;
}

.globalHeader__actions {
  display: flex;
  align-items: center;
  gap: var(--space-lg);
}

@media (max-width: 767px) {
  .globalHeader {
    height: 52px;
    padding: 0 var(--space-lg);
  }

  .globalHeader__inner {
    width: 100%;
    gap: var(--space-sm);
  }

  .brand__logo {
    width: 30px;
    height: 30px;
    border-radius: var(--radius-xs);
  }

  .brand__title {
    font-size: 16px;
  }

  .brand__sub {
    display: none;
  }

  .globalHeader__actions {
    gap: var(--space-sm);
  }

  /* 移动端 AI 设置按钮缩小 */
  .chatTop__summary {
    font-size: 12px;
    padding: 6px 12px;
  }
}
</style>
