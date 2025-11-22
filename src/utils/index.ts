import { FreeAPISuccessResponseInterface } from "@/interfaces/api";
import { AxiosResponse } from "axios";




// requestHandler: It's a wrapper for your Axios calls to standardize UI feedback (loading, success, error messages) and authentication redirects.
export const requestHandler = async(
    api : () => Promise<AxiosResponse<FreeAPISuccessResponseInterface>>,    
    setLoading : ((loading: boolean) => void) | null,
    onSuccess : (data: FreeAPISuccessResponseInterface) => void,
    onError: (error: string) => void
) => {

    // Showing loading state if the loading function is provided
    setLoading && setLoading(true)
    try {
        const res = await api()
        const { data } = res;
        if(data.success) {
            // Call the onSuccess callback with the response data
            onSuccess(data) 
        }
    } catch (error: any) {
        // Handle error case
        if([401,403].includes(error.res?.data.statusCode)){
            // As i am not using localStorage for storing user's information I am using redux store for that that's why i am going to use useDispatch to clear the user if the user found to be unauthorized
            // store.dispatch(clearUser())
            if(isBrowser) window.location.href = '/sign-in'
        }
     
        onError(error?.response?.data || "Something Went wrong")
    } finally {     

        setLoading && setLoading(false)
    }
}

export const isBrowser = typeof window !== 'undefined'


// A class that provides utility functions for working with local storage
export class LocalStorage {
    // Get a value from local storage by key
    static get(key: string){
        if(!isBrowser) return;
        const value = localStorage.getItem(key)
        if(value){
            try {
                return JSON.parse(value)
            } catch (error) {
                return null
            }
        }
        return null
    }

    // Set a value in local storage by key
    static set(key: string, value: any){
        if(!isBrowser) return 
        localStorage.setItem(key, JSON.stringify(value))
    }

    // Remove a value from local storage by key
    static remove(key: string){
        if(!isBrowser) return;
        localStorage.removeItem(key)
    }


    // Clear all items from localStorage
    static clear(){
        if(!isBrowser) return
        localStorage.clear()
    }

}



