import React, {Component} from 'react';
import {Platform,StyleSheet, Text, View,TouchableOpacity,StatusBar,Image,FlatList,ActivityIndicator} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {createStackNavigator} from 'react-navigation';
import StackViewStyleInterpolator from 'react-navigation-stack/lib/commonjs/views/StackView/StackViewStyleInterpolator';

import ScrollableTabView, {ScrollableTabBar} from 'react-native-scrollable-tab-view';
import ScreenUtil,{deviceWidth,deviceHeight,SZ_API_URI,DATA_API} from "../../common/ScreenUtil";

/*
* 主页
*/
export class MyQualityView extends Component{
    constructor(props){
        super(props);
        this.state={
            types:[],
            data:[],
            refreshing:true,
            loaded:false,
            count:"全部",
            statusText:""
        }
    }
    componentDidMount() {
        this._navListener = this.props.navigation.addListener('didFocus', () => {
           StatusBar.setBarStyle('dark-content');
           (Platform.OS === 'ios')?"":StatusBar.setBackgroundColor('#fff');
        });
        const types = [
            //{"id":2,"title":this.state.count},
            {"id":0,"title":"审核中"},
            {"id":1,"title":"已通过"},
            {"id":2,"title":"未通过"}
        ];
        this.setState({
            types:types,
            loaded:true,
        })
        this._loadData();
    }
    componentWillUnmount() {
        this._navListener.remove();
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
                    if(item.qualityStatus == status){
                        arr.push(item);
                    }
                });
                let statusText = "";
                if(status == 0 ){
                    statusText = "审核中";
                }else if(status == 1){
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
            console.error(err);
        })
    }
    render(){
        if(this.state.loaded == false){
            return (
                <ActivityIndicator size="large" color="#FB8703"/>
            )
        }
        let tabs = this.state.types;
        let tab = tabs.map((item,index)=>{
            return (
                <FlatList
                    contentContainerStyle={{
                        backgroundColor:'#F6F6F6',
                        paddingTop:ScreenUtil.scaleSize(20),
                        }}
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
                            <View style={{backgroundColor:"#fff", height: '100%',alignItems: 'center',justifyContent: 'center',}}>
                                <Text style={{ fontSize: ScreenUtil.scaleSize(24)}}>暂无数据</Text>
                            </View>
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
                    style={{marginTop: 20, }}
                    initialPage={0}
                    elevation={1}
                    tabBarActiveTextColor={"#FF7B21"}
                    tabBarUnderlineColor={"#FF7B21"}
                    style={{}}
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
//头样式
const headerStyle = {
    style:{
        textAlign:'center',
        height:ScreenUtil.scaleSize(120),
        borderBottomWidth:0,
        shadowOpacity:0,
        elevation:0,
        backgroundColor:"#fff"},
    titleStyle:{
        flex:1,
        textAlign:'center',
        color:'#000',
        alignItems:"center",
        fontSize:ScreenUtil.scaleSize(32)}
}
export default MyQuality = createStackNavigator ({
    MyQualityH:{
        screen:MyQualityView,
        navigationOptions:({navigation})=>({
            headerTitle : navigation.getParam("name","我的资质"),
            headerStyle:headerStyle.style,
            headerTitleStyle:headerStyle.titleStyle,
            headerTintColor:'#FFF',
            headerLeft:
                <TouchableOpacity onPress={()=>{
                    navigation.pop();
                }}>
                    <View style={{marginLeft:ScreenUtil.scaleSize(10),padding:ScreenUtil.scaleSize(10)}}>
                        <Image
                            resizeMode="contain"
                            source={require('../../static/icons/16.png')}
                            style={{width:ScreenUtil.scaleSize(30),height:ScreenUtil.scaleSize(30),}}/>
                    </View>
                </TouchableOpacity>
            ,
            headerRight:
                <TouchableOpacity onPress={()=>{
                    navigation.navigate("AddQuality");
                }}>
                    <View style={{marginRight:ScreenUtil.scaleSize(10),padding:ScreenUtil.scaleSize(10)}}>
                        <Image
                            resizeMode="contain"
                            source={require('../../static/icons/add.png')}
                            style={{width:ScreenUtil.scaleSize(30),height:ScreenUtil.scaleSize(30),}}/>
                    </View>
                </TouchableOpacity>
        })
    },

},{
    initialRouteName:'MyQualityH',
    transitionConfig:()=>({
        screenInterpolator: StackViewStyleInterpolator.forHorizontal,
    })
})
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
