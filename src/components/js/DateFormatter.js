import React from 'react'

const DateFormatter = ({ value }) => {

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const msd = new Date(Number(value));
  let date = msd.getDate();
  const month = months[msd.getMonth()];
  const year = msd.getFullYear();
  const h = msd.getHours();
  const m = msd.getMinutes();

  if (date < 10) {
    date = '0' + date;
  }
  const ampm = (((h / 12) % 12) > 1) && (((h / 12) % 12) < 2) ? 'PM' : 'AM'
  return `${month} ${date}, ${year} at ${h}:${m} ${ampm}`;


}

export default DateFormatter
