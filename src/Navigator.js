import React from 'react'
import {createSwitchNavigator, createAppContainer, createDrawerNavigator, 
    createStackNavigator, createBottomTabNavigator, Button} from 'react-navigation'
import Agenda from './screens/Agenda';
import Auth from './screens/Auth';
import commonStyles from './commonStyles';
import Menu from './screens/Menu';
import AuthOrApp from './screens/AuthOrApp';
import AddPhoto from './screens/AddPhoto';
import Icon from 'react-native-vector-icons/FontAwesome'
import Heart from './screens/Heart'


const MenuRoutes = {
    Today: {
        name: 'Today',
        screen: props => <Agenda title='Hoje' {...props} daysAhead={0}></Agenda>,
        navigationOptions: {
            title: 'Hoje'
        }
    },
    Tomorrow: {
        name: 'Tomorrow',
        screen: props => <Agenda title='Amanhã' {...props} daysAhead={1}></Agenda>,
        navigationOptions: {
            title: 'Amanhã'
        }
    },
    Week: {
        name: 'Week',
        screen: props => <Agenda title='Semana' {...props} daysAhead={7}></Agenda>,
        navigationOptions: {
            title: 'Semana'
        }
    },
    Month: {
        name: 'Month',
        screen: props => <Agenda title='Mês' {...props} daysAhead={30}></Agenda>,
        navigationOptions: {
            title: 'Mês'
        }
    }
}


const MenuConfig = {
    initialRouteName: 'Today',
    contentComponent: Menu,
    unmountInactiveRoutes: true,
    contentOptions: {
        labelStyle: {
            fontFamily: commonStyles.fontFamily,
            fontWeight: 'normal',
            fontSize: 20
        },
        activeLabelStyle: {
            color: '#080'
        }
    }
}

const menuNavigator = createDrawerNavigator(MenuRoutes, MenuConfig)

const stackRoutes = {
	Home: {
        name: 'Home',
        screen: menuNavigator,
        navigationOptions: {
            header: null,
        }
    },
    AddPhoto: {
        name: 'AddPhoto',
        screen: props => <AddPhoto {...props}></AddPhoto>,
    }
}

const stackNavigator = createStackNavigator(stackRoutes)

const bottomRoutes = {
    Home: {
        name: 'Home',
        screen: stackNavigator,
        navigationOptions: {
            title: 'Home',
            tabBarIcon: ({ tintColor: color }) =>
                <Icon name='tasks' size={30} color={color} />
        }
    },
    
    WhoAmI: {
        name: 'WhoAmI',
        screen: Heart,
        navigationOptions: {
            title: 'WhoAmI',
            tabBarIcon: ({ tintColor: color }) =>
                <Icon name='heart' size={30} color={color} />
        }
    }
}

const bottomConfig = {
    initialRouteName: 'Home',
    tabBarOptions: {
        showLabel: false
    }
}

const bottomNavigator = createBottomTabNavigator(bottomRoutes, bottomConfig)

const MainRoutes = {
    Loading: {
        name: 'Loading',
        screen: AuthOrApp
    },
    Auth: {
        name: 'Auth',
        screen: Auth
    },
    Home: {
        name: 'Home',
        screen: stackNavigator
    }
}


const MainNavigator = createSwitchNavigator(MainRoutes, {initialRouteName: 'Loading'})

const App = createAppContainer(MainNavigator);

export default App