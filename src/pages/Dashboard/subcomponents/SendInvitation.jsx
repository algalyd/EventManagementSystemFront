/* eslint-disable react/prop-types */
import { useState } from "react";
import './SendInvitation.css';

export default function SendInvitation({
  sendInvitation,
  setSelectedUsers,
  usersList,
  selectedUsers,
  data,
  closeModal
}) {

 const [value,setValue] = useState('Select user ...')

  const getSelectedUser=(id)=>{
    const user = usersList.find((item)=> item?.id == Number(id));
    setSelectedUsers((prevUsers)=> [...prevUsers,{eventId: data?.id, userEmail: user?.email,status: "pending"}]);
    setValue('Select user ...')
  }

  const removeUser=(index)=>{
    let arr = [...selectedUsers];
    arr = arr.filter((item,idx)=> idx!== index);
    setSelectedUsers([...arr])
  }

  return (
    <div className="invitation-container">
      <div className="content-invitation-container">
        <h2 className="invitation-title">Send Invitation To: </h2>

        <div className="user-selection-container">
            
          {
            selectedUsers?.map((user,index)=>(
                <div key={user?.username + index.toString()} className="user-badge">
                    <span className="text-white font-normal text-xs">{usersList.find((item)=> item.email == user?.userEmail)?.username}</span>
                    <span onClick={()=> removeUser(index)} className="remove-user-icon">&times;</span>
                </div>
            ))
          }
            
            <select value={value} className={`${value.includes('Select user') ? 'text-gray-500':''} border-none outline-none w-full`} onChange={(e)=> getSelectedUser(e.target.value)}>
                <option className="text-gray-100">Select user ...</option>
                {
                    usersList?.map((item)=>(
                        <option key={item?.id} value={item?.id}>{item?.username}</option>
                    ))
                }
            </select>
        </div>

      </div>

      <div className="button-invitation-container">
        <button
          onClick={() => sendInvitation()}
          className="send-invitation-button"
        >
          Send Invitation
        </button>
        <button
          onClick={() => closeModal()}
          className="cancel-invitation-button"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
