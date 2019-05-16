import {Alert, Platform} from 'react-native'

//const server = Platform.OS === 'ios' ? 'http://localhost:3000' : 'http://10.0.2.2:3000'

const server = Platform.OS === 'ios' ? 'http://localhost:3000' : 'http://tukazure.eastus.cloudapp.azure.com/node/remed-backend/app/'

//const server = Platform.OS === 'ios' ? 'http://localhost:3000' : 'http://127.0.0.1:3000'

function showError(err) {
    Alert.alert('Ops!', `Ocorreu um erro: ${err}`)
}

export {server, showError}