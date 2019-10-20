import React, {Component} from 'react'
import {StyleSheet, Text, View, TouchableOpacity, Alert} from 'react-native'
import commonStyles from '../commonStyles'

class Heart extends Component {

    clickTemQueVe = () => {

        Alert.alert("Tem que vê")
    }

    render() {
        
        return (

            <View style={styles.background}>

                <TouchableOpacity style={styles.button} onPress={() => this.clickTemQueVe()}>
                    <Text style={styles.title}>
                        Tem que vê
                    </Text>
                </TouchableOpacity>
            </View>
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
        color: 'white',
        fontSize: 60,
        fontWeight: 'bold'
    },
    button: {
        backgroundColor: 'black',
        marginTop: 10,
        padding: 10,
        alignItems: 'center'
    }
})

export default Heart