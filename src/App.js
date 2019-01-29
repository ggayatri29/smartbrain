import React, { Component } from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation'
import Logo from './components/Logo/Logo'
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm.js'
import Rank from './components/Rank/Rank.js'
import Particles from 'react-particles-js'
import FaceRecognition from './components/FaceRecognition/FaceRecognition.js'
import Signin from './signin/Signin.js'
import Register from './Register/Register.js'

const particlesOptions = {
  particles : {
  number : {
    value : 150,
    density : {
      enable : true,
      value_Area:800
    }
  }
  }
}

const intitialState = {
      input: '',
      imageUrl: '',
      box : {},
      route:'signin',
      isSignedIn: false,
      user:{
        id: '',
        name: '',
        email: '',
        entries:0,
        joined: ''
      }
}




class App extends Component {
  constructor(){
    super();
    this.state = intitialState;
   }

/*
componentDidMount() {
  fetch('http://localhost:3000')
  .then(response => response.json())
  .then(console.log)

}*/

   loadUser = (data) =>{
    this.setState({user: {
        id: data.id,
        name: data.name,
        email: data.name,
        entries:data.entries,
        joined: data.joined
    }})

   }

   calculateFaceLocation = (data) => {
     const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
     const image = document.getElementById('inputimage');
     const width = Number(image.width);
     const height = Number(image.height);
     return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col*width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
   }
 }

displayFaceBox = (box) => {
   this.setState({box :box});
   
}

onInputChange = (event) => {
 console.log(event.target.value);

 this.setState({input:event.target.value}); 
}

  
  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});
      fetch('http://localhost:3000/imageurl', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          input: this.state.input
        })
      })
      .then(response => response.json())
      .then(response => {
        if (response) {
          fetch('http://localhost:3000/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
            .then(response => response.json())
            .then(count => {
              this.setState(Object.assign(this.state.user, { entries: count}))
            })
            .catch(console.log)

        }
        this.displayFaceBox(this.calculateFaceLocation(response))
      })
      .catch(err => console.log(err));
  }
 
   
  onRouteChange = (routeval) => {
    if (routeval === 'signout') {
      this.setState(intitialState)
    } else if (routeval === 'home') {
      this.setState({ isSignedIn: true })
    }
    this.setState({route: routeval});
  }

    
 
render() {
    const { isSignedIn, imageUrl, route, box } = this.state;
    return (
      <div className="App">
         <Particles className='particles'
          params={particlesOptions}
        />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
        { route === 'home'
          ? <div>
              <Logo />
              <Rank
                name={this.state.user.name}
                entries={this.state.user.entries}
              />
              <ImageLinkForm
                onInputChange={this.onInputChange}
                onButtonSubmit={this.onButtonSubmit}
              />
              <FaceRecognition box={box} imageUrl={imageUrl} />
            </div>
          : (
             route === 'signin'
             ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
             : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
            )
        }
      </div>
    );
  }
}
export default App;
