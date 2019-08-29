import React, {Component} from 'react';
import {Image, Dimensions, View} from 'react-native';

const {height, width} = Dimensions.get('window');
type Props = {};
export default class ImgAuto extends Component<Props> {
    constructor(props) {
        super(props)
        this.state = {
            width: this.props.width || width,
            httpsUrl: this.props.url,
            height: 0
        }
        /* this.url = this.props.url;*/
        this.borderRadius = this.props.borderRadius || 0;
        this.onError = this.props.onError || (() => {
        });
        this.resizeMethod = this.props.resizeMethod || 'scale';
        /*resize: 在图片解码之前，使用软件算法对其在内存中的数据进行修改。当图片尺寸比容器尺寸大得多时，应该优先使用此选项。
        scale: 对图片进行缩放。和resize相比，scale速度更快（一般有硬件加速），而且图片质量更优。在图片尺寸比容器尺寸小或者只是稍大一点时，应该优先使用此选项。*/
    }

    componentDidMount(): void {
        if (this.state.httpsUrl && this.state.httpsUrl.indexOf('https://') < 0) {
            try {
                this.setState({
                    httpsUrl: this.state.httpsUrl.replace('http://', 'https://')
                }, () => {
                    this._getSize(this.state.httpsUrl)
                })
            } catch (e) {
                console.log(e)
            }
        } else {
            this._getSize(this.state.httpsUrl)
        }
    }

    componentWillUnmount(): void {
        this.setState = () => {
            return null;
        }
    }

    _getSize(url) {
        if(!url) {
            return false;
        }
        Image.getSize(url, (width, height) => {
            this.setState({
                height: this.state.width * (height / width)
            })
        });
    }

    render() {
        if (this.state.httpsUrl) {
            return (
                <Image resizeMode={'cover'} onError={this.onError} resizeMethod={this.resizeMethod}
                       source={{uri: this.state.httpsUrl}} style={{
                    width: this.state.width,
                    height: this.state.height,
                    borderRadius: this.borderRadius, ...this.props.imgStyle
                }}/>
            );
        } else {
            return null;
        }
    }
}
