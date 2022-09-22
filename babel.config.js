// 项目发布阶段需要用到的 babel 插件
let prodPlugins = []
if (process.env.NODE_ENV === 'production') {
    prodPlugins = ['transform-remove-console', { exclude: ['error', 'warn'] }]
}

module.exports = {
    presets: ['@vue/cli-plugin-babel/preset'],
    plugins: [
        [
            'component',
            {
                libraryName: 'element-ui',
                styleLibraryName: 'theme-chalk'
            }
        ],

        // 发布产品时候的插件数组
        [...prodPlugins],
        '@babel/plugin-syntax-dynamic-import'
    ]
}
