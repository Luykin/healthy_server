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
    StatusBar,
    //YellowBox
    } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {createSwitchNavigator,createAppContainer} from 'react-navigation';

import LoginScreen from './application/screen/LoginScreen';
import MainScreen from './application/screen/MainScreen';

/*
YellowBox.ignoreWarnings([
      'Warning: ViewPagerAndroid has been extracted',
      'Warning: Slider has been extracted',
 ]);*/
//type Props = {};
//验证登陆状态
class AuthLoadingScreen extends Component{
    constructor(props) {
        super(props);
        this._bootstrapAsync();
        //AsyncStorage.clear();
    }
    _bootstrapAsync = async () => {
        let token = await AsyncStorage.getItem('token');
        this.props.navigation.navigate(token ? 'Main' : 'Auth');
    }
    render() {
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
export default createAppContainer(switchNav);
