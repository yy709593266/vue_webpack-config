import Vue from 'vue'
import App from './app.vue'

import './assets/images/jay4.png'
import './assets/style/test.css'
import './assets/style/test-stylus.styl'

const root = document.createElement('div')
document.body.appendChild(root)


new Vue({
    render: (h) => h(App)
}).$mount(root)