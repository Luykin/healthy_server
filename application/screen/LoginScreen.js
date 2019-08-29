import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    ScrollView,
    Alert,
    Image,
    ImageBackground,
    TouchableOpacity,
    TextInput,
    KeyboardAvoidingView,
    Keyboard,
    StatusBar} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {createStackNavigator} from 'react-navigation';
import StackViewStyleInterpolator from 'react-navigation-stack/lib/commonjs/views/StackView/StackViewStyleInterpolator';
import LinearGradient from 'react-native-linear-gradient';
import ScreenUtil,{deviceWidth,deviceHeight,SZ_API_URI} from "../common/ScreenUtil";
import Common from "../common/Common";

const icon_PwdShow = require('../static/images/icon_pwd_show.png')
const icon_PwdHide = require('../static/images/icon_pwd_hide.png')

/*
* 登陆
*/
export class LoginView extends Component{
    constructor(props){
        super(props);
        this.state={
            username:"",
            pwd:"",
            showPwd:false
        }
    }
    componentDidMount () {
        //this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
        //this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
    }
    /*
    componentWillUnmount () {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }*/
    _keyboardDidShow () {
        //console.log("aaa")
    }

  _keyboardDidHide () {
    //alert('Keyboard Hidden');
  }
    _loginOnPress(){

        if(!this.state.username){
            Alert.alert("请输入手机号码");
            return;
        }
        if(!this.state.pwd){
            Alert.alert("请输入密码");
            return;
        }
        let formData = new FormData();
        formData.append("phone",this.state.username);
        formData.append("password",this.state.pwd);

        let url = SZ_API_URI + "appauth";

        fetch(url,{
            method:'POST',
            headers: {
                "Content-Type" : "multipart/form-data"
            },
            body:formData
        })
        .then(response => response.json())
        .then(responseJson => {
            if(responseJson.code !== 200){
                Alert.alert(responseJson.msg);
                return;
            }
            let token = "";
            token = responseJson.data.token;

            let userInfo = {};
            userInfo = responseJson.data.user;
            AsyncStorage.setItem("token",token);
            AsyncStorage.setItem("userInfo",JSON.stringify(userInfo));
            AsyncStorage.setItem("userData",JSON.stringify(responseJson.data));
            console.log(responseJson.data, '用户信息');
            this.props.navigation.navigate("Main");
        }).catch(error => {
            console.error(error);
        });
    }
    render(){
        const  {navigate}  = this.props.navigation;
        return (
        <KeyboardAvoidingView behavior="padding" enabled>
            <ScrollView contentContainerStyle={[styles.container,{}]}>
                <View style={{
                    flexDirection:'row',
                    justifyContent:'center',
                    alignItems:'center',
                    }}>
                    <Image
                        source={require("../static/icons/logo.png")}
                        style={{width:ScreenUtil.scaleSize(250),height:ScreenUtil.scaleSize(250)}}
                        resizeMode="contain"/>
                </View>
                <View style={{
                    justifyContent:'flex-start',
                    marginTop:ScreenUtil.scaleSize(50),
                    alignItems:'center',
                    paddingHorizontal:ScreenUtil.scaleSize(30)}}>
                    <View style={[styles.horizontal,{borderBottomWidth:.8,borderBottomColor:'#F6F6F6',}]}>
                        <Image source={require("../static/icons/34.png")} style={styles.icon} resizeMode="contain"/>
                        <TextInput
                            style={[styles.textInputType,{}]}
                            allowFontScaling={true}
                            clearButtonMode='while-editing'
                            enablesReturnKeyAutomatically={true}
                            keyboardType='numeric'
                            editable={true}
                            underlineColorAndroid="transparent"
                            multiline = {false}
                            onChangeText = {(text)=>{
                                this.setState({username:text})
                            }}
                            placeholder="请输入手机号"
                            />
                    </View>
                    <View style={[styles.horizontal,{marginTop:ScreenUtil.scaleSize(50),borderBottomWidth:.8,borderBottomColor:'#F6F6F6'}]}>
                        <Image source={require("../static/icons/35.png")}
                            style={styles.icon} resizeMode="contain"/>
                        <TextInput
                            style={styles.textInputType}
                            allowFontScaling={true}
                            clearButtonMode='while-editing'
                            enablesReturnKeyAutomatically={true}
                            editable={true}
                            underlineColorAndroid="transparent"
                            multiline = {false}
                            secureTextEntry={this.state.showPwd ? false:true}
                            onChangeText = {(text)=>{
                                this.setState({pwd:text})
                            }}
                            placeholder="请输入密码"
                        />
                        <TouchableOpacity activeOpacity={.9} onPress={()=>{
                            let showPwd = this.state.showPwd;
                            this.setState({
                                showPwd:!showPwd
                            })
                        }}>
                        {
                            this.state.showPwd ?  <Image source={icon_PwdHide} style={{width:20,height:20}}/> :<Image source={icon_PwdShow} style={{width:20,height:20}}/>
                        }
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={{width:'90%',marginTop:ScreenUtil.scaleSize(150)}} underlayColor="#ffffff" onPress={()=>{
                        this._loginOnPress()
                    }}>
                        <LinearGradient colors={['#1f82ff', '#0071ff',]} start={{x: 0, y: 0}} end={{x: 1, y: 0}}
                            style={{width:'100%',borderRadius:ScreenUtil.scaleSize(50)}}>
                            <Text style={styles.login_button}>登录</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
                <View style={{flexDirection:'row',justifyContent:'center',paddingHorizontal:'20%',marginTop:ScreenUtil.scaleSize(30)}}>

                <TouchableOpacity onPress={
                        ()=>{
                            navigate("Regist")
                        }
                    }>
                        <Text style={{color:"#0071ff",fontSize:ScreenUtil.scaleSize(32)}}>账号注册 > </Text>
                    </TouchableOpacity>
                    <Text style={{color:"#0071ff",fontSize:ScreenUtil.scaleSize(32)}}> | </Text>
                    <TouchableOpacity style={{height:20}} onPress={
                        ()=>{
                            navigate("ForgotPwd")
                        }
                    }>
                        <Text style={{color:"#0071ff",fontSize:ScreenUtil.scaleSize(32)}}>忘记密码 > </Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
            </KeyboardAvoidingView>
        )
    }
}

const TIME = 60;
/*
*   忘记密码
*/
class ForgotPwdView extends Component{
    constructor(props){
        super(props);
        this.state={
            phone:"",
            vercode:"",
            password:"",
            confirmPwd:"",
            timeTitle:"获取验证码",
            index:TIME
        }
    }
    componentDidMount() {
        this._navListener = this.props.navigation.addListener('didFocus', () => {
           StatusBar.setBarStyle('light-content');
           (Platform.OS === 'ios')?"":StatusBar.setBackgroundColor('#353535');
        });
    }
    componentWillUnmount() {
        this._navListener.remove();
    }
    //计时器
    _countTime(){
        this._timer=setInterval(()=>{
            this.setState({
                timeTitle:this.state.index-- + "s"
            });
            if(this.state.index<=0){
                this._timer && clearInterval(this._timer);
                this.setState({
                    timeTitle:"重新发送",
                    index:TIME
                });
            }
        },1000);
    }
    //发送验证码
    _sendMsg(){
        let reg = new RegExp("1(3|4|5|6|7|8|9)[0-9]{9}$");
        if (this.state.phone == ""){
            Alert.alert("请输入手机号");
            return;
        }
        if(!reg.test(this.state.phone)){
            Alert.alert("请输入正确的手机号码");
            return;
        }
        if(this.state.index == TIME){
            Common.sendMsg(this.state.phone);
            this._countTime();
        }
    }
    //忘记密码，验证码通过，继续操作
    _forget2(phone,expire,pwd1,pwd2){
        const self = this;
        let data = new FormData();
        data.append("phone",phone);
        data.append("expire",expire);
        data.append("pwd1",pwd1);
        data.append("pwd2",pwd2);

        fetch(SZ_API_URI + "member/forget2",{
            method:"POST",
            headers: {
                "Content-Type" : "multipart/form-data"
            },
            body:data
        })
        .then(response => response.json())
        .then(responseJson => {
            if(responseJson.code !== 200){
                Alert.alert(responseJson.msg);
                return;
            }
            // Alert.alert(responseJson.msg);
            Alert.alert('修改成功');
            self.props.navigation.goBack(null);
        }).catch(error => {
            console.error(error);
        });
    }
    //提交表单
    _submit(){
        if(this.state.phone == ""){
            Alert.alert("请输入手机号码");
            return;
        }
        if(this.state.vercode == ""){
            Alert.alert("请输入验证码");
            return;
        }
        if(this.state.password == ""){
            Alert.alert("请输入密码");
            return;
        }
        if(this.state.confirmPwd == ""){
            Alert.alert("请重新输入密码");
            return;
        }
        if(this.state.password !== this.state.confirmPwd){
            Alert.alert("两次密码不一致");
            return;
        }

        let data = new FormData();
        data.append("phone",this.state.phone);
        data.append("code",this.state.vercode);

        fetch(SZ_API_URI + "member/forget1",{
            method:'POST',
            headers: {
                "Content-Type" : "multipart/form-data"
            },
            body:data
        })
        .then(response => response.json())
        .then(responseJson => {
            if(responseJson.code !== 200){
                Alert.alert(responseJson.msg);
                return;
            }
            this._forget2(this.state.phone,responseJson.data.expire,this.state.password,this.state.confirmPwd);
        }).catch(error => {
            console.error(error);
        });
    }
    render(){
        return (
            <View style={styles.container}>
                <View style={{justifyContent:'flex-end',alignItems:'center'}}>
                    <View style={{flexDirection:"row",width:"90%",alignItems:"center"}}>
                        <Image source={require("../static/icons/34.png")}
                               style={styles.icon} resizeMode="contain"/>
                        <TextInput
                            style={[styles.textInputType,{}]}
                            allowFontScaling={true}
                            clearButtonMode='while-editing'
                            enablesReturnKeyAutomatically={true}
                            keyboardType='numeric'
                            editable={true}
                            underlineColorAndroid="transparent"
                            multiline = {false}
                            placeholder="   请输入手机号"
                            onChangeText = {(text)=>{
                                this.setState({
                                    phone:text
                                })
                            }}
                            />
                    </View>

                    <View style={{flexDirection:'row',justifyContent:"space-between",alignItems:"center",width:"90%"}}>
                        <Image source={require("../static/icons/37.png")} style={styles.icon} resizeMode="contain"/>
                        <TextInput
                            style={[styles.textInputType,{width:"75%"}]}
                            allowFontScaling={true}
                            clearButtonMode='while-editing'
                            enablesReturnKeyAutomatically={true}
                            editable={true}
                            underlineColorAndroid="transparent"
                            multiline = {false}
                            placeholder="   请输入验证码"
                            onChangeText={(text)=>{
                                this.setState({
                                    vercode:text
                                })
                            }}
                        />
                        <TouchableOpacity onPress={()=>{
                            this._sendMsg();
                        }}>
                            <Text style={{
                                width:ScreenUtil.scaleSize(150),
                                height:ScreenUtil.scaleSize(50),
                                color:"#0071ff",
                                textAlign:"center",
                                alignItems:"center",
                                }}>{this.state.timeTitle}</Text>
                        </TouchableOpacity>

                    </View>
                    <View style={{flexDirection:'row',justifyContent:"space-between",alignItems:"center",width:"90%"}}>
                        <Image source={require("../static/icons/35.png")} style={styles.icon} resizeMode="contain"/>
                        <TextInput
                            style={styles.textInputType}
                            allowFontScaling={true}
                            clearButtonMode='while-editing'
                            enablesReturnKeyAutomatically={true}
                            editable={true}
                            underlineColorAndroid="transparent"
                            multiline = {false}
                            secureTextEntry={true}
                            placeholder="请输入新密码"
                            onChangeText={(text)=>{
                                this.setState({
                                    password:text
                                })
                            }}
                            />
                    </View>
                    <View style={{flexDirection:'row',justifyContent:"space-between",alignItems:"center",width:"90%"}}>
                        <Image source={require("../static/icons/35.png")} style={styles.icon}  resizeMode="contain"/>
                        <TextInput
                            style={styles.textInputType}
                            allowFontScaling={true}
                            clearButtonMode='while-editing'
                            enablesReturnKeyAutomatically={true}
                            editable={true}
                            underlineColorAndroid="transparent"
                            multiline = {false}
                            secureTextEntry={true}
                            placeholder="确认新密码"
                            onChangeText={(text)=>{
                                this.setState({
                                    confirmPwd:text
                                })
                            }}
                            />
                    </View>
                    <View style={{flexDirection:"row",justifyContent:"center",width:"100%"}}>
                    <TouchableOpacity onPress={()=>{
                        this._submit();
                    }}>
                        <LinearGradient
                            colors={['#1f82ff', '#0071ff',]}
                            start={{x: 0, y: 0}} end={{x: 1, y: 0}}
                            style={{marginTop:ScreenUtil.scaleSize(100),width:ScreenUtil.scaleSize(500),borderRadius:25}}>
                            <Text style={[styles.button,{}]}>修改密码</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }
}
/*
* 注册
*/
class RegistView extends Component{
    constructor(props){
        super(props);
        this.state={
            phone:"",
            code:"",
            repassword:"",
            password:"",
            timeTitle:"发送验证码",
            index:TIME
        }
    }
    componentDidMount() {
        this._navListener = this.props.navigation.addListener('didFocus', () => {
           StatusBar.setBarStyle('dark-content');
           (Platform.OS === 'ios')?"":StatusBar.setBackgroundColor('#fff');
        });
    }
    componentWillUnmount() {
        this._navListener.remove();
    }
    //计时器
    _countTime(){
        this._timer=setInterval(()=>{
            this.setState({
                timeTitle:this.state.index-- + "s"
            });
            if(this.state.index<=0){
                this._timer && clearInterval(this._timer);
                this.setState({
                    timeTitle:"重新发送",
                    index:TIME
                });
            }
        },1000);
    }
    _sendMsg(){
        let reg = new RegExp("1(3|4|5|6|7|8|9)[0-9]{9}$");
        if (this.state.phone == ""){
            Alert.alert("请输入手机号");
            return;
        }
        if(!reg.test(this.state.phone)){
            Alert.alert("请输入正确的手机号码");
            return;
        }
        if(this.state.index == TIME){
            Common.sendMsg(this.state.phone);
            this._countTime();
        }
    }
    _submit(){

        if(this.state.phone == ""){
            Alert.alert("请输入手机号码");
            return;
        }
        if(this.state.code == ""){
            Alert.alert("请输入验证码");
            return;
        }
        if(this.state.password == ""){
            Alert.alert("请输入密码");
            return;
        }
        if(this.state.repassword == ""){
            Alert.alert("请输入确认密码");
            return;
        }
        if(this.state.password !== this.state.repassword){
            Alert.alert("两次输入密码不一致");
            return;
        }
        let data = new FormData();
        data.append("phone",this.state.phone);
        data.append("code",this.state.code);
        data.append("password",this.state.password);
        data.append("repassword",this.state.repassword);
        data.append("authentication",2);

        fetch(SZ_API_URI + "member/register",{
            method:'POST',
            headers: {
                "Content-Type" : "multipart/form-data"
            },
            body:data
        })
        .then(response => response.json())
        .then(responseJson => {
            Alert.alert(responseJson.msg);
            const  {navigate}  = this.props.navigation;
            navigate("Login");
        }).catch(error => {
            console.error(error);
        });
    }
    render(){
        return (
            <ScrollView contentContainerStyle={styles.container}>
                <View style={{
                    flexDirection:'row',
                    justifyContent:'center',
                    alignItems:'flex-end',
                    }}>
                    <Text style={{fontSize:ScreenUtil.scaleSize(42),fontWeight:'bold',color:"#000"}}>用户注册</Text>
                </View>
                <KeyboardAvoidingView behavior="padding" enabled>
                <View style={{justifyContent:'flex-end',alignItems:'center'}}>
                    <View style={{flexDirection:"row",width:"90%",alignItems:"center"}}>
                        <Image
                            source={require("../static/icons/34.png")}
                            style={[styles.icon,{}]}
                            resizeMode="contain"/>
                        <TextInput
                            style={styles.textInputType}
                            allowFontScaling={true}
                            clearButtonMode='while-editing'
                            enablesReturnKeyAutomatically={true}
                            keyboardType='numeric'
                            editable={true}
                            underlineColorAndroid="transparent"
                            multiline = {false}
                            placeholder="   请输入手机号"
                            onChangeText={(text)=>{
                                this.setState({
                                    phone:text
                                })
                            }}
                            />
                    </View>
                    <View style={{flexDirection:'row',justifyContent:"space-between",alignItems:"center",width:"90%"}}>
                        <Image source={require("../static/icons/37.png")} style={styles.icon}  resizeMode="contain"/>
                        <TextInput
                            style={[styles.textInputType,{width:"75%"}]}
                            allowFontScaling={true}
                            clearButtonMode='while-editing'
                            enablesReturnKeyAutomatically={true}
                            editable={true}
                            underlineColorAndroid="transparent"
                            multiline = {false}
                            placeholder="   请输入验证码"
                            onChangeText={(text)=>{
                                this.setState({
                                    code:text
                                })
                            }}
                        />
                        <TouchableOpacity onPress={()=>{
                            this._sendMsg();
                        }}>
                            <Text style={{
                                width:ScreenUtil.scaleSize(150),
                                height:ScreenUtil.scaleSize(50),
                                color:"#0071ff",
                                textAlign:"center",
                                alignItems:"center",
                                }}>{this.state.timeTitle}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{flexDirection:'row',justifyContent:"space-between",alignItems:"center",width:"90%"}}>
                        <Image source={require("../static/icons/35.png")} style={styles.icon}  resizeMode="contain"/>
                        <TextInput
                            style={styles.textInputType}
                            allowFontScaling={true}
                            clearButtonMode='while-editing'
                            enablesReturnKeyAutomatically={true}
                            editable={true}
                            underlineColorAndroid="transparent"
                            multiline = {false}
                            secureTextEntry={true}
                            placeholder="请输入密码"
                            onChangeText={(text)=>{
                                this.setState({
                                    password:text
                                })
                            }}
                            />
                    </View>
                    <View style={{flexDirection:'row',justifyContent:"space-between",alignItems:"center",width:"90%"}}>
                        <Image source={require("../static/icons/35.png")} style={styles.icon}  resizeMode="contain"/>
                        <TextInput
                            style={styles.textInputType}
                            allowFontScaling={true}
                            clearButtonMode='while-editing'
                            enablesReturnKeyAutomatically={true}
                            editable={true}
                            underlineColorAndroid="transparent"
                            multiline = {false}
                            secureTextEntry={true}
                            placeholder="请输入密码"
                            onChangeText={(text)=>{
                                this.setState({
                                    repassword:text
                                })
                            }}
                            />
                    </View>
                </View>
                </KeyboardAvoidingView>
                <View style={{flexDirection:"row",justifyContent:"center",marginTop:ScreenUtil.scaleSize(80),width:"100%"}}>
                    <TouchableOpacity onPress={()=>{
                        this._submit();
                    }}>
                        <LinearGradient colors={['#1f82ff', '#0071ff',]} start={{x: 0, y: 0}} end={{x: 1, y: 0}}
                            style={{marginTop:20,width:ScreenUtil.scaleSize(600),borderRadius:25}}>
                            <Text style={[styles.button,{}]}>注册</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

                <View style={{flexDirection:'row',justifyContent:'center',alignItems:'flex-start',marginTop:15}}>
                    <TouchableOpacity style={{}} onPress={
                        ()=>{

                        }
                    }>
                        <Text>点击注册即表示您已同意协议《用户协议》</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        )
    }
}
export default LoginScreen = createStackNavigator ({
    Login:{
        screen:LoginView,
        navigationOptions:({ navigation }) => ({
            header:null
        })
    },
    ForgotPwd:{
        screen:ForgotPwdView,
        navigationOptions:({ navigation }) => ({
            title : '忘记密码',
            headerTitle : '忘记密码',
            headerStyle:{
                backgroundColor:'#353535',
                textAlign:'center'
            },
            headerTitleStyle:{
                flex:1,
                textAlign:'center',
                color:'#fff',
                alignSelf:'center',
            },
            headerBackTitleStyle:{
                color:'#fff'
            },
            headerTintColor:'#fff',
            headerLeft:
                <TouchableOpacity onPress={()=>{
                    navigation.pop();
                }}>
                    <View style={{marginLeft:ScreenUtil.scaleSize(10),}}>
                        <Image resizeMode="contain"
                        source={require('../static/icons/left_write.png')}
                         style={{width:ScreenUtil.scaleSize(40),height:ScreenUtil.scaleSize(40)}}/>
                    </View>
                </TouchableOpacity>
            ,
            headerRight:<View />
        })
    },
    Regist:{
        screen:RegistView,
        navigationOptions:({ navigation }) => ({
            title : '注册',
            headerTitle : '注册',
            headerStyle:{
                backgroundColor:'#fff',
                textAlign:'center',
                borderBottomWidth:0,
                shadowOpacity:0,
                elevation:0,
            },
            headerTitleStyle:{
                flex:1,
                textAlign:'center',
                color:'#000',
                alignSelf:'center',
            },
            headerBackTitleStyle:{
                color:'#fff'
            },
            headerTintColor:'#fff',
            headerLeft:
                <TouchableOpacity onPress={()=>{
                    navigation.pop();
                }}>
                    <View style={{marginLeft:ScreenUtil.scaleSize(10),}}>
                        <Image
                            resizeMode="contain" source={require('../static/icons/16.png')}
                            style={{width:ScreenUtil.scaleSize(30),height:ScreenUtil.scaleSize(30)}}/>
                    </View>
                </TouchableOpacity>
            ,
            headerRight:<View />
        })
    },

},{
    initialRouteName:'Login',
    transitionConfig:()=>({
        screenInterpolator: StackViewStyleInterpolator.forHorizontal,
    })
})
const styles = StyleSheet.create({
    container: {
        //flex: 1,
        backgroundColor:'white',
        justifyContent: 'center',//
        marginTop:ScreenUtil.scaleSize(100)
    },
    textInputType:{
        textAlignVertical:"center",
        backgroundColor: '#FFFFFF',
        borderColor:'#F6F6F6',
        //borderWidth:1,
        // borderBottomWidth: 1,
        // width:'90%',
        flex:1,
        height:ScreenUtil.scaleSize(100),
        lineHeight:ScreenUtil.scaleSize(100),
        //marginTop:15,
        padding:0,
        paddingLeft:10
    },
    button:{
        height:ScreenUtil.scaleSize(120),color:"#fff",
        textAlign:'center',
        lineHeight:ScreenUtil.scaleSize(120),fontSize:ScreenUtil.scaleSize(38),fontWeight:'bold'
    },
    icon:{
        width:ScreenUtil.scaleSize(40),height:ScreenUtil.scaleSize(40)
    },
    horizontal:{
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center",
        height:ScreenUtil.scaleSize(100),
        lineHeight:ScreenUtil.scaleSize(100)
    },
    login_button:{
        height:ScreenUtil.scaleSize(100),
        lineHeight:ScreenUtil.scaleSize(100),
        color:"#fff",textAlign:'center',fontSize:ScreenUtil.scaleSize(42),fontWeight:'bold'
    }
})
