
<template>
  <div class="setting-header">
    <a class="logo" href="https://wxt.dev" target="_blank">
      <img src="/wxt.svg" alt="WXT logo" />
    </a>
    <h1>配置</h1>
  </div>
  
  <div class="setting-body">
    <div class="setting-item">
      <span class="label">接口命名带前缀 I:</span>
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
      <span class="label">请求函数类型用 Types :</span>
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


<style lang="scss" scoped>
.setting-header {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4px 16px;

  h1 {
    font-size: 16px;
    font-weight: normal;
  }

  .logo {
    display: block;
    margin-right: 8px;
    font-size: 0;

    img {
      height: 20px;
    }
  }
}



.setting-body {
  padding: 16px;
  font-size: 14px;

  .setting-item {
    display: flex;
    align-items: center;
    margin-bottom: 12px;

    :last-child {
      margin-bottom: 0%;
    }

    .label {
      margin-right: 8px;
      color: #333;
    }

    > div {
      flex: 1;
    }
  }
}
</style>
