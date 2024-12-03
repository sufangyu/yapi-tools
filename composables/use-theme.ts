import { Sunny, Moon, Monitor } from '@element-plus/icons-vue';

export enum THEME_ENUM {
  浅色 = 'light',
  深色 = 'dark',
  系统 = 'system'
}

const STORAGE_KEY_THEME = 'theme';
const ThemeList = [
  { label: '浅色', value: THEME_ENUM.浅色, icon: Sunny },
  { label: '深色', value: THEME_ENUM.深色, icon: Moon },
  { label: '系统', value: THEME_ENUM.系统, icon: Monitor }
];

const matchMedia = window.matchMedia('(prefers-color-scheme: dark)');
const autoSystemTheme = () => {
  matchMedia.matches
    ? document.documentElement.classList.add('dark')
    : document.documentElement.classList.remove('dark');
};
matchMedia.onchange = () => {
  // 不存在本地缓存或者设置为跟随系统时才处理
  (!currentThemeCode.value || ['system'].includes(currentThemeCode.value)) && autoSystemTheme();
};

const currentThemeCode = ref<THEME_ENUM>(THEME_ENUM.系统);
const currentTheme = computed(() => {
  return ThemeList.find((item) => item.value === currentThemeCode.value);
});
const setCurrentTheme = (theme: THEME_ENUM) => {
  if (theme !== currentThemeCode.value) {
    currentThemeCode.value = theme;
    localStorage.setItem(STORAGE_KEY_THEME, theme);
  }

  switch (theme) {
    case THEME_ENUM.深色:
      document.documentElement.classList.add('dark');
      break;
    case THEME_ENUM.浅色:
      document.documentElement.classList.remove('dark');
      break;
    case THEME_ENUM.系统:
    default:
      autoSystemTheme();
      break;
  }
};

export function useTheme() {
  /**
   * 初始化主题
   */
  const initTheme = () => {
    const themeStorageCode = (localStorage.getItem(STORAGE_KEY_THEME) ??
      THEME_ENUM.系统) as THEME_ENUM;
    currentThemeCode.value = themeStorageCode;

    setCurrentTheme(themeStorageCode);
  };

  // 监听缓存的变化
  const listernStorage = () => {
    window.addEventListener('storage', (ev) => {
      if (ev.key === STORAGE_KEY_THEME) {
        setCurrentTheme(ev.newValue as THEME_ENUM);
      }
    });
  };

  return {
    THEME_ENUM,
    STORAGE_KEY_THEME,
    ThemeList,
    initTheme,
    listernStorage,
    currentTheme,
    currentThemeCode,
    setCurrentTheme
  };
}
