import React, {Component} from 'react'
import {StyleSheet, Text, View, ImageBackground, FlatList, TouchableOpacity, Platform} from 'react-native'
import moment from 'moment'
import 'moment/locale/pt-br'
import todayImage from '../../assets/imgs/today.png'
import commonStyles from '../commonStyles';
import Tasks from '../components/Tasks';
import Icon from 'react-native-vector-icons/FontAwesome'
import ActionButton from 'react-native-action-button'
import AddTask from './AddTask';
import tomorrowImage from '../../assets/imgs/tomorrow.png'
import weekImage from '../../assets/imgs/week.png'
import monthImage from '../../assets/imgs/month.png'
import Loading from '../components/Loading';
import {connect} from 'react-redux'
import {actionLoadTasks, 
    actionToggleFilter, 
    actionToggleAddTask,
    actionAddTask,
    actionToggleTask,
    actionDeleteTask
} from '../store/actions/tasks'

class Agenda extends Component {

    componentDidMount = () => {
        this.focusListener = this.props.navigation.addListener('didFocus', () => {
             this.onFocusFunction()
        })

        this.onFocusFunction()
    }

    onFocusFunction = () => {
        this.props.onLoadTasks(this.props.daysAhead, this.props.tasks.showDoneTasks)
    }

    componentWillUnmount () {
        this.focusListener.remove()
    }

    addTask =  task => {
        this.props.onAddTask(task, this.props.daysAhead)
    }

    deleteTask = id => {
        this.props.onDeleteTask(id, this.props.daysAhead)
    }

    toggleFilter = () => {
        this.props.onToggleFilter(this.props.daysAhead)
    }

    toggleAddTask = (showAddTask) => {
        this.props.onToggleAddTask(showAddTask)
    }

    toggleTask = id => {
        this.props.onToggleTask(id, this.props.daysAhead)
    }

    photo = id => {
        this.props.navigation.navigate('AddPhoto', {id})
    }

    render() {

        let styleColor = null
        let image = null

        switch(this.props.daysAhead) {
            case 0:
                styleColor = commonStyles.colors.today
                image = todayImage
                break
            case 1:
                styleColor = commonStyles.colors.tomorrow
                image = tomorrowImage
                break
            case 7:
                styleColor = commonStyles.colors.week
                image = weekImage
                break
            default:
                styleColor = commonStyles.colors.month
                image = monthImage
                break
        }

        return (
            <View style={styles.container}>
                <AddTask isVisible={this.props.tasks.showAddTask} 
                    onSave={this.addTask} 
                    onCancel={() => this.toggleAddTask(false)}>
                </AddTask>
                <ImageBackground source={image} style={styles.background}>
                    <View style={styles.iconBar}>
                        <TouchableOpacity onPress={() => this.props.navigation.openDrawer()}>
                            <Icon name='bars' size={25} color={commonStyles.colors.secondary}>

                            </Icon>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.toggleFilter}>
                            <Icon name={this.props.tasks.showDoneTasks ? 'filter' : 'filter'} size={25}
                            color={this.props.tasks.showDoneTasks ? commonStyles.colors.secondary : 'red'} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.titleBar}>
                        <Text style={styles.title}>
                            {this.props.title}
                        </Text>

                        <Text style={styles.subtitle}>
                            {moment().locale('pt-br').format('ddd, D [de] MMMM')}
                            {/* {this.props.daysAhead} */}
                        </Text>
                    </View>
                </ImageBackground>

                <View style={styles.taskContainer}>
                
                    <FlatList data={this.props.tasks.visibleTasks} 
                        keyExtractor={item => `${item.id}`}  
                        renderItem={({item}) => <Tasks {...item} 
                            toggleTask={this.toggleTask} onDelete={this.deleteTask} 
                            onPhoto={this.photo} loading={this.props.tasks.isLoadingImg} /> } />
                
                </View>
                {/* <ActionButton buttonColor={styleColor} onPress={() => this.toggleAddTask(true)}>

                </ActionButton> */}
                
                {this.props.tasks.isLoading ? 
                    <View style={styles.containerLoading}>
                        <Loading/>
                    </View>
                    : null
                }
                
                 <View style={[styles.addButtonContainer]}>
                    <TouchableOpacity 
                       onPress={() => this.toggleAddTask(true)}>
                
                        <Icon name={'plus'} size={40} color='green' />
                            
                    </TouchableOpacity>
                </View> 

            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    addButtonContainer: {
        flex: 1.2, 
        alignContent: 'center', 
        justifyContent: 'center', 
        alignItems: 'center'
    },
    addButton: {
        borderRadius:128,
        borderWidth: 1,
        width: 45,
        alignItems: 'center',
        justifyContent: 'center',
        alignContent: 'center'
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
    background: {
        flex: 4
    },
    titleBar: {
        flex: 1,
        justifyContent: 'flex-end'
    },
    title: {
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.secondary,
        fontSize: 45,
        marginLeft: 20,
        marginBottom: 10
    },
    subtitle: {
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.secondary,
        fontSize: 20,
        marginLeft: 20,
        marginBottom: 30
    },
    taskContainer: {
        flex: 7
    },
    iconBar: {
        marginTop: Platform.OS === 'ios' ? 30 : 10,
        marginHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
})

const mapStateToProps = (data) => {
    
    return {
        tasks: data.tasks,
        visibleTasks: data.visibleTasks,
        showDoneTasks: data.tasks.showDoneTasks,
        showAddTask: data.tasks.showAddTask,
        isLoading: data.tasks.isLoading,
        isLoadingImg: data.tasks.isLoadingImg
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onLoadTasks: (daysAhead, showDoneTasks) => dispatch(actionLoadTasks(daysAhead, showDoneTasks)),
        onToggleFilter: (daysAhead) => dispatch(actionToggleFilter(daysAhead)),
        onToggleAddTask: (showAddTask) => dispatch(actionToggleAddTask(showAddTask)),
        onAddTask: (task, daysAhead) => dispatch(actionAddTask(task, daysAhead)),
        onToggleTask: (id, daysAhead) => dispatch(actionToggleTask(id, daysAhead)),
        onDeleteTask: (id, daysAhead) => dispatch(actionDeleteTask(id, daysAhead))
    }
}

//export default
export default connect(mapStateToProps, mapDispatchToProps)(Agenda)