import api from "../settings/api"

export const saveNotification= async(userId, message, context)=>{
    const isArray = Array.isArray(context); 
    let data = []
    if(isArray){
        data = context.map((item)=>{
            return{
                userId,
                message,
                item
            }
        })
    }else{
        data = {
            userId,
            message,
            context
        }
    }

    try{
        const res = await api.post(`/notifications${isArray ? '/all':''}`,data)
        return res.status;
    }catch(err){
        return 500;
    }
}

export const getMyNotifications=async()=>{
    const loggedUser = JSON.parse(sessionStorage.getItem("logged_user"));
    let result = []
    try{
        const res = await api.get(`/notifications/users/${loggedUser?.email}/context/all`);
        if(res.status == 200){
            if(res.data?.length <=0){
                return {success: true, message: 'fetch all notifications successfully !!!', data: []} 
            }
            result = res.data.map((item)=>{
                return {
                    ...item,
                    type: (item?.message?.includes("declined") || item?.message?.includes("delete")) ?  'error' : 'success'
                }
            })
        }

        return {success: true, message: 'fetch all notifications successfully !!!', data: result}
    }catch(err){
        return {success: false, message: err, data: []}
    }
}

export const removeNotification=async(id)=>{
    try{
        const res = await api.delete(`/notifications/${id}`)
        return res.status;
    }catch(err){    
        return 500;
    }
}