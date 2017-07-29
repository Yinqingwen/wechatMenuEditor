let URL_GET = '/menu';
let URL_SUBMIT = '/menu';
axios.defaults.baseURI = 'https://online.sdu.edu.cn/isdu-new';
let net_menu_data = {
    "button":[
        {"type":"click", "name":"今日歌曲", "key":"V1001_TODAY_MUSIC"},
        {"name":"菜单", "sub_button":[{"type":"view", "name":"搜索", "url":"http://www.soso.com/"},
                {"type":"miniprogram", "name":"wxa", "url":"http://mp.weixin.qq.com", "appid":"wx286b93c14bbf93aa", "pagepath":"pages/lunar/index"},
                {"type":"click", "name":"赞一下我们", "key":"V1001_GOOD"}]}]};
/*axios.get(URL_GET)
    .then(function (res) {
        if (res.status === 200){
            net_menu_data = res.data.menu;
        }
    })
    .catch(function (err) {
        console.log(err);
    });*/
var app = new Vue({
    el: '#app',
    data: {
        menu_data: net_menu_data,
        selectedMenu: null
    },
    computed:{
        showAddBtn: function () {
            return this.menu_data.button.length < 3
        },
        size: function () {
            return 'sizeof' + (this.menu_data.button.length + 1)
        }
    },
    methods: {
        submit: function () {
            if (confirm('确认提交?')){
                axios({
                    method: 'POST',
                    url: URL_SUBMIT,
                    data: this.menu_data
                })
                    .then(function (res) {
                    if (res.status === 200){
                        alert('ok');
                    }
                    })
                    .catch(function (err) {
                        console.log(err);
                    });
            }
        },
        showData: function () {

        },
        chooseBtn: function (event, id) {
            let eles = document.getElementsByClassName('chosen');
            for (let i=0; i<eles.length; i++)
                eles[i].classList.remove('chosen');
            event.target.classList.add('chosen');
            this.selectedMenu = this.menu_data.button[id];
        },
        chooseSubBtn: function (event, id, sid) {
            let eles = document.getElementsByClassName('chosen');
            for (let i=0; i<eles.length; i++)
                eles[i].classList.remove('chosen');
            event.target.classList.add('chosen');
            this.selectedMenu = this.menu_data.button[id].sub_button[sid];
        }
    }
});