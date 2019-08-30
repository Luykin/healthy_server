import React, {Component} from 'react';
import {Platform,StyleSheet, Text, View,TouchableOpacity,StatusBar,Image,FlatList,ActivityIndicator} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {createStackNavigator} from 'react-navigation';
import StackViewStyleInterpolator from 'react-navigation-stack/lib/commonjs/views/StackView/StackViewStyleInterpolator';

import ScrollableTabView, {ScrollableTabBar} from 'react-native-scrollable-tab-view';
import ScreenUtil,{deviceWidth,deviceHeight,SZ_API_URI,DATA_API} from "../../common/ScreenUtil";
import Empty from "../../base/Empty";

/*
* 主页
*/
export default class MyQualityView extends Component{
    constructor(props){
        super(props);
        this.state={
            types:[

                {"id":0,"title":"审核中"},
                {"id":1,"title":"已通过"},
                {"id":2,"title":"未通过"}
            ],
            data:[],
            refreshing:false,
            loaded:false,
            count:"全部",
            statusText:""
        }
    }
    componentDidMount() {
        this._loadData();
    }
    componentWillUnmount() {
    }
    //加载数据  3进行中 4已完成
    async _loadData(status = 0){
        let user = JSON.parse(await AsyncStorage.getItem("userInfo"));

        fetch(DATA_API + "api/v1/quality/" + user.data_layer_uid,{
            method:"GET"
        }).then(res=>res.json())
        .then(resJson=>{
            if(resJson && resJson.data && resJson.data.length > 0){
                let arr = [];
                resJson.data.map((item,key)=>{
                    if(item.qualityStatus === status){
                        arr.push(item);
                    }
                });
                let statusText = "";
                if(status === 0 ){
                    statusText = "审核中";
                }else if(status === 1){
                    statusText = "已通过";
                }else{
                    statusText = "未通过";
                }
                this.setState({
                    data : arr,
                    refreshing:false,
                    statusText : statusText
                })
            }

        }).catch(err=>{
            this.setState({
                refreshing:false,
            })
            console.error(err);
        })
    }
    render(){
        let tabs = this.state.types;
        let tab = tabs.map((item,index)=>{
            return (
                <FlatList
                    style={{flex:1}}
                    tabLabel = {item.title}
                    data={this.state.data}
                    horizontal={false}
                    key = {index}
                    keyExtractor={(item,index)=>{
                        return "key" +  index
                    }}
                    refreshing={this.state.refreshing}
                    onRefresh={()=>{
                        this._loadData(item.id)
                    }}
                    onEndReached={()=>{

                    }}
                    ListEmptyComponent={()=>{
                        return(
                            <Empty/>
                        )
                    }}
                    renderItem={({item,index})=>(
                        <View style={{
                            backgroundColor:"#fff",
                            marginBottom:ScreenUtil.scaleSize(10),
                            paddingHorizontal:ScreenUtil.scaleSize(30),
                            paddingVertical:ScreenUtil.scaleSize(20)}}>
                            <View style={{textAlign:"center",}}>
                                <Text style={{fontSize:ScreenUtil.scaleSize(36),fontWeight:"bold",color:"#000"}}>{item.qualityType}</Text>
                                <Text style={{height:ScreenUtil.scaleSize(80),lineHeight:ScreenUtil.scaleSize(80)}}>{item.name}</Text>
                            </View>
                            <Text style={{textAlign:"right"}}>{this.state.statusText}</Text>
                        </View>
                    )}
                />
            )
        })

        const  {navigate}  = this.props.navigation;
        return (
            <View style={{flex:1}}>
                <ScrollableTabView
                    initialPage={0}
                    elevation={1}
                    tabBarActiveTextColor={"#FF7B21"}
                    tabBarUnderlineStyle={{
                        backgroundColor: '#FF7B21',
                        height: 1
                    }}
                    onChangeTab = {(obj)=>{
                        this._loadData(obj.i);
                    }}
                    renderTabBar={() => <ScrollableTabBar style={{}}/>}
                  >
                   {tab}
                </ScrollableTabView>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        backgroundColor:'#FFF',
    },
    view:{
        backgroundColor:"#fff",
        marginBottom:ScreenUtil.scaleSize(20),
        padding:ScreenUtil.scaleSize(30),
        borderRadius:ScreenUtil.scaleSize(10),
        marginHorizontal:ScreenUtil.scaleSize(20)
    },
    list:{
        flexDirection:"row",
        justifyContent:"space-between",
        borderBottomWidth:StyleSheet.hairlineWidth,
        borderBottomColor:"#ccc",
        height:ScreenUtil.scaleSize(70),
        lineHeight:ScreenUtil.scaleSize(70)
    },
    status:{
        color:"#000",
        fontSize:ScreenUtil.scaleSize(30),
        fontWeight:"bold"
    },
    phone:{
        fontSize:ScreenUtil.scaleSize(24),
        height:ScreenUtil.scaleSize(50),
        lineHeight:ScreenUtil.scaleSize(50),
        width:ScreenUtil.scaleSize(150),
        borderRadius:ScreenUtil.scaleSize(50),
        color:"#FF9900",
        borderWidth:1,
        borderColor:"#FF9900",
        textAlign:"center"
    },
    text:{
        height:ScreenUtil.scaleSize(80),lineHeight:ScreenUtil.scaleSize(80)
    }
})
