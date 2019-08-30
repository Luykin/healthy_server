import React, {Component} from 'react';
import {Platform,StyleSheet, Text, View,ScrollView,TouchableOpacity,StatusBar,Image,Switch,FlatList} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {createStackNavigator} from 'react-navigation';
import StackViewStyleInterpolator from 'react-navigation-stack/lib/commonjs/views/StackView/StackViewStyleInterpolator';

import DatePicker from 'react-native-datepicker';

import ScreenUtil,{deviceWidth,deviceHeight,SZ_API_URI} from "../../common/ScreenUtil";

const Data=[{"id":1}]
/*
* 主页
*/
export class MsgBoxView extends Component{
    constructor(props){
        super(props);
        this.state={
            isOn:false,
            isYuyue:false,
            date:"2019-01-01",
            leftCheck:true,
            rightCheck:false
        }
    }
    componentDidMount() {
        // this._navListener = this.props.navigation.addListener('didFocus', () => {
        //    // StatusBar.setBarStyle('dark-content');
        //    // (Platform.OS === 'ios')?"":StatusBar.setBackgroundColor('#0071ff');
        // });
    }
    componentWillUnmount() {
        // this._navListener.remove();
    }
    switchValue(e){
        this.setState({
            isOn:e
        })
    }
    switchYuyueValue(e){
        this.setState({
            isYuyue:e
        })
    }
    //加载数据  1服务通知 2其他通知
    loadData(type_id = 1){

    }
    render(){
        const  {navigate}  = this.props.navigation;
        return (
            <ScrollView style={[styles.container]} contentContainerStyle={{}}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={()=>{
                        this.setState({
                            leftCheck:true,
                            rightCheck:false
                        })
                    }}>
                        <Text style={
                            [styles.text,
                                {
                                    borderTopLeftRadius:ScreenUtil.scaleSize(40),
                                    borderBottomLeftRadius:ScreenUtil.scaleSize(40),
                                    backgroundColor:this.state.leftCheck == true ? "#fff" :"#0071ff",
                                    color:this.state.leftCheck == true ?"#0071ff" : "#fff"
                                }]}>服务通知</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>{
                        this.setState({
                            leftCheck:false,
                            rightCheck:true
                        })
                    }}>
                        <Text style={
                            [styles.text,
                                {
                                    borderTopRightRadius:ScreenUtil.scaleSize(40),
                                    borderBottomRightRadius:ScreenUtil.scaleSize(40),
                                    backgroundColor:this.state.rightCheck == true ? "#fff" :"#0071ff",
                                    color:this.state.rightCheck == true ?"#0071ff" : "#fff"
                                }]}>其他通知</Text>
                    </TouchableOpacity>
                </View>
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
                            <Image source={require("../../static/icons/26.png")} style={{
                                width:ScreenUtil.scaleSize(120),height:ScreenUtil.scaleSize(120)}} />
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
            </ScrollView>
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
        color:'#FFF',
        alignItems:"center",
        fontSize:ScreenUtil.scaleSize(42)}
}
export default MsgBox = createStackNavigator ({
    MsgBoxH:{
        screen:MsgBoxView,
        navigationOptions:({navigation})=>({
            headerTitle : navigation.getParam("name","消息通知"),
            headerStyle:headerStyle.style,
            headerTitleStyle:headerStyle.titleStyle,
            headerTintColor:'#FFF',
            headerLeft:
                <TouchableOpacity onPress={()=>{
                    navigation.pop();
                }}>
                    <View style={{marginLeft:ScreenUtil.scaleSize(10),padding:ScreenUtil.scaleSize(10)}}>
                        <Image resizeMode="contain" source={require('../../static/icons/left_write.png')} style={{width:ScreenUtil.scaleSize(40),height:ScreenUtil.scaleSize(40),}}/>
                    </View>
                </TouchableOpacity>
            ,
            headerRight:
                <View />
        })
    },

},{
    initialRouteName:'MsgBoxH',
    transitionConfig:()=>({
        screenInterpolator: StackViewStyleInterpolator.forHorizontal,
    })
})
const styles = StyleSheet.create({
    container: {
        backgroundColor:'#FFF',
    },
    header:{
        flexDirection:"row",
        justifyContent:"center",
        alignItems:"center",
        backgroundColor:"#0071ff",
        paddingVertical:ScreenUtil.scaleSize(30)
    },
    text:{
        backgroundColor:"#1f82ff",
        color:"#fff",
        width:ScreenUtil.scaleSize(230),
        padding:ScreenUtil.scaleSize(20),
        borderWidth:0.9,
        borderColor:"#fff",
        textAlign:"center"
    }


})
