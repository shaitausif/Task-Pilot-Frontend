import React from 'react'
import UserDashboard from '../../../../components/dashboard/UserDashboard'

export const metadata = {
  'title' : "TaskPilot - Dashboard",
  "description" : "See your Dashboard"
}


const page = () => {
  return (
    <UserDashboard />
  )
}

export default page
