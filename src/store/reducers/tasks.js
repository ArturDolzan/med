import { LOAD_TASKS, TOGGLE_FILTER, SHOW_ADD_TASK, LOADING, LOADING_IMG } from "../actions/actionTypes"

const initialState = {
    tasks: [],

    visibleTasks: [],

    images: [],

    showDoneTasks: true,
    showAddTask: false,
    isLoading: false,
    isLoadingImg: false
}

const reducer = (state = initialState, action) => {
    switch(action.type) {
        case LOAD_TASKS:
        //console.log(action.payload)
            return {
                ...state,
                tasks: action.payload.tasks,
                visibleTasks: action.payload.visibleTasks,
                showDoneTasks: action.payload.showDoneTasks
            }

        case TOGGLE_FILTER:
                return {
                    ...state,
                    showDoneTasks: action.payload.showDoneTasks
                }
        case SHOW_ADD_TASK:
                return {
                    ...state,
                    showAddTask: action.payload.showAddTask
                }
        case LOADING:
                return {
                    ...state,
                    isLoading: action.payload.isLoading
                }
        case LOADING_IMG:
                return {
                    ...state,
                    isLoadingImg: action.payload.isLoadingImg
                }
        default: 
            return state
    }
}

export default reducer