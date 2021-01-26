import React, {useState} from 'react'
import "./content.css";

const Overlay = ({name}) => {
    const [isVisible, setIsVisible] = useState(true)
    return (
        <div>
        {isVisible && 
            <div className='my-extension'>This is {name}</div>
        }
        </div>
        
    )
}

export default Overlay;