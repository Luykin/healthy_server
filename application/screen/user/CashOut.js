import React, {Component} from 'react';
import {Platform,StyleSheet, Text, View,ScrollView,TouchableOpacity,StatusBar,TextInput,Image} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {createStackNavigator} from 'react-navigation';
import StackViewStyleInterpolator from 'react-navigation-stack/lib/commonjs/views/StackView/StackViewStyleInterpolator';


import ScreenUtil,{deviceWidth,deviceHeight,SZ_API_URI} from "../../common/ScreenUtil";

/*
* 主页
*/
export class CashOutView extends Component{
    constructor(props){
        super(props);
        this.state={
            uName:'',
            uCard:'',
            uBank:'',
            uMoney:''
        }
        this.onBtnTiXian = this.onBtnTiXian.bind(this);
    }
    componentDidMount() {
        this.getMoneyBag();
        this._navListener = this.props.navigation.addListener('didFocus', () => {
           StatusBar.setBarStyle('dark-content');
           (Platform.OS === 'ios')?"":StatusBar.setBackgroundColor('#FFFFFF');
        });

    }

    getMoneyBag = async (callback)=>{
        const self = this;
        let token  = await AsyncStorage.getItem("token");
        fetch(SZ_API_URI+'/app/api/v1/wallet/query',{
            headers:{
                "token" : token
            }
        }).then(res=>res.json()).then(res=>{
            if(res.code == 200){
                self.setState({
                    uMoney:res.data.balance || 0
                })
            }else{
                Alert.alert(res.msg || '查询钱包出错')
            }
        }).catch(e=>{
            callback()
            Alert.alert('查询钱包出错')
        })
    }

    componentWillUnmount() {
        this._navListener.remove();
    }
    render(){
        const  {navigate}  = this.props.navigation;
        return (
            <ScrollView style={[styles.container]} contentContainerStyle={{}}>
                {/*<View style={styles.input}>*/}
                {/*    <Text style={styles.label}>姓名</Text>*/}
                {/*    <TextInput placeholder="请输入姓名" style={{width:"80%",}} onChangeText={(uName)=>this.setState({uName})} />*/}
                {/*</View>*/}
                {/*<View style={[styles.input,{marginTop:0}]}>*/}
                {/*    <Text style={styles.label}>卡号</Text>*/}
                {/*    <TextInput placeholder="请输入卡号" style={{width:"80%",}} onChangeText={(uCard)=>this.setState({uCard})} />*/}
                {/*</View>*/}
                {/*<View style={[styles.input,{marginTop:0,borderBottomWidth:0}]}>*/}
                {/*    <Text style={styles.label}>银行</Text>*/}
                {/*    <TextInput placeholder="请输入银行" style={{width:"80%",}} onChangeText={(uBank)=>this.setState({uBank})} />*/}
                {/*</View>*/}
                {/*<View style={styles.input}>*/}
                {/*    <Text style={styles.label}>￥</Text>*/}
                {/*    <TextInput placeholder="请输入金额" style={{width:"70%",}} onChangeText={(uMoney)=>this.setState({uMoney})} />*/}
                {/*    <TouchableOpacity activeOpacity={.8} onPress={this.onBtnTiXian}>*/}
                {/*        <Text style={{color:"#FF9900",fontSize:ScreenUtil.scaleSize(30)}}>全部提现</Text>*/}
                {/*    </TouchableOpacity>*/}
                {/*</View>*/}
                {/*<View style={[styles.input,{marginTop:0,borderBottomWidth:0}]}>*/}
                {/*    <Text style={[styles.label,{color:"#ccc",}]}>可提现金额510.00</Text>*/}
                {/*</View>*/}
            </ScrollView>
        )
    }

    onBtnTiXian(){}
}
//头样式
const headerStyle = {
    style:{
        textAlign:'center',
        height:ScreenUtil.scaleSize(120),
        borderBottomWidth:0,
        shadowOpacity:0,
        elevation:0,
        backgroundColor:"#FFF"
    },
    titleStyle: {
        flex: 1,
        textAlign: 'center',
        color: '#000',
        alignItems: "center",
        fontSize: 15
    }
};
export default CashOut = createStackNavigator ({
    CashOutHome:{
        screen:CashOutView,
        navigationOptions:({navigation})=>({
            headerTitle : navigation.getParam("name","提现"),
            headerStyle:headerStyle.style,
            headerTitleStyle:headerStyle.titleStyle,
            headerTintColor:'#FFF',
            headerLeft:
                <TouchableOpacity onPress={()=>{
                    navigation.pop();
                }}>
                    <View style={{marginLeft:ScreenUtil.scaleSize(10),padding:ScreenUtil.scaleSize(10)}}>
                        <Image resizeMode="contain" source={require('../../static/icons/16.png')} style={{width:ScreenUtil.scaleSize(30),height:ScreenUtil.scaleSize(30)}}/>
                    </View>
                </TouchableOpacity>
            ,
            headerRight:
                <TouchableOpacity onPress={()=>{
                    navigation.navigate("CashOutLog");
                }}>
                    <View style={{marginRight:ScreenUtil.scaleSize(24)}}>
                        <Text>提现记录</Text>
                    </View>
                </TouchableOpacity>
        })
    },

},{
    initialRouteName:'CashOutHome',
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
