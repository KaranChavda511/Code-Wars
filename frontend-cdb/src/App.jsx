import { Routes, Route } from 'react-router-dom';
import Layout from './components/Shared/Layout.jsx';
import PrivateRoute from './components/Shared/PrivateRoute.jsx';
import Home from './pages/Home.jsx';
import ChallengePage from './pages/ChallengePage.jsx';
import MultiplayerPage from './pages/MultiplayerPage.jsx';
import LeaderboardPage from './pages/LeaderboardPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import AdminPage from './pages/AdminPage.jsx';
import Login from './components/Auth/Login.jsx';
import Signup from './components/Auth/Signup.jsx';
// import ChallengeList from './components/Challenges/ChallengeList.jsx'
import AllChallengeList from './components/Challenges/AllChallengeList.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx';
import './assets/variables.css';


function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Public Routes */}
        <Route index element={<Home />} />
        {/* <Route path="/challenges" element={<ChallengePage />} /> */}
        <Route path="/challenges" element={<AllChallengeList />} />
        <Route path="/challenges/:id" element={<ChallengePage />} />
        {/* <Route path="/challenges/:id" element={<ChallengeView />} /> */}
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {/* Private Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/profile/*" element={<ProfilePage />} />
          <Route path="/multiplayer/*" element={<MultiplayerPage />} />
        </Route>

        {/* Admin Routes */}
        <Route element={<PrivateRoute adminOnly />}>
          <Route path="/admin/*" element={<AdminPage />} />
        </Route>

        {/* 404 Catch All */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
    // <>
    //   <h1 class="text-3xl bg-gray-500 font-bold underline">
    //     Hello world!
    //   </h1>
    // </>
  );
}

export default App;