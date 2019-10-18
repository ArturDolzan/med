import React, {Component} from 'react'
import {StyleSheet, Text, View, ImageBackground, TextInput, TouchableOpacity, Alert} from 'react-native'
import commonStyles from '../commonStyles';
import backgroundImage from '../../assets/imgs/login.jpg'
import AuthInput from '../components/AuthInput';
import axios from 'axios';
import { server, showError } from '../common';
import AsyncStorage from '@react-native-community/async-storage'
import {connect} from 'react-redux'
import {login} from '../store/actions/user'
import Loading from '../components/Loading'

class Auth extends Component {
    state = {
        stageNew: false,
        nome: 'Artur',
        email: 'artur@gmail.com',
        password: '1',
        confirmPassword: '',
        loading: false
    }

    signin = async () => {
        try {

            this.setState({loading: true})

            const res = await axios.post(`${server}/signin`, {
                email: this.state.email,
                password: this.state.password
            })
            
            if(!res.data.token) {
                this.setState({loading: false})
                Alert.alert('Ops', 'Algo deu errado =(')
                return
            }

            axios.defaults.headers.common['Authorization'] = `bearer ${res.data.token}`

            await AsyncStorage.setItem('userData', JSON.stringify(res.data))

            this.login(res.data)

            this.setState({loading: false})

            this.props.navigation.navigate('Home', res.data)

        } catch (err) {
            this.setState({loading: false})
            showError(err)
        }
    }

    signup = async () => {
        try{
            this.setState({loading: true})

            console.log(`${server}/signup`)

            await axios.post(`${server}/signup`, {
                name: this.state.nome,
                email: this.state.email,
                password: this.state.password,
                confirmPassword: this.state.confirmPassword
            })

            this.setState({loading: false})
            Alert.alert('Sucesso', 'Usuario cadastrado =)')
            this.setState({stageNew: false})
        } catch (err) {
            this.setState({loading: false})
            showError(err)
        }
    }

    signinOrSignup = () => {
        if(this.state.stageNew) {
            this.signup()
        } else {
            this.signin()
        }
    }

    login = (user) => {
        this.props.onLogin(user)
    }

    render() {

        const validations = []

        validations.push(this.state.email && this.state.email.includes('@'))
        validations.push(this.state.password)

        if(this.state.stageNew) {
            validations.push(this.state.nome && this.state.nome.trim())
            validations.push(this.state.confirmPassword)
            validations.push(this.state.password === this.state.confirmPassword)
        }

        const validForm = validations.reduce((all, v) => all && v)

        return (
            <ImageBackground source={backgroundImage} style={styles.background}>
                <Text style={styles.title}>
                    ReMed
                </Text>
                <View style={styles.formContainer}>
                    <Text style={styles.subtitle}>
                        {this.state.stageNew ? 'Crie sua conta' : 'Informe seus dados'}
                    </Text>
                    
                    {this.state.stageNew && <AuthInput icon='user' placeholder='Nome' style={styles.input}
                        value={this.state.nome} onChangeText={nome => this.setState({nome})}>
                    </AuthInput>}

                    <AuthInput icon='at' placeholder='E-Mail' style={styles.input}
                        value={this.state.email} onChangeText={email => this.setState({email})}>
                    </AuthInput>

                    <AuthInput icon='lock' secureTextEntry={true} placeholder='Senha' style={styles.input}
                        value={this.state.password} onChangeText={password => this.setState({password})}>
                    </AuthInput>

                    {this.state.stageNew && <AuthInput icon='asterisk' secureTextEntry={true} placeholder='Confirmacao' style={styles.input}
                        value={this.state.confirmPassword} onChangeText={confirmPassword => this.setState({confirmPassword})}>
                    </AuthInput>}

                    <TouchableOpacity onPress={this.signinOrSignup} disabled={!validForm || this.state.loading}>
                        <View style={[styles.button, (!validForm || this.state.loading) ? {backgroundColor: '#AAA'} : {}]}>
                            <Text style={styles.buttonText}>
                                {this.state.stageNew ? 'Registrar' : 'Entrar'}
                            </Text>
                        </View>
                    </TouchableOpacity>

                </View>

                <TouchableOpacity style={{padding: 10}} onPress={() => this.setState({stageNew: !this.state.stageNew})}>
                    <Text style={styles.buttonText}>
                        {this.state.stageNew ? 'Ja possui conta?' : 'Ainda nao possui conta?'}
                    </Text>
                </TouchableOpacity>

                {this.state.loading ? 
                    <View style={styles.containerLoading}>
                        <Loading/>
                    </View>
                    : null
                }

            </ImageBackground>
        )
    }
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        fontFamily: commonStyles.fontFamily,
        color: '#FFF',
        fontSize: 60,
        fontWeight: 'bold'
    },
    subtitle: {
        fontFamily: commonStyles.fontFamily,
        color: '#FFF',
        fontSize: 20
    },
    formContainer: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        padding: 20,
        width: '90%'
    },
    input: {
        marginTop: 10,
        backgroundColor: '#FFF'
    },
    button: {
        backgroundColor: '#080',
        marginTop: 10,
        padding: 10,
        alignItems: 'center'
    },
    buttonText: {
        fontFamily: commonStyles.fontFamily,
        color: '#FFF',
        fontSize: 20
    },
    containerLoading: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    }
})


const mapDispatchToProps = dispatch => {
    return {
        onLogin: user => dispatch(login(user))
    }
}

//export default
export default connect(null, mapDispatchToProps)(Auth)