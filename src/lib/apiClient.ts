
import { NoteSchemaType } from "@/schemas/NoteSchema"
import { ProjectSchemaType } from "@/schemas/ProjectSchema"
import { TaskSchemaType } from "@/schemas/TaskSchema"
import axios from "axios"




const apiClient = axios.create({
    baseURL : '/api/v1',
    withCredentials : true,
    timeout : 180000
})



const loginUser = (data: any) => {
    
    return apiClient.post('/auth/login',{identifier: data.identifier, password: data.password})
}


const registerUser = (data: any) => {
    try {
        const formData = new FormData()
    formData.append("fullName", data.fullName)
    formData.append("username",data.username)
    formData.append("email",data.email)
    formData.append("password",data.password)
    if(data?.avatar) formData.append("avatar",data.avatar)

    return apiClient.post('/auth/register',formData)
    } catch (error) {
        console.log(error)
    }
}



const getUserDashboardStats = () => {
    return apiClient.get(`/dashboard/user`)
}


const getUserInfo = () => {
    return apiClient.get('/users/get-current-user')
}


const logoutUser = () => {
    return apiClient.post(`/auth/logout`)
}


const getAllTasks = () => {
    return apiClient.get(`/tasks/get-tasks`)
}


const createTask = (data: TaskSchemaType) => {
    return apiClient.post('/tasks/create',data)
}


const deleteTask = (taskId: string) => {
    return apiClient.delete(`/tasks/delete-task/${taskId}`)
}



const updateTask = (taskId: string, data: TaskSchemaType) => {
    return apiClient.patch(`/tasks/update-task/${taskId}`, data)
}


const createNote = (data: NoteSchemaType) => {
    return apiClient.post(`/notes/create`, data)
}

const getAllNotes = () => {
    return apiClient.get(`/notes/get-notes`)
}



const updateNote = (noteId: string, data: NoteSchemaType) => {
    return apiClient.patch(`/notes/update-note/${noteId}`,data)
}


const deleteNote = (noteId: string) => {
    return apiClient.delete(`/notes/delete-note/${noteId}`)
}


const createProject = (data: ProjectSchemaType) => {
    return apiClient.post(`/projects/create`, data)
}


const getAllProjects = () => {
    return apiClient.get(`/projects/get-projects`)
}


const updateProject = (projectId: string, data: ProjectSchemaType) => {
    return apiClient.patch(`/projects/update-project/${projectId}`, data)
}



const deleteProject = (projectId: string) => {
    return apiClient.delete(`/projects/delete-project/${projectId}`)
}

const getProjectById = (projectId: string) => {
    return apiClient.get(`/projects/get-project-by-id/${projectId}`)
}



const getAllUsers = () => {
    return apiClient.get(`/users/get-all-users`)
}


const deleteUser = (userId: string) => {
    return apiClient.delete(`/users/delete-user/${userId}`)
}



const getUserById = (userId: string) => {
    return apiClient.get(`/users/get-user-by-id/${userId}`)
}


const updateUserProfile = (data: any) => {


    try {
      
        const formData = new FormData();
        formData.append("fullName",data.fullName)

        if(data.avatar) formData.append("avatar",data.avatar)
        formData.append("bio",data.bio)
        return apiClient.patch(`/users/update-profile`, formData)
    } catch (error) {
        console.log(error)
    }
}


const updateUserRole = (userId: string | undefined) => {
    
    return apiClient.patch(`/users/update-user-role/${userId}`)
}


// Only deletes the current user's account
const deleteUserAccount = () => {
    return apiClient.delete(`/users/delete-current-user-account`)
}



export {
    getUserById,
    updateUserProfile,
    updateUserRole,
    deleteUserAccount,
    getAllUsers,
    deleteUser,
    createProject,
    getAllProjects,
    getProjectById,
    updateProject,
    deleteProject,
    getAllNotes,
    updateNote,
    deleteNote, 
    createNote,
    updateTask,
    deleteTask,
    createTask,
    getAllTasks,
    loginUser,
    logoutUser,
    registerUser,
    getUserDashboardStats,
    getUserInfo
}