import React, { Component } from 'react';
import HttpRequest from '../../../requset/Fetch';
import { setCookie, removeCookie } from '../../common/methods';
import { Input, Radio, Button, message } from 'antd';
import './style.scss';

const RadioGroup = Radio.Group;

class MyCenter extends Component {
  state = {
    userInfo: "", // 个人信息
    sexValue: "", // 性别
    nickName: "", // 昵称
    name: "", // 姓名
    oldPwd: "", // 旧密码
    newPwd: "", // 新密码
  }

  componentDidMount () {
    this.getUserInfo()
  }

  // 获取个人信息
  getUserInfo = () => {
    HttpRequest("/manager/info", "GET", {}, res => {
      this.setState({
        userInfo: res.data,
        sexValue: res.data.sex,
        nickName: res.data.nickName,
        name: res.data.name
      })

      setCookie("userInfo", JSON.stringify(res.data))
    })
  }

  // 监听性别
  onChangeInput = (type, e) => {
    let obj = {}
    obj[type] = e.target.value.trim();

    this.setState({
      ...obj
    })
  }

  // 编辑个人信息
  editUserInfo = () => {
    const { sexValue, name, nickName  } = this.state;
    if (name === "") {
      message.warning("姓名不能空！")
    } else {
      HttpRequest("/manager/modify/info", "POST", {
        name,
        nickName,
        sex: sexValue
      }, res => {
        message.success("修改成功！")
        this.getUserInfo()
      })
    }
  }

  // 密码修改
  changePassword = () => {
    const { oldPwd, newPwd  } = this.state;
    if (oldPwd === "") {
      message.warning("请输入原密码!");
    } else if (newPwd === "") {
      message.warning("请输入新密码!");
    } else {
      HttpRequest("/manager/modify/password", "POST", {
        oldPwd,
        newPwd
      }, res => {
        message.success("密码修改成功，请重新登录");
        removeCookie("JSESSIONID");
        removeCookie("userInfo");

        setTimeout(() => {
          window.location.href = "/";
        }, 500)
      })
    }
  }

  render () {
    const { sexValue, name, nickName  } = this.state;

    return (
      <section className="center-box">
        <h3>当前位置：个人中心</h3>

        <div className="center-content">
          <h4 className="user-info">个人信息</h4>

          <div className="input-group">
            <label className="name" htmlFor="">姓名：</label>
            <Input className="input" placeholder="请输入姓名" value={ name } onChange={this.onChangeInput.bind(this, "name")} />
          </div>

          <div className="input-group">
            <label className="name" htmlFor="">昵称：</label>
            <Input className="input" placeholder="请输入昵称" value={ nickName } onChange={this.onChangeInput.bind(this, "nickName")} />
          </div>

          <div className="input-group">
            <label className="name" htmlFor="">性别：</label>
            <RadioGroup className="input" onChange={this.onChangeInput.bind(this, "sexValue")} value={sexValue}>
              <Radio value={1}>男</Radio>
              <Radio value={2}>女</Radio>
            </RadioGroup>
          </div>

          <div className="input-group">
            <label className="name" htmlFor="" style={{ height: 40 }}></label>
            <div className="input">
              <Button style={{ height: 38, width: 120 }} type="primary" onClick={ this.editUserInfo }>确定修改</Button>
            </div>
          </div>
        </div>

        <div className="center-content" style={{ marginTop: 50 }}>
          <h4 className="user-info">密码修改</h4>

          <div className="input-group">
            <label className="name" htmlFor="">原密码：</label>
            <Input className="input" placeholder="请输入原密码" type="password" onChange={this.onChangeInput.bind(this, "oldPwd")} />
          </div>

          <div className="input-group">
            <label className="name" htmlFor="">新密码：</label>
            <Input className="input" placeholder="请输入新密码" type="password" onChange={this.onChangeInput.bind(this, "newPwd")} />
          </div>

          <div className="input-group">
            <label className="name" htmlFor="" style={{ height: 40 }}></label>
            <div className="input">
              <Button style={{ height: 38, width: 120 }} type="primary" onClick={ this.changePassword }>确定修改</Button>
            </div>
          </div>
        </div>
      </section>
    )
  }
}

export default MyCenter;