import React, { Component } from 'react';
import { Table } from 'antd';  
import HttpRequest from '../../../requset/Fetch';
import './style.scss';

const columns = [{
  title: 'IP',
  dataIndex: 'serverIp',
  key: 'serverIp',
  render: (text, record) => {
    return <a>{ record.serverIp }</a>
  }
}, {
  title: '端口',
  dataIndex: 'port',
  key: 'port',
}, {
  title: 'web端口',
  dataIndex: 'httpPort',
  key: 'httpPort',
}];

class VpnAdmin extends Component {
  state = {
    serverList: [], // 服务器列表
  }

  componentDidMount () {
    this.getServerList()
  }

  // 获取列表
  getServerList = () => {
    HttpRequest("/lc/manager/list", "POST", {}, res => {
      this.setState({
        serverList: res.data
      })
    })
  }

  render () {
    const { serverList } = this.state;

    return (
      <section className="vpn-box">
        <h3>当前位置：VPN管理</h3>

        <div className="vpn-content table-box">
          <Table 
            dataSource={serverList} 
            columns={columns} 
            rowKey={(record, index) => index}
            pagination={ false }
          />
        </div>
      </section>
    )
  }
}

export default VpnAdmin;
