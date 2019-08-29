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
import {createSwitchNavigator,createAppContainer} from 'react-navigation';
import LoginScreen from './application/screen/LoginScreen';
import MainScreen from './application/screen/MainScreen';
import NavigationUtil from './application/navigator/NavigationUtil';
import {CONSO_LOG} from "./application/api/config";
import {getGlobal, setGlobal} from "./application/api/global";
import {updateUserInfo} from "./application/api";
/*
YellowBox.ignoreWarnings([
      'Warning: ViewPagerAndroid has been extracted',
      'Warning: Slider has been extracted',
 ]);*/
//type Props = {};
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
class AuthLoadingScreen extends Component{
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
                <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                <ActivityIndicator />
                <StatusBar barStyle="default" />
                </View>
        );
    }
}
const switchNav = createSwitchNavigator(
    {
        AuthLoading:{
            screen:AuthLoadingScreen
         },
        Main:{
            screen:MainScreen
        },
        Auth:{
            screen:LoginScreen
        }
    },
    {
        initialRouteName:'AuthLoading',
        headerMode:"float"
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
    }

    componentWillUnmount() {
        this.updateListener && this.updateListener.remove();
    }
    render() {
        const Rooter = createAppContainer(switchNav);
        return (<Rooter />);
    }
}
