import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    Image,
    Switch,
    Alert} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {createStackNavigator} from 'react-navigation';
import StackViewStyleInterpolator from 'react-navigation-stack/lib/commonjs/views/StackView/StackViewStyleInterpolator';

import DatePicker from 'react-native-datepicker';

import ScreenUtil,{deviceWidth,deviceHeight,SZ_API_URI,DATA_API} from "../../common/ScreenUtil";

/*
* 主页
*/
export default class Model extends Component{
    constructor(props){
        super(props);
        this.state={
            isOn:false,//是否实时单
            isYuyue:false,//是否预约单
            limit:0,//可接单范围
            types:[],//可接单类型
            startTime:"",
            endTime:""
        }
    }
    componentDidMount() {
        // this._navListener = this.props.navigation.addListener('didFocus', () => {
        //    StatusBar.setBarStyle('dark-content');
        //    (Platform.OS === 'ios')?"":StatusBar.setBackgroundColor('#FFFFFF');
        // });
        let date = new Date();

        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        let hours = date.getHours();
        let minute = date.getMinutes();
        let second = date.getSeconds();

        let now = year + '-' + month + "-" + day + " " + hours + ":" + minute + ":" + second;
        let nextDay = year + '-' + month + "-" + (day + 1) + " " + hours + ":" + minute + ":" + second;

        this.setState({
            startTime:now,
            endTime:nextDay
        })
        this._getWorkModel();
    }
    //工作模式
    async _getWorkModel(){
        let user = JSON.parse(await AsyncStorage.getItem("userInfo"));

        fetch(DATA_API + "api/v1/modes/" + user.data_layer_uid,{
            method:"GET"
        }).then(response => response.json())
        .then(responseJson=>{
            console.log(responseJson, 'model 数据设置');
            if(responseJson.code !== 0){
                Alert.alert(responseJson.msg);
                return;
            }
            let d = responseJson.data;

            this.setState({
                isOn : d.realTimeMode,
                isYuyue : d.acceptAppoint,
                limit : d.geoRange,
                startTime : d.appointStartTime,
                endTime : d.appointEndTime,
                types : d.serves.split(',').map((val)=>{
                                            return parseInt(val);
                                        })

            })
        }).catch(error => {
            console.error(error);
        });
    }
    componentWillUnmount() {
        //this._navListener.remove();
    }
    //实时单
    switchValue(e){
        this.setState({
            isOn:e
        })
    }
    //预约单
    switchYuyueValue(e){
        this.setState({
            isYuyue:e
        })
    }
    //接单类型
    _getTypes(type=1){

        let arr = this.state.types;

        if(arr.indexOf(type) > -1){
            arr.splice(arr.indexOf(type),1);
        }else{
            arr.push(type);
        }
        this.setState({
            types:arr
        })
    }
    //提交
    async _submit(){

        let userInfo = JSON.parse(await AsyncStorage.getItem("userInfo"));
        let token = await AsyncStorage.getItem("token");
        if(this.state.types.length == 0){
            Alert.alert("请选择接单类型");
            return;
        }

        let data = {};
        data.userId = userInfo.data_layer_uid;
        data.real_timemode = this.state.isOn;
        data.geo_range = this.state.limit;
        data.accept_appoint = this.state.isYuyue;

        if(this.state.isYuyue == true){
            data.appoint_starttime = this.state.startTime;
            data.appoint_endtime = this.state.endTime;
        }
        data.serves = this.state.types.join(",");

        let formData = new FormData();
        formData.append("userId",data.userId);
        formData.append("real_timemode",data.real_timemode);
        formData.append("geo_range",data.geo_range);
        formData.append("accept_appoint",data.accept_appoint);
        formData.append("appoint_starttime",data.appoint_starttime || "");
        formData.append("appoint_endtime",data.appoint_endtime || "");
        formData.append("serves",data.serves);

        fetch(SZ_API_URI + "app/api/v1/worker/modes",{
            method:'POST',
            headers: {
                "Content-Type" : "multipart/form-data",
                "token" : token
            },
            // body:JSON.stringify(data)
            body:formData
        }).then(response => response.json())
        .then(responseJson => {
        console.log(responseJson);
            if(responseJson.code == 200){
                Alert.alert(responseJson.msg);
                return;
            }else{
                Alert.alert(responseJson.msg);
            }

        }).catch(error => {
            console.error(error);
        });
    }
    render(){
        const  {navigate}  = this.props.navigation;
        return (
            <ScrollView style={[styles.container]} contentContainerStyle={{}}>
                <View style={[styles.view,{marginTop:ScreenUtil.scaleSize(30),borderBottomWidth:0.9,borderBottomColor:"#ccc",}]}>
                    <Text style={styles.label}>实时单</Text>
                    <View style={styles.inputBlock}>
                        <Switch
                            style={{ transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }] }}
                            trackColor='#1f82ff'  //开关打开时的背景颜色
                            thumbColor='#FFF' //开关上原形按钮的颜色
                            value={this.state.isOn == true}//默认状态
                            onValueChange={(e) => this.switchValue(e)} //当状态值发生变化值回调
                        />
                    </View>
                </View>
                <View style={[styles.addressView,{borderBottomWidth:0}]}>
                    <Text style={[styles.label,{textAlign:"left"}]}>位置</Text>
                    <View style={{flexWrap: 'wrap',flexDirection:"row"}}>
                        {
                        //接单范围
                        }
                        <TouchableOpacity onPress={()=>{
                            this.setState({
                                limit:3
                            });
                        }}>
                            <Text style={[styles.addressInput,
                               this.state.limit == 3 ?({backgroundColor:"#ff7418",color:"#fff",borderColor:"#ff7418"}) :""
                            ]}>3公里以内</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>{
                            this.setState({
                                limit:5
                            });
                        }}>
                            <Text style={[styles.addressInput,
                               this.state.limit == 5 ?({backgroundColor:"#ff7418",color:"#fff",borderColor:"#ff7418"}) :""
                            ]}>5公里以内</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>{
                            this.setState({
                                limit:10
                            });
                        }}>
                            <Text style={[styles.addressInput,
                               this.state.limit == 10 ?({backgroundColor:"#ff7418",color:"#fff",borderColor:"#ff7418"}) :""
                            ]}>10公里以内</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>{
                            this.setState({
                                limit:0
                            });
                        }}>
                            <Text style={[styles.addressInput,
                               this.state.limit == 0 ?({backgroundColor:"#ff7418",color:"#fff",borderColor:"#ff7418"}) :""
                            ]}>不限范围</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={[styles.view,{borderBottomWidth:0.9,borderBottomColor:"#ccc",}]}>
                    <Text style={styles.label}>预约单</Text>
                    <View style={styles.inputBlock}>
                        <Switch
                            style={{ transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }] }}
                            trackColor='#1f82ff'  //开关打开时的背景颜色
                            thumbColor='#FFF' //开关上原形按钮的颜色
                            value={this.state.isYuyue == true}//默认状态
                            onValueChange={(e) => this.switchYuyueValue(e)} //当状态值发生变化值回调
                        />
                    </View>
                </View>
                <View style={[styles.addressView,{borderBottomWidth:0,}]}>
                    <Text style={[styles.label,{textAlign:"left",color:"#ccc",marginBottom:ScreenUtil.scaleSize(30)}]}>设置预约时间</Text>
                    <View style={styles.inputBlock}>
                        <DatePicker
                            style={{width: ScreenUtil.scaleSize(350),}}
                            date={this.state.startTime}
                            mode="datetime"
                            placeholder="开始时间"
                            format="YYYY-MM-DD HH:mm:ss"
                            confirmBtnText="Confirm"
                            cancelBtnText="Cancel"
                            iconSource={require("../../static/icons/09.png")}
                            customStyles={{
                              dateIcon: {
                                position: 'absolute',
                                left: 0,
                                top: 9,
                                marginLeft: 0,
                                width:ScreenUtil.scaleSize(40),
                                height:ScreenUtil.scaleSize(40)
                              },
                              dateInput: {
                                paddingLeft: ScreenUtil.scaleSize(5),
                                borderWidth:StyleSheet.hairlineWidth,
                                textAlign:"right"
                              }
                            }}
                            onDateChange={(date) => {this.setState({startTime: date})}}
                        />
                        <Text style={{marginHorizontal:ScreenUtil.scaleSize(15)}}>至</Text>
                        <DatePicker
                            style={{width: ScreenUtil.scaleSize(350)}}
                            date={this.state.endTime}
                            mode="datetime"
                            placeholder="结束时间"
                            format="YYYY-MM-DD HH:mm:ss"
                            iconSource={require("../../static/icons/09.png")}
                            confirmBtnText="Confirm"
                            cancelBtnText="Cancel"
                            customStyles={{
                              dateIcon: {
                                position: 'absolute',
                                left: 0,
                                top: 9,
                                marginLeft: 0,
                                width:ScreenUtil.scaleSize(40),
                                height:ScreenUtil.scaleSize(40)
                              },
                              dateInput: {
                                paddingLeft: ScreenUtil.scaleSize(5),
                                borderWidth:StyleSheet.hairlineWidth,
                                textAlign:"right"
                              }
                            }}
                            onDateChange={(date) => {this.setState({endTime: date})}}
                        />
                    </View>
                </View>
                <View style={[styles.addressView,{borderBottomWidth:0}]}>
                    <Text style={[styles.label,{textAlign:"left",borderBottomWidth:0.9,borderBottomColor:"#ccc",paddingVertical:ScreenUtil.scaleSize(30)}]}>可接单类型</Text>

                    <View style={styles.checkbox}>
                        <Text style={{}}>家政服务</Text>
                        <TouchableOpacity onPress={()=>{
                            this._getTypes(1);
                        }}>
                        {
                            this.state.types.indexOf(1) > -1
                            ? <Image source={require("../../static/icons/checked.png")} resizeMode="contain" style={styles.check_img} />
                            : <Image source={require("../../static/icons/check.png")} resizeMode="contain" style={styles.check_img} />
                        }
                        </TouchableOpacity>
                    </View>

                    <View style={styles.checkbox}>
                        <Text>打针服务</Text>
                        <TouchableOpacity onPress={()=>{
                            this._getTypes(2)
                        }}
                        >
                        {
                            this.state.types.indexOf(2) > -1
                            ? <Image source={require("../../static/icons/checked.png")} resizeMode="contain" style={styles.check_img} />
                            : <Image source={require("../../static/icons/check.png")} resizeMode="contain" style={styles.check_img} />
                        }
                        </TouchableOpacity>
                    </View>
                    <View style={styles.checkbox}>
                        <Text>输液服务</Text>
                        <TouchableOpacity onPress={()=>{
                            this._getTypes(3)
                        }}>
                        {
                            this.state.types.indexOf(3) > -1
                            ? <Image source={require("../../static/icons/checked.png")} resizeMode="contain" style={styles.check_img} />
                            : <Image source={require("../../static/icons/check.png")} resizeMode="contain" style={styles.check_img} />
                        }
                        </TouchableOpacity>
                    </View>
                    <View style={styles.checkbox}>
                        <Text>针灸按摩</Text>
                        <TouchableOpacity onPress={()=>{
                            this._getTypes(4)
                        }}>
                        {
                            this.state.types.indexOf(4) > -1
                            ? <Image source={require("../../static/icons/checked.png")} resizeMode="contain" style={styles.check_img} />
                            : <Image source={require("../../static/icons/check.png")} resizeMode="contain" style={styles.check_img} />
                        }
                        </TouchableOpacity>
                    </View>
                </View>
                <TouchableOpacity onPress={()=>{
                    this._submit();
                }}>
                    <View style={{justifyContent:"center",alignItems:"center",marginBottom:ScreenUtil.scaleSize(30)}}>
                        <Text style={styles.button}>保存设置</Text>
                    </View>
                </TouchableOpacity>
            </ScrollView>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        backgroundColor:'#FFF',
    },
    view:{
        flexDirection:"row",
        justifyContent:"space-between",
        marginHorizontal:ScreenUtil.scaleSize(40),
        alignItems:"center",
        height:ScreenUtil.scaleSize(120),
        lineHeight:ScreenUtil.scaleSize(120),
    },
    addressView:{
        borderBottomWidth:1,
        borderBottomColor:"#ccc",
        flexDirection:"column",
        justifyContent:"flex-start",
        padding:ScreenUtil.scaleSize(30)
    },
    addressInput:{
        paddingHorizontal:ScreenUtil.scaleSize(30),
        paddingVertical:ScreenUtil.scaleSize(10),
        borderRadius:ScreenUtil.scaleSize(30),
        borderWidth:1,
        borderColor:"#CCC",
        margin:ScreenUtil.scaleSize(20)
    },
    label:{
        fontSize:ScreenUtil.scaleSize(32),fontWeight:"bold",
        color:"#000"
    },
    inputBlock:{
        flexDirection:"row",
        justifyContent:"flex-start",
        alignItems:"center",
    },
    checkbox:{
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"space-between",
        height:ScreenUtil.scaleSize(80),
        lineHeight:ScreenUtil.scaleSize(80),
    },
    button:{
        width:"80%",
        height:ScreenUtil.scaleSize(100),
        backgroundColor:"#1f82ff",
        color:"#FFF",
        textAlign:"center",
        lineHeight:ScreenUtil.scaleSize(100),
        borderRadius:ScreenUtil.scaleSize(50)
    },
    check_img:{
        width:ScreenUtil.scaleSize(50),
        height:ScreenUtil.scaleSize(50)
    }

})
