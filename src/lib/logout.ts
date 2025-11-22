import { logoutUser } from '@/lib/apiClient'
import { requestHandler } from "@/utils"



export const LogouttheUser = async (router: any, showToast: any) => { // Accept router and showToast as arguments
    requestHandler(
        async () => await logoutUser(),
        null,
        (res) => {
            router.push('/login');
            showToast(res.message, "success");
        },
        (err: any) => {
            showToast(err.message || "Something went wrong");
            console.log(err);

        }
    );


    
};

