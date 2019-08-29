import React, {Component} from 'react';
import {Modal, View, StyleSheet, TouchableOpacity, Dimensions} from 'react-native';

const {height, width} = Dimensions.get('window');
import comStyles from '../assets/styles/comStyles'
import ImgAuto from "./ImgAuto";


let TIMER = null;
export default class Popup extends Component<Props> {
    constructor(props) {
        super(props)
        this.state = {
            display: false,
        }
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

    _show() {
        this.setState({
            display: true
        })
    }

    _hidden() {
        if (this.props.onClose && typeof this.props.onClose === 'function') {
            this.props.onClose()
        }
        this.setState({
            display: false
        })
    }

    _renderClose() {
        if (this.props.hiddenClose) {
            return null;
        }
        return (
            <TouchableOpacity style={[comStyles.flex, styles.closeIcon]} activeOpacity={1}
                              onPress={() => {
                                  this._hidden.call(this)
                              }}>
                <ImgAuto url={'https://ali.rn.onlinejx.cn/close.png'} width={30}/>
            </TouchableOpacity>
        )
    }

    render() {
        if (this.state.display && this.props.content) {
            return (
                <Modal transparent={true} visible={this.state.display} animationType={'fade'} onRequestClose={() => {
                }} hardwareAccelerated={true} presentationStyle={'overFullScreen'} style={styles.model}>
                    <TouchableOpacity style={[comStyles.flex, styles.inner]} activeOpacity={1} onPress={() => {
                        if (this.props.close) {
                            this._hidden.call(this)
                        }
                    }}>
                        <View>
                            {this.props.content}
                            {this._renderClose.call(this)}
                        </View>
                    </TouchableOpacity>
                </Modal>
            );
        } else {
            return null;
        }
    }
}

const styles = StyleSheet.create({
    model: {
        width: width,
        height: height,
    },
    inner: {
        backgroundColor: 'rgba(0,0,0,.8)',
        flex: 1
    },
    closeIcon: {
        width: '100%',
        position: 'absolute',
        bottom: -45,
        left: 0
    }
});
