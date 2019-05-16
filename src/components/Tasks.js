import React from 'react'
import {StyleSheet, Text, View, TouchableWithoutFeedback, TouchableOpacity, Alert} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import moment from 'moment'
import 'moment/locale/pt-br'
import commonStyles from '../commonStyles';
import Swipeable from 'react-native-swipeable'

export default props => {
    let check = null

    if(props.doneAt !== null) {
        check = (
            <View style={styles.done}>
                <Icon name='check' size={20} color={commonStyles.colors.secondary}>
                </Icon>
            </View>
        )
    }else {
        check = (
            <View style={styles.pending}>
                
            </View>
        )
    }

    const descStyle = props.doneAt !== null ? {textDecorationLine: 'line-through'} : {}

    const leftContent = (
        <View style={styles.exclude}>
            <Icon name='trash' size={20} color='#FFF'></Icon>
            <Text style={styles.excludeText}>
                Excluir
            </Text>
        </View>
    )

    const rightContent = [
        <TouchableOpacity style={[styles.exclude, {justifyContent: 'flex-start', paddingLeft: 20}]} 
            onPress={() => props.onDelete(props.id)}>
            <Icon name='trash' size={30} color='#FFF'></Icon>
        </TouchableOpacity>
    ]

    return (
        <Swipeable leftActionActivationDistance={200} 
            onLeftActionActivate={() => props.onDelete(props.id)}
            leftContent={leftContent} rightButtons={rightContent}>
            <View style={styles.container}>
                <View style={styles.container1}>
                    <TouchableWithoutFeedback onPress={() => props.toggleTask(props.id)}>
                        <View style={styles.checkContainer}>
                            {check}
                        </View>
                    </TouchableWithoutFeedback>
                    <View>
                        <Text style={[styles.description, descStyle]}>{props.desc}</Text>
                        <Text style={styles.date}>{moment(props.estimateAt).locale('pt-br').format('ddd, D [de] MMMM [de] YYYY')}</Text>
                    </View>
                </View>
                <View style={styles.photo}>
                    <TouchableOpacity onPress={() => props.onPhoto(props.id)}>
                        <Icon name='camera' size={25} color='red'></Icon>
                    </TouchableOpacity>
                </View>
            </View>
        </Swipeable>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 10,
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor : '#AAA',
        justifyContent: 'space-between'
    },

    container1: {
        justifyContent: 'flex-start',
        flexDirection: 'row',
    },

    photo: {
        justifyContent: 'flex-end',
        flexDirection: 'row',
        paddingTop: 6,
        paddingRight: 10
    },

    checkContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '20%'
    },

    pending: {
        borderWidth: 1,
        height: 25,
        width: 25,
        borderRadius: 15,
        borderColor: '#555'
    },

    done: {
        height: 25,
        width: 25,
        borderRadius: 15,
        backgroundColor: '#4d7031',
        alignItems: 'center',
        justifyContent: 'center'
    },

    description: {
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.mainText,
        fontSize: 15
    },

    date: {
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.subText,
        fontSize: 12
    },

    exclude: {
        flex: 1,
        backgroundColor: 'red',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center'
    },

    excludeText: {
        fontFamily: commonStyles.fontFamily,
        color: '#FFF',
        fontSize: 20,
        margin: 10
    }
})