import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Dimensions,
    ActivityIndicator,
    DeviceEventEmitter,
    TouchableOpacity,
    StatusBar, Modal
} from 'react-native';
import comStyles from "../assets/styles/comStyles"

const {width, height} = Dimensions.get('window');
let loadingTimer = null;
const delayed = 350; //loading 显示时间 350ms
let timerClose = null;
export default class Loading extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false
        }
    }

    show(time = 300) {
        if (Platform.OS === 'ios') {
            return false;
        }
        // 大于10m, 或者time 为 ‘hide’ 表示不显示loading
        if (time === 'hide') {
            return false
        }
        if (time < 10000 && !loadingTimer) {
            try {
                if (loadingTimer) {
                    clearTimeout(loadingTimer);
                    loadingTimer = null;
                }
                loadingTimer = setTimeout(() => {
                    this.setState({
                        show: true
                    }, () => {
                        clearTimeout(loadingTimer);
                        loadingTimer = null
                    });
                }, Number(time) || delayed)
            } catch (e) {
                console.log(e)
            }
        }
    }

    hide() {
        if (!this.state.show) {
            clearTimeout(loadingTimer);
            loadingTimer = null;
            console.log('model 已被关闭', this.state.show);
            return false;
        }
        this.setState({
            show: false
        }, () => {
            clearTimeout(loadingTimer);
            loadingTimer = null;
        })
    }

    render() {
        return (
            <Modal visible={this.state.show} transparent={true} animationType={'fade'} onRequestClose={() => {
            }} hardwareAccelerated={true} presentationStyle={'overFullScreen'} style={styles.model}>
                <TouchableOpacity style={[comStyles.flex, styles.LoadingPage]} onPress={() => {
                    try {
                        this.hide();
                    } catch (err) {
                        console.log(err)
                    }
                }}>
                    <View style={{
                        width: 100,
                        height: 100,
                        backgroundColor: "rgba(0,0,0,0.5)",
                        opacity: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 8
                    }}>
                        <ActivityIndicator size="large" color="#FFF"/>
                        <Text style={{color: "#FFF", marginTop: 10}}>请稍后</Text>
                    </View>
                </TouchableOpacity>
            </Modal>
        );
    }

    // 在界面渲染之前监听 loading 事件
    componentWillMount(): void {
        console.log('全局监听loading')
        this.loadShow = DeviceEventEmitter.addListener('loadShow', (time) => {
            this.show(time)
        })
        this.loadHide = DeviceEventEmitter.addListener('loadHide', () => {
            this.hide()
        })
    }

    componentWillUnmount() {
        try {
            /*清空事件监听, 清除定时器*/
            this.loadShow.remove();
            this.loadHide.remove();
            clearTimeout(loadingTimer);
            loadingTimer = null;
            this.setState({
                show: false
            });
            this.setState = () => {
                return null;
            }
        } catch (e) {
            console.log(e)
        }
    }
}

const styles = StyleSheet.create({
    LoadingPage: {
        width: width,
        height: height,
    },
    model: {
        width: width,
        height: height,
    }
});
