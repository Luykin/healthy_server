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
    TextInput,
    Modal,
    Alert,
    } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {createStackNavigator} from 'react-navigation';
import StackViewStyleInterpolator from 'react-navigation-stack/lib/commonjs/views/StackView/StackViewStyleInterpolator';

import ImagePicker from 'react-native-image-crop-picker';
import RNPickerSelect from 'react-native-picker-select';
import { Chevron} from 'react-native-shapes';

import ScreenUtil,{deviceWidth,deviceHeight,SZ_API_URI} from "../../common/ScreenUtil";

/*
* 主页
*/

const items=[
   {
     label: '护工证',
     value: '1',
   },
   {
     label: '护士证',
     value: '2',
   }
];
const placeholder = {"label": '请选择资质类型...',"value": null,"color": '#9EA0A4'};

export class AddQualityView extends Component{
    constructor(props){
        super(props);
        this.state={
            sex:1,
            isVisible:false,
            zheng:false,
            id_img1:"",
            name:"",
            id_num:"",
            quality:"",
            quality_type:"",
            selected_val:""
        }
    }
    componentDidMount() {
        this._navListener = this.props.navigation.addListener('didFocus', () => {
           StatusBar.setBarStyle('dark-content');
           (Platform.OS === 'ios')?"":StatusBar.setBackgroundColor('#FFFFFF');
        });
    }
    componentWillUnmount() {
        this._navListener.remove();
    }
    _onPicker(){
        ImagePicker.openPicker({
            multiple: false,
            cropping:true,
            includeBase64:true
        }).then(images => {
            let img = "data:image/png;base64," + images.data;
            if(this.state.zheng == true){
                this.setState({
                    id_img1:images.data,
                    isVisible:false,
                    id_card_img_z:{uri : img}
                })
            }
            ImagePicker.clean();

        });
    }
    _onCamera(){
        ImagePicker.openCamera({
              cropping: true,
              width: 500,
              height: 500,
              includeExif: true,
              //mediaType,
            }).then(image => {
                let img = "data:image/png;base64," + images.data;
                if(this.state.zheng == true){
                    this.setState({
                        id_img1:images.data,
                        isVisible:false,
                        id_card_img_z:{uri : img}
                    })
                }
                ImagePicker.clean();
        }).catch(e => console.log(e));
    }
    _cancel(){
        this.setState({
            isVisible:false,
        });
    }
    //提交信息
    async _submit(){
        if(this.state.selected_val == ""){
            Alert.alert("请选择资质类型");
            return;
        }
        if(this.state.name == ""){
            Alert.alert("请输入用户姓名");
            return;
        }
        if(this.state.id_num == ""){
            Alert.alert("请输入身份证号");
            return;
        }
        if(this.state.id_img1 == ""){
            Alert.alert("请上传资质照片");
            return;
        }
        let token = await AsyncStorage.getItem("token");

        let data = new FormData();
        data.append("qualityType",this.state.selected_val);
        data.append("name",this.state.name);
        data.append("id_num",this.state.id_num);
        data.append("id_img1",this.state.id_img1);
        data.append("id_img2",this.state.id_img2);
        data.append("sex",this.state.sex);

        fetch(SZ_API_URI + "app/api/v1/worker/idcard/addedit",{
            method:"POST",
            headers:{
                "Content-Type" : "multipart/form-data",
                "token" : token
            },
            body:data
        }).then(response=>response.json())
        .then(responseJson=>{
            if(responseJson.code == 200){
                Alert.alert("信息上传成功，审核中。。。");
                return;
            }
            Alert.alert(responseJson.msg);
        })
    }
    render(){
        const  {navigate}  = this.props.navigation;
        return (
            <ScrollView style={[styles.container]} contentContainerStyle={{}}>

                <View style={[styles.view,{marginTop:ScreenUtil.scaleSize(30),borderBottomWidth:1,borderBottomColor:"#ccc",}]}>
                    <Text style={styles.label}>资质类型</Text>
                    <View style={styles.inputBlock}>

                        <RNPickerSelect
                          placeholder={placeholder}
                          items={items}
                          onValueChange={value => {
                            this.setState({
                              selected_val: value,
                            });
                          }}
                          style={{
                            inputAndroid: {
                              backgroundColor: 'transparent',
                              color:"#000"
                            },
                            iconContainer: {
                              top: 5,
                              right: 15,
                            },
                          }}
                          value={this.state.selected_val}
                          useNativeAndroidPickerStyle={false}
                        />
                    </View>
                </View>
                <View style={[styles.view,{marginTop:ScreenUtil.scaleSize(30),borderBottomWidth:1,borderBottomColor:"#ccc",}]}>
                    <Text style={styles.label}>资质名称</Text>
                    <View style={styles.inputBlock}>
                        <TextInput
                            style={styles.textInputType}
                            allowFontScaling={true}
                            clearButtonMode='while-editing'
                            enablesReturnKeyAutomatically={true}
                            keyboardType='default'
                            editable={true}
                            underlineColorAndroid="transparent"
                            multiline = {false}
                            onChangeText = {(text)=>{
                                this.setState({quality:text})
                            }}
                            placeholder="请输入资质名称"
                            />
                    </View>
                </View>
                <View style={[styles.view,{marginTop:ScreenUtil.scaleSize(30),borderBottomWidth:1,borderBottomColor:"#ccc",}]}>
                    <Text style={styles.label}>姓名</Text>
                    <View style={styles.inputBlock}>
                        <TextInput
                            style={styles.textInputType}
                            allowFontScaling={true}
                            clearButtonMode='while-editing'
                            enablesReturnKeyAutomatically={true}
                            keyboardType='default'
                            editable={true}
                            underlineColorAndroid="transparent"
                            multiline = {false}
                            onChangeText = {(text)=>{
                                this.setState({name:text})
                            }}
                            placeholder="请输入姓名"
                            />
                    </View>
                </View>
                <View style={[styles.view,{borderBottomWidth:1,borderBottomColor:"#ccc",}]}>
                    <Text style={styles.label}>身份证号</Text>
                    <View style={styles.inputBlock}>
                        <TextInput
                            style={styles.textInputType}
                            allowFontScaling={true}
                            clearButtonMode='while-editing'
                            enablesReturnKeyAutomatically={true}
                            keyboardType='default'
                            editable={true}
                            underlineColorAndroid="transparent"
                            multiline = {false}
                            onChangeText = {(text)=>{
                                this.setState({id_num:text})
                            }}
                            placeholder="请输入身份证号"
                            />
                    </View>
                </View>
                <View style={[styles.view]}>
                    <Text style={styles.label}>性别</Text>
                    <View style={styles.inputBlock}>
                        <TouchableOpacity onPress={()=>{
                            this.setState({
                                sex:1
                            })
                        }}>
                            <View style={{flexDirection:"row",paddingLeft:ScreenUtil.scaleSize(20)}}>
                                {
                                    this.state.sex == 1
                                    ? <Image source={require("../../static/icons/checked.png")} style={{width:ScreenUtil.scaleSize(40),height:ScreenUtil.scaleSize(40)}} />
                                    : <Image source={require("../../static/icons/check.png")} style={{width:ScreenUtil.scaleSize(40),height:ScreenUtil.scaleSize(40)}} />
                                }

                                <Text>男</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>{
                            this.setState({
                                sex:2
                            })
                        }}>
                            <View style={{flexDirection:"row",paddingLeft:ScreenUtil.scaleSize(30)}}>
                                {
                                    this.state.sex == 2
                                    ? <Image source={require("../../static/icons/checked.png")} style={{width:ScreenUtil.scaleSize(40),height:ScreenUtil.scaleSize(40)}} />
                                    : <Image source={require("../../static/icons/check.png")} style={{width:ScreenUtil.scaleSize(40),height:ScreenUtil.scaleSize(40)}} />
                                }
                                <Text>女</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{paddingHorizontal:ScreenUtil.scaleSize(30),marginTop:ScreenUtil.scaleSize(30)}}>
                    <Text style={{color:"#000",fontSize:ScreenUtil.scaleSize(36),fontWeight:"bold"}}>上传资质证书</Text>
                    <View style={{
                        flexDirection:"row",
                        backgroundColor:"rgba(255,239,213,0.3)",
                        width:"100%",
                        justifyContent:"center",
                        marginTop:ScreenUtil.scaleSize(30)}}>
                        <TouchableOpacity onPress={()=>{
                            this.setState({
                                isVisible:true,
                                zheng:true,
                            })
                        }}>
                            <ImageBackground
                                resizeMode="contain"
                                source={this.state.id_card_img_z}
                                style={{
                                    flex:1,
                                    flexDirection:"row",
                                    height:ScreenUtil.scaleSize(280),
                                    alignItems:"center",justifyContent:"center"}}>
                                <Image
                                    resizeMode={"contain"}
                                    source={require("../../static/icons/30.png")}
                                    style={{width:ScreenUtil.scaleSize(120),height:ScreenUtil.scaleSize(120)}} />
                            </ImageBackground>
                        </TouchableOpacity>
                    </View>
                </View>
                <TouchableOpacity onPress={()=>{
                    this._submit()
                }}>
                    <View style={[styles.view,{marginTop:ScreenUtil.scaleSize(30),justifyContent:"center"}]}>
                        <Text style={{
                            width:"90%",
                            textAlign:"center",
                            height:ScreenUtil.scaleSize(100),
                            lineHeight:ScreenUtil.scaleSize(100),
                            color:"#fff",
                            borderRadius:ScreenUtil.scaleSize(50),
                            backgroundColor:"#0071ff",
                            fontSize:ScreenUtil.scaleSize(32),
                            fontWeight:"bold"}}>提交</Text>
                    </View>
                </TouchableOpacity>

                <Modal
                    animationType="none"
                    transparent={true}
                    visible={this.state.isVisible}
                    onRequestClose={() => {
                        this.setState({
                            isVisible:false,
                            statusBarBck:"#FFF"
                        });
                    }}
                >
                    <View style={{
                        justifyContent:"center",
                        alignItems:"center",
                        backgroundColor:"rgba(0, 0, 0, 0.5)",
                        width:deviceWidth,
                        height:deviceHeight}}>
                        <View style={{
                            padding:ScreenUtil.scaleSize(50),
                            justifyContent:"space-between",
                            width:ScreenUtil.scaleSize(500),
                            height:ScreenUtil.scaleSize(300),backgroundColor:"#FFF"}}>
                            <TouchableOpacity onPress={()=>{
                                this._onPicker();
                            }}>
                                <Text style={styles.fnt}>从相册选择</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>{
                                this._onCamera();
                            }}>
                                <Text style={styles.fnt}>拍照</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={()=>{
                                this._cancel();
                            }}>
                                <Text style={styles.fnt}>取消</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                 </Modal>
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
        backgroundColor:"#FFF"},
    titleStyle:{
        flex:1,
        textAlign:'center',
        color:'#000',
        alignItems:"center",
        fontSize:ScreenUtil.scaleSize(32)}
}
export default AddQuality = createStackNavigator ({
    AddQualityH:{
        screen:AddQualityView,
        navigationOptions:({navigation})=>({
            headerTitle : navigation.getParam("name","上传资质信息"),
            headerStyle:headerStyle.style,
            headerTitleStyle:headerStyle.titleStyle,
            headerTintColor:'#FFF',
            headerLeft:
                <TouchableOpacity onPress={()=>{
                    navigation.navigate("Main");
                }}>
                    <View style={{marginLeft:ScreenUtil.scaleSize(10),padding:ScreenUtil.scaleSize(10)}}>
                        <Image resizeMode="contain" source={require('../../static/icons/16.png')} style={{width:ScreenUtil.scaleSize(30),height:ScreenUtil.scaleSize(30)}}/>
                    </View>
                </TouchableOpacity>
            ,
            headerRight:
                <View />
        })
    },

},{
    initialRouteName:'AddQualityH',
    transitionConfig:()=>({
        screenInterpolator: StackViewStyleInterpolator.forHorizontal,
    })
})
const styles = StyleSheet.create({
    container: {
        backgroundColor:'#fff',
    },
    view:{
        flexDirection:"row",
        justifyContent:"flex-start",
        paddingHorizontal:ScreenUtil.scaleSize(40),
        backgroundColor:"#FFF",
        alignItems:"center",
        height:ScreenUtil.scaleSize(120),
        lineHeight:ScreenUtil.scaleSize(120),
    },
    label:{
        fontSize:ScreenUtil.scaleSize(32),fontWeight:"bold"
    },
    inputBlock:{
        flexDirection:"row",
        justifyContent:"center",
        alignItems:"center",
        textAlign:"center"
    },
    inputImg:{
        width:ScreenUtil.scaleSize(40),
        height:ScreenUtil.scaleSize(40)
    }
})

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,

    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});
