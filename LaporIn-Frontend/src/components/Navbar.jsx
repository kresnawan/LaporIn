import { Link } from "react-router-dom"
import Button from "./button/Button"

function Navbar() {
	return (
		<div className='w-full p-5 border-[0.5px] border-gray-300'>
			<div className='flex max-w-4xl justify-between items-center'>
				<div className='flex gap-10'>
					<div className="font-black">
						LaporIn
					</div>
					<div>
						<ul className='flex gap-4'>
							<Link to={`/`}>
								<li>Beranda</li>
							</Link>
							<Link to={`/aduan`}>
								<li>Aduan</li>
							</Link>
							<Link to={`/artikel`}>
								<li>Artikel</li>
							</Link>
						</ul>
					</div>
				</div>

				<div className="flex items-center">
					<Link to={`/edit-profil`}>
						<div className="w-7 h-7 bg-amber-300 rounded-full"></div>
					</Link>
					<Link to={`/login`}>
						<Button variant={`filled`}>Login</Button>
					</Link>
				</div>

			</div>
		</div>
	)
}

export default Navbar