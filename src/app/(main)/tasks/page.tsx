import React from 'react'
import UserTasks from '../../../../components/tasks/UserTasks'

export const metadata = {
  title : "TaskPilot - Manage Tasks",
  description : "Manage your workflow's Tasks"
}


const page = () => {
  return (
    <UserTasks />
  )
}

export default page
