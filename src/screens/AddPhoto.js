import React, {Component} from 'react'
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Image,
    Dimensions,
    Platform,
    ScrollView,
    Alert
} from "react-native"
import ImagePicker from 'react-native-image-picker'
import Icon from 'react-native-vector-icons/FontAwesome'
import axios from 'axios';
import { server, showError } from '../common';

class AddPhoto extends Component {
    state = {
        image: null
    }

    pickImage = () => {
        ImagePicker.showImagePicker({
            title: 'Tire a foto do ReMed =)',
            maxHeight: 600,
            maxWidth: 800
        }, res => {
            if(!res.didCancel){
                this.setState({image: {uri: res.uri, base64: res.data}})
            }
        })
    }

    save = async () => {

        const image = this.state.image.base64

        try {
            await axios.post(`${server}/tasks/${this.props.navigation.getParam('id')}/uploadPhoto/`, {
                photo: image
            })

            Alert.alert('Imagem', 'Foto salva com sucesso!')
            
        } catch (err) {
            showError(err)
        }

        this.voltar()
    }

    voltar = () => {
        this.props.navigation.navigate('Home')
    }

    loadPhoto = async () => {
        try {
            const res = await axios.get(`${server}/tasks/${this.props.navigation.getParam('id')}/downloadPhoto/`)
            
            const url = 'data:image/jpg;base64,' + res.data[0].image_url

            this.setState({image: {uri: url, base64: res.data[0].image_url}})
  
        } catch (err) {
            showError(err)
        }
    }

    componentDidMount = () => {
        this.loadPhoto()
    }

    render() {
        return (
            <ScrollView>

                <View style={styles.titleContainer}>

                    <TouchableOpacity onPress={this.voltar} >

                        <Icon name='arrow-left' size={20} color='#888'></Icon>
                    </TouchableOpacity>

                    <Text style={styles.title}>
                        Foto ReMed
                    </Text>
                </View>

                <View style={styles.container}>

                    <View style={styles.imageContainer}>
                        <Image source={this.state.image} style={styles.image}>

                        </Image>
                    </View>

                    <TouchableOpacity onPress={this.pickImage} style={styles.buttom}>
                        <Icon name='camera' size={40} color='green'></Icon>
                    </TouchableOpacity>

                    <View style={styles.botContainer}>
                        <TouchableOpacity onPress={this.save}  
                            disabled={this.state.image === null ? true : false} style={styles.buttom}>
                            
                            <Icon name='save' size={40} color='black'></Icon>
                        </TouchableOpacity>

                    </View>
                    

                </View>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    },

    titleContainer: {
        marginTop: Platform.OS === 'ios' ? 30 : 10,
        marginHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },

    botContainer: {
        justifyContent: 'center',
        flexDirection: 'row'
    },

    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 30
    },

    imageContainer: {
        width: '90%',
        height: Dimensions.get('window').width * 3 /4,
        backgroundColor: '#EEE',
        marginTop: 10
    },

    image: {
        width: '100%',
        height: Dimensions.get('window').width * 3 / 4,
        resizeMode: 'center'
    },

    buttom: {
        marginTop: 30,
        padding: 10
    },

    buttomText: {
        fontSize: 20,
        color: '#FFF'
    },

    input: {
        marginTop: 20,
        width: '90%'
    }
})

export default AddPhoto