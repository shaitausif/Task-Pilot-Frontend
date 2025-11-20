import { LoginInputs } from "@/app/(auth)/login/page"
import { RegisterInputs } from "@/app/(auth)/register/page"
import axios from "axios"




const apiClient = axios.create({
    baseURL : process.env.NEXT_PUBLIC_SERVER_URI,
    withCredentials : true,
    timeout : 120000
})



const loginUser = (data: LoginInputs) => {
    const email = data.identifier
    const username = data.identifier
    return apiClient.post('/auth/login',{email , username, password: data.password})
}


const registerUser = (data: RegisterInputs) => {
    try {
        const formData = new FormData()
    formData.append("fullName", data.username)
    formData.append("username",data.username)
    formData.append("email",data.email)
    formData.append("password",data.password)
    if(data?.avatar) formData.append("avatar",data.avatar)

    return apiClient.post('/auth/register',formData)
    } catch (error) {
        console.log(error)
    }
}




export {
    loginUser,
    registerUser
}