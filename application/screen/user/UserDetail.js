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
import ImagePicker from 'react-native-image-crop-picker';

import ScreenUtil, {deviceWidth, deviceHeight, SZ_API_URI} from "../../common/ScreenUtil";
import comStyles from "../../assets/styles/comStyles";
import {MapView, MapTypes, Geolocation, Overlay} from 'react-native-baidu-map';
import NavigationUtil from "../../navigator/NavigationUtil";
import {addIdCard} from "../../api";

const Data = [{"id": 1}]
/*
* 主页
*/
export default class UserDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            address: '',
            sex: 1,
            isVisible: false,
            zheng: false,
            id_img1: "",
            fan: false,
            id_img2: "",
            name: "",
            id_num: "",
            // id_card_img_z: require("../../static/icons/card1.png"),
            // id_card_img_f: require("../../static/icons/card2.png")
        }
    }

    componentDidMount() {
        this.setAddress();
    }

    componentWillUnmount() {
    }

    // const ret = await Geolocation.getCurrentPosition();
    async setAddress() {
        const ret = await Geolocation.getCurrentPosition();
        if (ret.address) {
            this.setState({
                address: ret.address
            })
        }
    }

    async _submit() {
        if (!this.state.name || !this.state.id_num || !this.state.address) {
            Alert.alert("请先完善信息");
            return false
        }
        const ret = await addIdCard(this.state.name, this.state.id_num , this.state.address);
        console.log(ret);
        if (ret.code === 200) {
            Alert.alert("提交成功");
            NavigationUtil.goBack();
        } else {
            Alert.alert(ret.msg || "提交失败");
        }
    }

    render() {
        const {navigate} = this.props.navigation;
        return (
            <ScrollView style={[styles.container]} contentContainerStyle={{}}>
                <View style={[styles.view, {
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
                <View style={[styles.view, {
                    borderBottomWidth: 1,
                    borderBottomColor: "#eee",
                }]}>
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
                <View style={[styles.view, {
                    borderBottomWidth: 1,
                    borderBottomColor: "#eee",
                }]}>
                    <Text style={styles.label}>地区</Text>
                    <View style={styles.inputBlock}>
                        <TextInput
                            value={this.state.address}
                            style={styles.textInputType}
                            allowFontScaling={true}
                            clearButtonMode='while-editing'
                            enablesReturnKeyAutomatically={true}
                            keyboardType='default'
                            editable={true}
                            underlineColorAndroid="transparent"
                            multiline={false}
                            onChangeText={(text) => {
                                this.setState({address: text})
                            }}
                            placeholder="请输入地区"
                        />
                    </View>
                </View>
                <TouchableOpacity style={[styles.view, {
                    borderBottomWidth: 1,
                    borderBottomColor: "#eee",
                }]} onPress={() => {
                    NavigationUtil.goPage({}, 'idCardDetail')
                }}>
                    <Text style={styles.label}>上传身份证</Text>
                    <View style={[styles.inputBlock, {justifyContent: 'flex-end'}]}>
                        <Text>非必传></Text>
                    </View>
                </TouchableOpacity>
                {/*<View style={{paddingHorizontal: ScreenUtil.scaleSize(30), marginTop: ScreenUtil.scaleSize(100)}}>*/}
                {/*    <Text style={{*/}
                {/*        color: "#000",*/}
                {/*        fontSize: ScreenUtil.scaleSize(36),*/}
                {/*        fontWeight: "bold"*/}
                {/*    }}>上传手持身份证正反照片</Text>*/}
                {/*    <View style={{*/}
                {/*        flexDirection: "row",*/}
                {/*        justifyContent: "space-between",*/}
                {/*        marginTop: ScreenUtil.scaleSize(30)*/}
                {/*    }}>*/}
                {/*        <TouchableOpacity onPress={() => {*/}
                {/*            this.setState({*/}
                {/*                isVisible: true,*/}
                {/*                zheng: true,*/}
                {/*                fan: false*/}
                {/*            })*/}
                {/*        }}>*/}
                {/*            <ImageBackground*/}
                {/*                resizeMode="contain"*/}
                {/*                source={this.state.id_card_img_z}*/}
                {/*                style={{*/}
                {/*                    width: ScreenUtil.scaleSize(360),*/}
                {/*                    height: ScreenUtil.scaleSize(280),*/}
                {/*                    alignItems: "center",*/}
                {/*                    justifyContent: "center"*/}
                {/*                }}>*/}
                {/*                <Image source={require("../../static/icons/30.png")}*/}
                {/*                       style={{width: ScreenUtil.scaleSize(120), height: ScreenUtil.scaleSize(120)}}/>*/}
                {/*            </ImageBackground>*/}
                {/*        </TouchableOpacity>*/}

                {/*        <TouchableOpacity onPress={() => {*/}
                {/*            this.setState({*/}
                {/*                isVisible: true,*/}
                {/*                zheng: false,*/}
                {/*                fan: true*/}
                {/*            })*/}
                {/*        }}>*/}
                {/*            <ImageBackground*/}
                {/*                resizeMode="contain"*/}
                {/*                source={this.state.id_card_img_f}*/}
                {/*                style={{*/}
                {/*                    width: ScreenUtil.scaleSize(360),*/}
                {/*                    height: ScreenUtil.scaleSize(280),*/}
                {/*                    alignItems: "center",*/}
                {/*                    justifyContent: "center"*/}
                {/*                }}>*/}
                {/*                <Image source={require("../../static/icons/30.png")}*/}
                {/*                       style={{width: ScreenUtil.scaleSize(120), height: ScreenUtil.scaleSize(120)}}/>*/}
                {/*            </ImageBackground>*/}
                {/*        </TouchableOpacity>*/}
                {/*    </View>*/}
                {/*</View>*/}
                <TouchableOpacity onPress={() => {
                    this._submit();
                }}>
                    <Text style={[comStyles.commonBtn, {marginTop: 60}]}>提交</Text>
                </TouchableOpacity>
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
        fontSize: 15,
        fontWeight: "bold",
        width: 80,
        flexShrink: 0,
        overflow: 'hidden'
    },
    inputBlock: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        textAlign: "center",
    },
    textInputType: {
        flex: 1,
        height: 40,
    },
    inputImg: {
        width: ScreenUtil.scaleSize(40),
        height: ScreenUtil.scaleSize(40)
    }
})
