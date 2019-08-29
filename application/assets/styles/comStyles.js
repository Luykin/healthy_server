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
    }
});

export default comStyles
