import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Alert,
    Text,
    View,
    TouchableOpacity,
    StatusBar,
    Image,
    FlatList,
    ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {createStackNavigator} from 'react-navigation';
import StackViewStyleInterpolator from 'react-navigation-stack/lib/commonjs/views/StackView/StackViewStyleInterpolator';
import moment from 'moment';
import ScreenUtil, {deviceWidth, deviceHeight, SZ_API_URI} from "../../common/ScreenUtil";
import Empty from "../../base/Empty";
import DatePicker from "react-native-datepicker";

/**
 "balance": "165.82",
 "income": 200.22,
 "list": {
            "list": [
                {
                    "amount": 10,
                    "billId": "1157239171576893440",
                    "categoryName": "充值",
                    "createTime": "2019-08-02T10:38:14.000+0000",
                    "deleted": false,
                    "description": "测试充值",
                    "reserve1": null,
                    "reserve2": null,
                    "type": 0,
                    "updateTime": null,
                    "userId": "1128204377975296000"
                },
                {
                    "amount": 1.1,
                    "billId": "1157239306855780352",
                    "categoryName": "消费",
                    "createTime": "2019-08-02T10:38:46.000+0000",
                    "deleted": false,
                    "description": "测试消费",
                    "reserve1": null,
                    "reserve2": null,
                    "type": 1,
                    "updateTime": null,
                    "userId": "1128204377975296000"
                },
                {
                    "amount": 5,
                    "billId": "1157239684326363136",
                    "categoryName": "消费",
                    "createTime": "2019-08-02T10:40:16.000+0000",
                    "deleted": false,
                    "description": "测试消费",
                    "reserve1": null,
                    "reserve2": null,
                    "type": 1,
                    "updateTime": null,
                    "userId": "1128204377975296000"
                },
                {
                    "amount": 10,
                    "billId": "1157240899860828160",
                    "categoryName": "充值",
                    "createTime": "2019-08-02T10:45:06.000+0000",
                    "deleted": false,
                    "description": "测试充值",
                    "reserve1": null,
                    "reserve2": null,
                    "type": 0,
                    "updateTime": null,
                    "userId": "1128204377975296000"
                },
                {
                    "amount": 10,
                    "billId": "1157241616658993152",
                    "categoryName": "充值",
                    "createTime": "2019-08-02T10:47:57.000+0000",
                    "deleted": false,
                    "description": "",
                    "reserve1": null,
                    "reserve2": null,
                    "type": 0,
                    "updateTime": null,
                    "userId": "1128204377975296000"
                },
                {
                    "amount": 1.1,
                    "billId": "1157243352765304832",
                    "categoryName": "消费",
                    "createTime": "2019-08-02T10:54:50.000+0000",
                    "deleted": false,
                    "description": "测试消费",
                    "reserve1": null,
                    "reserve2": null,
                    "type": 1,
                    "updateTime": null,
                    "userId": "1128204377975296000"
                },
                {
                    "amount": 10,
                    "billId": "1157243816416251904",
                    "categoryName": "消费",
                    "createTime": "2019-08-02T10:56:41.000+0000",
                    "deleted": false,
                    "description": "",
                    "reserve1": null,
                    "reserve2": null,
                    "type": 1,
                    "updateTime": null,
                    "userId": "1128204377975296000"
                },
                {
                    "amount": 10,
                    "billId": "1157244524028891136",
                    "categoryName": "消费",
                    "createTime": "2019-08-02T10:59:30.000+0000",
                    "deleted": false,
                    "description": "",
                    "reserve1": null,
                    "reserve2": null,
                    "type": 1,
                    "updateTime": null,
                    "userId": "1128204377975296000"
                },
                {
                    "amount": 10,
                    "billId": "1157247210207973376",
                    "categoryName": "充值",
                    "createTime": "2019-08-02T11:10:10.000+0000",
                    "deleted": false,
                    "description": "测试充值",
                    "reserve1": null,
                    "reserve2": null,
                    "type": 0,
                    "updateTime": null,
                    "userId": "1128204377975296000"
                },
                {
                    "amount": 5,
                    "billId": "1157247225307467776",
                    "categoryName": "消费",
                    "createTime": "2019-08-02T11:10:14.000+0000",
                    "deleted": false,
                    "description": "测试消费",
                    "reserve1": null,
                    "reserve2": null,
                    "type": 1,
                    "updateTime": null,
                    "userId": "1128204377975296000"
                },
                {
                    "amount": 10,
                    "billId": "1158284899984216064",
                    "categoryName": "充值",
                    "createTime": "2019-08-05T07:53:35.000+0000",
                    "deleted": false,
                    "description": "测试充值",
                    "reserve1": null,
                    "reserve2": null,
                    "type": 0,
                    "updateTime": null,
                    "userId": "1128204377975296000"
                },
                {
                    "amount": 10,
                    "billId": "1158284902177837056",
                    "categoryName": "充值",
                    "createTime": "2019-08-05T07:53:35.000+0000",
                    "deleted": false,
                    "description": "测试充值",
                    "reserve1": null,
                    "reserve2": null,
                    "type": 0,
                    "updateTime": null,
                    "userId": "1128204377975296000"
                },
                {
                    "amount": 10,
                    "billId": "1158284904740556800",
                    "categoryName": "充值",
                    "createTime": "2019-08-05T07:53:36.000+0000",
                    "deleted": false,
                    "description": "测试充值",
                    "reserve1": null,
                    "reserve2": null,
                    "type": 0,
                    "updateTime": null,
                    "userId": "1128204377975296000"
                },
                {
                    "amount": 10,
                    "billId": "1158284906766405632",
                    "categoryName": "充值",
                    "createTime": "2019-08-05T07:53:36.000+0000",
                    "deleted": false,
                    "description": "测试充值",
                    "reserve1": null,
                    "reserve2": null,
                    "type": 0,
                    "updateTime": null,
                    "userId": "1128204377975296000"
                },
                {
                    "amount": 10,
                    "billId": "1158284908469293056",
                    "categoryName": "充值",
                    "createTime": "2019-08-05T07:53:37.000+0000",
                    "deleted": false,
                    "description": "测试充值",
                    "reserve1": null,
                    "reserve2": null,
                    "type": 0,
                    "updateTime": null,
                    "userId": "1128204377975296000"
                },
                {
                    "amount": 10,
                    "billId": "1158284910092488704",
                    "categoryName": "充值",
                    "createTime": "2019-08-05T07:53:37.000+0000",
                    "deleted": false,
                    "description": "测试充值",
                    "reserve1": null,
                    "reserve2": null,
                    "type": 0,
                    "updateTime": null,
                    "userId": "1128204377975296000"
                },
                {
                    "amount": 10,
                    "billId": "1158284911564689408",
                    "categoryName": "充值",
                    "createTime": "2019-08-05T07:53:37.000+0000",
                    "deleted": false,
                    "description": "测试充值",
                    "reserve1": null,
                    "reserve2": null,
                    "type": 0,
                    "updateTime": null,
                    "userId": "1128204377975296000"
                },
                {
                    "amount": 10,
                    "billId": "1158285380810838016",
                    "categoryName": "充值",
                    "createTime": "2019-08-05T07:55:29.000+0000",
                    "deleted": false,
                    "description": "测试充值",
                    "reserve1": null,
                    "reserve2": null,
                    "type": 0,
                    "updateTime": null,
                    "userId": "1128204377975296000"
                },
                {
                    "amount": 10,
                    "billId": "1158285387815325696",
                    "categoryName": "充值",
                    "createTime": "2019-08-05T07:55:31.000+0000",
                    "deleted": false,
                    "description": "测试充值",
                    "reserve1": null,
                    "reserve2": null,
                    "type": 0,
                    "updateTime": null,
                    "userId": "1128204377975296000"
                },
                {
                    "amount": 10,
                    "billId": "1158285389279137792",
                    "categoryName": "充值",
                    "createTime": "2019-08-05T07:55:31.000+0000",
                    "deleted": false,
                    "description": "测试充值",
                    "reserve1": null,
                    "reserve2": null,
                    "type": 0,
                    "updateTime": null,
                    "userId": "1128204377975296000"
                }
            ],
            "page": 1,
            "pageSize": 20,
            "total": 28
        },
 "spend": 34.4
 */


/*
* 主页
*/
export default class MoneyBag extends Component {
    constructor(props) {
        super(props);
        this.state = {
            date: '2019-08',
            data: {
                balance: 0, income: 0, spend: 0, list: []
            },
            refreshing: true,
            loaded: false,
            count: "全部(60)"
        }
    }

    componentDidMount() {

        this.getMoneyBag((data) => {
            if (data) {
                this.setState({
                    data,
                    loaded: true,
                    refreshing: false
                })
            } else {
                this.setState({
                    loaded: true,
                    refreshing: false
                })
            }

        });

    }

    componentWillUnmount() {

    }

    //加载数据  1全部 2待服务 3已完成
    _loadData(type_id = 1) {
        // getMoneyBag()
    }

    getMoneyBag = async (callback) => {
        const self = this;
        let token = await AsyncStorage.getItem("token");
        fetch(SZ_API_URI + '/app/api/v1/wallet/query', {
            headers: {
                "token": token
            }
        }).then(res => res.json()).then(res => {
            if (res.code === 200) {
                // res.data.balance = 512.13
                callback(res.data)
            } else {
                callback()
                Alert.alert(res.msg || '查询钱包出错')
            }
        }).catch(e => {
            callback()
            Alert.alert('查询钱包出错')
        })
    }

    render() {
        if (!this.state.loaded) {
            return (
                <ActivityIndicator size="large" color="#FB8703"/>
            )
        }
        const {data} = this.state;
        const {balance, income, spend, list} = data;
        const {navigate} = this.props.navigation;
        return (
            <View style={{alignItems: "center"}}>
                <View style={styles.header}>
                    <Text style={[styles.accountTitle, {marginLeft: ScreenUtil.scaleSize(26)}]}>账户余额</Text>
                    <Text style={[styles.account, {marginLeft: ScreenUtil.scaleSize(34)}]}>{balance}</Text>
                    <View style={styles.list}>
                        <Text style={styles.list_left}>累计收入:{income}</Text>
                        <Text style={styles.list_right}>累计提现:{spend}</Text>
                    </View>
                </View>
                <View style={styles.titleLine}>
                    <Text style={{color: "#FFFFFF", fontSize: ScreenUtil.scaleSize(36), fontWeight: "bold"}}>账单明细</Text>
                    <View style={styles.titleLineBottom}>
                        <DatePicker
                            style={{width: 120, height: 40, lineHeight: 40}}
                            date={this.state.date}
                            mode="date"
                            placeholder={this.state.date}
                            format="YYYY年MM月"
                            minDate="2019-01"
                            maxDate="2024-12"
                            confirmBtnText="确定"
                            cancelBtnText="取消"
                            showIcon={false}
                            androidMode={'spinner'}
                            customStyles={{
                                dateInput: {
                                    borderWidth: 0,
                                },
                                dateText: {
                                    fontWeight: '600',
                                    fontSize: 13,
                                    color: '#fff'
                                }
                            }}
                            onDateChange={(date) => {
                                this.setState({date: date})
                            }}
                        />
                        <Image source={require("../../static/icons/bottom.png")}
                               style={{width: 15, height: 15}}/>
                    </View>
                </View>
                <FlatList
                    contentContainerStyle={{
                        alignItems: "center"
                    }}
                    data={list.list}
                    keyExtractor={(item, index) => {
                        return Math.random() + ''
                    }}
                    refreshing={this.state.refreshing}
                    onRefresh={() => {
                        // this._loadData(item.id)
                    }}
                    onEndReached={() => {

                    }}
                    ListEmptyComponent={() => {
                        return (
                            <Empty/>
                        )
                    }}
                    renderItem={({item, index}) => (
                        <View style={{
                            width: "90%",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            borderBottomWidth: 0.9,
                            borderBottomColor: "#ccc",
                            height: ScreenUtil.scaleSize(180),
                            alignItems: "center",
                            lineHeight: ScreenUtil.scaleSize(180)
                        }}>
                            <View style={{flex: 2}}>
                                <Text style={{
                                    fontSize: ScreenUtil.scaleSize(36),
                                    fontWeight: "bold"
                                }}>{item.description}</Text>
                                <Text
                                    style={{marginTop: ScreenUtil.scaleSize(10), fontSize: ScreenUtil.scaleSize(32)}}>{
                                    moment(item.createTime).format('YYYY-MM-DD HH:mm:ss')
                                }</Text>
                            </View>
                            <Text
                                style={{fontSize: ScreenUtil.scaleSize(32)}}>{item.categoryName == '充值' ? `+${item.amount}` : `-${item.amount}`}</Text>
                        </View>
                    )}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFF',
    },
    header: {
        backgroundColor: "#FFCC66",
        width: "96%",
        height: 175,
        borderRadius: 8,
        justifyContent: "space-between",
        paddingTop: 15,
        overflow: 'hidden',
        marginTop: 20
    },
    accountTitle: {
        color: "#FFF",
        fontSize: 15
    },
    account: {
        color: "#fff",
        fontSize: 30
    },
    list: {
        flexDirection: "row", justifyContent: "space-between", borderTopWidth: 0.9, borderTopColor: "#f8f3e5"
    },
    list_left: {
        height: ScreenUtil.scaleSize(80),
        lineHeight: ScreenUtil.scaleSize(80),
        textAlign: "center",
        color: "#fff",
        borderRightWidth: 0.9,
        borderRightColor: "#fff",
        width: "50%",
        fontSize: ScreenUtil.scaleSize(28)
    },
    list_right: {
        height: ScreenUtil.scaleSize(80),
        lineHeight: ScreenUtil.scaleSize(80),
        textAlign: "center", color: "#fff",
        width: "50%",
        fontSize: ScreenUtil.scaleSize(28)
    },
    titleLine: {
        flexDirection: "row",
        justifyContent: "space-between",
        height: ScreenUtil.scaleSize(120),
        lineHeight: ScreenUtil.scaleSize(120),
        backgroundColor: "rgba(0,0,0,0.7)",
        width: "100%",
        textAlign: "center",
        alignItems: "center",
        paddingHorizontal: ScreenUtil.scaleSize(30),
        marginTop: ScreenUtil.scaleSize(50)
    },
    titleLineBottom: {
        color: "#fff",
        backgroundColor: "#000",
        width: 140,
        height: 40,
        lineHeight: 40,
        textAlign: "center",
        alignItems: "center",
        borderRadius: 20,
        overflow: 'hidden'
    }
})
