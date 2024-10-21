<template>
  <div class="setting-header">
    <a class="logo" href="https://wxt.dev" target="_blank">
      <img src="/wxt.svg" alt="WXT logo" />
    </a>
    <h1>配置</h1>
  </div>

  <div class="setting-body">
    <div class="setting-item">
      <el-alert
        title="配置修改后需刷新页面才生效！！！"
        size="small"
        type="success"
        :closable="false"
      />
    </div>

    <div class="setting-item">
      <span class="label">接口命名带前缀(I):</span>
      <div>
        <el-switch
          v-model="setting.interfacePrefix"
          inline-prompt
          active-text="是"
          inactive-text="否"
          @change="handleSettingChange"
        />
      </div>
    </div>

    <div class="setting-item">
      <span class="label">有效对象 Key 路径:</span>
      <div>
        <el-input
          v-model.trim="setting.keyPath"
          placeholder="请输入"
          @change="handleSettingChange"
        />
      </div>
    </div>

    <div class="setting-item">
      <span class="label">生成 Mock 数据:</span>
      <div>
        <el-switch
          v-model="setting.generateMockData"
          inline-prompt
          active-text="是"
          inactive-text="否"
          @change="handleSettingChange"
        />
      </div>
    </div>

    <div class="setting-item">
      <span class="label">生成请求函数代码:</span>
      <div>
        <el-switch
          v-model="setting.generateRequestFunc"
          inline-prompt
          active-text="是"
          inactive-text="否"
          @change="handleSettingChange"
        />
      </div>
    </div>

    <div class="setting-item">
      <span class="label">类型使用时带前缀(Types.) :</span>
      <div>
        <el-switch
          v-model="setting.requestFuncTypes"
          inline-prompt
          active-text="是"
          inactive-text="否"
          @change="handleSettingChange"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { settingDefault, storageKeyForSetting, type Setting } from '@/modules/setting';
import { ElMessage } from 'element-plus';

const setting = ref<Setting>(settingDefault)


const handleSettingChange = async (val: boolean) => {
  console.log('setting', setting.value);
  try {
    await storage.setItem(storageKeyForSetting, setting.value);
    ElMessage({
      message: '设置成功, 请刷新',
      type: 'success',
      grouping: true,
    });
  } catch (error) {
    console.error(error);
    ElMessage({
      message: '设置失败' + JSON.stringify(error),
      type: 'error',
      grouping: true,
    });
  }
};



const initSetting = async () => {
  const installSetting = await storage.getItem(storageKeyForSetting);
  if (installSetting) {
    setting.value = {
      ...settingDefault,
      ...((installSetting ?? {}) as Setting),
    };
  }
}

onMounted(async () => {
  await initSetting();
})
</script>

<style lang="postcss" scoped>
.setting-header {
  @apply flex justify-center items-center
    py-2 px-4 bg-[#F9FAFB];

  h1 {
    @apply text-base;
  }

  .logo {
    @apply block mr-2 text-[0];

    img {
      @apply h-5;
    }
  }
}

.setting-body {
  @apply text-sm p-4;

  .setting-item {
    @apply flex items-center mb-3;

    &:last-child {
      margin-bottom: 0;
    }

    .label {
      @apply mr-2 text-[#666];
    }

    > div {
      @apply flex-1;
    }
  }
}
</style>
