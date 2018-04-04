import React, { Component } from 'react';
import Head from '../common/header';
import loadable from "react-loadable";
import {Route, Link} from 'react-router-dom';
import PreLoading from '../common/Preloading';
import './style.scss';

// VPN管理
const LoadVpnAdmin = loadable({
  loader: () => import('./vpnAdmin'),
  loading: PreLoading
})

// 账户管理
const LoadAccountAdmin = loadable({
  loader: () => import('./accountAdmin'),
  loading: PreLoading
})

// 个人中心
const LoadMyCenter = loadable({
  loader: () => import('./myCenter'),
  loading: PreLoading
})

class Content extends Component {
  render () {
    const { match } = this.props;

    return (
      <section className="content">
        <Head />

        <div className="content-box">
          <Link to={{ pathname: "/content/vpn-admin" }}>vpn管理</Link>
          <Link to={{ pathname: "/content/account/list/1"}}>账户列表</Link>
          <Link to={{ pathname: "/content/account/list/2"}}>黑名单</Link>
          <Link to={{ pathname: "/content/center"}}>个人中心</Link>
          
          <Route path={`${ match.path }/vpn-admin`} component={ LoadVpnAdmin } />
          <Route path={`${ match.path }/account`} component={ LoadAccountAdmin } />
          <Route path={`${ match.path }/center`} component={ LoadMyCenter } />
        </div>
      </section>
    )
  }
}

export default Content;