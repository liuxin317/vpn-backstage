import React, { Component } from 'react';
import { Table, Modal, InputNumber, message } from 'antd';
import HttpRequest from '../../../../requset/Fetch';
import './style.scss';

class AccountList extends Component {
  state = {
    pageSize: 10, // 每页展示条数
    pageNumber: 1, // 页码
    userList: [], // 用户列表
    rowData: "", // 当前列数据
    visibleShield: false, // 拉黑弹窗显示状态
    time: "", // 拉黑时长
  }

  componentDidMount () {
    this.getUserList()
  }

  // 获取用户列表
  getUserList = () => {
    const { pageSize, pageNumber } = this.state;

    HttpRequest(`/user/query/${ pageNumber }/${ pageSize }`, "GET", {}, res => {
      this.setState({
        userList: res.data
      })
    })
  }

  // 页码回调
  onChangePage = (number) => {
    this.setState({
      pageNumber: number
    }, () => {
      this.getUserList()
    })
  }

  // 拉黑接口
  setShield = () => {
    const { rowData, time } = this.state;

    HttpRequest("/blacklist/black", "GET", {
      uid: rowData.id,
      time
    }, res => {
      message.success("拉黑成功！");

      this.setState({
        visibleShield: false,
      })
    })
  }

  // 打开拉黑弹窗
  showModalShield = (rowData) => {
    this.setState({
      rowData,
      visibleShield: true,
    });
  }

  // 提交拉黑弹窗按钮
  handleOkShield = (e) => {
    const { time } = this.state;

    if (time === "") {
      message.warning("时长不能为空");
    } else {
      this.setShield()
    }
  }

  // 关闭拉黑弹窗
  handleCancelShield = (e) => {
    this.setState({
      visibleShield: false,
    });
  }

  // 监听拉黑时长
  handleChangeTime = (val) => {
    this.setState({
      time: val
    })
  }

  render () {
    const { userList, pageSize, pageNumber } = this.state;
    const columns = [{
      title: '帐号名称',
      dataIndex: 'account',
      key: 'account'
    }, {
      title: '性别',
      dataIndex: 'sex',
      key: 'sex',
      render: (text, record) => {
        return (
          record.sex === 1
          ?
          <span>男</span>
          :
          record.sex === 2
          ?
          <span>女</span>
          :
          <span>--</span>
        )
      }
    }, {
      title: '业务状态',
      dataIndex: 'status',
      key: 'status',
      render: (text, record) => {
        return (
          record.status === 0
          ?
          <span>未激活</span>
          :
          <span>正常用户</span>
        )
      }
    }, {
      title: '账户类型',
      dataIndex: 'state',
      key: 'state',
      render: (text, record) => {
        return (
          record.state === 0
          ?
          <span>按流量</span>
          :
          record.state === 1
          ?
          <span>持续时长</span>
          :
          <span>自然时长</span>
        )
      }
    }, {
      title: '注册时间',
      dataIndex: 'time',
      key: 'time',
      render: (text, record) => {
        return (
          record.time
          ?
          <span>{ record.time }</span>
          :
          <span>--</span>
        )
      }
    }, {
      title: '操作',
      key: 'handle',
      render: (text, record) => {
        return (
          <div className="handle-group">
            <a onClick={ this.showModalShield.bind(this, record) }>拉黑</a>
          </div>
        )
      }
    }];

    return (
      <section className="account-list-box">
        <h3>当前位置：账号列表</h3>

        <div className="table-box">
          <Table 
            dataSource={userList.content} 
            columns={columns} 
            rowKey={(record, index) => index}
            pagination={{ showQuickJumper: true, total: userList.contentSize, current: pageNumber, pageSize, onChange: this.onChangePage, showTotal: total => `共 ${userList.contentSize} 条`}}
          />
        </div>

        {/* 拉黑弹窗 */}
        <Modal
          title="提示"
          visible={this.state.visibleShield}
          onOk={this.handleOkShield}
          onCancel={this.handleCancelShield}
        >
          <div className="shield-box">
            <div className="input-group">
              <label htmlFor="">拉黑时长：</label>
              <InputNumber className="input-number" min={1} placeholder="请输入时长" onChange={ this.handleChangeTime } />
              <span className="monad">s</span>
            </div>
          </div>
        </Modal>
      </section>
    )
  }
}

export default AccountList;
