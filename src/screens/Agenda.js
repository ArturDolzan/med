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
import axios from 'axios';
import { server, showError } from '../common';
import tomorrowImage from '../../assets/imgs/tomorrow.png'
import weekImage from '../../assets/imgs/week.png'
import monthImage from '../../assets/imgs/month.png'
import Loading from '../components/Loading';


export default class Agenda extends Component {

    state = {
        tasks: [],

        visibleTasks: [],

        images: [],

        showDoneTasks: true,
        showAddTask: false,
        isLoading: false,
        isLoadingImg: false
    }

    addTask = async task => {
        try {
            await axios.post(`${server}/tasks`, {
                desc: task.desc,
                estimateAt: task.date
            })

            this.setState({showAddTask: false}, () => this.loadTasks())
        } catch (err) {
            showError(err)
        }
    }

    deleteTask = async id => {
        try {
            await axios.delete(`${server}/tasks/${id}`)
            await this.loadTasks()
        } catch (err) {
            showError(err)
        }
    }

    filterTasks = () => {
        let visibleTasks = null

        if(this.state.showDoneTasks) {
            visibleTasks = [...this.state.tasks]
        } else {
            visibleTasks = this.state.tasks.filter(task => task.doneAt === null)
        }

        let images = [...this.state.images]

        visibleTasks.map((item, idx) => {

            let uri = images.filter(x => x.id === item.id)
            let url = null

            if (uri.length > 0) {
                url = uri[0].image_uri
            }

            item.image_url = url
            item.image_base = url
        })

        this.setState({visibleTasks, isLoading: false})
    }

    processImages = () => {
        let tasksMan = [...this.state.tasks]
        let images = []

        if (tasksMan.length > 0) {

            const promises = tasksMan.map(async (item, idx) => {

                try {
                    const res = await axios.get(`${server}/tasks/${item.id}/downloadPhoto/`)
                    
                    let url = null

                    if (res.data[0].image_url) {
                        url = 'data:image/jpg;base64,' + res.data[0].image_url
                    }

                    var ret = images.push({
                        image_uri: url,
                        id: item.id
                    })

                    this.setState({images, isLoadingImg: false})

                    return ret
        
                } catch (err) {
                    showError(err)
                }
            })
    
            return Promise.all(promises)
                    .then(_ => {
                        this.filterTasks()
                    });
        }   
    }

    toggleFilter = () => {
        this.setState({showDoneTasks: !this.state.showDoneTasks})
        this.loadTasks()
    }

    componentDidMount = () => {
        this.loadTasks()
    }

    toggleTask = async id => {
        try {
            await axios.put(`${server}/tasks/${id}/toggle`)
            await this.loadTasks()
        } catch (err) {
            showError(err)
        }
    }

    loadTasks = async () => {
        try {
            const maxDate = moment()
                .add({days: this.props.daysAhead})
                .format('YYYY-MM-DD 23:59')

            this.setState({isLoading: true, isLoadingImg: true})    

            const res = await axios.get(`${server}/tasks?date=${maxDate}`)

            this.setState({tasks: res.data}, () => {
                this.processImages()
                this.filterTasks()
            })

        } catch (err) {
            showError(err)
        }
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
                <AddTask isVisible={this.state.showAddTask} 
                    onSave={this.addTask} 
                    onCancel={() => this.setState({showAddTask: false})}>
                </AddTask>
                <ImageBackground source={image} style={styles.background}>
                    <View style={styles.iconBar}>
                        <TouchableOpacity onPress={() => this.props.navigation.openDrawer()}>
                            <Icon name='bars' size={30} color={commonStyles.colors.secondary}>

                            </Icon>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.toggleFilter}>
                            <Icon name={this.state.showDoneTasks ? 'filter' : 'filter'} size={30}
                            color={this.state.showDoneTasks ? commonStyles.colors.secondary : 'red'} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.titleBar}>
                        <Text style={styles.title}>
                            {this.props.title}
                        </Text>

                        <Text style={styles.subtitle}>
                            {moment().locale('pt-br').format('ddd, D [de] MMMM')}
                        </Text>
                    </View>
                </ImageBackground>

                <View style={styles.taskContainer}>
                
                    <FlatList data={this.state.visibleTasks} 
                        keyExtractor={item => `${item.id}`}  
                        renderItem={({item}) => <Tasks {...item} 
                            toggleTask={this.toggleTask} onDelete={this.deleteTask} 
                            onPhoto={this.photo} loading={this.state.isLoadingImg} /> } />
                
                </View>
                <ActionButton buttonColor={styleColor} onPress={() => this.setState({showAddTask: true})}>

                </ActionButton>
                
                {this.state.isLoading ? 
                    <View style={styles.containerLoading}>
                        <Loading/>
                    </View>
                    : null
                }
                
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
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
        flex: 3
    },
    titleBar: {
        flex: 1,
        justifyContent: 'flex-end'
    },
    title: {
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.secondary,
        fontSize: 50,
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