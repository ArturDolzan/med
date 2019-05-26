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
import Loading from '../components/Loading'

class AddPhoto extends Component {
    state = {
        image: null,
        isLoading: false,
        newPhoto: false
    }

     AsyncAlert = async () => new Promise((resolve) => {
        Alert.alert(
          'Imagem',
          'Foto salva com sucesso!',
          [
            {
              text: 'Ok',
              onPress: () => {
                resolve('YES');
                this.voltar()
              },
            },
          ],
          { cancelable: false },
        );
      });

    pickImage = () => {
        ImagePicker.showImagePicker({
            title: 'Tire a foto do ReMed =)',
            maxHeight: 600,
            maxWidth: 800
        }, res => {
            if(!res.didCancel){
                this.setState({image: {uri: res.uri, base64: res.data}, newPhoto: true})
            }
        })
    }

    save = async () => {

        const image = this.state.image.base64

        try {
            this.setState({isLoading: true})

            await axios.post(`${server}/tasks/${this.props.navigation.getParam('id')}/uploadPhoto/`, {
                photo: image
            })

            this.setState({isLoading: false})

            this.voltar()
            //this.AsyncAlert()
            
        } catch (err) {
            showError(err)
        } 
    }

    voltar = () => { 
        this.props.navigation.navigate('Home')
    }

    loadPhoto = async () => {
        try {
            this.setState({isLoading: true})

            const res = await axios.get(`${server}/tasks/${this.props.navigation.getParam('id')}/downloadPhoto/`)

            const newPhoto = res.data[0].image_url ? true : false

            const url = 'data:image/jpg;base64,' + res.data[0].image_url

            this.setState({image: {uri: url, base64: res.data[0].image_url}, newPhoto, isLoading: false}) 
  
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

                <View style={styles.container}>

                    <View style={styles.imageContainer}>   
                        <Image source={this.state.image} style={styles.image}>
                            
                        </Image>
                    </View>

                    <View style={styles.botContainer}>

                        <TouchableOpacity onPress={this.pickImage} style={styles.buttom}>
                            <Icon name='camera' size={40} color='red' ></Icon>
                        </TouchableOpacity> 

                        {this.state.newPhoto ? 
                            <TouchableOpacity onPress={this.save} style={styles.buttom}>
                                
                                <Icon name='check' size={40} color='green'></Icon>
                            </TouchableOpacity>
                        : 
                            null
                        }

                    </View>

                </View>
                {this.state.isLoading ? 
                    <View style={styles.containerLoading}>
                        <Loading/>
                    </View>
                    : null
                }
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    },

    containerLoading: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },

    cam: {
        position: 'absolute',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },

    titleContainer: {
        marginTop: Platform.OS === 'ios' ? 35 : 15,
        marginHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 15
    },

    botContainer: {
        justifyContent: 'center',
        flexDirection: 'row'
    },

    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000'
    },

    imageContainer: {
        width: '90%',
        height: Dimensions.get('window').width * 3 /3.2,
        backgroundColor: '#EEE',
        marginTop: 10
    },

    image: {
        width: '100%',
        height: Dimensions.get('window').width * 3 / 3.2,
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