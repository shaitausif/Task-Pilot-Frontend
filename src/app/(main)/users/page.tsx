import React from 'react'
import UserList from '../../../../components/users/UserList'


export const metadata = {
  'title' : "TaskPilot - Users",
  "description" : "See the Users using this platform."
}



const page = () => {
  return (
    <UserList />
  )
}

export default page
