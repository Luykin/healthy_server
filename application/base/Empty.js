import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Image, Dimensions} from 'react-native';
type Props = {};
const {height, width} = Dimensions.get('window');
export default class Empty extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
        };
        this.width = this.props.width || '100%';
    }
    render() {
        return (
            <View style={[styles.emptyWarp, {width: this.width}]}>
                <Text style={{width: width, textAlign: 'center', marginTop: 10, color: '#ccc'}}>暂时没有数据</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    emptyWarp: {
        width: '100%',
        justifyContent: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginLeft: 'auto',
        marginRight: 'auto',
        height: 200,
        backgroundColor: '#ffffff',
    },
});
