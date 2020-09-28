import React, { useState, useEffect } from 'react'
import '../css/Banner.css';
import cardData from '../../pages/cardData';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';


const Banner = () => {
  const [countleft, setCountLeft] = useState(0);
  const [url, setUrl] = useState(null);


  useEffect(() => {

    setUrl(cardData[Math.floor(Math.random() * cardData.length)].Url)

  }, [countleft])



  return (
    <header className='banner'
      style={{
        backgroundImage: `url(${url})`,
        backgroundSize: 'cover'
      }}
    >

      <div className="banner_btns">
        <button className="banner_btn"></button>
        <button className="banner_btn"></button>
      </div>
    </header>
  )
}

export default Banner
