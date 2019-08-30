import qs from 'qs'
import axios from 'react-native-axios'
import {
    API_URI,
    SZ_API_URI
} from "./config"
import {DeviceEventEmitter, Platform} from 'react-native';
let instance = axios.create({
    timeout: 1000 //1s 超时时间
});
// 全局设置token
export function setToken(token) {
    instance.defaults.headers['token'] = token
}

function netAxios(url, data, method, loadingDelay = 200 /*loading 显示延时, 非必填*/) {
    DeviceEventEmitter.emit('loadShow', loadingDelay);
    let axiosObj = {
        url: `${url}`,
        method,
    };
    if (method === 'get') {
        axiosObj['params'] = data
    } else {
        axiosObj['data'] = qs.stringify(data)
    }
    console.log(url, data, method);
    return instance(axiosObj).then((res) => {
        console.log(res);
        DeviceEventEmitter.emit('loadHide');
        return Promise.resolve(res.data)
    }).catch((err) => {
        DeviceEventEmitter.emit('loadHide');
        try {
            return Promise.resolve(err.response.data);
        } catch (e) {
            return Promise.resolve({})
        }
    })
}

/*用户信息查询*/
export function updateUserInfo() {
    let data = {};
    return netAxios(`${SZ_API_URI}/appauth`, data, 'post')
}




/*wallet查询*/
export function walletQuery(page, pageSize, name = '提现') {
    let data = {
        page,
        pageSize,
        name
    };
    return netAxios(`${SZ_API_URI}/app/api/v1/wallet/query`, data, 'get')
}

// 订单查询
export function orderQuery(page, pageSize, orderStatus) {
    let data = {
        page,
        pageSize,
        orderStatus
    };
    return netAxios(`${SZ_API_URI}/app/api/v1/worker/orders`, data, 'get')
}

// /app/api/v1/worker/idcard
export function getIdCard() {
    let data = {};
    return netAxios(`${SZ_API_URI}/app/api/v1/worker/idcard`, data, 'get')
}
