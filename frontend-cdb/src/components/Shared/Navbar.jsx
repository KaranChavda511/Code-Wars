// import React from 'react';
// import { Link, NavLink } from 'react-router-dom';
// import { useAuth } from '../../contexts/AuthContext.jsx';
// import './navbar.css'


// const Navbar = ({ user }) => {
//   const { logout } = useAuth();

//   return (

//     <nav className=" navbar">
//       <div className="logoDiv">
//         <NavLink to="/" className="logo">
//           CDB
//         </NavLink>
//       </div>

//       <div className="navbar-links">
//         <NavLink
//           to="/challenges"
//           // className={` navbarLinks ${isActive => isActive ? 'activeColor' : ''}`} // isme dikkat hai jiska problem and solution niche likha hai
//           className={({ isActive }) =>
//             `navbarLinks ${isActive ? "activeColor" : ""}`
//           }
//         >
//           {/**
//            * Problem:
//            * bhai ye code hai,
//            * 
//            * <div className="navbar-links">
//            *         <NavLink to="/challenges" className={` navbarLinks ${ isActive  => isActive ? 'activeColor' : '' }`}>
//            *           Challenges
//            *         </NavLink>
//            *         <NavLink to="/multiplayer" className={` navbarLinks ${ isActive  => isActive ? 'activeColor' : '' }`}>
//            *           Multiplayer
//            *         </NavLink>
//            *         <NavLink to="/leaderboard" className={` navbarLinks ${ isActive  => isActive ? 'activeColor' : '' }`}>
//            *           Leaderboard
//            *         </NavLink>
//            *       </div>
//            * 
//            * isme me kuch se css likh raha hu but isme vo callback function ke andar vali class apply hi nahi ho rhai hai iska solution batao and uss se pehle ye problem kyu ho rahi hai vo batao yrr
//            * 
//            * Solution:
//            * Bhai perfect sawaal hai 🔥  
//            * Pehle **problem kyu ho rahi hai**, fir **solution deta hoon**.
//            * 
//            * ---
//            * 
//            * ### ❌ Problem kyu ho rahi hai?
//            * 
//            * ```jsx
//            * className={` navbarLinks ${ isActive => isActive ? 'activeColor' : '' }`}
//            * ```
//            * 
//            * Yaha tum `isActive => ...` **arrow function ko string interpolation ke andar** daal rahe ho — lekin React ka `NavLink` expect karta hai:
//            * 
//            * ```js
//            * className={({ isActive }) => "className" }
//            * ```
//            * 
//            * Lekin tumne us function ko **template string** me daal diya, isliye wo **kabhi execute hi nahi hota** — sirf ek function object ban ke reh jata hai.
//            * 
//            * ---
//            * 
//            * ### ✅ Solution:
//            * 
//            * ```jsx
//            * <NavLink
//            *   to="/challenges"
//            *   className={({ isActive }) =>
//            *     `navbarLinks ${isActive ? "activeColor" : ""}`
//            *   }
//            * >
//            *   Challenges
//            * </NavLink>
//            * ```
//            * 
//            * 👆 yaha pe `className` ko **direct function** diya gaya hai — React Router khud `isActive` pass karega, aur tum uske basis pe class de rahe ho.
//            * 
//            * ---
//            * 
//            * ### 🔁 Same fix baaki links me bhi:
//            * 
//            * ```jsx
//            * <NavLink
//            *   to="/multiplayer"
//            *   className={({ isActive }) =>
//            *     `navbarLinks ${isActive ? "activeColor" : ""}`
//            *   }
//            * >
//            *   Multiplayer
//            * </NavLink>
//            * 
//            * <NavLink
//            *   to="/leaderboard"
//            *   className={({ isActive }) =>
//            *     `navbarLinks ${isActive ? "activeColor" : ""}`
//            *   }
//            * >
//            *   Leaderboard
//            * </NavLink>
//            * ```
//            * 
//            * ---
//            * 
//            * ### 🔵 Bonus Tip (Tailwind Style):
//            * 
//            * Agar `navbarLinks` aur `activeColor` Tailwind ke class names hain, to make sure wo Tailwind config me scan ho rahe hoon.  
//            * Ya to direct likho:
//            * 
//            * ```jsx
//            * className={({ isActive }) =>
//            *   `text-white px-4 py-2 ${isActive ? "bg-blue-500" : ""}`
//            * }
//            * ```
//            * 
//            * ---
//            * 
//            * Batao bhai — ab navbar ka styling active dikh raha kya? 
//            */}
//           Challenges
//         </NavLink>
//         <NavLink
//           to="/multiplayer"
//           className={({ isActive }) =>
//             `navbarLinks ${isActive ? "activeColor" : ""}`
//           }
//         >
//           Multiplayer
//         </NavLink>
//         <NavLink
//           to="/leaderboard"
//           className={({ isActive }) =>
//             `navbarLinks ${isActive ? "activeColor" : ""}`
//           }
//         >
//           Leaderboard
//         </NavLink>
//       </div>

//       <div className="navbar-auth">
//         {user ? (
//           <>
//             <div className="user-info">
//               <span className="username">{user.username}</span>
//               <span className="score">{user.score} pts</span>
//             </div>
//             <NavLink to="/profile" className="profile-link">
//               Profile
//             </NavLink>
//             {user.role === 'admin' && (
//               <NavLink to="/admin" className="admin-link">
//                 Admin
//               </NavLink>
//             )}
//             <button onClick={logout} className="logout-btn">
//               Logout
//             </button>
//           </>
//         ) : (
//           <>
//             <NavLink to="/login" className="login-btn">
//               Login
//             </NavLink>
//             <NavLink to="/signup" className="signup-btn">
//               SignUp
//             </NavLink>
//           </>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;






// css ke liye new code

import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import './navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="logoDiv">
        <NavLink to="/" className="logo">CDB</NavLink>
      </div>

      <div className="navbar-links">
        <NavLink to="/challenges" className={({ isActive }) => `navbarLinks ${isActive ? 'activeColor' : ''}`}>Challenges</NavLink>
        <NavLink to="/multiplayer" className={({ isActive }) => `navbarLinks ${isActive ? 'activeColor' : ''}`}>Multiplayer</NavLink>
        <NavLink to="/leaderboard" className={({ isActive }) => `navbarLinks ${isActive ? 'activeColor' : ''}`}>Leaderboard</NavLink>
      </div>

      <div className="navbar-auth">
        {user ? (
          <>
            <div className="user-info">
              <span className="username">{user.username}</span>
              <span className="score">{user.score} pts</span>
            </div>
            <NavLink to="/profile" className="profile-link">Profile</NavLink>
            {user.role === 'admin' && <NavLink to="/admin" className="admin-link">Admin</NavLink>}
            <button onClick={logout} className="logout-btn">Logout</button>
          </>
        ) : (
          <>
            <NavLink to="/login" className="login-btn">Login</NavLink>
            <NavLink to="/signup" className="signupBtn">SignUp</NavLink>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;



// iss vale me dark mode toggle karne ka logic hai but iske css me kuch dikkat hai usse baad me solve karke isse fir se apply kar dunga abhi ke liye upper vale code se kaam chalata hu.
// // niche vale code me darkmode ke liye button add kar di hai.
// import React, { useEffect, useState } from 'react';
// import { NavLink } from 'react-router-dom';
// import { useAuth } from '../../contexts/AuthContext.jsx';
// import './navbar.css';

// const Navbar = () => {
//   const { user, logout } = useAuth();
//   const [theme, setTheme] = useState('light');

//   useEffect(() => {
//     document.documentElement.setAttribute('data-theme', theme);
//   }, [theme]);

//   const toggleTheme = () => {
//     setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
//   };

//   return (
//     <nav className="navbar">
//       <div className="logoDiv">
//         <NavLink to="/" className="logo">CDB</NavLink>
//       </div>

//       <div className="navbar-links">
//         <NavLink to="/challenges" className={({ isActive }) => `navbarLinks ${isActive ? 'activeColor' : ''}`}>Challenges</NavLink>
//         <NavLink to="/multiplayer" className={({ isActive }) => `navbarLinks ${isActive ? 'activeColor' : ''}`}>Multiplayer</NavLink>
//         <NavLink to="/leaderboard" className={({ isActive }) => `navbarLinks ${isActive ? 'activeColor' : ''}`}>Leaderboard</NavLink>
//       </div>

//       <div className="navbar-auth">
//         <label className="theme-switch">
//           <input type="checkbox" onChange={toggleTheme} checked={theme === 'dark'} />
//           <span className="slider"></span>
//         </label>

//         {user ? (
//           <>
//             <div className="user-info">
//               <span className="username">{user.username}</span>
//               <span className="score">{user.score} pts</span>
//             </div>
//             <NavLink to="/profile" className="profile-link">Profile</NavLink>
//             {user.role === 'admin' && <NavLink to="/admin" className="admin-link">Admin</NavLink>}
//             <button onClick={logout} className="logout-btn">Logout</button>
//           </>
//         ) : (
//           <>
//             <NavLink to="/login" className="login-btn">Login</NavLink>
//             <NavLink to="/signup" className="signupBtn">SignUp</NavLink>
//           </>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;
