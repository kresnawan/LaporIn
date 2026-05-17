import { SyncLoader } from 'react-spinners'

function LoadingAnimation() {
	return (
		<div className='flex justify-center'>
			<SyncLoader size={15} color='#4a7ce7' />
		</div>
	)
}

export default LoadingAnimation