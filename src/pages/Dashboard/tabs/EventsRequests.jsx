/* eslint-disable react/prop-types */
import DataTable from 'react-data-table-component';
import { useState,useEffect } from 'react'
import api from '../../../settings/api';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { saveNotification } from '../../../utils/notifications';
import './EventsCenter.css';
import './EventsRequests.css';

export default function EventsRequests() {
  const loggedUser = JSON.parse(sessionStorage.getItem("logged_user"));
  const [pending, setPending] = useState(true);
  const [activeSearchItem,setActiveSearchItem] = useState('name');
  const [data,setData] = useState([]);
  const [tempData,setTempData] = useState([]);
  const [isCancelEvent,setIsCancelEvent] = useState(false);
  const [search,setSearch] = useState('')
  const [viewEvent,setViewEvent] = useState("created")
  const [receivedInvitations, setReceivedInvitations] = useState([]);
  const [prevData,setPrevData] = useState([])

  const customStyles = {
    headCells: {
      style: {
        backgroundColor: "#1E90FF", // DodgerBlue
        color: "white",
        fontSize: "18px",
        fontWeight: "bold",
        textAlign: "center",
        padding: "10px",
        border: "1px solid #ffffff",
      },
    },
    cells: {
      style: {
        backgroundColor: "#f9f9f9", // Light background for better contrast
        borderBottom: "1px solid #000000", // Black vertical divider
        borderRight: "1px solid #000000", // Black diagonal divider
        fontSize: "16px",
        color: "#333333",
        padding: "8px",
        textAlign: "left",
      },
    },
  };

  const columns = [
    {
      name: "Username",
      selector: row => row.username,
      sortable: true
    },
    {
      name: 'Event Name',
      selector: row => row.name,
      sortable: true,
    },
    {
      name: 'Description',
      selector: row => row.description,
      sortable: true,
    },
    {
      name: 'Location',
      selector: row => row.location,
      sortable: true,
    },
    {
      name: 'Date',
      selector: row => row.date,
      sortable: true,
    },
    {
      name: 'time',
      selector: row => row.time,
      sortable: true,
    },
    {
      name: 'Status',
      selector: row => row.status,
      sortable: true,
    }
  ];
  
  
  const getUserEvents = async (data) => {
    try {
      const res = await api.get(`/users/${loggedUser.id}`);
      if (res.data?.events) {
        let arr = data.filter((item)=>{
          const itemId = Number(item?.event_id)
          let result = false;
          res.data?.events.forEach((itm)=>{
            if(Number(itm?.id) == itemId && loggedUser?.email !== item?.user_email){
                result = true;
                return;
            }
          })

          return result;
        })

        arr = arr.map((item)=> { return {...item,date: item?.date?.split(" ")[0],time: item?.date?.split(" ")[1], id: Number(item?.id), event_id: Number(item?.event_id)}})
        
        setReceivedInvitations([...arr]);
      }
    } catch (err) {
      toast("Error occurred while fetching created Events", {
        type: "error",
      });
    }
  };

  const getUsersRequests = async ()=>{
    try{
      const res = await api.get(`/invitations/users?email=${loggedUser.email}`);
      if(res.data){
        const arr  = res.data.map((item)=> {
          return {
            ...item,
            date: item?.date?.split(" ")[0],
            time: item?.date?.split(" ")[1],
          }
        })
        setData([...arr]);
        setPrevData([...arr])
      }
      else 
        setData([])
    }catch(err){
      toast("Error occurred while fetching created Events", {
        type: "error",
      });
    }
  }

  const getAllInvitations = async ()=>{
       try{
        const res = await api.get(`/invitations`);
        getUserEvents(res.data);
      }catch(err){
        toast("Error occurred while fetching all invitations requests", {
          type: "error",
        });
      }
  }

  const deleteRow = async(row)=>{
    if(row.selectedCount > 0){
      setIsCancelEvent(true);
      const data = row.selectedRows
      try{
        const res = await api.delete(`/invitations/${Number(data?.id)}`);
        if(res.status == 200){
          toast("Request deleted successfully !!!", {
            type: "success",
            onClose: ()=>{
              window.location.reload();
            }
          });
        }
      }catch(err){
        toast("An error occurred while deleting request try again", {
          type: "error",
        });
      }

    }else{
      setIsCancelEvent(false)
    }
    


    // const selectedElement = row?.selectedRows[0];
    console.log(row)
  }

  const filterData=(value)=>{
    setSearch(value);
    let arr = []
    switch(activeSearchItem){
      case 'name':
        arr = data.filter((item)=> item?.name?.toLowerCase().includes(value.toString().toLowerCase()));
        break;
      case 'location':
        arr = data.filter((item)=> item?.location?.toLowerCase().includes(value.toString().toLowerCase()));
        break;
      case 'status':
        arr = data.filter((item)=> item?.status?.toLowerCase().includes(value.toString().toLowerCase()));
        break;
      case 'date':
        arr = data.filter((item)=> item?.date?.toString() == value.toString());
        break;
      default:
        break;
    }

    setTempData([...arr]);
  }


  const toggleView=(text)=>{
    if(text === 'created'){
      const arr = [...prevData]
      setData([...arr]);
    }else{
      setData([...receivedInvitations])
    }

    setViewEvent(text)
  }

  useEffect(() => {
    getUsersRequests();
    getAllInvitations();
		const timeout = setTimeout(() => {
			setPending(false);
		}, 1000);
		return () => clearTimeout(timeout);
	}, []);

  return (
    <div className="full-container-request">
      <div className="search-container-request">
        <label
          htmlFor="default-search"
          className="label-request"
        >
          Search
        </label>
        <div className="relative-container-request">
          <div className="icon-container-request">
            <svg
              className="icon-request"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            id="default-search"
            type={activeSearchItem !=='date' ? 'text' : 'date'}
            className="search-input"
            placeholder="Search Events"
            required
            value={search}
            onChange={(e)=> filterData(e.target.value)}
          />
          <button
            type="submit"
            className="search-event-button"
          >
            Search
          </button>
        </div>
      </div>

      <div className='search-options-container-request'>
        <h3 className='mr-2'>Search by:</h3>
        <div className='search-options-container'>
        <div onClick={()=> setActiveSearchItem('name')} className={`option ${activeSearchItem == 'name' ? 'option-active' : 'option-inactive'} all-option`}>
          <span>Name</span>
        </div>
        <div onClick={()=> setActiveSearchItem('location')} className={`option ${activeSearchItem == 'location' ? 'option-active' : 'option-inactive'} all-option`}>
          <span>Location</span>
        </div>
        <div onClick={()=> setActiveSearchItem('date')} className={`option ${activeSearchItem == 'date' ? 'option-active' : 'option-inactive'} all-option`}>
          <span>Date</span>
        </div>
        <div onClick={()=> setActiveSearchItem('status')} className={`option ${activeSearchItem == 'status' ? 'option-active' : 'option-inactive'} all-option`}>
          <span>Status</span>
        </div>
        </div>
      </div>

      <div className="header-container-request">
        <div className="view-events-container-request">
          <h3 className="heading-view-events">View Events:</h3>
          <div className="view-options-container-request">
          <div
              onClick={() => toggleView('created')}
              className={`option ${
                viewEvent == "created"
                  ? "option-active"
                  : "option-inactive"
              } all-option`}
            >
              <span>My Requests</span>
            </div>

            <div
              onClick={() => toggleView('invitation')}
              className={`option ${
                viewEvent == "invitation"
                  ? "option-active"
                  : "option-inactive"
              } all-option`}
            >
              <span>Received Invitations</span>
            </div>
            
          </div>
        </div>
        {
      isCancelEvent &&
      <button className='delete-button-request'>
        Delete Request
      </button>
     }
      </div>

     
      <DataTable
        columns={columns}
        data={search ? tempData : viewEvent === 'created' ? data : receivedInvitations}
        pagination
        selectableRows={viewEvent === 'created' ? true : false }
        selectableRowsSingle
        onSelectedRowsChange={(item)=> deleteRow(item)}
        progressPending={pending}
        expandableRows = {viewEvent === 'created' ? false : true}
        expandableRowsComponent={ExpandedComponent}
        customStyles={customStyles}
      />
      <ToastContainer />
    </div>
  );
}


const ExpandedComponent = ({ data }) => {
  const loggedUser = JSON.parse(sessionStorage.getItem("logged_user"));
  const eventId = data?.event_id;
  const status = data?.status;

  const [attendees,setAttendees] = useState([])
  const [isLoaded,setIsLoaded] = useState(false)

  const toggleRequest = async (action)=>{
    if(action === 'accept'){
      try{
        const res = await api.put(`/invitations/${Number(data?.id)}`,{status: 'accepted'});
        if(res.status == 200){
          const sendNotifStatus = await saveNotification(loggedUser?.id, `Your request to join ${data?.name} has been accepted`,data?.user_email);
          if(sendNotifStatus == 200 || sendNotifStatus == 201){
            toast("Invitation request accepted and notification sent to user !!!", {
              type: "success",
              onClose: ()=>{
                window.location.reload();
              }
            });
          }
          
        }
      }catch(err){
        toast("An error occurred try again", {
          type: "error",
        });
      }
    }else{
      try{
        const res = await api.put(`/invitations/${Number(data?.id)}`,{status: 'declined'});
        const sendNotifStatus = await saveNotification(loggedUser?.id, `Your request to join ${data?.name} has been declined`,data?.user_email);
        if(res.status == 200){
          if(sendNotifStatus == 200 || sendNotifStatus == 201){
            toast("Invitation request declined and user has been notified !!!", {
              type: "success",
            });
          }
        }
      }catch(err){
        toast("An error occurred try again", {
          type: "error",
        });
      }
    }
  }

  if(status === 'pending'){
    return   <div className='pending-status-container-request'>
                <button onClick={()=> toggleRequest('accept')} className="accept-button-request">
                      Accept Request
                    </button>
              <button onClick={()=> toggleRequest('decline')} className="decline-button-request">
                      Decline Request
                    </button>
            </div>
  }

  const getListOfAttendees = async ()=>{
    try{
        const res = await api.get(`/invitations/attendees/${eventId}`)
        if(res.status == 200){
          setAttendees([...res.data])
          setIsLoaded(true)
        }
    }catch(err){
      toast('An error when fetching attendees of event',{
        type:'error'
      })
    }
  }

  if(status == 'accepted'){
    if(!isLoaded){
      getListOfAttendees();
    }
  }

  return(
    <>
      {status == 'accepted' && 
        <div className='w-full h-auto p-2 flex flex-row items-around'>
          <h3 className='text-green-700 font-bold text-xl'>Attendees: </h3>
          {
            attendees?.map((item,index)=>(
              <span key={index} className='p-1 rounded bg-yellow-500 text-white mx-1'>{item}</span>
            ))
          }
        </div>
      }
      {status == 'declined' && <h3 className='text-red-500'>Request Declined !!!</h3>}
    </>
  )
};