import { useEffect,useState } from "react";
import { removeNotification } from "../../../utils/notifications";
import { ToastContainer,toast } from "react-toastify";
import './NotificationCenter.css';
export default function NotificationCenter() {
  const [notificationList,setNotificationList] = useState([]);

  const handleNotificationDelete=async(id)=>{
    const status = await removeNotification(id);
    if(status === 200 || status === 201){
      let arr = notificationList?.filter((item)=> item.id === id)
      toast('Deleted Notification successfully',{
        type:'success'
      })

      setNotificationList([...arr]);
    }else{
      toast('An error occurred when deleting notification !!!',{
        type:'error'
      })
    }
  }

  useEffect(()=>{
    var interval = setInterval(()=>{
      if(sessionStorage.getItem('my_notifications')){
        const notif = JSON.parse(sessionStorage.getItem('my_notifications'))
        setNotificationList([...notif])
      }
    },5000)

    return ()=> clearInterval(interval);
  },[])

  return (
    <div>
      <h1 className="text-center-bold-heading">Personal notifications</h1>

      {
      [...new Set([...notificationList])]?.map((notif,index)=>(

          <div
          key={index}
        className="alert-container"
        role="alert"
      >
        <svg
          className="icon-svg"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
        </svg>
        <span className="sr-only">Info</span>
        <div>
          <span className="font-medium">{notif?.message}</span>
        </div>

        <span onClick={()=>handleNotificationDelete(notif?.id)} className="delete-notification-btn">
          &times;
        </span>
      </div>

        ))
      }

      <ToastContainer />
      
    </div>
  );
}
