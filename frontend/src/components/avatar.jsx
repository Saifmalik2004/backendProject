import React, { useState, useEffect } from 'react';
import { PiUserCircle } from "react-icons/pi";
import { useSelector } from 'react-redux';

const Avatar = ({  name, imageUrl, width, height }) => {
    const onlineUser = useSelector(state => state?.user?.onlineuser);
  
    let avatarName = "";

    if (name) {
        const splitName = name.split(" ");
        if (splitName.length > 1) {
            avatarName = splitName[0][0] + splitName[1][0];
        } else {
            avatarName = splitName[0][0]; 
        }
    }

    

    

   
    return (
        <div 
            className={`text-slate-800 rounded-full shadow font-bold relative`} 
            style={{ width: width + "px", height: height + "px" }}
        >
            {
                imageUrl ? (
                    <img
                        src={imageUrl}
                        width={width}
                        height={height}
                        alt={name}
                        className='overflow-hidden rounded-full object-cover'
                        style={{ width: '100%', height: '100%' }}
                    />
                ) : (
                    name ? (
                        <div 
                            style={{ width: width + "px", height: height + "px" }} 
                            className={`overflow-hidden rounded-full flex justify-center items-center text-lg ${randomBgColor}`}
                        >
                            {avatarName} 
                        </div>
                    ) : (
                        <PiUserCircle size={width} />
                    )
                )
            }
           
        </div>
    );
}

export default Avatar;
