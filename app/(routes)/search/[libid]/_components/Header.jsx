import { UserButton } from '@clerk/nextjs'
import { Clock, Link, Send } from 'lucide-react'
import moment from 'moment'
import React from 'react'
import { Button } from '../../../../../components/ui/button'

function Header({searchInputRecord}) {
  return (
    <div className='w-full p-4 border-b flex justify-between items-center'>
        <div className='flex items-center gap-2'>

        <UserButton/>
        <div className='flex gap-1 justify-center items-center'> 
            <Clock className='h-5 w-5 text-gray-500'/>
            <h2>{ moment(searchInputRecord?.created_at).fromNow()}</h2>
        </div>
        </div>
        <h2 className='line-clamp-1 max-w-md'>{searchInputRecord?.searchinput}</h2>
        <div className='flex gap-3'>
            <Button><Link/></Button>
            <Button><Send/>Share</Button>
        </div>

    </div>
  )
}

export default Header