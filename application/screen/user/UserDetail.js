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

import ScreenUtil, {deviceWidth, deviceHeight, SZ_API_URI} from "../../common/ScreenUtil";

const Data = [{"id": 1}]
/*
* 主页
*/
export default class UserDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sex: 1,
            isVisible: false,
            zheng: false,
            id_img1: "",
            fan: false,
            id_img2: "",
            name: "",
            id_num: "",
            id_card_img_z: require("../../static/icons/card1.png"),
            id_card_img_f: require("../../static/icons/card2.png")
        }
    }

    componentDidMount() {
        // this._navListener = this.props.navigation.addListener('didFocus', () => {
        //    StatusBar.setBarStyle('dark-content');
        //    (Platform.OS === 'ios')?"":StatusBar.setBackgroundColor('#FFFFFF');
        // });
    }

    componentWillUnmount() {
        // this._navListener.remove();
    }

    _onPicker() {
        ImagePicker.openPicker({
            multiple: false,
            cropping: true,
            includeBase64: true
        }).then(images => {
            let img = "data:image/png;base64," + images.data;
            if (this.state.zheng) {
                this.setState({
                    id_img1: images.data,
                    isVisible: false,
                    id_card_img_z: {uri: img}
                })
            }
            if (this.state.fan) {
                this.setState({
                    id_img2: images.data,
                    isVisible: false,
                    id_card_img_f: {uri: img}
                })
            }

            //this._postImg(images.data);

            ImagePicker.clean();

        });
    }

    _onCamera() {
        ImagePicker.openCamera({
            cropping: true,
            width: 500,
            height: 500,
            includeExif: true,
            //mediaType,
        }).then(images => {
            let file;
            if (Platform.OS === 'android') {
                file = images.path;
            } else {
                file = images.path.replace('file://', '');
            }
            if (this.state.zheng) {
                this.setState({
                    id_img1: file,
                    isVisible: false,
                    id_card_img_z: {uri: file, isStatic: true}
                })
            }
            if (this.state.fan) {
                this.setState({
                    id_img2: images.data,
                    isVisible: false,
                    id_card_img_f: {uri: img}
                })
            }

            //this._postImg(images.data);

            ImagePicker.clean();
        }).catch(e => console.log(e));
    }

    _cancel() {
        this.setState({
            isVisible: false,
        });
    }

    //提交信息
    async _submit() {
        if (!this.state.name) {
            Alert.alert("请输入用户姓名");
            return;
        }
        if (!this.state.id_num) {
            Alert.alert("请输入身份证号");
            return;
        }
        if (!this.state.id_img1 || !this.state.id_img2) {
            Alert.alert("请上传身份证照片");
            return;
        }
        let token = await AsyncStorage.getItem("token");

        let data = new FormData();
        data.append("name", this.state.name);
        data.append("id_num", this.state.id_num);
        data.append("id_img1", this.state.id_img1);
        data.append("id_img2", this.state.id_img2);
        data.append("sex", this.state.sex);

        fetch(SZ_API_URI + "app/api/v1/worker/idcard/addedit", {
            method: "POST",
            headers: {
                "Content-Type": "multipart/form-data",
                "token": token
            },
            body: data
        }).then(response => response.json())
            .then(responseJson => {
                if (responseJson.code === 200) {
                    Alert.alert("信息上传成功，审核中。。。");
                    return;
                }
                Alert.alert(responseJson.msg);
            })
    }

    render() {
        const {navigate} = this.props.navigation;
        return (
            <ScrollView style={[styles.container]} contentContainerStyle={{}}>
                <View style={[styles.view, {
                    marginTop: ScreenUtil.scaleSize(30),
                    borderBottomWidth: 1,
                    borderBottomColor: "#eee",
                }]}>
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
                            multiline={false}
                            onChangeText={(text) => {
                                this.setState({name: text})
                            }}
                            placeholder="请输入姓名"
                        />
                    </View>
                </View>
                <View style={[styles.view, {borderBottomWidth: 1, borderBottomColor: "#eee",}]}>
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
                            multiline={false}
                            onChangeText={(text) => {
                                this.setState({id_num: text})
                            }}
                            placeholder="请输入身份证号"
                        />
                    </View>
                </View>
                <View style={[styles.view]}>
                    <Text style={styles.label}>性别</Text>
                    <View style={styles.inputBlock}>
                        <TouchableOpacity onPress={() => {
                            this.setState({
                                sex: 1
                            })
                        }}>
                            <View style={{flexDirection: "row", paddingLeft: ScreenUtil.scaleSize(20)}}>
                                {
                                    this.state.sex === 1
                                        ? <Image source={require("../../static/icons/checked.png")} style={{
                                            width: ScreenUtil.scaleSize(40),
                                            height: ScreenUtil.scaleSize(40)
                                        }}/>
                                        : <Image source={require("../../static/icons/check.png")} style={{
                                            width: ScreenUtil.scaleSize(40),
                                            height: ScreenUtil.scaleSize(40)
                                        }}/>
                                }

                                <Text>男</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            this.setState({
                                sex: 2
                            })
                        }}>
                            <View style={{flexDirection: "row", paddingLeft: ScreenUtil.scaleSize(30)}}>
                                {
                                    this.state.sex === 2
                                        ? <Image source={require("../../static/icons/checked.png")} style={{
                                            width: ScreenUtil.scaleSize(40),
                                            height: ScreenUtil.scaleSize(40)
                                        }}/>
                                        : <Image source={require("../../static/icons/check.png")} style={{
                                            width: ScreenUtil.scaleSize(40),
                                            height: ScreenUtil.scaleSize(40)
                                        }}/>
                                }
                                <Text>女</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{paddingHorizontal: ScreenUtil.scaleSize(30), marginTop: ScreenUtil.scaleSize(100)}}>
                    <Text style={{
                        color: "#000",
                        fontSize: ScreenUtil.scaleSize(36),
                        fontWeight: "bold"
                    }}>上传手持身份证正反照片</Text>
                    <View style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginTop: ScreenUtil.scaleSize(30)
                    }}>
                        <TouchableOpacity onPress={() => {
                            this.setState({
                                isVisible: true,
                                zheng: true,
                                fan: false
                            })
                        }}>
                            <ImageBackground
                                resizeMode="contain"
                                source={this.state.id_card_img_z}
                                style={{
                                    width: ScreenUtil.scaleSize(360),
                                    height: ScreenUtil.scaleSize(280),
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}>
                                <Image source={require("../../static/icons/30.png")}
                                       style={{width: ScreenUtil.scaleSize(120), height: ScreenUtil.scaleSize(120)}}/>
                            </ImageBackground>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => {
                            this.setState({
                                isVisible: true,
                                zheng: false,
                                fan: true
                            })
                        }}>
                            <ImageBackground
                                resizeMode="contain"
                                source={this.state.id_card_img_f}
                                style={{
                                    width: ScreenUtil.scaleSize(360),
                                    height: ScreenUtil.scaleSize(280),
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}>
                                <Image source={require("../../static/icons/30.png")}
                                       style={{width: ScreenUtil.scaleSize(120), height: ScreenUtil.scaleSize(120)}}/>
                            </ImageBackground>
                        </TouchableOpacity>
                    </View>
                </View>
                <TouchableOpacity onPress={() => {
                    this._submit()
                }}>
                    <View style={[styles.view, {marginTop: ScreenUtil.scaleSize(30), justifyContent: "center"}]}>
                        <Text style={{
                            width: "90%",
                            textAlign: "center",
                            height: ScreenUtil.scaleSize(100),
                            lineHeight: ScreenUtil.scaleSize(100),
                            color: "#fff",
                            borderRadius: ScreenUtil.scaleSize(50),
                            backgroundColor: "#0071ff",
                            fontSize: ScreenUtil.scaleSize(32),
                            fontWeight: "bold"
                        }}>提交</Text>
                    </View>
                </TouchableOpacity>

                <Modal
                    animationType="none"
                    transparent={true}
                    visible={this.state.isVisible}
                    onRequestClose={() => {
                        this.setState({
                            isVisible: false,
                            statusBarBck: "#FFF"
                        });
                    }}
                >
                    <View style={{
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        width: deviceWidth,
                        height: deviceHeight
                    }}>
                        <View style={{
                            padding: ScreenUtil.scaleSize(50),
                            justifyContent: "space-between",
                            width: ScreenUtil.scaleSize(500),
                            height: ScreenUtil.scaleSize(300), backgroundColor: "#FFF"
                        }}>
                            <TouchableOpacity onPress={() => {
                                this._onPicker();
                            }}>
                                <Text style={styles.fnt}>从相册选择</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {
                                this._onCamera();
                            }}>
                                <Text style={styles.fnt}>拍照</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => {
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

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
    },
    view: {
        flexDirection: "row",
        justifyContent: "flex-start",
        paddingHorizontal: ScreenUtil.scaleSize(40),
        backgroundColor: "#FFF",
        alignItems: "center",
        height: ScreenUtil.scaleSize(120),
        lineHeight: ScreenUtil.scaleSize(120),
    },
    label: {
        fontSize: ScreenUtil.scaleSize(32), fontWeight: "bold"
    },
    inputBlock: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center"
    },
    inputImg: {
        width: ScreenUtil.scaleSize(40),
        height: ScreenUtil.scaleSize(40)
    }
})
