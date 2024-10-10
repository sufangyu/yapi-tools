# WXT + Vue 3

This template should help get you started developing with Vue 3 in WXT.

## pnpm patch

- raw-to-ts@0.1.4
  - 生成 patch 项目: pnpm patch raw-to-ts@0.1.4
  - 提交 patch 差异: pnpm patch-commit '/Users/yu/Documents/Libs/chrome-extension/wxt/patch_raw-to-ts@0.1.4'
  - changelog:
    - 优化 非顶级节点 interface 名称增加前缀、增加注释（2024-10-10）
    - 修复 部分对象类型的节点无法获取到 description（为空）问题（2024-10-10）
    - 修复 数组类型处理成对象导致无法生成数组类型的interface问题（2024-10-09）
