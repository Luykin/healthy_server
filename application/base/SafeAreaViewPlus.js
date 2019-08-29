import React, { Component, } from 'react';
import { Platform, DeviceInfo, SafeAreaView, StyleSheet, View, ViewPropTypes } from 'react-native';
import { PropTypes } from 'prop-types';

export default class SafeAreaViewPlus extends Component {
    static propTypes = {
        ...ViewPropTypes,
        topColor: PropTypes.string,
        bottomColor: PropTypes.string,
        enablePlus: PropTypes.bool,
        topInset: PropTypes.bool,
        bottomInset: PropTypes.bool,

    };
    static defaultProps = {
        topColor: 'transparent', // 上边颜色
        bottomColor: '#f8f8f8', // 下面颜色
        enablePlus: true, //
        topInset: true, // 上面默认显示
        bottomInset: false, //  导航栏下面默认不显示
    };

    genSafeAreaViewPlus() {
        const { children, topColor, bottomColor, topInset, bottomInset } = this.props;
        return <View style={[styles.container, this.props.style]}>
            {this.getTopArea(topColor, topInset)}
            {children}
            {this.getBottomArea(bottomColor, bottomInset)}
        </View>;
    }

    genSafeAreaView() {
        return <SafeAreaView style={[styles.container, this.props.style]} {...this.props}>
            {this.props.children}
        </SafeAreaView>
    }

    getTopArea(topColor, topInset) {
        if (Platform.OS === 'ios') {
            return DeviceInfo.isIPhoneX_deprecated ? <View style={[styles.topArea, { backgroundColor: topColor }]} /> : <View style={[styles.otherTopArea, { backgroundColor:  '#ffffff'}]} />
        } else {
            return null;
        }
    }

    getBottomArea(bottomColor, bottomInset) {
        return !DeviceInfo.isIPhoneX_deprecated || !bottomInset ? null
            : <View style={[styles.bottomArea, { backgroundColor: bottomColor }]} />;
    }

    render() {
        const { enablePlus } = this.props;
        return enablePlus ? this.genSafeAreaViewPlus() : this.genSafeAreaView();
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    otherTopArea: {
        height: 25,
    },
    topArea: {
        height: 44,
    },
    bottomArea: {
        height: 34,
    }
});
