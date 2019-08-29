import AsyncStorage from '@react-native-community/async-storage';
import {setToken} from "./index";
/*不同的页面，都监听一次改变*/
let localObj = {};
let global = {
    token: null,
};

AsyncStorage.getItem(`token`).then((res) => {
    console.log(res);
    if (res) {
        global.token = res;
        setToken(res);
    }
}).catch((err) => {
    console.log(err)
});

AsyncStorage.getItem(`user`).then((res) => {
    if (res) {
        try {
            global.userInfo = JSON.parse(res);
            console.log(global)
        } catch (e) {
            console.log(e)
        }
    }
}).catch((err) => {
    console.log(err)
});

/*实现多页面双向绑定*/
function proxy(key) {
    if (key in global) {
        let val = global[key];
        Object.defineProperty(global, key, {
            get: function () {
                return val;
            },
            set: function (newValue) {
                try {
                    if (newValue !== val) {
                        if (localObj[key]) {
                            localObj[key].forEach((local) => {
                                /*防止已经记录注册的页面已经被注销，通知出错*/
                                if (local.setState) {
                                    local.setState({
                                        [key]: newValue
                                    })
                                }
                            })
                        }
                        val = newValue
                        this[key] = newValue
                    }
                } catch (e) {
                    console.log(e)
                }
            }
        });
    }
}

export function bindData(key, local) {
    if (key in global) {
        if (!localObj[key] || !localObj[key] instanceof Array) {
            localObj[key] = [local]
        } else {
            localObj[key].push(local)
        }
        proxy(key)
        return global[key]
    } else {
        console.log(`${key} key not in global`)
        return {};
    }
}

export function setGlobal(key, value, callback) {
    if (key in global) {
        console.log(`全局设置${key}`);
        global[key] = value;
        if(callback) {
            callback();
        }
    } else {
        console.log(`${key} key not in global`)
    }
}

export function getGlobal(key) {
    if (key in global) {
        return global[key]
    } else {
        console.log(`${key} key not in global`)
        return {};
    }
}
