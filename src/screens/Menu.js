import React, {Component} from 'react'
import {StyleSheet, Text, View, ScrollView, TouchableOpacity} from 'react-native'
import {Gravatar} from 'react-native-gravatar'
import { DrawerItems } from 'react-navigation';
import commonStyles from '../commonStyles';
import AsyncStorage from '@react-native-community/async-storage'
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome'
import {connect} from 'react-redux'

class Menu extends Component {

    logout = async () => {
        delete axios.defaults.headers.common['Authorization']

        await AsyncStorage.removeItem('userData')

        this.props.navigation.navigate('Loading')
    }

    render() {
        return (
            <ScrollView>
                <View style={styles.header}>
                    <Text style={styles.title}>
                        Tasks
                    </Text>

                    <Gravatar style={styles.avatar} options={{
                            email: this.props.email,
                            secure: true
                        }}>

                    </Gravatar>

                    <View style={styles.userInfo}>
                        <View>
                            <Text style={styles.name}>
                                {this.props.name}
                            </Text>

                            <Text style={styles.email}>
                                {this.props.email}
                            </Text>
                        </View>
                    </View>
                    <TouchableOpacity onPress={this.logout}>
                        <View style={styles.logoutIcon}>
                            <Icon name='sign-out' size={30} color='#800'></Icon>
                        </View>
                    </TouchableOpacity>
                </View>
                <DrawerItems {...this.props}></DrawerItems>
            </ScrollView>
        ) 
    }
        
}

const styles = StyleSheet.create({
    header: {
        borderBottomWidth: 1,
        borderColor: '#DDD'
    },
    title: {
        backgroundColor: '#FFF',
        color: '#000',
        fontFamily: commonStyles.fontFamily,
        fontSize: 30,
        paddingTop: 20,
        padding: 10
    },
    avatar: {
        width: 60,
        height: 60,
        borderWidth: 3,
        borderColor: '#AAA',
        borderRadius: 30,
        margin: 10
    },
    name: {
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.mainText,
        fontSize: 20,
        marginLeft: 10
    },
    email: {
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.subText,
        fontSize: 15,
        marginLeft: 10,
        marginBottom: 10
    },
    menu: {
        justifyContent: 'center',
        alignItems: 'stretch'
    },
    userInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    logoutIcon: {
        justifyContent: 'center',
        alignItems: 'flex-end',
        marginRight: 10
    }
})

const mapStateToProps = ({user}) => {
    
    return {
        email: user.email,
        name: user.name
    }
}

//export default
export default connect(mapStateToProps, null)(Menu)