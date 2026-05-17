import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleDown, faCircleUp } from '@fortawesome/free-regular-svg-icons'
import { faCircleDown as faCircleDownSolid, faCircleUp as faCircleUpSolid } from '@fortawesome/free-solid-svg-icons'

import React, { useState } from 'react'
import api from '../axios/axiosInstance';

function VoteBar({ reportId, upvoteCount, downvoteCount, setTick, tick, userVote }) {
    const [upvoteIcon, setUpvoteIcon] = useState(faCircleUp);
    const [downvoteIcon, setDownvoteIcon] = useState(faCircleDown);
    async function handleUpvote() {
        try {
            await api.patch(`/report?id=${reportId}`, { upvote: true });
        } catch (error) {
            console.log(error);
        } finally {
            setTick(tick + 1);
        }
    }

    async function handleDownvote() {
        try {
            await api.patch(`/report?id=${reportId}`, { downvote: true });
        } catch (error) {
            console.log(error);
        } finally {
            setTick(tick + 1)
        }
    }

    return (
        <div className='flex items-center gap-3 mt-2 text-sm'>
            <div
                className='cursor-pointer'
                onMouseEnter={() => setUpvoteIcon(faCircleUpSolid)}
                onMouseLeave={() => setUpvoteIcon(faCircleUp)}
                onClick={handleUpvote}
            >
                <FontAwesomeIcon icon={userVote ? (userVote === 1 ? (faCircleUpSolid) : (upvoteIcon)) : (upvoteIcon)} className='text-green-600' />
                <span> {upvoteCount}</span>
            </div>
            <div
                className='cursor-pointer'
                onMouseEnter={() => setDownvoteIcon(faCircleDownSolid)}
                onMouseLeave={() => setDownvoteIcon(faCircleDown)}
                onClick={handleDownvote}
            >
                <FontAwesomeIcon icon={userVote ? (userVote === -1 ? (faCircleDownSolid) : (downvoteIcon)) : (downvoteIcon)} className='text-red-600' />
                <span> {downvoteCount}</span>
            </div>
        </div>
    )
}

export default VoteBar