import React, {Component} from 'react';
import {Linking,Platform,StyleSheet, Text, View,TouchableOpacity,StatusBar,Image,FlatList,ActivityIndicator} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {createStackNavigator} from 'react-navigation';
import StackViewStyleInterpolator from 'react-navigation-stack/lib/commonjs/views/StackView/StackViewStyleInterpolator';

import ScrollableTabView, {ScrollableTabBar} from 'react-native-scrollable-tab-view';
import ScreenUtil,{deviceWidth,deviceHeight,SZ_API_URI,DATA_API} from "../../common/ScreenUtil";

const serviceType = {
    "全部":"",
    "待服务":"2",
    "已完成":"4"
}
/*
* 主页
*/
export class MyOrderView extends Component{
    constructor(props){
        super(props);
        this.state={
            types:[],
            data:{
                list:[]
            },
            refreshing:true,
            loaded:false,
            count:"全部"
        }
    }
    async componentDidMount() {
        this.token = await AsyncStorage.getItem("token");
        this._navListener = this.props.navigation.addListener('didFocus', () => {
           StatusBar.setBarStyle('dark-content');
           (Platform.OS === 'ios')?"":StatusBar.setBackgroundColor('#fff');
        });
        const types = [
            {"id":1,"title":"全部"},
            {"id":2,"title":"进行中"},
            {"id":3,"title":"已完成"}
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
    //加载数据  2进行中 4已完成
    _loadData = async (type_id = "") =>{
        const self = this
        let user = JSON.parse(await AsyncStorage.getItem("userInfo"));

        const url = `${SZ_API_URI}/app/api/v1/worker/orders?orderStatus=${type_id}`;
        fetch(url,{
            method:"GET",
            headers:{"token":self.token}
        }).then(response => response.json())
        .then(responseJson => {

            if(responseJson.code != 200){
                return;
            }
            this.setState({
                data:responseJson.data,
                refreshing:false
            })
        }).catch(error => {
            console.error(error);
        });
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
                    data={this.state.data.list}
                    horizontal={false}
                    key = {index}
                    keyExtractor={(item,index)=>{
                        return "key" + item.orderId
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
                    renderItem={({item,index})=>{
                        let  strOrderStatus = '进行中';
                        if(item.orderStatus == 4){
                            strOrderStatus = '已完成'
                        }
                        return (
                            <View style={styles.view}>
                                <View style={styles.list}>
                                    <Text style={styles.status}>{strOrderStatus}</Text>
                                    <TouchableOpacity onPress={()=>{
                                        const url = `tel:${item.contactPhone}`;
                                        Linking.canOpenURL(url).then(supported => {
                                            if (!supported) {
                                                Alert.alert('无法拨打电话')
                                                console.log('Can\'t handle url: ' + url);
                                            } else {
                                                return Linking.openURL(url);
                                            }
                                        }).catch(err => console.error('An error occurred'));
                                    }}>
                                        <Text style={styles.phone}>拨打电话</Text>
                                    </TouchableOpacity>
                                </View>
                                <View stype={{paddingVertical:ScreenUtil.scaleSize(30)}}>
                                    <Text style={styles.text}>{item.appointTime}</Text>
                                    <Text style={[styles.text,{fontSize:ScreenUtil.scaleSize(32),fontWeight:"bold"}]}>
                                        <Image source={require("../../static/icons/point.png")} style={{width:ScreenUtil.scaleSize(40),height:ScreenUtil.scaleSize(40)}}/>{item.serveDay}
                                    </Text>
                                    <Text style={[styles.text,{fontSize:ScreenUtil.scaleSize(28)}]}>
                                        <Image source={require("../../static/icons/point.png")} style={{width:ScreenUtil.scaleSize(40),height:ScreenUtil.scaleSize(40)}}/>
                                    {item.address}</Text>
                                </View>
                            </View>
                        );
                    }}
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
                        let tid = "";
                        if(obj.i == 1){
                            tid = 2;
                        }else if(obj.i == 2){
                            tid = 4;
                        }
                        this._loadData(tid);
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
export default MyOrder = createStackNavigator ({
    MyOrderH:{
        screen:MyOrderView,
        navigationOptions:({navigation})=>({
            headerTitle : navigation.getParam("name","我的订单"),
            headerStyle:headerStyle.style,
            headerTitleStyle:headerStyle.titleStyle,
            headerTintColor:'#FFF',
            headerLeft:
                <TouchableOpacity onPress={()=>{
                    navigation.pop();
                }}>
                    <View style={{marginLeft:ScreenUtil.scaleSize(10),padding:ScreenUtil.scaleSize(10)}}>
                        <Image resizeMode="contain" source={require('../../static/icons/16.png')} style={{width:ScreenUtil.scaleSize(30),height:ScreenUtil.scaleSize(30),}}/>
                    </View>
                </TouchableOpacity>
            ,
            headerRight:
                <View />
        })
    },

},{
    initialRouteName:'MyOrderH',
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
