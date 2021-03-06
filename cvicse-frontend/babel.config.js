module.exports = function (api) {
  api.cache(true)
  const presets = [
    '@vue/app'
  ]
  const plugins = [
    // https://babeljs.io/docs/en/babel-plugin-transform-runtime/
    '@babel/plugin-transform-runtime',
    // 使用 component 插件实现 Element UI 按需加载
    [
      'component',
      {
        libraryName: 'element-ui',
        styleLibraryName: 'theme-chalk'
      }
    ]
  ]
  // 使用 require-context-hook 插件解决 jest 不能解析 require.context 的问题，仅限 test 模式使用
  if (process.env.NODE_ENV === 'test') {
    plugins.push('require-context-hook')
  }

  return {
    presets,
    plugins
  }
}
