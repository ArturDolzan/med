import React, {Component} from 'react'
import {View, Text} from 'react-native'

class AddButton extends Component {
   
    render() {
    
        return (
            <View style={{
                position: 'absolute',
                alignItems: 'center'
            }}>
                <Text>+</Text>
            </View>
        );
    }
}
export default AddButton