import { useContext, useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect, useParams
} from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import Error from "./pages/Error/Error";
import Login from "./pages/Login/Login";
import Profile from "./pages/Profile/Profile";
import Register from "./pages/Register/Register";
import Department from './pages/Department/Department';
import Information from "./pages/Information/Information";
import Reports from "./pages/Reports/Reports";
import ReportsNominations from "./pages/ReportsNominations/ReportsNominations";
import ReportsHistory from "./pages/ReportsHistory/ReportsHistory";
import Message from "./components/MessagePost/MessagePost";
import VacanciesView from "./components/VacanciesView/VacanciesView"
import VacanciesAdd from "./components/VacanciesAdd/VacanciesAdd"
import AdminPanel from './components/ProfileInfo/AdminPanel/AdminPanel'
import Layout from "./components/Layout/Layout";
import axios from "axios";
import Role from "./components/ProfileInfo/AdminPanel/Role/Role";



function App() {
  const [users, setUser] = useState([])

  const userStorage = JSON.parse(localStorage.getItem('user'))
  useEffect(() => {
    const fetchUserName = async () => {
      if(userStorage!==null) {
        const res = await axios.get('/api/user/' + userStorage._id)
        setUser(res.data)
      }
    }


    fetchUserName()
  },[])



  const {user} = useContext(AuthContext)
  const authUser = user || userStorage


  return (
      <Router>
        <Switch>
          <Route exact path="/">
            {authUser ? <Redirect to={`/department/${authUser.main_department}`} /> : <Redirect to="/login" />}
          </Route>
          <Route path="/login">
            {authUser ? <Redirect to={`/department/${authUser.main_department}`} /> : <Login />}
          </Route>
          <Route path="/register">
            {authUser ? <Redirect to="/" /> : <Register />}
          </Route>


            <Route path="/profile/:username">
              {authUser ? <Layout><Profile authUser={authUser} /></Layout>: <Login />}
            </Route>
            <Route path="/department/:username">
              {authUser ? <Layout><Department /></Layout> : <Login />}
            </Route>
            <Route path="/all_users">
              {authUser && userStorage.isAdmin ? <Layout><Department /></Layout> : <Error />}
            </Route>
            <Route path="/not_working_today">
              {authUser && userStorage.isAdmin ? <Layout><Department /></Layout> : <Error />}
            </Route>
            <Route path="/not_worked_yesterday">
              {authUser && userStorage.isAdmin ? <Layout><Department /></Layout> : <Error />}
            </Route>
            <Route path="/sick_today">
              {authUser && userStorage.isAdmin ? <Layout><Department /></Layout> : <Error />}
            </Route>
            <Route path="/sick_yesterday">
              {authUser && userStorage.isAdmin ? <Layout><Department /></Layout> : <Error />}
            </Route>
            <Route path="/vacation_today">
              {authUser && userStorage.isAdmin ? <Layout><Department /></Layout> :<Error />}
            </Route>
            <Route path="/vacation_yesterday">
              {authUser && userStorage.isAdmin ? <Layout><Department /></Layout> : <Error />}
            </Route>
            <Route path="/vacanciesview">
              {authUser && userStorage.isAdmin ? <Layout><VacanciesView /></Layout> : <Error />}
            </Route>
            <Route path="/adminpanel">
              {authUser && userStorage.isAdmin ? <Layout><AdminPanel /></Layout> : <Error />}
            </Route>
            <Route path="/reports">
              {authUser && userStorage.isAdmin  ? <Layout><Reports /></Layout> : <Error />}
            </Route>
            <Route path="/information">
              {authUser ? <Layout><Information /></Layout> : <Error />}
            </Route>
            <Route path="/reportsnominations">
              {authUser && userStorage.isAdmin ? <Layout><ReportsNominations /></Layout> : <Error />}
            </Route>
            <Route path="/reportshistory">
              {authUser && userStorage.isAdmin ? <Layout><ReportsHistory /></Layout> : <Error />}
            </Route>
          <Route path="/vacanciesadd">
            {authUser && userStorage.isAdmin ? <Layout><VacanciesAdd /></Layout> : <Error />}
          </Route>
          <Route path="/role">
            {authUser && userStorage.isAdmin ? <Layout><Role /></Layout> : <Error />}
          </Route>
          <Route path="*">
            <Error />
          </Route>
        </Switch>
      </Router>
  );
}

export default App;
