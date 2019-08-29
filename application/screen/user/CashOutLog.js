import React, {Component} from 'react';
import {Platform,StyleSheet, Text, View,ScrollView,TouchableOpacity,StatusBar,FlatList,Image} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {createStackNavigator} from 'react-navigation';
import StackViewStyleInterpolator from 'react-navigation-stack/lib/commonjs/views/StackView/StackViewStyleInterpolator';


import ScreenUtil,{deviceWidth,deviceHeight,SZ_API_URI} from "../../common/ScreenUtil";

/*
* 主页
*/
export class CashOutLogView extends Component{
    constructor(props){
        super(props);
        this.state={
        }
    }
    componentDidMount() {
        this._navListener = this.props.navigation.addListener('didFocus', () => {
           StatusBar.setBarStyle('light-content');
           (Platform.OS === 'ios')?"":StatusBar.setBackgroundColor('#0071ff');
        });

    }
    componentWillUnmount() {
        this._navListener.remove();
    }
    render(){
        const  {navigate}  = this.props.navigation;
        return (
            <View>
                <FlatList
                    data={[{key: 'a'}, {key: 'b'}]}
                    keyExtractor={(item,index)=>{
                        return "key" +  index
                    }}
                    renderItem={({item}) =>
                        <View style={{
                            paddingHorizontal:ScreenUtil.scaleSize(30),
                            marginTop:ScreenUtil.scaleSize(60),
                            flexDirection:"row",
                            justifyContent:"space-between",
                            }}>
                            <View style={{justifyContent:"space-between",paddingVertical:ScreenUtil.scaleSize(10)}}>
                                <Text style={{fontSize:ScreenUtil.scaleSize(30),fontWeight:"bold",color:"#000"}}>工作消息</Text>
                                <Text numberOfLines={1} ellipsizeMode="tail">您已接受新订单，服务地址：莱山区</Text>
                            </View>
                            <View>
                                <Text>12-11</Text>
                            </View>
                        </View>
                    }
                />
            </View>
        )
    }
}
//头样式
const headerStyle = {
    style:{
        textAlign:'center',
        height:ScreenUtil.scaleSize(120),
        borderBottomWidth:0,
        shadowOpacity:0,
        elevation:0,
        backgroundColor:"#0071ff"},
    titleStyle:{
        flex:1,
        textAlign:'center',
        color:'#ffffff',
        alignItems:"center",
        fontSize:ScreenUtil.scaleSize(42)}
}
export default CashOutLog = createStackNavigator ({
    CashOutLogHome:{
        screen:CashOutLogView,
        navigationOptions:({navigation})=>({
            headerTitle : navigation.getParam("name","提现记录"),
            headerStyle:headerStyle.style,
            headerTitleStyle:headerStyle.titleStyle,
            headerTintColor:'#FFF',
            headerLeft:
                <TouchableOpacity onPress={()=>{
                    navigation.pop();
                }}>
                    <View style={{marginLeft:ScreenUtil.scaleSize(10),padding:ScreenUtil.scaleSize(10)}}>
                        <Image resizeMode="contain" source={require('../../static/icons/left_write.png')} style={{width:ScreenUtil.scaleSize(40),height:ScreenUtil.scaleSize(40)}}/>
                    </View>
                </TouchableOpacity>
            ,
            headerRight:
                <View />
        })
    },

},{
    initialRouteName:'CashOutLogHome',
    transitionConfig:()=>({
        screenInterpolator: StackViewStyleInterpolator.forHorizontal,
    })
})
const styles = StyleSheet.create({
    container: {
        backgroundColor:'#f5f6f5',
    },
    input:{
        flexDirection:"row",
        alignItems:"center",
        backgroundColor:"#fff",
        height:ScreenUtil.scaleSize(140),
        lineHeight:ScreenUtil.scaleSize(140),
        marginTop:ScreenUtil.scaleSize(30),
        paddingHorizontal:ScreenUtil.scaleSize(30),
        borderBottomWidth:StyleSheet.hairlineWidth,
        borderBottomColor:"#ccc"
    },
    label:{
        fontSize:ScreenUtil.scaleSize(36),color:"#000",fontWeight:"bold"
    }
})