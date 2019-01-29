import React from 'react';
import 'tachyons';
import Tilt from 'react-tilt'
import './Logo.css'
import brain from './brain.png';


const Logo = () => {
	return (
  <div className='ma4 mt0'>
<Tilt className="Tilt br2 shadow-2" options={{ max : 105 }} style={{ height: 150, width: 150 }} >
 <div className="Tilt-inner">
 <img alt='logo' style={{paddingTop: '35px'}} src={brain}/> </div>
</Tilt>
  </div>

		)
}
export default Logo;