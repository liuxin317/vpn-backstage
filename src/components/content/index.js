import React, { Component } from 'react';
import Head from '../common/header';
import loadable from "react-loadable";
import {Route} from 'react-router-dom';
import PreLoading from '../common/Preloading';
import './style.scss';

const LoadVpnAdmin = loadable({
  loader: () => import('./vpnAdmin'),
  loading: PreLoading
})

const LoadAccountAdmin = loadable({
  loader: () => import('./accountAdmin'),
  loading: PreLoading
})

class Content extends Component {
  render () {
    const { match } = this.props;

    return (
      <section className="content">
        <Head />

        <div className="content-box">
          <Route path={`${ match.path }/vpn-admin`} component={ LoadVpnAdmin } />
          <Route path={`${ match.path }/account`} component={ LoadAccountAdmin } />
        </div>
      </section>
    )
  }
}

export default Content;