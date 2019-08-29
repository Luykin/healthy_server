/*luoyukun:通用列表，更方便的使用list,不用关心page等处理*/
import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Image, Dimensions} from 'react-native';
import {ChineseNormalFooter, ChineseNormalHeader} from "react-native-spring-scrollview/Customize"
import {LargeList} from "react-native-largelist-v3"
import Empty from './Empty';

type Props = {};
const {height, width} = Dimensions.get('window');
let page = 1;
export default class ListGeneral extends Component<Props> {
    constructor(props) {
        super(props)
        this.state = {
            list: [{
                items: []
            }],
            allLoaded: false, //数据全部加载完成
            empty: null
        }
        this._list = null;
        this.num = this.props.num || 10; //默认一页10个,非必填
    }

    componentDidMount(): void {
        this._onRefresh()
    }

    componentWillUnmount(): void {
        try {
            this.setState = () => {
                return null;
            }
        } catch (e) {
            console.log(e)
        }
    }

    /*列 的每一个元素UI*/
    _renderIndexPath({section: section, row: row}) {
        const item = this.state.list[section].items[row]
        if (this.props.renderItem && typeof this.props.renderItem === 'function') {
            return this.props.renderItem(item, row);
        } else {
            return null;
        }
    }

    _netWork() {
        if (typeof this.props.getList === 'function') {
            this.props.getList(page, this.num, (results) => {
                this._enRefresh()
                /*如果网络请求的数据不存在或者为空，则表示列表数据全部加载完成*/
                if (!results || !results.length) {
                    if (page === 1) {
                        this.setState({
                            list: [{
                                items: []
                            }],
                            empty: true,
                            allLoaded: true,
                        })
                    } else {
                        this.setState({
                            empty: null,
                            allLoaded: true,
                        })
                    }
                    return false
                }
                const list = this.state.list
                let ret = results
                if (this.props.formatData && typeof this.props.formatData === 'function') {
                    if (page === 1) {
                        ret = this.props.formatData(results)
                    } else {
                        ret = [...list[0].items, ...this.props.formatData(results)]
                    }
                } else {
                    if (page === 1) {
                    } else {
                        ret = [...list[0].items, ...results]
                    }
                }
                list[0].items = ret
                this.setState({
                    list: list,
                    empty: null
                })
            })
        }
    }

    _onEndReached() {
        //EndRefresh判断是否需要上拉加载
        if (this.props.EndRefresh) {
            this._enRefresh()
        } else {
            if (!this.state.allLoaded) {
                page += 1
                this._netWork()
            }
        }
    }

    _onRefresh() {
        page = 1
        this.setState({
            allLoaded: null
        }, () => {
            this._netWork()
        })
    }

    _enRefresh() {
        if (this._list) {
            try {
                this._list.endRefresh();
                this._list.endLoading();
            } catch (e) {
                console.log(e)
            }
        }
    }

    render() {
        if (!this.props.itemHeight || !this.props.itemMarginTop) {
            return (
                <Text style={styles.error}>
                    {/*提示使用者itemHeight 或 itemMarginTop 必填*/}
                    itemHeight or itemMarginTop not in Props !
                </Text>)
        }
        if (!this.props.getList || !this.props.renderItem) {
            return (
                <Text style={styles.error}>
                    {/*提示使用者getList 或 renderItem 必填*/}
                    getList or renderItem not in Props !
                </Text>)
        }
        let listView = [];
        /*if (!this.state.list[0].items.length) {
            listView.push(
                <Empty key={'empty'}/>
            )
        } else {*/
        listView.push(
            <LargeList
                ref={ref => (this._list = ref)}
                key={'largeList'}
                style={styles.largeList}
                data={this.state.list}
                renderHeader={() => {
                    let header = [];
                    if (this.props.renderHeader) {
                        header.push(
                            <View key={'propsHeader'}>
                                {this.props.renderHeader()}
                            </View>
                        )
                    }
                    if (this.state.empty) {
                        header.push(
                            <Empty key={'empty'} width={'94%'}/>
                        )
                    }
                    return (
                        <View>
                            {header}
                        </View>
                    );
                }}
                heightForIndexPath={() => this.props.itemHeight + this.props.itemMarginTop}
                renderIndexPath={this._renderIndexPath.bind(this)}
                onRefresh={this._onRefresh.bind(this)}
                onLoading={this._onEndReached.bind(this)}
                allLoaded={this.state.allLoaded}
                refreshHeader={ChineseNormalHeader}
                loadingFooter={ChineseNormalFooter}
            />
        )
        /*    }*/
        return listView;
    }
}

const styles = StyleSheet.create({
    largeList: {
        flex: 1
    },
    error: {
        width: '100%',
        textAlign: 'center',
        height: 80,
        lineHeight: 80,
        color: '#666666'
    }
});
