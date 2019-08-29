import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, ScrollView, TouchableOpacity, StatusBar, FlatList, Image} from 'react-native';
import comStyles from "../../assets/styles/comStyles";
import NavigationUtil from "../../navigator/NavigationUtil";

export default class CashSuc extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    render() {
        return (
            <View style={[comStyles.flex, comStyles.fw, {
                paddingTop: 100
            }]}>
                <Image source={require('../../static/icons/28.png')} style={styles.sucIcon}/>
                <Text style={styles.sucText}>提现成功</Text>
                <Text style={styles.moneyText}>300.00</Text>
                <Text style={styles.tipsText}>您已提现（元）</Text>
                <TouchableOpacity onPress={() => {
                    NavigationUtil.goBack();
                }}>
                    <Text style={[comStyles.commonBtn, {marginTop: 60}]}>完成</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    sucIcon: {
        width: 80,
        height: 80,
    },
    sucText: {
        width: '100%',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '600',
        lineHeight: 30
    },
    moneyText: {
        width: '100%',
        textAlign: 'center',
        fontWeight: '600',
        fontSize: 25,
        lineHeight: 80,
        paddingTop: 30,
        marginBottom: -30,
    },
    tipsText: {
        width: '100%',
        textAlign: 'center',
        color: '#999',
        fontSize: 10
    }
});
