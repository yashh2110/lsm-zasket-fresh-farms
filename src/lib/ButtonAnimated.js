import React from 'react';
import { StyleSheet, TouchableWithoutFeedback, Animated, ActivityIndicator, View, Text } from 'react-native';
import PropTypes from 'prop-types';
export default class Component extends React.PureComponent {
    static propTypes = {
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired,
        title: PropTypes.string,
        titleColor: PropTypes.string,
        titleFontFamily: PropTypes.string,
        titleFontSize: PropTypes.number,
        backgroundColor: PropTypes.string,
        borderWidth: PropTypes.number,
        borderRadius: PropTypes.number,
        activityIndicatorColor: PropTypes.string,
        onPress: PropTypes.func.isRequired,
        customStyles: PropTypes.object
    };

    static defaultProps = {
        title: 'Button',
        titleColor: 'white',
        backgroundColor: 'gray',
        activityIndicatorColor: 'white',
        borderRadius: 0,
        customStyles: {},
    };

    constructor(props) {
        super(props);

        this.state = {
            showLoading: false
        };

        this.loadingValue = {
            width: new Animated.Value(props.width),
            borderRadius: new Animated.Value(props.borderRadius),
            opacity: new Animated.Value(1)
        };
    }

    showLoading(showLoading) {
        if (showLoading) {
            this._loadingAnimation(this.props.width, this.props.height, this.props.borderRadius, this.props.height / 2, 1, 0);
            this.setState({ showLoading: showLoading });
        } else {
            setTimeout(() => {
                this._loadingAnimation(this.props.height, this.props.width, this.props.height / 2, this.props.borderRadius, 0, 1);
                this.setState({ showLoading: showLoading });
            }, 1000);
        }
    }

    _loadingAnimation(widthStart, widthEnd, borderRadiusStart, borderRadiusEnd, opacityStart, opacityEnd) {
        if (this.loadingValue.width._value !== widthEnd) {
            this.loadingValue.width.setValue(widthStart);
            this.loadingValue.opacity.setValue(opacityStart);
            this.loadingValue.borderRadius.setValue(borderRadiusStart);

            Animated.timing(this.loadingValue.width, {
                toValue: widthEnd,
                duration: 300
            }).start();

            Animated.timing(this.loadingValue.borderRadius, {
                toValue: borderRadiusEnd,
                duration: 300
            }).start();

            Animated.timing(this.loadingValue.opacity, {
                toValue: opacityEnd,
                duration: 200
            }).start();
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <TouchableWithoutFeedback onPress={!this.state.showLoading ? this.props.onPress : null}>
                    <Animated.View
                        style={[
                            styles.containerButton,
                            {
                                width: this.loadingValue.width,
                                height: this.props.height,
                                backgroundColor: this.props.backgroundColor,
                                borderWidth: this.props.borderWidth,
                                borderRadius: this.loadingValue.borderRadius
                            }, {
                                shadowColor: "#000",
                                shadowOffset: {
                                    width: 0,
                                    height: 1,
                                },
                                shadowOpacity: 0.20,
                                shadowRadius: 1.41,
                                elevation: 2,
                            }
                        ]}
                    >
                        {this.state.showLoading ? this._renderIndicator() : this._renderTitle()}
                    </Animated.View>
                </TouchableWithoutFeedback>
            </View>
        );
    }

    _renderTitle() {
        return (
            <Animated.Text
                style={[
                    styles.buttonText,
                    {
                        opacity: this.loadingValue.opacity,
                        color: this.props.titleColor,
                        fontFamily: this.props.titleFontFamily,
                        fontSize: this.props.titleFontSize
                    },
                    { ...this.props.customStyles }
                ]}
            >
                {this.props.title}
            </Animated.Text>
        );
    }

    _renderIndicator() {
        return <ActivityIndicator color={this.props.activityIndicatorColor} />;
    }
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center'
    },
    containerButton: {
        justifyContent: 'center'
    },
    buttonText: {
        backgroundColor: 'transparent',
        textAlign: 'center'
    }
});