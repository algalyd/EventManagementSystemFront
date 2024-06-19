
import { useEffect, useState } from "react";
import { MdEvent } from 'react-icons/md';
import EventsCenter from "./tabs/EventsCenter.jsx";
import NotificationCenter from "./tabs/NotificationCenter.jsx";
import EventsRequests from "./tabs/EventsRequests";
import { Link, useLocation } from "react-router-dom";
import { getMyNotifications } from "../../utils/notifications";
import './Dashboard.css';
export default function Dashboard() {
  const location = useLocation();
  const loggedUser = JSON.parse(sessionStorage.getItem("logged_user"));
  const [activeTab,setActiveTab] = useState('events');
  const [noticationLength,setNoticationLength] = useState(0);
  const [isLoaded,setIsLoaded] = useState(false)

  const updateNotif=(notif)=>{
    const prevListCount = JSON.parse(sessionStorage.getItem('my_notifications'))?.length
    const prevCount = JSON.parse(sessionStorage.getItem('notif_count'))
    let newCount  = (notif?.data?.length - prevListCount) > 0 ? prevCount + (notif?.data?.length - prevCount) : prevCount
    sessionStorage.setItem("notif_count",newCount)
    setNoticationLength(newCount);
  }

  useEffect(()=>{
    if(location?.search?.includes('notification')){
      setActiveTab('notifications')
    }
  },[])

  useEffect(()=>{
    var interval = setInterval(async ()=>{
      const notif = await getMyNotifications();
      if(!notif.success) return;
      if(!isLoaded){
        if(sessionStorage.getItem('notif_count')!=null || sessionStorage.getItem('notif_count')!=undefined){
          updateNotif(notif);
        }else{
          sessionStorage.setItem("notif_count",notif?.data?.length)
          setNoticationLength(notif?.data?.length);
        }
      }else{
        if(sessionStorage.getItem('notif_count')!=null){
          updateNotif(notif);
        }
      }

      // eslint-disable-next-line no-unsafe-optional-chaining
      sessionStorage.setItem('my_notifications',JSON.stringify([...notif?.data]))
    },5000)

    setIsLoaded(true);

    return ()=> clearInterval(interval);
  },[])

  return (
    <div>
  <nav className="navigation-bar-dashboard">
    <div className="container-dashboard">
      <div className="flex-between-dashboard">
        <div className="flex-start-dashboard">
          <button data-drawer-target="logo-sidebar" data-drawer-toggle="logo-sidebar" aria-controls="logo-sidebar" type="button" className="button-dashboard">
            <span className="sr-only">Open sidebar</span>
            <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z" />
            </svg>
          </button>
          <Link to={"/"} className="link-dashboard">
            <MdEvent className="icon-dashboard"/>
            <span className="title-dashboard">E.M.</span>
          </Link>
        </div>
        <div className="flex-center-dashboard">
          <div className="flex-center-margin-dashboard">
            <div>
              <span className="avatar-dashboard">
                {loggedUser?.username?.substring(0,2).toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
  <aside id="logo-sidebar" className="sidebar-dashboard" aria-label="Sidebar">
    <div className="content-container-dashboard">
      <ul className="list-dashboard">
        <li onClick={()=> setActiveTab('events')}>
          <a href="#" className="menu-item-dashboard">
            <svg className="icon-side-dashboard" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="black" viewBox="0 0 18 18">
              <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z" />
            </svg>
            <span className={`text-invitations-dashboard ${activeTab == 'events' ? 'text-invitations-active-dashboard':''}`}>Events</span>
          </a>
        </li>
        <li onClick={()=> setActiveTab('eventsRequests')}>
          <a href="#" className="menu-item-dashboard">
            <svg className="icon-side-dashboard" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="blue" viewBox="0 0 18 18">
              <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z" />
            </svg>
            <span className={`text-invitations-dashboard ${activeTab == 'eventsRequests' ? 'text-invitations-active-dashboard':''}`}>Invitations</span>
          </a>
        </li>
        <li onClick={()=> {
          setActiveTab('notifications')
          sessionStorage.setItem("notif_count",0)
          setNoticationLength(0);
          }}>
          <a href="#" className="menu-item-dashboard">
            <svg className="icon-side-dashboard" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="green" viewBox="0 0 20 20">
              <path d="m17.418 3.623-.018-.008a6.713 6.713 0 0 0-2.4-.569V2h1a1 1 0 1 0 0-2h-2a1 1 0 0 0-1 1v2H9.89A6.977 6.977 0 0 1 12 8v5h-2V8A5 5 0 1 0 0 8v6a1 1 0 0 0 1 1h8v4a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-4h6a1 1 0 0 0 1-1V8a5 5 0 0 0-2.582-4.377ZM6 12H4a1 1 0 0 1 0-2h2a1 1 0 0 1 0 2Z" />
            </svg>
            <span className={`text-invitations-dashboard ${activeTab == 'notifications' ? 'text-invitations-active-dashboard':''}`}>Notification</span>
            <span className="notification-badge-dashboard">{noticationLength}</span>
          </a>
        </li>
      </ul>
    </div>
  </aside>
  <div className="main-content-dashboard">
    <div className="card-dashboard">
      { activeTab === 'events' && <EventsCenter /> }
      { activeTab === 'eventsRequests' && <EventsRequests /> }
      { activeTab === 'notifications' && <NotificationCenter /> }
    </div>
  </div>
</div>

  )
}
