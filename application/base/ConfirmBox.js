import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TouchableOpacity, Dimensions} from 'react-native';
import Popup from './Popup'
import comStyles from "../assets/styles/comStyles"
type Props = {};
const {height, width} = Dimensions.get('window');
const confirmBoxWidth = width * 0.85
export default class ConfirmBox extends Component<Props> {
    constructor(props) {
        super(props)
        this.state = {
        }
        this.title = this.props.title || '提示';
        this.content = this.props.content || '是否确定?';
        this.sureText = this.props.sureText || '确定';
        this.sureFn = this.props.sureFn || (() => {});
        this.sureColor = this.props.sureColor || '#774DF2';
        this.confirmContent = this.props.confirmContent || null;
    }
    _show() {
        this._popup._show();
    }
    render() {
        return (
            <Popup hiddenClose={true} ref={ref => (this._popup = ref)} content={(
                <View style={[comStyles.flex, styles.confirmBox]}>
                    <Text style={styles.confirmTitle} numberOfLines={1}>{this.title}</Text>
                    <Text style={styles.confirmText} numberOfLines={1}>{this.content}</Text>
                    <View style={{width: '100%'}}>{this.confirmContent}</View>
                    <Text style={styles.confirmBtn} onPress={() => {
                        this._popup._hidden();
                    }}>取消</Text>
                    <Text style={[styles.confirmBtn, {backgroundColor: this.sureColor, color: '#fff'}]} onPress={() => {
                        try {
                            this.sureFn();
                            this._popup._hidden();
                        } catch (e) {
                            this._popup._hidden();
                        }
                    }}>{this.sureText}</Text>
                </View>
            )} />
        );
    }
}

const styles = StyleSheet.create({
    confirmBox: {
        width: confirmBoxWidth,
        padding: 0,
        height: 'auto',
        borderRadius: 10,
        backgroundColor: '#ffffff',
        overflow: 'hidden',
        flexWrap: 'wrap',
    },
    confirmTitle: {
        width: '100%',
        color: '#000',
        fontSize: 18,
        fontWeight: '600',
        height: 30,
        lineHeight: 30,
        marginTop: 15,
        textAlign: 'center'
    },
    confirmText: {
        width: '100%',
        color: '#353535',
        fontSize: 13,
        height: 20,
        lineHeight: 20,
        marginBottom: 25,
        textAlign: 'center'
    },
    confirmBtn: {
        width: '50%',
        height: 50,
        backgroundColor: '#dbdbdb',
        color: '#444444',
        textAlign: 'center',
        lineHeight: 50,
        borderWidth: 0
    }
});
