import AsyncStorage from '@react-native-community/async-storage';
import { Icon, Picker } from 'native-base';
import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { actions as IntlAction } from '../store';
import { updateLanguage } from '../store/actions';


class LanguageSwitcher extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,

        }
    }
    _updateLanguage = (lang) => {
        this.props.updateLanguage(lang)
    };


    render() {
        const { Translate } = this.props;
        const languages = [
            { code: 'en', name: "English" },
            // { code: 'fr', name: "French" },
            { code: 'ar', name: "Arabic" },
            // { code: 'jp', name: "Japanese" },
        ];
        const options = languages.map(language => {
            return (
                <Picker.Item
                    value={language.code}
                    key={language.code}
                    label={language.name}
                />
            );
        });
        return (
            <View>
                {/* <View style={{ flex:3, borderWidth: 1, borderColor: Theme.Colors.borderColor, borderRadius: Theme.borderRadius }}> */}

                <Picker
                    placeholder="Select One"
                    placeholderStyle={{ color: "black" }}
                    selectedValue={Translate.locale}
                    style={{ width: 150, }}
                    iosIcon={<Icon name="ios-arrow-down" />}
                    onValueChange={async itemValue => {
                        this._updateLanguage(itemValue)
                        await AsyncStorage.setItem('selectedLanguage', itemValue)
                    }}
                    mode="dropdown"
                >
                    {options}
                </Picker>
            </View>

            // </View>
        );
    }
}

const mapStateToProps = (state) => ({
    Translate: state.IntlReducers
});

const mapDispatchToProps = (dispatch) => ({
    updateLanguage: (language) => dispatch(updateLanguage(language)),
    IntlAction
});


export default connect(mapStateToProps, mapDispatchToProps)(LanguageSwitcher)