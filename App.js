/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {
    View,
    ActivityIndicator,
    StatusBar, DeviceEventEmitter,
    //YellowBox
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {createSwitchNavigator, createAppContainer} from 'react-navigation';
import LoginScreen from './application/screen/LoginScreen';
import MainScreen from './application/screen/MainScreen';
import NavigationUtil from './application/navigator/NavigationUtil';
import {CONSO_LOG} from "./application/api/config";
import {getGlobal, setGlobal} from "./application/api/global";
import {updateUserInfo} from "./application/api";
import Loading from "./application/base/Loading";
import Toast from 'react-native-root-toast';

let options = {
    duration: 1500, // toast显示时长1.2s
    position: -20, // toast位置
    shadow: false, // toast是否出现阴影
    animation: true, // toast显示/隐藏的时候是否需要使用动画过渡
    hideOnPress: true, // 是否可以通过点击事件对toast进行隐藏
    delay: 0, // toast显示的延时
    textColor: '#ffffff',
    textStyle: {
        fontSize: 12
    },
    backgroundColor: 'rgba(0,0,0,.8)',
};
try {
    if (!CONSO_LOG) {
        console.log = () => {
        };
        console.error = () => {
        };
        console.warn = () => {
        };
        console.info = () => {
        };
        console.debug = () => {
        };
    }
    console.disableYellowBox = true
} catch (e) {
    console.log(e)
}

//验证登陆状态
class AuthLoadingScreen extends Component {
    constructor(props) {
        super(props);
        this._bootstrapAsync();
    }

    _bootstrapAsync = async () => {
        let token = await AsyncStorage.getItem('token');
        token && DeviceEventEmitter.emit('updateUserInfo', true);
        this.props.navigation.navigate(token ? 'Main' : 'Auth');
    };

    render() {
        NavigationUtil.navigation = this.props.navigation;
        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <ActivityIndicator/>
                <StatusBar barStyle="default"/>
            </View>
        );
    }
}

const switchNav = createSwitchNavigator(
    {
        AuthLoading: {
            screen: AuthLoadingScreen
        },
        Main: {
            screen: MainScreen
        },
        Auth: {
            screen: LoginScreen
        }
    },
    {
        initialRouteName: 'AuthLoading',
        headerMode: "float"
    }
);
// export default createAppContainer(switchNav);
export default class AppContainer extends Component {
    componentDidMount() {
        this.updateListener = DeviceEventEmitter.addListener('updateUserInfo', async (must = false/*是否一定更新*/) => {
            if (!getGlobal('token')) {
                return false
            }
            const ret = await updateUserInfo();
            console.log(ret, '更新用户信息');
            if (ret.code === 200) {
                try {
                    // let userInfo = userInfo;
                    // setGlobal('userInfo', userInfo);
                    // AsyncStorage.setItem("userInfo",JSON.stringify(userInfo));
                } catch (e) {
                    console.log(e)
                }
            }
        });

        /*监听Toast*/
        this.tipsEmitter = DeviceEventEmitter.addListener('tips', (event) => {
            try {
                if (!event) {
                    return false
                }
                if (event.options && event.text) {
                    Toast.show(event.text, event.options)
                } else {
                    if (typeof event === 'string') {
                        Toast.show(event, options)
                    } else {
                        Toast.show(JSON.stringify(event), options)
                    }
                }
            } catch (e) {
                console.log(e)
            }
        })
    }

    componentWillUnmount() {
        this.updateListener && this.updateListener.remove();
        this.tipsEmitter && this.tipsEmitter.remove();
    }

    render() {
        const Rooter = createAppContainer(switchNav);
        return (
            <View style={{flex: 1}}>
                <StatusBar
                    barStyle="dark-content"
                    backgroundColor="#ffffff"
                />
                <Loading/>
                <Rooter/>
            </View>);
    }
}
