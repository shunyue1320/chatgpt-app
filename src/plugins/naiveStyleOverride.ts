// 解决 naive-ui 与 tailwind 的样式冲突 https://www.naiveui.com/zh-CN/os-theme/docs/style-conflict
export default function setupNaiveStyleOverride() {
  const meta = document.createElement('meta')
  meta.name = 'naive-ui-style'
  document.head.appendChild(meta)
}
