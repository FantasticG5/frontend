import React, { useState } from 'react'

const BookingButton = ({buttonText, onClick}) => {
    const [text, setText] = useState(buttonText);
    const [functionality, setFunctionality] = useState('book');

  return (
    <div>
        <button 
            className='btn-book'
            onClick={() => {
                // setFunctionality('book')
                // setText('Bokad')
                if (onClick) onClick();
            }}

        >{text}</button>
    </div>
  )
}

export default BookingButton