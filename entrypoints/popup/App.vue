<template>
  <div class="setting">
    <section class="setting-header">
      <h1>Yapi Tools 配置</h1>
      <p>配置修改后需刷新页面才生效！！！</p>

      <div class="theme">
        <el-dropdown placement="bottom">
          <el-button plain :icon="currentTheme?.icon"></el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                v-for="item in ThemeList"
                :key="item"
                :icon="item.icon"
                @click="setCurrentTheme(item.value)"
              >
                {{ item.label }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </section>

    <section class="setting-body">
      <div class="setting-item">
        <div class="setting-item__header">
          <h3>基础配置</h3>
        </div>
        <div class="setting-item__body">
          <div class="config-item">
            <span class="label">
              命名带前缀(I)
              <el-popover placement="top" :width="250" trigger="hover">
                <template #reference>
                  <el-button style="padding: 6px" text :icon="QuestionFilled"></el-button>
                </template>
                <template #default>
                  <el-image :src="imgPrefixDemo" style="width: 220px" />
                </template>
              </el-popover>
            </span>
            <div>
              <el-switch
                v-model="setting.interfacePrefix"
                size="default"
                inline-prompt
                @change="handleSettingChange"
              />
            </div>
          </div>

          <div class="config-item">
            <span class="label">
              数据Key路径
              <el-popover placement="top" :width="360" trigger="hover">
                <template #reference>
                  <el-button style="padding: 6px" text :icon="QuestionFilled"></el-button>
                </template>
                <template #default>
                  <p class="text-xs py-1">
                    主要作用于`响应类型`的生成, 默认值是 `data`。
                  </p>
                  <p class="text-xs py-1">
                    值是某个对象节点相对于返回数据的路径, 如: `data.list`
                  </p>
                </template>
              </el-popover>
            </span>
            <div class="flex items-center gap-1">
              <el-input
                v-model.trim="setting.keyPath"
                placeholder="请输入"
                class="input"
                @change="handleSettingChange"
              />
              <el-icon><ArrowRight /></el-icon>
            </div>
          </div>

          <div class="config-item">
            <span class="label">Mock数据</span>
            <div>
              <el-switch
                v-model="setting.generateMockData"
                size="default"
                inline-prompt
                @change="handleSettingChange"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="setting-item">
        <div class="setting-item__header">
          <h3 style="background-color: #3b485b">请求函数</h3>
        </div>
        <div class="setting-item__body">
          <div class="config-item">
            <span class="label">生成代码</span>
            <div>
              <el-switch
                v-model="setting.generateRequestFunc"
                size="default"
                inline-prompt
                @change="handleSettingChange"
              />
            </div>
          </div>
          <div class="config-item">
            <span class="label">
              类型用Types.
              <el-popover placement="top" :width="320" trigger="hover">
                <template #reference>
                  <el-button style="padding: 6px" text :icon="QuestionFilled"></el-button>
                </template>
                <template #default>
                  <el-image :src="imgTypesDemo" style="width: 300px" />
                </template>
              </el-popover>
            </span>
            <div>
              <el-switch
                v-model="setting.requestFuncTypes"
                size="default"
                inline-prompt
                @change="handleSettingChange"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { ElMessage } from 'element-plus';
import { ArrowRight, QuestionFilled } from '@element-plus/icons-vue';
import { settingDefault, storageKeyForSetting, type Setting } from '@/modules/setting';
import { useTheme } from "@/composables";
import imgPrefixDemo from '~/assets/images/prefix-demo.png';
import imgTypesDemo from '~/assets/images/types-demo.png';


const { ThemeList, currentTheme, setCurrentTheme } = useTheme();

const setting = ref<Setting>(settingDefault)

const handleSettingChange = async (val: boolean) => {
  try {
    await storage.setItem(storageKeyForSetting, setting.value);
    ElMessage({
      message: '设置成功, 刷新页面',
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
.setting {
  @apply bg-[#F4F4F4]
  dark:bg-[#454545];
}

.setting-header {
  @apply relative bg-[#18181B] text-white p-6 pb-12 rounded-b-xl;

  h1 {
    @apply text-lg mb-2;
  }

  p {
    @apply text-gray-400;
  }

  .theme {
    @apply absolute top-[26px] right-4;
  }
}

.setting-body {
  @apply p-4 -mt-10;

  .setting-item {
    @apply mb-3 relative rounded-xl p-4 pt-10
       bg-white
       dark:bg-[#242424];

    &:last-child {
      margin-bottom: 0;
    }
  }

  .setting-item__header {
    @apply absolute top-3 left-0 text-white;

    h3 {
      @apply bg-[#D04E24] text-xs py-1 px-2 rounded-r-full;
    }
  }
}
.config-item {
  @apply border-b-[1px] flex justify-between items-center py-1.5
    border-gray-300 
    dark:border-gray-700;

  .label {
    @apply flex items-center gap-0.5;
  }

  .input :deep(.el-input__wrapper) {
    box-shadow: none;
  }
  .input :deep(.el-input__inner) {
    text-align: right;
  }
}
</style>
