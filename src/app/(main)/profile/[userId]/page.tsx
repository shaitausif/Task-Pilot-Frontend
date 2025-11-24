'use client'
import React from 'react'
import UserProfile from '../../../../../components/users/UserProfile'
import { useParams } from 'next/navigation'







const page = () => {
    const params = useParams()
    const { userId } = params;


  return (
    <UserProfile userId={userId} />
  )
}

export default page