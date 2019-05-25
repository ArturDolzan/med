import React, {Component} from 'react'
import {StyleSheet, View, ActivityIndicator} from 'react-native'
import axios from 'axios';
import {connect} from 'react-redux'
import AsyncStorage from '@react-native-community/async-storage'
import {login} from '../store/actions/user'

class AuthOrApp extends Component {
    componentWillMount = async () => {
        const json = await AsyncStorage.getItem('userData')
        const userData = JSON.parse(json) || {}

        if(userData.token) {
            axios.defaults.headers.common['Authorization'] = `bearer ${userData.token}`

            this.login(userData)

            this.props.navigation.navigate('Home', userData)
        } else {
            this.props.navigation.navigate('Auth')
        }
    }

    login = (user) => {
        this.props.onLogin(user)
    }

    render() {
        return (
            <View style={styles.container}>
                <ActivityIndicator size='large'></ActivityIndicator>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black'
    }
})

const mapDispatchToProps = dispatch => {
    return {
        onLogin: user => dispatch(login(user))
    }
}

//export default
export default connect(null, mapDispatchToProps)(AuthOrApp)