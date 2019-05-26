import { LOAD_TASKS, TOGGLE_FILTER, SHOW_ADD_TASK, LOADING, LOADING_IMG } from "./actionTypes"
import {Alert} from 'react-native'
import moment from 'moment'
import 'moment/locale/pt-br'
import { server, showError } from '../../common';
import axios from 'axios';

export const actionIsLoading = (isLoading) => {
    return (dispatch) => {
       
        dispatch(goingToReducerTasks({
            isLoading
        },
        LOADING))

    }
}

export const actionIsLoadingImg = (isLoadingImg) => {
    return (dispatch) => {
       
        dispatch(goingToReducerTasks({
            isLoadingImg
        },
        LOADING_IMG))

    }
}

export const actionToggleFilter = (daysAhead) => {
    return (dispatch, getState) => {
        const showDoneTasks = !getState().tasks.showDoneTasks

        dispatch(goingToReducerTasks({
            showDoneTasks
        },
        TOGGLE_FILTER))

        dispatch(actionLoadTasks(daysAhead, showDoneTasks))
    }
}

export const actionToggleAddTask = (showAddTask) => {
    return (dispatch) => {
       
        dispatch(goingToReducerTasks({
            showAddTask
        },
        SHOW_ADD_TASK))

    }
}

export const actionAddTask = (task, daysAhead) => {
    return async (dispatch, getState) => {

        try {
            await axios.post(`${server}/tasks`, {
                desc: task.desc,
                estimateAt: task.date
            })

            dispatch(actionToggleAddTask(false))
            dispatch(actionLoadTasks(daysAhead, getState().tasks.showDoneTasks))

        } catch (err) {
            showError(err)
        }
    }
}

export const actionToggleTask = (id, daysAhead) => {
    return async (dispatch, getState) => {

        try {
            await axios.put(`${server}/tasks/${id}/toggle`)
        } catch (err) {
            showError(err)
        }

        dispatch(actionLoadTasks(daysAhead, getState().tasks.showDoneTasks))
    }
}

export const actionDeleteTask = (id, daysAhead) => {
    return async (dispatch, getState) => {

        try {
            await axios.delete(`${server}/tasks/${id}`)
        } catch (err) {
            showError(err)
        }
    
        dispatch(actionLoadTasks(daysAhead, getState().tasks.showDoneTasks))
    }
}

export const actionLoadTasks = (daysAhead, showDoneTasks) => {
    return (dispatch) => {
      //console.log(daysAhead)
        const maxDate = moment()
            .add({days: daysAhead})
            .format('YYYY-MM-DD 23:59')

        dispatch(actionIsLoading(true))

        axios.get(`${server}/tasks?date=${maxDate}`)
            .catch(err => {
              
                Alert.alert('Ops', 'Ocorreu um erro inesperado =(')
            })
            .then(res => {
                dispatch(actionIsLoading(false))
                dispatch(setProcessImages(res.data))
                dispatch(setFilterTasks(res.data, showDoneTasks))
            })
    }
}

export const setFilterTasks = (tasks, showDoneTasks, image = []) => {
    return (dispatch) => {

        let visibleTasks = null

        if(showDoneTasks) {
            visibleTasks = [...tasks]
        } else {
            visibleTasks = tasks.filter(task => task.doneAt === null)
        }   

        let img = [...image]

        visibleTasks.map((item, idx) => {

            let uri = img.filter(x => x.id === item.id)
            let url = null

            if (uri.length > 0) {
                url = uri[0].image_uri
            }
            //console.log(url)
            item.image_url = url
            item.image_base = url
        })

        dispatch(goingToReducerTasks({
            tasks,
            visibleTasks,
            showDoneTasks
        },
        LOAD_TASKS))
    }
}

export const setProcessImages = (tasks) => {
    return (dispatch, getState) => {
        let tasksMan = [...tasks]

        if (tasksMan.length > 0) {
            
            dispatch(actionIsLoadingImg(true))
            const promises = tasksMan.map(async (item, idx) => {

                try {
                    const res = await axios.get(`${server}/tasks/${item.id}/downloadPhoto/`)
                    
                    let url = null

                    if (res.data[0].image_url) {
                        url = 'data:image/jpg;base64,' + res.data[0].image_url
                    }

                    return {
                        image_uri: url,
                        id: item.id
                    }
        
                } catch (err) {
                    showError(err)
                }
            })
    
            return Promise.all(promises)
                    .then(ret => {
                        //console.log( ret)
                        dispatch(actionIsLoadingImg(false))
                        dispatch(setFilterTasks(tasksMan, getState().tasks.showDoneTasks, ret))
                    });
        } 
    }
}

export const goingToReducerTasks = (data, type) => {
    return {
        type: type,
        payload: data
    }
}