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

function netAxios(url, data, method, loadingDelay = 500 /*loading 显示延时, 非必填*/) {
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
export function walletQuery(page, pageSize, name = '提现', dateStart, dateEnd) {
    let data = {
        page,
        pageSize,
        name
    };
    if (dateStart && dateEnd) {
        Object.assign(data, {
            dateStart,
            dateEnd
        })
    }
    return netAxios(`${SZ_API_URI}/app/api/v1/wallet/query`, data, 'get')
}

// 订单查询
export function orderQuery(page, pageSize, orderStatus) {
    let data = {
        page, pageSize, orderStatus
    };
    return netAxios(`${SZ_API_URI}/app/api/v1/worker/orders`, data, 'get')
}

// /app/api/v1/worker/idcard
export function getIdCard() {
    let data = {};
    return netAxios(`${SZ_API_URI}/app/api/v1/worker/idcard`, data, 'get')
}


// 提现
export function cashOut(amount, cardName, cardId, cardBank) {
    let data = {
        amount, cardName, cardId, cardBank
    };
    return netAxios(`${SZ_API_URI}/app/api/v1/wallet/cashout`, data, 'post')
}

// 模式信息
export function modesInfo() {
    let data = {};
    return netAxios(`${SZ_API_URI}/app/api/v1/worker/modes/info`, data, 'get')
}

// 设置模式信息
export function setModesInfo(real_timemode, geo_range, accept_appoint, appoint_starttime, appoint_endtime) {
    let data = {
        real_timemode, geo_range,
    };
    if (accept_appoint) {
        Object.assign(data, {
            accept_appoint, appoint_starttime, appoint_endtime
        })
    }
    return netAxios(`${SZ_API_URI}/app/api/v1/worker/modes`, data, 'post')
}


// 添加身份信息
export function addIdCard(realName, userIdCard, address) {
    let data = {
        realName, userIdCard, address
    };
    return netAxios(`${SZ_API_URI}/app/api/v1/server/idcard/add`, data, 'post')
}


// 添加身份证图片
export function addIdCardImg(userName, idCardImg1, idCardImg2) {
    let data = {
        userName, idCardImg1, idCardImg2
    };
    return netAxios(`${SZ_API_URI}/app/api/v1/server/idcardimg/add`, data, 'post')
}
