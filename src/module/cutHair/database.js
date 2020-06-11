var dataBase = {
  /*必配-start*/
  mask: false, //遮罩层控制
  isShow: false,
  config: '', //公共配置信息
  wxqyh_uploadfile: {
    //当前应用名称
    agent: 'calendar'
  },
  /*必配-end*/
  loading: {
    //加载、提交成功、删除成功
    show: false,
    text: '',
    icon: ''
  },
  selectConfig: {
    //负责人、相关人
    show: false,
    signIndex: 'toPersonList',
    selectList: {
      toPersonList: {
        show: false,
        title: '授权人员',
        selectType: 'user',
        userName: 'incharges',
        userSelected: [],
        deptSelected: [],
        deptSelectedShow: true,
        callBack: {
          confirm: null
        }
      },
      ccPersonList: {
        title: '授权人员',
        selectType: 'user',
        userName: 'relatives',
        userSelected: [],
        deptSelected: [],
        tagSelected: [],
        deptSelectedShow: true,
        callBack: {
          confirm: null
        }
      },
      FlowAuditUser: {
        list: [],
        callBack: {
          confirm: null
        }
      }
    }
  },
  dialogConfig: {
    //弹窗对话框
    show: false,
    title: '', //标题
    type: '',
    content: [
      //中间自定义内容
    ],
    canClose: true, //是否由弹窗组件关闭窗口，true:确定按钮后自动关闭，
    btnConfig: {
      primaryBtn: { name: '', callBack: null }, //主操作按钮
      defaultBtn: { name: '', callBack: null } //次操作按钮
    }
  },
  searchBar: {
    //头部搜索框
    show: true,
    keyWord: '',
    rightSpan: {
      show: false,
      callback: null
    }
  },
  hasrecord: {
    //无数据配置
    show: true,
    setTop: false,
    icon: 'img_a-nodata_02',
    text: '暂无数据'
  }
}

export default dataBase
