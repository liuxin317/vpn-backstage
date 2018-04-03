import React, { Component } from 'react';
import { Form, Icon, Input, Button, message } from 'antd';
import HttpRequest from '../../requset/Fetch';
import { Redirect } from 'react-router-dom';
import { setCookie } from '../common/methods';
import "./style.scss";

const FormItem = Form.Item;

class Login extends Component {
  state = {
    codeImg: "", // 验证码图片
    isLogin: false, // 跳转页面状态
  }

  componentDidMount () {
    this.getGenerateCode();
  }

  // 登录提交
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { account, password, code } = values;

        HttpRequest("/manager/login", "POST", {
          account, 
          password, 
          code 
        }, res => {
          message.success("登陆成功！");
          setCookie("userInfo", JSON.stringify(res.data));
          this.setState({
            isLogin: true
          })
        })
      }
    });
  }

  // 生成验证码
  getGenerateCode = () => {
    HttpRequest("/code/generate/4/150/40", "GET", {}, res => {
      this.setState({
        codeImg: res.data.code
      })
    })
  }

  render () {
    const { getFieldDecorator } = this.props.form;
    const { codeImg, isLogin } = this.state;

    if (isLogin) {
      return <Redirect push to="/content" />
    }

    return (
      <section className="login-box">
        <div className="login-content">
          <div className="login-input-box">
            <figure className="login-title">
              <figcaption>VPN管理后台</figcaption>
            </figure>

            <div className="border-top"></div>
            <div className="input-group">
              <Form onSubmit={this.handleSubmit} className="login-form">
                <FormItem>
                  {getFieldDecorator('account', {
                    rules: [{ required: true, message: '请输入帐号！' }],
                  })(
                    <Input prefix={<Icon type="user" style={{ color: "white", fontSize: "18px" }} />} placeholder="请输入帐号" />
                  )}
                </FormItem>
                <FormItem>
                  {getFieldDecorator('password', {
                    rules: [{ required: true, message: '请输入密码！' }],
                  })(
                    <Input prefix={<Icon type="lock" style={{ color: "white", fontSize: "18px" }} />} type="password" placeholder="请输入密码" />
                  )}
                </FormItem>

                <FormItem>
                  {getFieldDecorator('code', {
                    rules: [{ required: true, message: '请输入验证码！' }],
                  })(
                    <Input className="pull-left code-input" style={{ width: 255 }} type="text" placeholder="请输入验证码" />
                  )}
                  <div className="pull-right" style={{width: 130, height: 46, border: "1px solid #cfd2e5", borderRadius: "5px"}} onClick={ this.getGenerateCode }>
                    <img src={ codeImg } alt="" style={{ width: 130, height: 46, cursor: "pointer" }}/>
                  </div>
                </FormItem>

                <FormItem>
                  <Button type="primary" htmlType="submit" className="login-form-button">
                    登录
                  </Button>
                </FormItem>
              </Form>
            </div>
            <div className="border-bottom"></div>
          </div>
        </div>
      </section>
    )
  }
}

const WrappedNormalLoginForm = Form.create()(Login);

export default WrappedNormalLoginForm;