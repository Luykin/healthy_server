import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import {createStackNavigator} from 'react-navigation';
import StackViewStyleInterpolator from 'react-navigation-stack/lib/commonjs/views/StackView/StackViewStyleInterpolator';

import HomeScreen from "./home/HomeScreen";
import UCenter from "./user/UCenter";
import Setting from "./user/Setting";
import Model from "./user/Model";
import MsgBox from "./user/MsgBox";
import MyOrder from "./user/MyOrder";
import MoneyBag from "./user/MoneyBag";
import CashOut from "./user/CashOut";
import CashOutLog from "./user/CashOutLog";
import UserDetail from "./user/UserDetail";
import MyQuality from "./user/MyQuality";
import OrderDetail from "./order/OrderDetail";
import AddQuality from "./user/AddQuality";
import global from "../api/global";

export default createStackNavigator({
    Main:{
        screen:HomeScreen,
        navigationOptions:({ navigation }) => ({
            header:null
        })
    },
    //会员中心
    UCenter:{
        screen:UCenter,
        navigationOptions:({navigation})=>({
            header:null
        })
    },
    //个人设置
    Setting:{
        screen:Setting,
        navigationOptions:({navigation})=>({
            header:null
        })
    },
    //模式设置
    Model:{
        screen:Model,
        navigationOptions:({navigation})=>({
            header:null
        })
    },
    //消息
    MsgBox:{
        screen:MsgBox,
        navigationOptions:({navigation})=>({
            header:null
        })
    },
    //我的订单
    MyOrder:{
        screen:MyOrder,
        navigationOptions:({navigation})=>({
            header:null
        })
    },
    //我的钱包
    MoneyBag:{
        screen:MoneyBag,
        navigationOptions:({navigation})=>({
            header:null
        })
    },
    //提现
    CashOut:{
        screen:CashOut,
        navigationOptions:({navigation})=>({
            header:null
        })
    },
    //提现记录
    CashOutLog:{
        screen:CashOutLog,
        navigationOptions:({navigation})=>({
            header:null
        })
    },
    //用户基本信息认证
    UserDetail:{
        screen:UserDetail,
        navigationOptions:({navigation})=>({
            header:null
        })
    },
    //订单详情
    OrderDetail:{
        screen:OrderDetail,
        navigationOptions:({navigation})=>({
            header:null
        })
    },
    //我的资质
    MyQuality:{
        screen:MyQuality,
        navigationOptions:({navigation})=>({
            header:null
        })
    },
    //上传资质
    AddQuality:{
        screen:AddQuality,
        navigationOptions:({navigation})=>({
            header:null
        })
    }
},{
    initialRouteName:"Main",
    headerMode:"float",
    transitionConfig:()=>({
        screenInterpolator: StackViewStyleInterpolator.forHorizontal,
    })
});
