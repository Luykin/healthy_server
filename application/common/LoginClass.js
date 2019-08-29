import {Alert} from 'react-native';
import {SZ_API_URI} from "./ScreenUtil";
/**
* 公共方法
*/
export default class LoginClass{

    /**
    * 发送短信难码
    * @param phone
    * return
    */
    static forget1(phone,code){
        let data = new FormData();
        data.append("phone",phone);

        fetch(SZ_API_URI + "member/sentmsg",{
            method:'POST',
            headers: {
                "Content-Type" : "multipart/form-data"
            },
            body:data
        })
        .then(response => response.json())
        .then(responseJson => {
            Alert.alert(responseJson.msg);
        }).catch(error => {
            console.error(error);
        });
    }
}