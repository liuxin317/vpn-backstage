import React, { Component } from 'react';
import loadable from "react-loadable";
import {Route} from 'react-router-dom';
import PreLoading from '../../common/Preloading';

const LoadAccountList = loadable({
  loader: () => import('./list'),
  loading: PreLoading
})

class AccountAdmin extends Component {
  render () {
    const { match } = this.props;

    return (
      <section>
        <Route path={`${ match.path }/list`} component={ LoadAccountList } />
      </section>
    )
  }
}

export default AccountAdmin;