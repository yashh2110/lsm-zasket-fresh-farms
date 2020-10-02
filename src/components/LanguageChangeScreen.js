
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { connect } from 'react-redux';
import LanguageSwitcher from '../i18n/component/languageSwitcher';
import { updateLanguage } from '../i18n/store/actions';

const LanguageChangeScreen = (props) => {
    const { Translate } = props;
    return (
        <View style={styles.container}>
            <LanguageSwitcher />
            <Text>{Translate.messages['hello']}</Text>
        </View>
    )
}

const mapStateToProps = state => ({
    Translate: state.IntlReducers
});

export default connect(mapStateToProps, { updateLanguage: (language) => dispatch(updateLanguage(language)) })(LanguageChangeScreen);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});