import React, { Component } from 'react';
import { Icon, message } from 'antd';
import HttpRequest from '../../../requset/Fetch';
import { getCookie, removeCookie } from '../methods';
import Store from '../../../store';
import Type from '../../../action/Type';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import './style.scss';

const userInfo = getCookie("userInfo") ? JSON.parse(getCookie("userInfo")) : {};

// 后级递归菜单
class menuListLast extends Component {
  render () {
    const { menuData, upMenuData } = this.props;

    return (
      <ol className="last-menu">
        {
          menuData.map((item, index) => {
            return (
              <li key={ index } onClick={ upMenuData.bind(this, item) }>
                <Link to={ item.href }>
                  <span>{ item.title }</span>

                  {
                    item.children && item.children.length 
                    ?
                    <menuListLast menuData={ item.children } upMenuData={ upMenuData } />
                    :
                    ""
                  }
                </Link>
              </li>
            )
          })
        }
      </ol>
    )
  }
}

// 二级菜单
class MenuListTwo extends Component {
  render () {
    const { menuData, upMenuData } = this.props;

    return (
      <ol className="two-menu">
        {
          menuData.map((item, index) => {
            return (
              <li key={ index } onClick={ upMenuData.bind(this, item) }>
                <Link to={ item.href }>
                  <span>{ item.title }</span>

                  {
                    item.children && item.children.length 
                    ?
                    <menuListLast menuData={ item.children } upMenuData={ upMenuData } />
                    :
                    ""
                  }
                </Link>
              </li>
            )
          })
        }
      </ol>
    )
  }
}

// 一级菜单
class MenuListOne extends Component {
  render () {
    const { menuData, upMenuData } = this.props;

    return (
      <ul className="menu-list">
        {
          menuData.map((item, index) => {
            return (
              item.children && item.children.length 
              ?
              <li key={ index } className={ item.active ? "active": "" }>
                <figure>
                  <Icon type="file-text" />
                  <figcaption>{ item.title }</figcaption>
                </figure>

                {
                  item.children && item.children.length 
                  ?
                  <MenuListTwo menuData={ item.children } upMenuData={ upMenuData } />
                  :
                  ""
                }
              </li>
              :
              <li key={ index } className={ item.active ? "active": "" } onClick={ upMenuData.bind(this, item) }>
                <Link to={ item.href }>
                  <figure>
                    <Icon type="file-text" />
                    <figcaption>{ item.title }</figcaption>
                  </figure>

                  {
                    item.children && item.children.length 
                    ?
                    <MenuListTwo menuData={ item.children } upMenuData={ upMenuData } />
                    :
                    ""
                  }
                </Link>
              </li>
            )
          })
        }
      </ul>
    )
  }
}

class Head extends Component {
  state = {
    menuData: [], // 菜单数据
    redirect: false, // 退出跳转状态
    zIndex: "", // 当前菜单所在一级菜单层级
  }

  componentDidMount () {
    this.getMenuPermission()
  }

  // 获取菜单权限
  getMenuPermission = () => {
    HttpRequest("/menu/tree", "GET", {}, res => {
      Store.dispatch({ type: Type.MENU_DATA, payload: { menuData: this.handleMenuData(res.data) } });
      this.defaultGetMnueOne()
    })
  }

  // 默认获取当前所在的一级菜单
  defaultGetMnueOne = () => {
    const pathname = window.location.pathname;
    let menuData = JSON.parse(JSON.stringify(this.props.menuData));

    this.recursiveMnue(menuData, pathname);

    const { zIndex } = this.state;

    menuData.forEach(item => {
      if (item.zIndex === zIndex) {
        item.active = true;
      } else {
        item.active = false;
      }
    })

    Store.dispatch({ type: Type.MENU_DATA, payload: { menuData: menuData } });
  }

  // 递归数据
  recursiveMnue = (data, pathname) => {
    data.forEach(item => {
      if (item.href === pathname) {
        this.setState({
          zIndex: item.zIndex
        })
      } else { 
        if (item.children && item.children.length) {
          this.recursiveMnue(item.children, pathname)
        }
      }
    })
  }

  // 处理菜单数据
  handleMenuData = (data, idx) => {
    let defaultMnue;

    if (!idx) { // 默认展示第一级菜单
      if (data[0].children && data[0].children.length) {
        defaultMnue = data[0].children[0].href;
      } else {
        data[0].active = true;
        defaultMnue = data[0].href;
      }

      Store.dispatch({ type: Type.DEFAULT_MNUE, payload: { defaultMnue } })
    }

    data.forEach((item, index) => {
      if (!idx) {
        item.zIndex = index;
        if (item.children && item.children.length) {
          this.handleMenuData(item.children, index)
        }
      } else {
        item.zIndex = idx;
        if (item.children && item.children.length) {
          this.handleMenuData(item.children, idx)
        }
      }
    })

    return data;
  }
  
  // 更新当前所在一级菜单
  upMenu = (rowData) => {
    const { upMenuData } = this.props;
    let menuData = JSON.parse(JSON.stringify(this.props.menuData));

    upMenuData(menuData, rowData);
  }

  // 退出接口
  handleExit = () => {
    HttpRequest("/manager/logout", "GET", { test: 1 }, res => {
      message.success("退出成功！");
      removeCookie("JSESSIONID");
      removeCookie("userInfo");
      
      setTimeout(() => {
        this.setState({
          redirect: true
        })
      }, 500)
    })
  }

  render () {
    const { menuData } = this.props;
    const { redirect } = this.state;

    if (redirect) {
      return <Redirect push to="/" />
    }
    
    return (
      <header className="head-top">
        <div className="head-top__title">
          <h2>VPN · 后台管理</h2>
        </div>
        <div className="head-top__navbar">
          { menuData ? <MenuListOne menuData={ menuData } upMenuData={ this.upMenu } /> : ""  }
        </div>
        <div className="user-info__group">
          <Icon type="user-add" />
          <p className="nickName">{ userInfo.name }</p>
          <a className="exit" onClick={ this.handleExit }>退出</a>
        </div>
      </header>
    )
  }
}

const mapStateToProps = (store) => {
  return {
    menuData: store.common.menuData
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    upMenuData: (oldData, rowData) => { 
      oldData.forEach(item => {
        if (rowData.zIndex === item.zIndex) {
          item.active = true;
        } else {
          item.active = false;
        }
      })
      dispatch({ type: Type.MENU_DATA, payload: { menuData: oldData }})
    }
  }
}

const ConnectHead = connect(
  mapStateToProps,
  mapDispatchToProps
)(Head);

export default ConnectHead;
