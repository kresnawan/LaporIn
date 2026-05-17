import React from 'react'
import { MoonLoader } from 'react-spinners'

function LoadingAnimation() {
	return (
		<div className='flex justify-center'>
			<MoonLoader size={30} color='#4a7ce7' />
		</div>
	)
}

export default LoadingAnimation