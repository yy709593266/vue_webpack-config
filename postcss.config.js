// 优化编译后的css代码

const autoprefixer = require('autoprefixer')  //autoprefixer自动添加css属性前缀

module.exports = {
    plugins: [
        autoprefixer()
    ]
}
//npm i postcss-loader autoprefixer babel-loader babel-core