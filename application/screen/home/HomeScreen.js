import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    FlatList,
    Image,
    ImageBackground,
    Modal,
    NativeModules,
    Alert,
    PanResponder,
    //Animated,
    //PermissionsAndroid
    //DeviceEventEmitter
    } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {createStackNavigator} from 'react-navigation';
import StackViewStyleInterpolator from 'react-navigation-stack/lib/commonjs/views/StackView/StackViewStyleInterpolator';

import CardView from 'react-native-cardview';
import LinearGradient from 'react-native-linear-gradient';
//import { MapView, MapTypes, Geolocation, Overlay } from 'react-native-baidu-map';

import SwitchSelector from "react-native-switch-selector";

import ScreenUtil,{deviceWidth,deviceHeight,SZ_API_URI,DATA_API} from "../../common/ScreenUtil";

/*
* 主页
*/
export class HomeView extends Component{
    constructor(props){
        super(props);
        this.state={
            data_layer_uid:0,//护工id
            data:[],
            gender:"",
            index:0,
            modalVisible:false,
            orders:0,
            income:0,
            hours:0,
            newOrderVisible:false,
            left:0,
            top:0,
            lat:0,
            lon:0,
            switchVal:1,
            order:{},
            products:{}
        }
        //this.lastX = this.state.left;
        //this.lastY = this.state.top;
        AsyncStorage.getItem('token').then(res=>{
            console.log(`token:`+res);
            //eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNaWQiOjYxLCJDdXN0b210b2tlbiI6IjdlZTZkOGEwMjBhNDJlZmYzODU0ZGI4NWZkYTEyZmNmLjBkYTg5ZDdmNTY1NmMzN2RmNjJkYzM2ZTQwNTg1YzFlIiwiZXhwIjoxNTk2NDIyMDA3LCJpc3MiOiJwaW5lLW51dC1oZWFsdGgifQ.27NqPGOBFvw_VOU3_ddzlIBryaHL3nTSs6YLPAqk6To
        })

    }
    async componentDidMount() {
        this._navListener = this.props.navigation.addListener('didFocus', () => {
           StatusBar.setBarStyle('light-content');
           (Platform.OS === 'ios')?"":StatusBar.setBackgroundColor('#0071ff');
        });
        let userInfo = JSON.parse(await AsyncStorage.getItem("userInfo"));
        let switchVal = parseInt(await AsyncStorage.getItem("switchVal"));

        this.setState({
            data_layer_uid:userInfo.data_layer_uid,
            switchVal:switchVal
        });
        //console.log(userInfo);
        if(userInfo.authentication == 0){
            this.setState({
                modalVisible:true
            })
        }

        //检测版本信息
        /*if(Android) {
            this.setState({
                apkUrl:'http://XXXXX'
            });
            Alert.alert('发现新版本','是否下载',
            [
                {text:"确定", onPress:() => {
                    //apkUrl为app下载连接地址
                    NativeModules.upgrade.upgrade(this.state.apkUrl);
                }},
            // {text:"取消", onPress:this.opntion2Selected}
                {text:"取消"}
            ]
            );
        }*/
        this._getWorkTotal(userInfo);
        this._getWorkingJub(userInfo);

        let token = await AsyncStorage.getItem("token");
        console.log(token);
        this._timer = setInterval(
            ()=>{
                this._getNewOrder(token);
            },
            10000
        );
        this._getLocal();

    }
    //获取经伟度
     _getLocal(){
         navigator.geolocation.getCurrentPosition(
            (position) => {
                if(position.coords.latitude == 0 || position.coords.longitude == 0){
                    Alert.alert("请检查GPS是否开启");
                    return;
                }
                this.setState({
                    lat: position.coords.latitude,
                    lon : position.coords.longitude
                })
            },
            (error) => {
                //reject(error);
            },
            {enableHighAccuracy:true,timeout: 20000,maximumAge:1000}
        )
    }
/*
    componentWillMount(){

        this._panResponder = PanResponder.create({
            onStartShouldSetPanResponder: (evt, gestureState) => {
                return true;
            },
            onMoveShouldSetPanResponder:  (evt, gestureState) => {
                return true;
            },
            onPanResponderGrant: (evt, gestureState) => {
                console.log("high");
                this.setState({
                    left:0,
                    top:0
                })
            },
            onPanResponderMove: (evt, gestureState) => {
                this.setState({
                    left: gestureState.dx <= 0 ? 0 : gestureState.dx >= 200 ? 200 :gestureState.dx,
                    top:0
                })
            },
            onPanResponderRelease: (evt, gestureState) => {
                this.lastX = this.state.left;
                this.lastY = this.state.top;
            },
            onPanResponderTerminate: (evt, gestureState) => {
            },
        });
    }*/
    componentWillUnmount() {
        this._navListener.remove();
        //this.deEmitter.remove();
        this._timer && clearInterval(this._timer);
    }
    //获取新订单
    _getNewOrder(token){
        fetch(SZ_API_URI + "app/api/v1/worker/careorders",{
            method:"GET",
            headers:{
                token : token
            }
        }).then(response => response.json())
        .then(responseJson => {
            if(this.state.newOrderVisible == false){
                if(responseJson.code != 200){
                    // Alert.alert('获取新订单出现错误：'+responseJson.msg)
                    return;
                }
                if(responseJson.data){
                    if(responseJson.data.length >= 1){
                        //this._timer && clearInterval(this._timer);

                        let item = responseJson.data;
                        let arr = {};

                        for(var key in item){
                            if(item[key] != undefined){
                                item[key].products = JSON.parse(item[key].products);
                                arr = item[key];
                                break;
                            }
                        }

                        this.setState({
                            modalVisible:false,
                            newOrderVisible:true,
                            order:arr,
                            products:arr.products
                        })
                    }
                }
            }

        }).catch(error => {
            console.error(error);
        });
    }

    //今日订单统计
    _getWorkTotal(userInfo){

        fetch(DATA_API + "api/v1/statistics/worker/today" + "?userId=" + userInfo.data_layer_uid,{
            method:'GET',
        })
        .then(response => response.json())
        .then(responseJson => {

            if(responseJson.code == 0){
                this.setState({
                    orders:responseJson.data.orders,
                    income:responseJson.data.income,
                    hours:responseJson.data.hours
                })
            }
        }).catch(error => {
            console.error(error);
        });
    }
    //正在进行的订单
    _getWorkingJub(user){

        fetch(DATA_API + "api/v1/order/serves/finisher?finisher=" + user.data_layer_uid + "&orderStatus=2",{
            method:"GET"
        }).then(response => response.json())
        .then(responseJson => {
            //console.log(responseJson);
            if(responseJson.code !== 0){
                //Alert.alert(responseJson.msg);
                return;
            }
            this.setState({
                data:responseJson.data,
            })
        }).catch(error => {
            console.error(error);
        });
    }
    renderLeftActions(){
        return(
            <View>
                <Text>aaa</Text>
            </View>
        )
    }
    //护工不接此单
    async _cancelLayer(){
        let token = await AsyncStorage.getItem("token");
        if(!this.state.order.ordernum){
            this.setState({
                newOrderVisible:false
            })
            return;
        }
        fetch(SZ_API_URI + "app/api/v1/careorder/delworker/"+this.state.order.ordernum,{
            method:"DELETE",
            headers:{
                token:token
            }
        }).then(res=>res.json())
        .then(resJson=>{
            //console.log(resJson);
            this.setState({
                order:{},
                newOrderVisible:false
            })
        }).catch(err=>{
            console.error(err);
        })
    }
    //护工接单
    async _cancelOrder(order_id){

        let token = await AsyncStorage.getItem("token");
        let user = JSON.parse(await AsyncStorage.getItem("userInfo"));
        let url = `${SZ_API_URI}/app/api/v1/worker/order/take/${order_id}`;

        //SZ_API_URI + "careorder/del/" + order_id + "/" + user.data_layer_uid
        fetch(url,{
            method:"PUT",
            headers:{
                token : token
            }
        }).then(res=>res.json())
        .then(resJson=>{
            this._getWorkingJub(user);
            this.setState({
                newOrderVisible:false
            })
        }).catch(err=>{
            console.log(err);
        })
    }
    //新订单modal
    _renderNewOrder(){

        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={this.state.newOrderVisible}
                onRequestClose={()=>{
                    this.setState({
                        newOrderVisible:false
                    })
                }}
            >
                <View style={styles.modal}>
                    <View style={{flexDirection:"row",width:"95%", justifyContent:"center",alignItems:"center"}}>
                        <ImageBackground
                            source={require("../../static/icons/15.png")}
                            resizeMode="stretch"
                            style={{flexDirection:"column",width:"100%",height:ScreenUtil.scaleSize(680),}}>

                            <Text
                                style={{
                                    width:"100%",
                                    height:ScreenUtil.scaleSize(180),
                                    lineHeight:ScreenUtil.scaleSize(180),
                                    color:"#fff",
                                    fontSize:ScreenUtil.scaleSize(42),
                                    fontWeight:"bold",
                                    textAlign:"center"}}>系统推送单</Text>
                            <View style={{
                                flexDirection:"row",paddingHorizontal:ScreenUtil.scaleSize(40),
                                height:ScreenUtil.scaleSize(90),
                                lineHeight:ScreenUtil.scaleSize(90),alignItems:"center"}}>
                                <Image
                                    resizeMode="contain"
                                    source={require("../../static/icons/time.png")}
                                    style={{width:ScreenUtil.scaleSize(40),height:ScreenUtil.scaleSize(40)}}/>
                                <Text style={{
                                    marginLeft:ScreenUtil.scaleSize(20),
                                    fontSize:ScreenUtil.scaleSize(32),
                                    color:"#fff"}}>预约时间:{this.state.order.appointTime}</Text>
                            </View>
                            <View style={{
                                flexDirection:"row",paddingHorizontal:ScreenUtil.scaleSize(40),
                                height:ScreenUtil.scaleSize(90),
                                lineHeight:ScreenUtil.scaleSize(90),alignItems:"center"}}>
                                <Image
                                    resizeMode="contain"
                                    source={require("../../static/icons/local.png")}
                                    style={{width:ScreenUtil.scaleSize(40),height:ScreenUtil.scaleSize(40)}}/>
                                <Text style={{marginLeft:ScreenUtil.scaleSize(20),fontSize:ScreenUtil.scaleSize(32),color:"#fff"}}>
                                服务地址:{this.state.order.province}{this.state.order.city}{this.state.order.county}{this.state.order.detail}
                                </Text>
                            </View>
                            <View style={{
                                flexDirection:"row",paddingHorizontal:ScreenUtil.scaleSize(40),
                                height:ScreenUtil.scaleSize(90),
                                lineHeight:ScreenUtil.scaleSize(90),alignItems:"center"}}>
                                <Image
                                    resizeMode="contain"
                                    source={require("../../static/icons/con.png")}
                                    style={{width:ScreenUtil.scaleSize(40),height:ScreenUtil.scaleSize(40)}}/>
                                <Text style={{marginLeft:ScreenUtil.scaleSize(20),fontSize:ScreenUtil.scaleSize(32),color:"#fff"}}>服务内容:{this.state.products.title}</Text>
                            </View>
                            <View style={{
                                flexDirection:"row",
                                justifyContent:"space-between",
                                paddingHorizontal:ScreenUtil.scaleSize(40),
                                marginTop:ScreenUtil.scaleSize(50)}}>
                                <TouchableOpacity onPress={()=>{
                                    this._cancelOrder(this.state.order.orderId);
                                }}>
                                    <Text style={{
                                        width:ScreenUtil.scaleSize(300),
                                        height:ScreenUtil.scaleSize(100),
                                        lineHeight:ScreenUtil.scaleSize(100),
                                        backgroundColor:"#fff",
                                        borderRadius:ScreenUtil.scaleSize(10),
                                        color:"#333",textAlign:"center",
                                        fontSize:ScreenUtil.scaleSize(32)}}>接单</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={()=>{
                                    this._cancelLayer();
                                }}>
                                    <Text style={{
                                        width:ScreenUtil.scaleSize(300),
                                        height:ScreenUtil.scaleSize(100),
                                        lineHeight:ScreenUtil.scaleSize(100),
                                        borderWidth:ScreenUtil.scaleSize(2),
                                        borderRadius:ScreenUtil.scaleSize(10),
                                        borderColor:"#fff",
                                        textAlign:"center",
                                        color:"#fff",
                                        fontSize:ScreenUtil.scaleSize(32)
                                    }}>拒绝</Text>
                                </TouchableOpacity>

                            </View>
                        </ImageBackground>
                    </View>
                </View>
            </Modal>
        )
    }
    //身份验证modal
    _renderIdCard(){
        return(
            <Modal
                animationType="slide"
                transparent={true}
                visible={this.state.modalVisible}
                onRequestClose={() => {
                    this.setState({
                        modalVisible:false
                    })
                }}
            >
                <View style={styles.modal}>
                    <View style={styles.modal_view}>
                        <View style={styles.modal_top}>
                            <View style={{alignItems:"flex-end",padding:ScreenUtil.scaleSize(10)}}>
                                <TouchableOpacity onPress={()=>{
                                    this.setState({
                                        modalVisible:false
                                    })
                                }}>
                                    <Image source={require("../../static/icons/close_write.png")} style={{width:ScreenUtil.scaleSize(40),height:ScreenUtil.scaleSize(40)}} />
                                </TouchableOpacity>
                            </View>
                            <View style={{justifyContent:"center",alignItems:"center"}}>
                                <Text style={{color:"#fff",fontSize:ScreenUtil.scaleSize(32)}}>身份验证</Text>
                                <Image source={require("../../static/icons/idCard.png")}
                                    style={{width:ScreenUtil.scaleSize(200),height:ScreenUtil.scaleSize(100),marginTop:ScreenUtil.scaleSize(30)}} />
                            </View>
                        </View>

                        <View style={styles.modal_bottom}>
                            <Text style={{
                                fontSize:ScreenUtil.scaleSize(32),
                                height:ScreenUtil.scaleSize(100),
                                lineHeight:ScreenUtil.scaleSize(100)
                                }}>账号注册成功</Text>
                            <Text style={{fontSize:ScreenUtil.scaleSize(26)}}>为了方便使用本应用，请先进行身份验证</Text>
                            <TouchableOpacity onPress={()=>{
                                this.setState({
                                    modalVisible:false
                                });
                                this.props.navigation.navigate("UserDetail");
                            }}>
                                <Text style={styles.go_button}>身份验证</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        )
    }
    //头部
    _renderHeader(){
        return(
            <LinearGradient colors={['#0071ff', '#1f82ff']} start={{x: 0, y: 1}} end={{x: 0, y: 0}} style={{}}>
            <View style={{}}>
                <ImageBackground source={require("../../static/icons/01.png")} style={[styles.topView,{marginHorizontal:ScreenUtil.scaleSize(30)}]}>
                        <View style={styles.listView}>
                            <Text style={styles.num}>{this.state.orders}</Text>
                            <Text style={styles.desc}>今日接单</Text>
                        </View>
                        <View style={styles.listView}>
                            <Text style={styles.num}>{this.state.income}元</Text>
                            <Text style={styles.desc}>今日收入</Text>
                        </View>
                        <View style={styles.listView}>
                            <Text style={styles.num}>{this.state.hours}h</Text>
                            <Text style={styles.desc}>护理时长</Text>
                        </View>
                </ImageBackground>

                <View style={{
                    flexDirection:"row",
                    marginTop:ScreenUtil.scaleSize(30),
                    height:ScreenUtil.scaleSize(100),
                    alignItems:"center",
                    backgroundColor:"rgba(0,0,0,0.3)",
                    paddingHorizontal:ScreenUtil.scaleSize(30)}}>
                    <Image source={require("../../static/icons/04.png")} style={{width:ScreenUtil.scaleSize(80),height:ScreenUtil.scaleSize(30)}} />
                    <Text style={{color:"#FFF"}}></Text>
                </View>
            </View>

            </LinearGradient>
        )
    }
    async _updateModel(val,index){
//        let data = new FormData();
//        data.append("sid",this.state.data_layer_uid);
//        data.append("longitude",this.state.lon);
//        data.append("latitude",this.state.lat);
//        data.append("status",val);

        let token = await AsyncStorage.getItem("token");

        if(this.state.lon == 0 || this.state.lat == 0){
            this._getLocal();
        }
        const url = SZ_API_URI + "app/api/v1/worker/state/" + this.state.lon + "/" + this.state.lat + "/" + val;
        fetch(url,{
            method:'PUT',
            headers:{
                //"Content-Type":"multipart/form-data",
                "token" : token
            },
        })
        .then(response => response.json())
        .then(responseJson => {
            if(responseJson.code !== 200){
                Alert.alert(responseJson.msg);
                return;
            }

            AsyncStorage.setItem("switchVal",index.toString());
        }).catch(error => {
            console.error(error);
        });
    }
    //左右滑动
    _renderLeft(){
        return (

            <SwitchSelector
              initial={0}
              height={50}
              onPress={value => {
                let index = 1;
                if(value == 1){
                    index = 0;
                }
                this._updateModel(value,index);

              }}
              disableValueChangeOnPress={true}
              textColor={"#CCC"} //'#7a44cf'
              selectedTextStyle={{color:"#fff",fontWeight:"bold"}}
              selectedColor={"#0071ff"}
              buttonColor={"#0071ff"}
              borderColor={"#ccc"}
              value={this.state.switchVal}
              hasPadding
              options={[
                { label: "开始接单", value: "1",}, //images.feminino = require('./path_to/assets/img/feminino.png')
                { label: "停止接单", value: "0",} //images.masculino = require('./path_to/assets/img/masculino.png')
              ]}
            />

        )
    }
    render(){
        const  {navigate}  = this.props.navigation;
        //console.log(this.state);
        return (

        <View style={{flex:1}}>
            <ScrollView style={[styles.container,{flex:1}]}>
                    {this._renderHeader()}

                <FlatList
                    style={{margin:ScreenUtil.scaleSize(30)}}
                    data={this.state.data}
                    horizontal={false}
                    keyExtractor={(item,index)=>{
                        return "key" +  index
                    }}
                    ListEmptyComponent={()=>{
                        return(
                            <View style={{backgroundColor:"#fff", height: '100%',alignItems: 'center',justifyContent: 'center',}}>
                                <Text style={{ fontSize: ScreenUtil.scaleSize(24)}}>暂无数据</Text>
                            </View>
                        )
                    }}
                    renderItem={({item,index})=>(
                        <TouchableOpacity onPress={()=>{

                            navigate("OrderDetail",{
                                id:item.orderId,
                                add:item.address,
                                phone:item.contactPhone,
                                time:item.appointTime,
                                user:item.contactPerson,
                                remark:item.remark,
                                lat:this.state.lat,
                                lon:this.state.lon,
                                cuslat:item.latitude,
                                cuslon:item.longitude,
                                });
                        }}>

                        <CardView
                            style={{marginBottom:ScreenUtil.scaleSize(30)}}
                            cardElevation={4}
                            cardMaxElevation={5}
                            cornerRadius={5}>

                            <View style={{backgroundColor:"#fff",}}>
                                <LinearGradient style={[styles.textWeight,{textAlign:"center",alignItems:"center",justifyContent:"center"}]} colors={['#ff7418', '#ffa35c']} start={{x: 1, y: 0}} end={{x: 0, y: 0}}>
                                <Text style={{color:"#FFF",fontSize:ScreenUtil.scaleSize(30),fontWeight:"bold"}}>待完成订单</Text>

                                </LinearGradient>

                                <View style={styles.fuwu}>
                                    <Image resizeMode="contain" source={require("../../static/icons/06.png")} style={{width:ScreenUtil.scaleSize(40),height:ScreenUtil.scaleSize(40)}} />
                                    <Text style={styles.text}>服务地址:{item.address}</Text>
                                </View>
                                <View style={styles.fuwu}>
                                    <Image resizeMode="contain" source={require("../../static/icons/07.png")} style={{width:ScreenUtil.scaleSize(40),height:ScreenUtil.scaleSize(40)}} />
                                    <Text style={styles.text}>联系电话:{item.contactPhone}</Text>
                                </View>
                                <View style={styles.fuwu}>
                                    <Image resizeMode="contain" source={require("../../static/icons/09.png")} style={{width:ScreenUtil.scaleSize(40),height:ScreenUtil.scaleSize(40)}} />
                                    <Text style={styles.text}>预约时间:{item.appointTime}</Text>
                                </View>
                                <View style={styles.fuwu}>
                                    <Image resizeMode="contain" source={require("../../static/icons/11.png")} style={{width:ScreenUtil.scaleSize(40),height:ScreenUtil.scaleSize(40)}} />
                                    <Text style={styles.text}>备注:{item.remark}</Text>
                                </View>
                            </View>

                            </CardView>


                        </TouchableOpacity>
                    )}
                />
            </ScrollView>

            {this._renderNewOrder()}
            {this._renderIdCard()}

            <View style={styles.footer}>
                <View style={{flex:1}}>
                    <TouchableOpacity onPress={()=>{
                        navigate("Model");
                    }}>
                        <Text style={{
                            width:ScreenUtil.scaleSize(150),
                            borderWidth:1,
                            borderColor:"#FFF",
                            textAlign:"center",
                            paddingVertical:10,
                            borderRadius:ScreenUtil.scaleSize(20),
                            color:"#FFF"}}>模式</Text>
                    </TouchableOpacity>
                </View>


                <View style={{flex:2,
                    height: ScreenUtil.scaleSize(240),width:ScreenUtil.scaleSize(500),
                    alignItems:"center",justifyContent:"center",lineHeight:ScreenUtil.scaleSize(240),
                    }} >
                    {/*
                    <Animated.View
                        style={{
                            width:ScreenUtil.scaleSize(100),
                            height:ScreenUtil.scaleSize(120),
                            backgroundColor:"red",
                            marginTop:this.state.top,
                            marginLeft:this.state.left,
                            transform:[
                                translateX:
                            ]}}
                        {...this._panResponder.panHandlers}
                    >
                        <Text>开始接单</Text>
                    </Animated.View>
                    */}
                    {
                    //左滑右滑render
                    this._renderLeft()
                    }
                </View>
            </View>

            </View>
        )
    }
}
//头样式
const headerStyle = {
    style:{textAlign:'center',height:ScreenUtil.scaleSize(120),borderBottomWidth:0,shadowOpacity:0,elevation:0,backgroundColor:"#0071ff"},
    titleStyle:{flex:1, textAlign:'center',color:'#FFF', alignItems:"center",fontSize:ScreenUtil.scaleSize(36)}
}
export default HomeScreen = createStackNavigator ({
    MainH:{
        screen:HomeView,
        navigationOptions:({navigation})=>({
            headerTitle : navigation.getParam("name","管家端"),
            headerStyle:headerStyle.style,
            headerTitleStyle:headerStyle.titleStyle,
            headerTintColor:'#0071ff',
            headerLeft:
                <TouchableOpacity onPress={()=>{
                    navigation.navigate("UCenter");
                }}>
                    <View style={{marginLeft:ScreenUtil.scaleSize(10),padding:ScreenUtil.scaleSize(10)}}>
                        <Image resizeMode="contain" source={require('../../static/icons/02.png')} style={{width:ScreenUtil.scaleSize(40),height:ScreenUtil.scaleSize(40)}}/>
                    </View>
                </TouchableOpacity>
            ,
            headerRight:
                <TouchableOpacity onPress={()=>{
                    navigation.navigate("MsgBox");
                }}>
                    <View style={{marginRight:ScreenUtil.scaleSize(10),padding:ScreenUtil.scaleSize(10)}}>
                        <Image resizeMode="contain" source={require('../../static/icons/03.png')} style={{width:ScreenUtil.scaleSize(40),height:ScreenUtil.scaleSize(40)}}/>
                    </View>
                </TouchableOpacity>
        })
    },

},{
    initialRouteName:'MainH',
    transitionConfig:()=>({
        screenInterpolator: StackViewStyleInterpolator.forHorizontal,
    })
})
const styles = StyleSheet.create({
    container: {
        backgroundColor:'#f5f6f5',
    },
    topView:{
        height:ScreenUtil.scaleSize(250),
        borderRadius:ScreenUtil.scaleSize(10),
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center",
        paddingHorizontal:ScreenUtil.scaleSize(20)
    },
    listView:{
        alignItems:"center"
    },
    textInputType:{
        //textAlignVertical:"top",
        padding:5,
        backgroundColor: '#FFFFFF',
        borderRadius:5,
        height:50,
        borderColor:'#F6F6F6',
        borderWidth: StyleSheet.hairlineWidth,
        width:'90%',
        marginTop:15
    },
    num:{
        color:"#000",fontSize:ScreenUtil.scaleSize(42),fontWeight:"bold"
    },
    desc:{
        fontSize:ScreenUtil.scaleSize(26)
    },
    textWeight:{
        fontSize:ScreenUtil.scaleSize(24),

        width:ScreenUtil.scaleSize(220),
        height:ScreenUtil.scaleSize(70),
        marginTop:ScreenUtil.scaleSize(10),
        borderTopRightRadius:30,
        borderBottomRightRadius:30,
        color:"#FFF",
        backgroundColor:"red"
    },
    text:{
        marginVertical:ScreenUtil.scaleSize(20),
        paddingHorizontal:ScreenUtil.scaleSize(20),
        lineHeight:ScreenUtil.scaleSize(40),
        fontSize:ScreenUtil.scaleSize(30)
    },
    fuwu:{
        flexDirection:"row",
        justifyContent:"flex-start",
        alignItems:"center",
        paddingHorizontal:ScreenUtil.scaleSize(30)
    },
    footer:{
        flexDirection:"row",
        backgroundColor:"#0071ff",
        height:ScreenUtil.scaleSize(150),
        alignItems:"center",
        justifyContent:"space-between",
        paddingHorizontal:ScreenUtil.scaleSize(30)
    },
    modal:{
        alignItems:"center",
        width:deviceWidth,
        height:deviceHeight,
        backgroundColor:"rgba(0,0,0,0.5)",
        justifyContent:"center"
    },
    modal_view:{
        width:"90%",
        height:ScreenUtil.scaleSize(600),
        borderRadius:ScreenUtil.scaleSize(10)
    },
    modal_top:{
        backgroundColor:"#0071ff",
        flex:1,
        borderTopLeftRadius:ScreenUtil.scaleSize(10),
        borderTopRightRadius:ScreenUtil.scaleSize(10)
    },
    modal_bottom:{
        flex:1,alignItems:"center",
        backgroundColor:"#fff",
        borderBottomLeftRadius:ScreenUtil.scaleSize(10),borderBottomRightRadius:ScreenUtil.scaleSize(10)
    },
    go_button:{
        width:ScreenUtil.scaleSize(400),
        height:ScreenUtil.scaleSize(100),
        lineHeight:ScreenUtil.scaleSize(100),
        backgroundColor:"#0071ff",
        color:"#fff",
        alignItems:"center",
        textAlign:"center",
        borderRadius:ScreenUtil.scaleSize(50),
        marginTop:ScreenUtil.scaleSize(30)
    },
    job_button:{
       width:ScreenUtil.scaleSize(500),
       height:ScreenUtil.scaleSize(240),
       flexDirection:"row",
       justifyContent:"space-between",
       alignItems:"center"
    }
})
