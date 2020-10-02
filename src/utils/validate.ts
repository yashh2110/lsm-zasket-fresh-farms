/**
 * Created by PanJiaChen on 16/11/18.
 */
import AsyncStorage from '@react-native-community/async-storage';
import { Toast } from "native-base";
import React from 'react';
import { Component } from 'react'

export class Validation {

    // Toast.show({
    //     text: error.response.data.message,
    //     type: "danger",
    //     buttonText: "Okay",
    //     buttonStyle: { backgroundColor: "#a52f2b" },
    //     duration: 3000
    // })
    /**
     * @param {string} email
     * @returns {Boolean}
     */

    CapitalizeFirstLetter = (str: any) => {
        return str.length ? str.charAt(0).toUpperCase() + str.slice(1) : str
    }


    timeFormatConvert = (time: any) => {
        // Check correct time format and split into components
        time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

        if (time.length > 1) { // If time format correct
            time = time.slice(1); // Remove full string match value
            time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
            time[0] = +time[0] % 12 || 12; // Adjust hours
        }
        return time.join(''); // return adjusted time or original string
    }


    validEmail(email: string) {
        const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return reg.test(email)
    }

    aadharNumber(number: string) {
        const reg = /^\d{4}\d{4}\d{4}$/
        return reg.test(number)
    }

    panNumber(number: string) {
        const reg = /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/
        return reg.test(number)
    }

    /**
     * @param {string} password
     * @returns {Boolean}
     */
    validPassword(password: string) {
        const reg = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/
        return reg.test(password)
    }

    /**
     * @param {string} path
     * @returns {Boolean}
     */
    isExternal(path: string) {
        return /^(https?:|mailto:|tel:)/.test(path)
    }

    /**
     * @param {string} str
     * @returns {Boolean}
     */
    validUsername(str: { trim: () => string; }) {
        const valid_map = ['admin', 'editor']
        return valid_map.indexOf(str.trim()) >= 0
    }

    /**
     * @param {string} url
     * @returns {Boolean}
     */
    validURL(url: string) {
        const reg = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
        return reg.test(url)
    }

    /**
     * @param {string} str
     * @returns {Boolean}
     */
    validLowerCase(str: string) {
        const reg = /^[a-z]+$/
        return reg.test(str)
    }

    /**
     * @param {string} str
     * @returns {Boolean}
     */
    validUpperCase(str: string) {
        const reg = /^[A-Z]+$/
        return reg.test(str)
    }

    /**
     * @param {string} str
     * @returns {Boolean}
     */
    validAlphabets(str: string) {
        const reg = /^[A-Za-z]+$/
        return reg.test(str)
    }

    isNumber = (str: string) => {
        var pattern = /^\d+$/;
        return pattern.test(str);  // returns a boolean
    }

    /**
     * @param {string} str
     * @returns {Boolean}
     */
    isString(str: any) {
        if (typeof str === 'string' || str instanceof String) {
            return true
        }
        return false
    }

    /**
     * @param {Array} arg
     * @returns {Boolean}
     */
    isArray(arg: any) {
        if (typeof Array.isArray === 'undefined') {
            return Object.prototype.toString.call(arg) === '[object Array]'
        }
        return Array.isArray(arg)
    }
    // validatePassword(password?: string) {
    //     var p = password
    //     try {
    //         if (p!.length == 0) {
    //             let validationMessage: string = "Please enter the password"
    //             return validationMessage
    //         } else if (p!.length < 8) {
    //             let validationMessage: string = "Your password must be at least 8 characters"
    //             return validationMessage
    //         } else if (p!.search(/[a-z]/i) < 0) {
    //             let validationMessage: string = "Your password must contain at least one letter"
    //             return validationMessage
    //         } else if (p!.search(/[A-Z]/i) < 0) {
    //             let validationMessage: string = "Your password must contain at least one upper case"
    //             return validationMessage
    //         } else if (p!.search(/[0-9]/) < 0) {
    //             let validationMessage: string = "Your password must contain at least one digit"
    //             return validationMessage
    //         } else if (p!.search(/[!@#$ %^&*]/) < 0) {
    //             let validationMessage: string = "Your password must contain at least one special character"
    //             return validationMessage
    //         } else {
    //             return true
    //         }
    //     } catch  {
    //         return false
    //     }
    // }
}





