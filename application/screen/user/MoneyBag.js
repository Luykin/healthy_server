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
import {walletQuery} from "../../api";
import {timeformat, YYMM} from "../../util/util";

export default class MoneyBag extends Component {
    constructor(props) {
        super(props);
        this.state = {
            date: YYMM(+new Date()),
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
            this._afterGet(data);
        });

    }

    _afterGet(data) {
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
    }

    componentWillUnmount() {

    }

    //加载数据  1全部 2待服务 3已完成
    _loadData(type_id = 1) {
        // getMoneyBag()
    }

    getMoneyBag = async (callback) => {
        const ret = await walletQuery(1, 10, '提现', `${this.state.date + '-01 00:00:00'}`, `${this.state.date + '-29 59:00:00'}`);
        if (ret.code === 200) {
            callback(ret.data)
        } else {
            callback();
            Alert.alert(ret.msg || '查询钱包出错')
        }
    };

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
                    <Text style={{color: "#FFFFFF", fontSize: 15, fontWeight: "bold"}}>账单明细</Text>
                    <View style={styles.titleLineBottom}>
                        <DatePicker
                            style={{width: 120, height: 40,}}
                            date={this.state.date}
                            mode="date"
                            placeholder={this.state.date}
                            format="YYYY年MM月"
                            minDate="2019-01"
                            maxDate="2024-12"
                            confirmBtnText="确定"
                            cancelBtnText="取消"
                            showIcon={false}
                            androidMode={'default'}
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
                                this.setState({
                                    date: date.replace('年', '-').replace('月', '')
                                }, () => {
                                    this.getMoneyBag((data) => {
                                        this._afterGet(data);
                                    });
                                })
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
                            borderBottomColor: "#eee",
                            height: ScreenUtil.scaleSize(180),
                            alignItems: "center",
                            lineHeight: ScreenUtil.scaleSize(180)
                        }}>
                            <View style={{flex: 2}}>
                                <Text style={{
                                    fontSize: 15,
                                    fontWeight: "bold"
                                }}>{item.description || '钱包提现'}</Text>
                                <Text
                                    style={{marginTop: 10, fontSize: 12, color: '#999'}}>{
                                    moment(item.createTime).format('YYYY-MM-DD HH:mm:ss')
                                }</Text>
                            </View>
                            <Text
                                style={{fontSize: 16}}>{item.categoryName === '充值' ? `+${item.amount}` : `-${item.amount}`}</Text>
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
