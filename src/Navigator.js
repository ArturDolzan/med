import React from 'react'
import {createSwitchNavigator, createAppContainer, createDrawerNavigator} from 'react-navigation'
import Agenda from './screens/Agenda';
import Auth from './screens/Auth';
import commonStyles from './commonStyles';
import Menu from './screens/Menu';
import AuthOrApp from './screens/AuthOrApp';
import AddPhoto from './screens/AddPhoto';


const MenuRoutes = {
    Today: {
        name: 'Today',
        screen: props => <Agenda title='Hoje' daysAhead={0} {...props}></Agenda>,
        navigationOptions: {
            title: 'Hoje'
        }
    },
    Tomorrow: {
        name: 'Tomorrow',
        screen: props => <Agenda title='Amanha' daysAhead={1} {...props}></Agenda>,
        navigationOptions: {
            title: 'Amanha'
        }
    },
    Week: {
        name: 'Week',
        screen: props => <Agenda title='Semana' daysAhead={7} {...props}></Agenda>,
        navigationOptions: {
            title: 'Semana'
        }
    },
    Month: {
        name: 'Month',
        screen: props => <Agenda title='Mes' daysAhead={30} {...props}></Agenda>,
        navigationOptions: {
            title: 'Mes'
        }
    }
}


const MenuConfig = {
    initialRouteName: 'Today',
    contentComponent: Menu,
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
        screen: menuNavigator
    },
    AddPhoto: {
        name: 'AddPhoto',
        screen: props => <AddPhoto {...props}></AddPhoto>,
    }
}



const MainNavigator = createSwitchNavigator(MainRoutes, {initialRouteName: 'Loading'})

const App = createAppContainer(MainNavigator);

export default App