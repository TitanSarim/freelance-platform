import React from 'react'

import {BsFingerprint,BsPostcard, BsHandIndex, BsHeadset} from 'react-icons/bs'



import "./NeedCard.css"

const NeedCard = () => {

  return (

    <div className='need_card_container'>

        <div className='need_card_container_header'>
            <p>Is It Urgent?</p>
            <span>Most viewed and Highly Skilled</span>
        </div>

        <div className='need_card_container_tabs'>

            <div className='need_card_container_tab'>
                <div className='need_card_container_icon'>
                    <BsPostcard size={40}/>
                </div>
                <p>Write Someting</p>
                <span>It is easy, just type in the search box, and keep going.</span>
            </div>

            <div className='need_card_container_tab'>
                <div className='need_card_container_icon'>
                    <BsHandIndex size={40}/>
                </div>
                <p>Choose a Freelancer</p>
                <span>Select a freelancer that you think it is best matched with your requirements.</span>
            </div>

            <div className='need_card_container_tab'>
                <div className='need_card_container_icon'>
                    <BsFingerprint size={40}/>
                </div>
                <p>Pay Safley</p>
                <span>We support a safe pay to our users with little or no charges.</span>
            </div>

            <div className='need_card_container_tab'>
                <div className='need_card_container_icon'>
                    <BsHeadset size={40}/>
                </div>
                <p>We're here to help</p>
                <span>We provide 24/7 customer support, and help to solve your quries.</span>
            </div>

        </div>

    </div>

  )
}

export default NeedCard