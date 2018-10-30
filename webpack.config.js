// import { HotModuleReplacementPlugin } from '../../../Library/Caches/typescript/2.6/node_modules/@types/webpack';

const path = require('path')  //path是node.js的一个基本包用来处理路径
const HTMLPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const ExtractPlugin = require('extract-text-webpack-plugin')//用于将非js代码打包成静态文件

// package.json中build或者dev启动脚本时定义的环境变量都在process.env对象中
const isDev = process.env.NODE_ENV === 'development' 

const config = {
    target: 'web', //编译为类浏览器环境里可用（默认值）
    // dirname代表当前文件（即webpack.config.js）所在的地址，也就是根目录
    // path.join(x,y)将两个地址进行拼接
    // entry指定入口文件
    entry: path.join(__dirname, 'src/index.js'),
    // 文件出口配置
    // 出口文件命名为bundle.js，并新建一个dist文件用来存放
    // 整体就是：输入一个index入口文件，最终webpack会将该文件以及内部所依赖的内容都打包成一个可以在浏览器中运行的bundle.js
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'  //告诉webpack使用vue-loader来处理.vue文件类型，最后输出正确的js代码
            },
            {
                test: /\.jsx$/,
                loader: 'babel-loader'  
            },
            {
                test: /\.css$/,   //因为css有多种方式，比如行内，外联，内联，所以使用use模式，use接受一个数组
                use: [           //webpack会将css以一段js代码的形式出现，用来将css代码写到html中去
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.(gif|jpg|jpeg|png|svg)$/,
                use: [
                    {            //可以使用对象数组，对对象进行选项配置
                        loader: 'url-loader',    //url-loader可以将我们的图片转换成base64代码直接写在js里面，不用生成新文件(减少了http请求)
                        options: {               //对转换后的内容进行选项配置(大小，名字等)
                            limit: 1024,
                            name: '[name].[ext]'    //name->文件的名，ext->文件的扩展名(jpg、png...)
                        }
                    }
                ]
            }
        ]
    },
    plugins:[
        //webpack的defineplugin,这里定义的process.env变量在我们自己写的js代码中被拿到，用来判断当前环境
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: isDev ? '"development"' : '"production"'
            }
        }),
        new HTMLPlugin()
    ] 
}

if(isDev){
    //开发环境我们要对styl格式的文件进行css的编译并一起打包成在bundle文件中，但是线上环境我们要将样式文件单独打包
    config.module.rules.push({
        test: /\.styl/,
        use: [
            'style-loader',
            'css-loader',
            {
                loader: 'postcss-loader',
                options: {
                    sourceMap: true
                }
            },
            'stylus-loader'
        ]
    })
    config.devtool = '#cheap-module-eval-source-map'  //映射本地代码和编译后代码，便于调试
    config.devServer = {
        port: '8000',
        host: '0.0.0.0',
        overlay: {
            errors: true  //使用webpack进行编译如果出错就显示在网页上
        },
        open: true,  //项目启动后自动打开浏览器
        historyApiFallback: {},  //路由配置，详情参考API
        hot: true  //热加载（不会刷新整个页面，只重新渲染当前组件的内容）
    }
    //热加载相关的plugin
    config.plugins.push(
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
    )
} else {
    //线上环境
    config.output.filename = '[name].[chunkhash:8].js'//打包后的js文件名修改并加上hash值
    config.module.rules.push(
        {
            test: /\.styl/,
            use: ExtractPlugin.extract({
                fallback: 'style-loader',
                use: [
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: true
                        }
                    },
                    'stylus-loader'
                ]
            })
        }
    )
    config.plugins.push(
        new ExtractPlugin('styles: [contentHash:8].css')
    )
    //此时打包后的代码中就会有一个css文件，文件名还是带有hash值的
}

module.exports = config