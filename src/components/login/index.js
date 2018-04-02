import React, { Component } from 'react';
import { Form, Icon, Input, Button } from 'antd';
// import log from '../../imgs/logoicon.svg';
import "./style.scss";

const FormItem = Form.Item;

class Login extends Component {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  }

  render () {
    const { getFieldDecorator } = this.props.form;

    return (
      <section className="login-box">
        <div className="login-content">
          <div className="login-input-box">
            <figure className="login-title">
              {/* <img src={ log } alt=""/> */}
              <figcaption>VPN管理后台</figcaption>
            </figure>

            <div className="border-top"></div>
            <div className="input-group">
              <Form onSubmit={this.handleSubmit} className="login-form">
                <FormItem>
                  {getFieldDecorator('userName', {
                    rules: [{ required: true, message: '请输入帐号！' }],
                  })(
                    <Input prefix={<Icon type="user" style={{ color: "white", fontSize: "18px" }} />} placeholder="请输入帐号" />
                  )}
                </FormItem>
                <FormItem>
                  {getFieldDecorator('password', {
                    rules: [{ required: true, message: '请输入密码！' }],
                  })(
                    <Input prefix={<Icon type="lock" style={{ color: "white", fontSize: "18px" }} />} type="password" placeholder="请输入密码！" />
                  )}
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