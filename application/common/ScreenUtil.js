import {Dimensions,PixelRatio} from 'react-native';

export const deviceWidth = Dimensions.get('window').width; //设备的宽度
export const deviceHeight = Dimensions.get('window').height; //设备的高度

export const API_URI = "http://sns.cd-scg.com/";//API地址
export const YOUZAN_API_URI = "http://api.shop.gonghaiqing.com/yzapi/";//有赞API接口地址
export const SAAS_API_URL = "http://140.249.17.114:8081/pen/";//SAAS平台接口地址
export const SZ_API_URI = "http://118.190.208.223:8166/";//松籽健康API地址
export const DATA_API = "http://47.105.186.85:9010/";//数据层接口地址

export const APK_URL = SZ_API_URI + "apk/";//apk下载地址
export const CHECK_APK_UPDATE_URL = SZ_API_URI + "appversion";//检查app版本号

let fontScale = PixelRatio.getFontScale(); //返回字体大小缩放比例
let pixelRatio = PixelRatio.get(); //当前设备的像素密度
const defaultPixel = 2; //iphone6的像素密度
//px转换成dp
const w2 = 750 / defaultPixel;
const h2 = 1334 / defaultPixel;
const scale = Math.min(deviceHeight / h2, deviceWidth / w2); //获取缩放比例

/**
* 设置text为sp
* @param size sp
* return number dp
*/
export default class ScreenUtil{
    /**
    * 设置text为sp
    * @param size sp
    * return number dp
    */
    static setSpText(size){
        size = Math.round((size * scale + 0.5) * pixelRatio / fontScale);
        return size / defaultPixel;
    }

    static scaleSize(size){
        size = Math.round(size * scale + 0.5);
        return size / defaultPixel;
    }
}
