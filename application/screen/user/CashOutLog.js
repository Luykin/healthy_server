import React, {Component} from 'react';
import {Picker, StyleSheet, Text, View, ScrollView, TouchableOpacity, StatusBar, FlatList, Image} from 'react-native';
import ListGeneral from "../../base/ListGeneral";
import {walletQuery} from "../../api";
import DatePicker from "react-native-datepicker";
import comStyles from "../../assets/styles/comStyles";

const ITEM_HEIGHT = 60;
const ITEM_MARGIN_TOP = 1;
const HEADER_HEIGHT = 60;
export default class CashOutLog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            date: "2016-05"
        }
    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    _renderHeader() {
        return (
            <View>header</View>
        )
    }

    _renderIndexPath({section: section, row: row}) {
        const item = this.state.list[section].items[row];
        return (
            <View>
                <TouchableOpacity style={[{height: ITEM_HEIGHT, marginTop: ITEM_MARGIN_TOP}]}>
                    <Text>{row}</Text>
                </TouchableOpacity>
            </View>
        )
    };

    render() {
        return (
            <View style={styles.container}>
                <View style={[comStyles.flex, styles.colHeader]}>
                    {/*<View>*/}
                    {/*    <DatePicker*/}
                    {/*        style={{width: 120, height: 40, lineHeight: 40}}*/}
                    {/*        date={this.state.date}*/}
                    {/*        mode="date"*/}
                    {/*        placeholder={this.state.date}*/}
                    {/*        format="YYYY年MM月"*/}
                    {/*        minDate="2019-01"*/}
                    {/*        maxDate="2024-12"*/}
                    {/*        confirmBtnText="确定"*/}
                    {/*        cancelBtnText="取消"*/}
                    {/*        showIcon={false}*/}
                    {/*        androidMode={'spinner'}*/}
                    {/*        customStyles={{*/}
                    {/*            dateInput: {*/}
                    {/*                borderWidth: 0,*/}
                    {/*            },*/}
                    {/*            dateText: {*/}
                    {/*                fontWeight: '600',*/}
                    {/*                fontSize: 15,*/}
                    {/*                color: '#353535'*/}
                    {/*            }*/}
                    {/*        }}*/}
                    {/*        onDateChange={(date) => {*/}
                    {/*            this.setState({date: date})*/}
                    {/*        }}*/}
                    {/*    />*/}
                    {/*</View>*/}
                </View>
                {/*<Picker*/}
                {/*    selectedValue={this.state.language}*/}
                {/*    style={{ height: 50, width: 100 }}*/}
                {/*    onValueChange={(itemValue, itemIndex) => this.setState({language: itemValue})}>*/}
                {/*    <Picker.Item label="Java" value="java" />*/}
                {/*    <Picker.Item label="JavaScript" value="js" />*/}
                {/*</Picker>*/}
                <ListGeneral
                    style={{flex: 1}}
                    ref={(ref) => {
                        this[`_list`] = ref
                    }}
                    formatData={(results) => {
                        return results
                    }}
                    itemHeight={ITEM_HEIGHT} //每一项的高度
                    itemMarginTop={ITEM_MARGIN_TOP} //每一项的marginTop
                    getList={async (page, num, callback) => {
                        const ret = await walletQuery(page, num);
                        console.log(ret);
                        if (ret.code === 200) {
                            callback(ret.data.list.list);
                        } else {
                            callback()
                        }
                    }} //获取列表的api
                    renderItem={(item) => {
                        return (
                            <View>
                                <TouchableOpacity activeOpacity={.9}>
                                    <Text>1</Text>
                                </TouchableOpacity>
                            </View>
                        )
                    }} //渲染每一项的UI
                />
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    colHeader: {
        height: HEADER_HEIGHT,
        backgroundColor: '#f8f8f8',
        justifyContent: 'flex-start'
    },
});
