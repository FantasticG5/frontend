import React, { useState } from 'react'

const BookingButton = ({buttonText}) => {
    const [text, setText] = useState(buttonText);
    const [functionality, setFunctionality] = useState('book');

  return (
    <div>
        <button 
            className='btn-book'
            onClick={() => {
                setFunctionality('book')
                setText('Bokad')
            }}

        >{text}</button>
    </div>
  )
}

export default BookingButton