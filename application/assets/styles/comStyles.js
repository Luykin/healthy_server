import {Dimensions, StyleSheet, Platform} from 'react-native';

const {height, width} = Dimensions.get('window');
const comStyles = StyleSheet.create({
    flex: {
        flexWrap: 'nowrap', //默认不换行
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
        flexDirection: 'row',
    },
    fw: {
        flexWrap: 'wrap' // 换行
    },
    commonBtn: {
        width: width * .88,
        height: 44,
        lineHeight: 44,
        textAlign: 'center',
        backgroundColor: '#0071ff',
        color: '#fff',
        fontSize: 15,
        marginLeft: 'auto',
        marginRight: 'auto',
        borderRadius: 22,
    },
    blank: {
        width: '100%',
        backgroundColor: '#f8f8f8',
        height: 10
    }
});

export default comStyles
