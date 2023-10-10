import React from 'react'
import { Link } from 'react-router-dom'

const Header = () => {
  return (
    <div className='bg-slate-200'>
        <div className='flex justify-between items-center max-w-full p-3 mr-[50px]'>
            <Link to='/'>
            <h1 className='text-2xl font-bold'>Auth</h1>
            </Link>
            <ul className='flex gap-3'>
                <Link to='/' >
                <li>Home</li>
                </Link>
                <Link to='/about'>
                <li>About</li>
                </Link>
                <Link to='/signin'>
                <li>Sign In</li>
                </Link>
            </ul>
        </div>
    </div>
  )
}

export default Header