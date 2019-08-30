import React, {Component} from 'react';
import {
    Linking,
    Platform,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    StatusBar,
    Image,
    FlatList,
    ActivityIndicator
} from 'react-native';

import ScrollableTabView, {ScrollableTabBar} from 'react-native-scrollable-tab-view';
import {orderQuery} from "../../api";
import ListGeneral from "../../base/ListGeneral";
import ScreenUtil, {deviceWidth, deviceHeight, SZ_API_URI} from "../../common/ScreenUtil";

const ITEM_HEIGHT = 100;
const ITEM_MARGIN_TOP = 15;
export default class MyOrder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            types: [
                {"id": 1, "title": "全部"},
                {"id": 2, "title": "进行中"},
                {"id": 3, "title": "已完成"}
            ],
            strOrderStatus: '全部',
            data: {
                list: []
            },
            refreshing: true,
            loaded: false,
            count: "全部"
        }
    }

    async componentDidMount() {
        // this.token = await AsyncStorage.getItem("token");
        // this._navListener = this.props.navigation.addListener('didFocus', () => {
        //     StatusBar.setBarStyle('dark-content');
        //     (Platform.OS === 'ios') ? "" : StatusBar.setBackgroundColor('#fff');
        // });
        // const types = [
        //     {"id": 1, "title": "全部"},
        //     {"id": 2, "title": "进行中"},
        //     {"id": 3, "title": "已完成"}
        // ];
        // this.setState({
        //     loaded: true,
        // });
        // this._loadData(1);
    }

    componentWillUnmount() {

    }

    _onChangeTab(index) {
        this.setState({
            strOrderStatus: this.state.types[index.i]
        })
    }

    render() {
        let tab = this.state.types.map((item, index) => {
            return (
                <View tabLabel={item.title} key={item.id} style={{flex: 1, backgroundColor: '#f8f8f8'}}>
                    <ListGeneral
                        style={{flex: 1}}
                        ref={(ref) => {
                            this[`_list${index}`] = ref
                        }}
                        formatData={(results) => {
                            return results
                        }}
                        itemHeight={ITEM_HEIGHT} //每一项的高度
                        itemMarginTop={ITEM_MARGIN_TOP} //每一项的marginTop
                        getList={async (page, num, callback) => {
                            const ret = await orderQuery(page, num, item.id);
                            console.log(ret);
                            if (ret.code === 200) {
                                callback();
                            } else {
                                callback()
                            }
                        }} //获取列表的api
                        renderItem={(item) => {
                            if (!item.contactPhone || !item.appointTime || !item.address) {
                                return (<View>
                                    <View style={styles.view} />
                                </View>);
                            }
                            return (
                                <View>
                                    <View style={styles.view}>
                                        <View style={styles.list}>
                                            <Text style={styles.status}>{this.state.strOrderStatus}</Text>
                                            <TouchableOpacity onPress={() => {
                                                const url = `tel:${item.contactPhone}`;
                                                Linking.canOpenURL(url).then(supported => {
                                                    if (!supported) {
                                                        Alert.alert('无法拨打电话')
                                                        console.log('Can\'t handle url: ' + url);
                                                    } else {
                                                        return Linking.openURL(url);
                                                    }
                                                }).catch(err => console.error('An error occurred'));
                                            }}>
                                                <Text style={styles.phone}>拨打电话</Text>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{paddingVertical: ScreenUtil.scaleSize(30)}}>
                                            <Text style={styles.text}>{item.appointTime}</Text>
                                            <Text
                                                style={[styles.text, {
                                                    fontSize: ScreenUtil.scaleSize(32),
                                                    fontWeight: "bold"
                                                }]}>
                                                <Image source={require("../../static/icons/point.png")} style={{
                                                    width: ScreenUtil.scaleSize(40),
                                                    height: ScreenUtil.scaleSize(40)
                                                }}/>{item.serveDay}
                                            </Text>
                                            <Text style={[styles.text, {fontSize: ScreenUtil.scaleSize(28)}]}>
                                                <Image source={require("../../static/icons/point.png")} style={{
                                                    width: ScreenUtil.scaleSize(40),
                                                    height: ScreenUtil.scaleSize(40)
                                                }}/>{item.address}</Text>
                                        </View>
                                    </View>
                                </View>
                            );
                        }} //渲染每一项的UI
                    />
                </View>
            )
        });

        //const {navigate} = this.props.navigation;
        return (
            <View style={{flex: 1}}>
                <ScrollableTabView
                    style={{marginTop: 20}}
                    initialPage={0}
                    tabBarInactiveTextColor={'#999999'}
                    tabBarActiveTextColor={"#FF7B21"}
                    tabBarUnderlineStyle={{
                        backgroundColor: '#FF7B21',
                        height: 1
                    }}
                    // onChangeTab={this._onChangeTab.bind(this)}
                    renderTabBar={() => <ScrollableTabBar/>}
                >
                    {tab}
                </ScrollableTabView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFF',
    },
    view: {
        backgroundColor: "#fff",
        marginBottom: ScreenUtil.scaleSize(20),
        padding: ScreenUtil.scaleSize(30),
        borderRadius: ScreenUtil.scaleSize(10),
        marginHorizontal: ScreenUtil.scaleSize(20),
        height: ITEM_HEIGHT,
        lineHeight: ITEM_HEIGHT,
        marginTop: ITEM_MARGIN_TOP,
        overflow: 'hidden'
    },
    list: {
        flexDirection: "row",
        justifyContent: "space-between",
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: "#ccc",
    },
    status: {
        color: "#000",
        fontSize: ScreenUtil.scaleSize(30),
        fontWeight: "bold"
    },
    phone: {
        fontSize: ScreenUtil.scaleSize(24),
        height: ScreenUtil.scaleSize(50),
        lineHeight: ScreenUtil.scaleSize(50),
        width: ScreenUtil.scaleSize(150),
        borderRadius: ScreenUtil.scaleSize(50),
        color: "#FF9900",
        borderWidth: 1,
        borderColor: "#FF9900",
        textAlign: "center"
    },
    text: {
        height: ScreenUtil.scaleSize(80), lineHeight: ScreenUtil.scaleSize(80)
    }
});

//加载数据  2进行中 4已完成
// _loadData = async (type_id = "") => {
//     const self = this;
//     let user = JSON.parse(await AsyncStorage.getItem("userInfo"));
//
//     const url = `${SZ_API_URI}/app/api/v1/worker/orders?orderStatus=${type_id}`;
//     fetch(url, {
//         method: "GET",
//         headers: {"token": self.token}
//     }).then(response => {
//         console.log(response, response.json());
//         if(response && response.json) {
//             response.json();
//         }
//     }).then(responseJson => {
//         if (!responseJson || responseJson.code !== 200) {
//             return;
//         }
//         this.setState({
//             data: responseJson.data,
//             refreshing: false,
//             loaded: true,
//         })
//     }).catch(error => {
//         console.error(error);
//     });
// };
{/*<FlatList*/
}
{/*    contentContainerStyle={{*/
}
{/*        backgroundColor: '#F6F6F6',*/
}
{/*        paddingTop: ScreenUtil.scaleSize(20),*/
}
{/*    }}*/
}
{/*    style={{flex: 1}}*/
}
{/*    tabLabel={item.title}*/
}
{/*    data={this.state.data.list}*/
}
{/*    horizontal={false}*/
}
{/*    key={index}*/
}
{/*    keyExtractor={(item, index) => {*/
}
{/*        return "key" + item.id*/
}
{/*    }}*/
}
{/*    refreshing={this.state.refreshing}*/
}
{/*    onRefresh={() => {*/
}
{/*        // this._loadData(item.id)*/
}
{/*    }}*/
}
{/*    onEndReached={() => {*/
}

{/*    }}*/
}
{/*    ListEmptyComponent={() => {*/
}
{/*        return (*/
}
{/*            <View style={{*/
}
{/*                backgroundColor: "#fff",*/
}
{/*                height: '100%',*/
}
{/*                alignItems: 'center',*/
}
{/*                justifyContent: 'center',*/
}
{/*            }}>*/
}
{/*                <Text style={{fontSize: ScreenUtil.scaleSize(24)}}>暂无数据</Text>*/
}
{/*            </View>*/
}
{/*        )*/
}
{/*    }}*/
}
{/*    renderItem={({item, index}) => {*/
}
{/*        let strOrderStatus = '进行中';*/
}
{/*        if (item.orderStatus === 4) {*/
}
{/*            strOrderStatus = '已完成'*/
}
{/*        }*/
}
{/*        return (*/
}
{/*            <View style={styles.view}>*/
}
{/*                <View style={styles.list}>*/
}
{/*                    <Text style={styles.status}>{strOrderStatus}</Text>*/
}
{/*                    <TouchableOpacity onPress={() => {*/
}
{/*                        const url = `tel:${item.contactPhone}`;*/
}
{/*                        Linking.canOpenURL(url).then(supported => {*/
}
{/*                            if (!supported) {*/
}
{/*                                Alert.alert('无法拨打电话')*/
}
{/*                                console.log('Can\'t handle url: ' + url);*/
}
{/*                            } else {*/
}
{/*                                return Linking.openURL(url);*/
}
{/*                            }*/
}
{/*                        }).catch(err => console.error('An error occurred'));*/
}
{/*                    }}>*/
}
{/*                        <Text style={styles.phone}>拨打电话</Text>*/
}
{/*                    </TouchableOpacity>*/
}
{/*                </View>*/
}
{/*                <View stype={{paddingVertical: ScreenUtil.scaleSize(30)}}>*/
}
{/*                    <Text style={styles.text}>{item.appointTime}</Text>*/
}
{/*                    <Text*/
}
{/*                        style={[styles.text, {fontSize: ScreenUtil.scaleSize(32), fontWeight: "bold"}]}>*/
}
{/*                        <Image source={require("../../static/icons/point.png")} style={{*/
}
{/*                            width: ScreenUtil.scaleSize(40),*/
}
{/*                            height: ScreenUtil.scaleSize(40)*/
}
{/*                        }}/>{item.serveDay}*/
}
{/*                    </Text>*/
}
{/*                    <Text style={[styles.text, {fontSize: ScreenUtil.scaleSize(28)}]}>*/
}
{/*                        <Image source={require("../../static/icons/point.png")} style={{*/
}
{/*                            width: ScreenUtil.scaleSize(40),*/
}
{/*                            height: ScreenUtil.scaleSize(40)*/
}
{/*                        }}/>*/
}
{/*                        {item.address}</Text>*/
}
{/*                </View>*/
}
{/*            </View>*/
}
{/*        );*/
}
{/*    }}*/
}
{/*/>*/
}
