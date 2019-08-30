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
    Alert,
    NativeModules,
    ImageBackground} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';


import ScreenUtil,
        {deviceWidth,
        deviceHeight,
        SZ_API_URI,
        APK_URL,
        CHECK_APK_UPDATE_URL} from "../../common/ScreenUtil";

const APP_VERSION = "0.9";//app当前版本
const IOS_APP_ID = "";//ios   appid
const APP_NAME = "GuanJia.apk";
/*
* 主页
*/
export default class Setting extends Component{
    constructor(props){
        super(props);
        this.state={
            stateText:"",
            user:{},
            worker:{},

        }
    }
    componentDidMount() {
        // this._navListener = this.props.navigation.addListener('didFocus', () => {
        //    StatusBar.setBarStyle('dark-content');
        //    (Platform.OS === 'ios')?"":StatusBar.setBackgroundColor('#FFFFFF');
        // });

        this.setState({
            stateText:"尚未认证"
        })
        this._userData();
        this.getIdCard();
    }
    componentWillUnmount() {
        // this._navListener.remove();

    }
    async _userData(){

        let user = JSON.parse(await AsyncStorage.getItem("userData"));
        this.setState({
            user:user.user,
            worker:user.worker
        })
    }
    getIdCard = async ()=>{
        const self = this;
        let token  = await AsyncStorage.getItem("token");
            fetch(SZ_API_URI+'/app/api/v1/worker/idcard',{
                headers:{
                    "token" : token
                }
            }).then(res=>res.json()).then(res=>{
                if(res.code == 200){
                    self.setState({
                        idCard:res.data.IdNum
                    })
                }
            }).catch(e=>{

            })
    }
    _updateApp(){
        let os = Platform.OS;

        fetch(CHECK_APK_UPDATE_URL,{
            method:"GET"
        }).then(res=>res.json())
        .then(resJson=>{
            console.log(resJson);
            if(resJson.data.response.version == APP_VERSION){
                Alert.alert("最新版本,无需更新");
                return;
            }
            Alert.alert(
            '版本检查',
            '发现新版本，是否更新？',
            [
                {text: '暂时不更新', onPress: () => {}, style: 'cancel'},
                {text: '马上更新', onPress: () => {
                    if(os == "android"){
                        NativeModules.upgrade.upgrade(APK_URL + "/" +APP_NAME);
                        return;
                    }
                    if(os == "ios"){
                        NativeModules.upgrade.upgrade(IOS_APP_ID,(msg) =>{
                            if('YES' == msg) {
                               NativeModules.upgrade.openAPPStore(IOS_APP_ID);
                            } else {
                                Alert.alert('当前为最新版本');
                            }
                        })
                    }
                    }
                }
            ],{ cancelable: false })
        }).catch(err=>{
            console.error(err);
        })
    }
    //退出登陆
    _logout(){
        AsyncStorage.clear();
        this.props.navigation.navigate("Auth");
    }
    render(){
        const  {navigate}  = this.props.navigation;
        return (
            <ScrollView style={[styles.container]} contentContainerStyle={{}}>
                <View style={[styles.view,{marginTop:ScreenUtil.scaleSize(30),borderBottomWidth:1,borderBottomColor:"#eee",}]}>
                    <Text style={styles.label}>姓名</Text>
                    <View style={styles.inputBlock}>
                        <Text>{this.state.worker.name}</Text>
                        <Image resizeMode="contain" source={require('../../static/icons/right.png')} style={styles.inputImg}/>
                    </View>
                </View>
                <View style={[styles.view,{/*borderBottomWidth:1,borderBottomColor:"#ccc",*/}]}>
                    <Text style={styles.label}>身份证号</Text>
                    <View style={styles.inputBlock}>
                        <Text>{this.state.idCard || '234234'}</Text>
                        <Image resizeMode="contain" source={require('../../static/icons/right.png')} style={styles.inputImg}/>
                    </View>
                </View>
                {/*
                <View style={[styles.view]}>
                    <Text style={styles.label}>初次接单日期</Text>
                    <View style={styles.inputBlock}>
                        <Text>2018-09-10</Text>
                        <Image resizeMode="contain" source={require('../../static/icons/right.png')} style={styles.inputImg}/>
                    </View>
                </View>
                */}

                <View style={[styles.view,{marginTop:ScreenUtil.scaleSize(30),/*borderBottomWidth:1,borderBottomColor:"#ccc",*/}]}>
                    <Text style={styles.label}>手机</Text>
                    <View style={styles.inputBlock}>
                        <Text>{this.state.user.phone}</Text>
                        <Image resizeMode="contain" source={require('../../static/icons/right.png')} style={styles.inputImg}/>
                    </View>
                </View>
                {/*
                <View style={[styles.view]}>
                    <Text style={styles.label}>位置</Text>
                    <View style={styles.inputBlock}>
                        <Text>烟台市</Text>
                        <Image resizeMode="contain" source={require('../../static/icons/right.png')} style={styles.inputImg}/>
                    </View>
                </View>
                */}
                <TouchableOpacity onPress={()=>{
                    this._updateApp();
                }}>
                <View style={[styles.view,{marginTop:ScreenUtil.scaleSize(30)}]}>
                    <Text style={styles.label}>检查版本</Text>
                    <View style={styles.inputBlock}>
                        <Text>{APP_VERSION}</Text>
                    </View>
                </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{
                    this._logout()
                }}>
                    <View style={[styles.view,{marginTop:ScreenUtil.scaleSize(30),justifyContent:"center"}]}>
                        <Text style={{fontSize:ScreenUtil.scaleSize(32),fontWeight:"bold"}}>退出登录</Text>
                    </View>
                </TouchableOpacity>
            </ScrollView>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        backgroundColor:'#f5f6f5',
    },
    view:{
        flexDirection:"row",
        justifyContent:"space-between",
        paddingHorizontal:ScreenUtil.scaleSize(40),
        backgroundColor:"#FFF",
        alignItems:"center",
        height:ScreenUtil.scaleSize(120),
        lineHeight:ScreenUtil.scaleSize(120),
    },
    label:{
        fontSize:ScreenUtil.scaleSize(26),fontWeight:"bold"
    },
    inputBlock:{
        flexDirection:"row",
        justifyContent:"center",
        alignItems:"center",
        textAlign:"center"
    },
    inputImg:{
        width:ScreenUtil.scaleSize(30),
        height:ScreenUtil.scaleSize(30)
    }
})
