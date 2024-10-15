# WXT + Vue 3

This template should help get you started developing with Vue 3 in WXT.

## pnpm patch

- raw-to-ts@0.1.4
  - 生成 patch 项目: pnpm patch raw-to-ts@0.1.4
  - 提交 patch 差异: pnpm patch-commit '/Users/yu/Documents/Libs/chrome-extension/wxt/patch_raw-to-ts@0.1.4'
  - changelog:
    - 修复 部分的属性为必填非不是可选问题（2024-10-15）
    - 优化 第一层是数组类型时, 使用 type 定义数组, 同时定义数组单项响应类型（2024-10-14）
    - 修复 数组类型的 schema 节点无法获取描述问题（2024-10-12）
    - 修复 简单数组类型([number]、[string]、[boolean])生成的类型是 `xxx[][]` 问题（2024-10-12）
    - 优化 非顶级节点 interface 名称增加前缀、增加注释（2024-10-10）
    - 修复 部分对象类型的节点无法获取到 description（为空）问题（2024-10-10）
    - 修复 数组类型处理成对象导致无法生成数组类型的interface问题（2024-10-09）
