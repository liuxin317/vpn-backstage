import React, { Component } from 'react';
import Head from '../common/header';
import loadable from "react-loadable";
import {Route, Redirect} from 'react-router-dom';
import PreLoading from '../common/Preloading';
import { connect } from 'react-redux';
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
    const { match, defaultMnue } = this.props;

    return (
      <section className="content">
        <Head />

        <div className="content-box">
          {
            defaultMnue
            ?
            <Route path={`${ match.path }`} exact render={() => {
              return <Redirect push to={ defaultMnue } />
            }} />
            :
            ""
          }
          
          <Route path={`${ match.path }/vpn-admin`} component={ LoadVpnAdmin } />
          <Route path={`${ match.path }/account`} component={ LoadAccountAdmin } />
          <Route path={`${ match.path }/center`} component={ LoadMyCenter } />
        </div>
      </section>
    )
  }
}

const mapStateToProps = (store) => {
  return {
    defaultMnue: store.common.defaultMnue
  }
}

const ConnectContent = connect(
  mapStateToProps
)(Content)

export default ConnectContent;