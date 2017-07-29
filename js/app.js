let URL_GET = '/menu';
let URL_SUBMIT = '/menu';
axios.defaults.baseURI = 'https://online.sdu.edu.cn/isdu-new';
let net_menu_data = {
    "button": [
        {"type": "click", "name": "今日歌曲", "key": "V1001_TODAY_MUSIC"},
        {
            "name": "菜单", "sub_button": [{"type": "view", "name": "搜索", "url": "http://www.soso.com/"},
            {
                "type": "miniprogram",
                "name": "wxa",
                "url": "http://mp.weixin.qq.com",
                "appid": "wx286b93c14bbf93aa",
                "pagepath": "pages/lunar/index"
            },
            {"type": "click", "name": "赞一下我们", "key": "V1001_GOOD"}]
        }]
};
/*axios.get(URL_GET)
    .then(function (res) {
        if (res.status === 200){
            net_menu_data = res.data.menu;
        }
    })
    .catch(function (err) {
        console.log(err);
    });*/
const app = new Vue({
    el: '#app',
    data: {
        menu_data: net_menu_data,
        selectedMenu: null,
        curId: -1,
        curSid: -1,
        jsonData: null
    },
    computed: {
        showAddBtn: function () {
            return this.menu_data.button.length < 3
        },
        size: function () {
            return 'sizeof' + (this.menu_data.button.length < 3 ? (this.menu_data.button.length + 1) : 3)
        }
    },
    methods: {
        addBtn: function () {
            if (this.menu_data.button.length < 3) {
                this.menu_data.button.push({
                    name: '新菜单',
                    type: 'click',
                    key: ''
                })
            }
        },
        addSubButton: function (id) {
            if (!this.menu_data.button[id].sub_button) {
                Vue.set(this.menu_data.button[id], 'sub_button', []);
            }
            this.menu_data.button[id].sub_button.push({
                name: '子菜单项',
                type: 'click',
                key: ''
            });
        },
        deleteButton: function () {
            if (confirm('确定要删除??????')) {
                if (this.curId !== -1) {
                    if (this.curSid === -1) {
                        this.menu_data.button.splice(this.curId, 1);
                    } else {
                        this.menu_data.button[this.curId].sub_button.splice(this.curSid, 1);
                    }
                    this.selectedMenu = null;
                    this.curId = -1;
                    this.curSid = -1;
                }
            }
        },
        submit: function () {
            this.showData();
            if (confirm('确认提交?')) {
                axios({
                    method: 'POST',
                    url: URL_SUBMIT,
                    data: this.jsonData
                })
                    .then(function (res) {
                        if (res.status === 200) {
                            alert('ok');
                        }
                    })
                    .catch(function (err) {
                        console.log(err);
                    });
            }
        },
        showData: function () {
            let menu = {};
            let button = [];
            for (let i = 0; i < this.menu_data.button.length; i++) {
                if (this.menu_data.button[i].hasOwnProperty('sub_button') && this.menu_data.button[i].sub_button.length > 0) {
                    button[i] = {sub_button: [], name: this.menu_data.button[i].name};
                    for (let j = 0; j < this.menu_data.button[i].sub_button.length; j++) {
                        button[i].sub_button[j] = getObj(this.menu_data.button[i].sub_button[j])
                    }
                } else {
                    button[i] = getObj(this.menu_data.button[i]);
                }
            }
            menu.button = button;

            this.jsonData = JSON.stringify(menu);
        },
        chooseBtn: function (event, id) {
            let eles = document.getElementsByClassName('chosen');
            for (let i = 0; i < eles.length; i++)
                eles[i].classList.remove('chosen');
            event.target.classList.add('chosen');
            this.selectedMenu = this.menu_data.button[id];
            this.curId = id;
            this.curSid = -1;
        },
        chooseSubBtn: function (event, id, sid) {
            let eles = document.getElementsByClassName('chosen');
            for (let i = 0; i < eles.length; i++)
                eles[i].classList.remove('chosen');
            event.target.classList.add('chosen');
            this.selectedMenu = this.menu_data.button[id].sub_button[sid];
            this.curId = id;
            this.curSid = sid;
        }
    }
});

function getObj(btn) {
    let res = {};
    res.name = btn.name;
    res.type = btn.type;
    if (btn.type === 'click') {
        res.key = btn.key;
    } else if (btn.type === 'view') {
        res.url = btn.url;
    } else if (btn.type === 'miniprogram') {
        res.appid = btn.appid;
        res.url = btn.url;
        res.pagepath = btn.pagepath;
    }
    return res;
}