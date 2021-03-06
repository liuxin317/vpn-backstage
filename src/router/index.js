import React, { Component } from 'react';
import PreLoading from '../components/common/Preloading';
import loadable from 'react-loadable'; // 代码的拆分和懒加载
import {Route} from 'react-router-dom';

// 登录成功页面集合
const loadContent = loadable({
  loader: () => import('../components/content'),
  loading: PreLoading
})

// 登录页面
const loadLogin = loadable({
  loader: () => import('../components/login'),
  loading: PreLoading
})

class ViewRoute extends Component {
  render () {
    return (
      <section>
        <Route path="/" component={ loadLogin } exact />
        <Route path="/content" component={ loadContent } />
      </section>
    )
  }
}

export default ViewRoute;