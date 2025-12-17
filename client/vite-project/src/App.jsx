// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App


// import React from 'react'

// const App = () => {
//   return (
//     <div>
//       <h1 className='bg-red-300'>hello</h1>
//     </div>
//   )
// }

// export default App



// import SignUp from './SignUp'
// import Login from './Login'
// import { Route, Routes } from 'react-router-dom'
// import Forget from './Forget'
// import Upload from './Upload'
// import Home from './Homepage';



// // import Reset from './Reset'
// // import VerifyOTP from './VerifyOTP'
// import './App.css'
// // import OTPgenetate from './OTPgenetate'
// const App = () => {
//   return (
//     <div>
//       {/* <RBACapp/> */}
//       {/* <ResetPassWord/> */}
//       <Routes>
//         <Route   path='/' element={<Login/>}/>
//         <Route   path='/signup' element={<SignUp/>}/>
//         <Route   path='/forgot-password' element={<Forget/>}/>
//         <Route path='/upload' element={< Upload/>}/>
//         <Route path='/home' element={< Homepage/>}/> 
        
       
//       </Routes>


//     </div>
//   )
// }

// export default App 








import SignUp from './SignUp';
import Login from './Login';
import { Route, Routes } from 'react-router-dom';
import Forget from './Forget';
import Upload from './Upload';
import Profile from './Profile';
import Home from './Homepage';
import './App.css';


const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/signUp' element={<SignUp />} />
        <Route path='/forgot-password' element={<Forget />} />
        <Route path='/upload' element={<Upload />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/home' element={<Home/>}/>
      </Routes>
    </div>
  );
}

export default App;

