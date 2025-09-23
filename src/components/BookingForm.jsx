import React from 'react'

const BookingForm = () => {
  return (
    <div className='booking-form-container'>
        <h1>Boka pass "HIIT 45"</h1>
        <form className='booking-form'>
            <label htmlFor="name" className='booking-label'>Namn:</label>
            <input type="text" id="name" name="name" required className='booking-input'/>

            <label htmlFor="email" className='booking-label'>E-post:</label>
            <input type="email" id="email" name="email" required className='booking-input'/>

            <label htmlFor="date" className='booking-label'>Datum:</label>
            <input type="date" id="date" name="date" required className='booking-input'/>

            <label htmlFor="time" className='booking-label'>Tid:</label>
            <input type="time" id="time" name="time" required className='booking-input'/>

            <button type="submit" className='booking-button'>Boka</button>

        </form>
    </div>
  )
}

export default BookingForm