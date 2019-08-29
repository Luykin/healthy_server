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
    DeviceEventEmitter,
    PanResponder
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {createStackNavigator} from 'react-navigation';
import StackViewStyleInterpolator from 'react-navigation-stack/lib/commonjs/views/StackView/StackViewStyleInterpolator';

import CardView from 'react-native-cardview';

import ScreenUtil, {deviceWidth, deviceHeight, SZ_API_URI, DATA_API} from "../../common/ScreenUtil";
import {walletQuery} from "../../api";

/*
* 主页
*/
export class UCenterView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            //avator:"",
            yearOrders: 0,
            monthOrders: 0,
            allIncome: 0,
            stateText: "审核中",
            marginLeft: 0,
            marginTop: 0,
            user: {},
            quality: [],
            refreshing: true,
        }
        this.lastX = this.state.marginLeft;
        this.lastY = this.state.marginTop;
    }

    async componentDidMount() {
        this._navListener = this.props.navigation.addListener('didFocus', () => {
            StatusBar.setBarStyle('dark-content');
            (Platform.OS === 'ios') ? "" : StatusBar.setBackgroundColor('#FFFFFF');
        });
        let userInfo = JSON.parse(await AsyncStorage.getItem("userInfo"));
        this.setState({
            //avator:userInfo.face_img,
            user: userInfo
        });
        //this._walletQuery();
        //DeviceEventEmitter.emit('left', '发送了个通知');
        this._getWordTotal(userInfo);
        this._getQuality(userInfo,0);
    }

    async _getQuality(user, status = 0) {
        fetch(DATA_API + "api/v1/quality/" + user.data_layer_uid, {
            method: "GET"
        }).then(res => res.json())
            .then(resJson => {

                if (resJson && resJson.data && resJson.data.length > 0) {
                    let arr = [];
                    resJson.data.map((item, key) => {
                        if (item.qualityStatus == status) {
                            arr.push(item);
                        }
                    })
                    this.setState({
                        quality: arr,
                        refreshing: false
                    })
                }

            }).catch(err => {
            console.error(err);
        })
    }

    //总订单信息
    _getWordTotal(userInfo) {
        fetch(DATA_API + "api/v1/statistics/worker" + "?userId=" + userInfo.data_layer_uid, {
            method: 'GEt',
        })
            .then(response => response.json())
            .then(responseJson => {

                if (responseJson.code == 0) {
                    this.setState({
                        yearOrders: responseJson.data.yearOrders,
                        monthOrders: responseJson.data.monthOrders,
                        allIncome: responseJson.data.allIncome
                    })
                }
            }).catch(error => {
            console.error(error);
        });
    }


    componentWillUnmount() {
        this._navListener.remove();
    }

    render() {
        const {navigate} = this.props.navigation;
        return (
            <ScrollView style={[styles.container]} contentContainerStyle={{alignItems: "center"}}>
                <View style={{
                    flexDirection: "column",
                    width: "96%",
                    height: ScreenUtil.scaleSize(350),
                    backgroundColor: "#FFF"
                }}>
                    <ImageBackground
                        source={require("../../static/icons/18.png")}
                        style={{width: "100%", height: ScreenUtil.scaleSize(350),}}
                        resizeMode="stretch"
                    >
                        <View style={styles.userview}>
                            {this.state.avator !== ""
                                ? (<Image source={{uri: this.state.user.face_img}} style={styles.avator}/>)
                                : (<Image source={require("../../static/icons/33.png")} style={styles.avator}/>)}

                            <View style={{flexDirection: 'column', paddingLeft: 10}}>
                                <Text style={styles.nickname}>{this.state.user.nickname}</Text>
                                <Text style={styles.nickname}>ID：{this.state.user.data_layer_uid}</Text>
                            </View>
                        </View>
                        <View style={styles.total}>
                            <View style={{textAlign: "center", alignItems: "center"}}>
                                <Text style={styles.num}>{this.state.monthOrders}</Text>
                                <Text style={styles.desc}>月累积接单</Text>
                            </View>
                            <View style={{textAlign: "center", alignItems: "center"}}>
                                <Text style={styles.num}>{this.state.yearOrders}</Text>
                                <Text style={styles.desc}>年累积接单</Text>
                            </View>
                            <View style={{textAlign: "center", alignItems: "center"}}>
                                <Text style={styles.num}>{this.state.allIncome}</Text>
                                <Text style={styles.desc}>累计收入(元)</Text>
                            </View>
                        </View>
                    </ImageBackground>
                </View>
                <View style={styles.viewButton}>
                    <TouchableOpacity onPress={() => {
                        navigate("MoneyBag");
                    }}>
                        <View style={{alignItems: "center",}}>
                            <Image resizeMode="contain" source={require("../../static/icons/19.png")}
                                   style={styles.img}/>
                            <Text>我的钱包</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        navigate("MyOrder");
                    }}>
                        <View style={{alignItems: "center",}}>
                            <Image resizeMode="contain" source={require("../../static/icons/20.png")}
                                   style={styles.img}/>
                            <Text>我的订单</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        navigate("MyQuality");
                    }}>
                        <View style={{alignItems: "center",}}>
                            <Image resizeMode="contain" source={require("../../static/icons/21.png")}
                                   style={styles.img}/>
                            <Text>资质管理</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => {
                        navigate("Setting");
                    }}>
                        <View style={{alignItems: "center",}}>
                            <Image resizeMode="contain" source={require("../../static/icons/23.png")}
                                   style={styles.img}/>
                            <Text>个人设置</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={[styles.list, {flex: 1}]}>
                    <View style={{justifyContent: "center", alignItems: "center"}}>
                        <Text style={styles.title}>技能管理</Text>
                    </View>

                    <FlatList
                        contentContainerStyle={{
                            flex: 1,
                            width: "100%",
                        }}
                        style={{}}
                        data={this.state.quality}
                        horizontal={false}
                        keyExtractor={(item, index) => {
                            return "key" + index
                        }}
                        refreshing={this.state.refreshing}
                        onRefresh={() => {

                        }}
                        onEndReached={() => {

                        }}
                        ListEmptyComponent={() => {
                            return (
                                <View style={{
                                    backgroundColor: "#fff",
                                    height: '100%',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                    <Text style={{fontSize: ScreenUtil.scaleSize(24)}}>暂无数据</Text>
                                </View>
                            )
                        }}
                        renderItem={({item, index}) => (
                            <View style={{
                                width: "100%",
                                justifyContent: "center",
                                alignItems: "center",
                                marginVertical: ScreenUtil.scaleSize(5)
                            }}>
                                <CardView
                                    style={styles.card}
                                    cardElevation={5}
                                    cardMaxElevation={5}
                                    cornerRadius={5}>
                                    <View style={{}}>
                                        <Text style={{
                                            fontSize: ScreenUtil.scaleSize(36),
                                            fontWeight: "bold",
                                            color: "#000"
                                        }}>{item.qualityType}</Text>
                                        <Text style={{
                                            height: ScreenUtil.scaleSize(80),
                                            lineHeight: ScreenUtil.scaleSize(80)
                                        }}>{item.name}</Text>
                                    </View>
                                    <Text style={styles.cardButton}>{item.qualityStatus == 0 ? "审核中" : "通过"}</Text>
                                </CardView>
                            </View>
                        )}
                    />
                </View>
            </ScrollView>
        )
    }
}

//头样式
const headerStyle = {
    style: {
        textAlign: 'center',
        height: ScreenUtil.scaleSize(120),
        borderBottomWidth: 0,
        shadowOpacity: 0,
        elevation: 0,
        backgroundColor: "#FFF"
    },
    titleStyle: {flex: 1, textAlign: 'center', color: '#000', alignItems: "center", fontSize: ScreenUtil.scaleSize(42)}
}
export default UCenter = createStackNavigator({
    UcHome: {
        screen: UCenterView,
        navigationOptions: ({navigation}) => ({
            headerTitle: navigation.getParam("name", "个人中心"),
            headerStyle: headerStyle.style,
            headerTitleStyle: headerStyle.titleStyle,
            headerTintColor: '#FFF',
            headerLeft:
                <TouchableOpacity onPress={() => {
                    navigation.pop();
                }}>
                    <View style={{marginLeft: ScreenUtil.scaleSize(10), padding: ScreenUtil.scaleSize(10)}}>
                        <Image resizeMode="contain" source={require('../../static/icons/16.png')}
                               style={{width: ScreenUtil.scaleSize(30), height: ScreenUtil.scaleSize(30)}}/>
                    </View>
                </TouchableOpacity>
            ,
            headerRight:
                <View/>
        })
    },

}, {
    initialRouteName: 'UcHome',
    transitionConfig: () => ({
        screenInterpolator: StackViewStyleInterpolator.forHorizontal,
    })
})
const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f5f6f5',
    },
    userview: {
        flexDirection: "row",
        alignItems: "center",
        padding: ScreenUtil.scaleSize(30)
    },
    avator: {
        width: ScreenUtil.scaleSize(100),
        height: ScreenUtil.scaleSize(100), borderRadius: ScreenUtil.scaleSize(100)
    },
    nickname: {
        color: "#FFF", fontSize: ScreenUtil.scaleSize(30), fontWeight: "bold"
    },
    total: {
        flexDirection: "row", justifyContent: "space-between", paddingHorizontal: ScreenUtil.scaleSize(30)
    },
    num: {
        fontSize: ScreenUtil.scaleSize(40), color: "#FFF"
    },
    desc: {
        fontSize: ScreenUtil.scaleSize(24), color: "#CCC"
    },
    img: {
        width: ScreenUtil.scaleSize(80),
        height: ScreenUtil.scaleSize(80)
    },
    list: {
        backgroundColor: "#FFF",
        //width:"100%",
        marginTop: ScreenUtil.scaleSize(20),
        paddingBottom: ScreenUtil.scaleSize(30)
    },
    viewButton: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        paddingHorizontal: ScreenUtil.scaleSize(30),
        paddingTop: ScreenUtil.scaleSize(60),
        paddingBottom: ScreenUtil.scaleSize(40),
        backgroundColor: "#FFF"
    },
    title: {
        paddingVertical: ScreenUtil.scaleSize(5),
        color: "#FFF",
        textAlign: "center",
        backgroundColor: "#CCC",
        width: ScreenUtil.scaleSize(200),
        height: ScreenUtil.scaleSize(50),
        borderBottomLeftRadius: ScreenUtil.scaleSize(20),
        borderBottomRightRadius: ScreenUtil.scaleSize(20)
    },
    card: {
        width: "90%",
        marginTop: ScreenUtil.scaleSize(30),
        padding: ScreenUtil.scaleSize(30),
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: "#FFF",
        alignItems: "center",
        borderWidth: 0
    },
    cardButton: {
        width: ScreenUtil.scaleSize(200),
        height: ScreenUtil.scaleSize(60),
        lineHeight: ScreenUtil.scaleSize(60),
        borderRadius: ScreenUtil.scaleSize(30),
        backgroundColor: "#0071ff",
        color: "#FFF", textAlign: "center"
    }
})

