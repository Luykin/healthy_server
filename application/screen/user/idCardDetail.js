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
    Dimensions,
    Modal,
    Alert,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import ImagePicker from 'react-native-image-crop-picker';
import comStyles from "../../assets/styles/comStyles";
import ScreenUtil, {deviceHeight, deviceWidth} from "../../common/ScreenUtil";
import {addIdCardImg} from "../../api";
import NavigationUtil from "../../navigator/NavigationUtil";

const {height, width} = Dimensions.get('window');

export default class idCardDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isVisible: false,
            zheng: false,
            id_img1: "",
            fan: false,
            id_img2: "",
            id_card_img_z: require("../../static/icons/card1.png"),
            id_card_img_f: require("../../static/icons/card2.png")
        }
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    async _submit() {
        if (!this.state.id_img1 || !this.state.id_img2) {
            Alert.alert("请先上传身份证照片");
            return false
        }
        const ret = await addIdCardImg('-', this.state.id_img1, this.state.id_img2);
        if (ret.code === 200) {
            Alert.alert("提交成功");
            NavigationUtil.goBack();
        } else {
            Alert.alert(ret.msg || "提交失败");
        }
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

    render() {
        return (
            <View style={{flex: 1}}>
                <View style={{paddingHorizontal: 15}}>
                    <Text style={{
                        color: "#353535",
                        fontSize: 16,
                        fontWeight: "bold",
                        marginTop: 20,
                        textIndent: 15,
                    }}>上传手持身份证正反照片</Text>
                    <View style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginTop: 30
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
                                    width: width * 0.42,
                                    height: 100,
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
                                    width: width * 0.42,
                                    height: 100,
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
                    this._submit();
                }}>
                    <Text style={[comStyles.commonBtn, {marginTop: 60}]}>提交</Text>
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
            </View>
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
