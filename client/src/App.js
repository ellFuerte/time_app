import {useContext,useState} from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import {useParams} from "react-router-dom";
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
import AdminPanel from './components/AdminPanel/AdminPanel'


function App() {

  function ProfileRoute({ authUser }) {

    let  username = useParams()

    if (authUser.isAdmin===false && authUser._id !== username.username) {

      return <Error />
    }

    return <Profile/>
  }
  const {user} = useContext(AuthContext)
  const userStorage = JSON.parse(localStorage.getItem('user'))

  const authUser = user || userStorage


  return (
    <Router>
      <Switch>
        <Route exact path='/'>
          { authUser ? <Redirect to={`/department/${authUser.main_department}`}/> : <Redirect to='/login'/>}
        </Route>
        <Route path='/login'>
          { authUser ? <Redirect to={`/department/${authUser.main_department}`}/> : <Login/> }
        </Route>
        <Route path='/register'>
          { authUser ? <Redirect to='/'/> : <Register/> }
        </Route>
        <Route path='/profile/:username'>
          { authUser ? <ProfileRoute authUser={authUser} /> :<Login/>}
        </Route>
        <Route path='/department/:username'>
          { authUser ? <Department/> : <Login/>}
        </Route>
        <Route path='/Information'>
          { authUser ? <Information/> : <Login/> }
        </Route>
        <Route path='/Reports/'>
          { authUser ? <Reports/> : <Login/> }
        </Route>
        <Route path='/ReportsNominations/'>
          { authUser ? <ReportsNominations/> : <Login/> }
        </Route>
        <Route path='/ReportsHistory/'>
          { authUser ? <ReportsHistory/> : <Login/> }
        </Route>
        <Route path='/all_users'>
          { authUser ? <Department/> : <Login/> }
        </Route>
        <Route path='/not_working_today'>
          { authUser ? <Department/> : <Login/> }
        </Route>
        <Route path='/not_worked_yesterday'>
          { authUser ? <Department/> : <Login/> }
        </Route>
        <Route path='/sick_today'>
          { authUser ? <Department/> : <Login/> }
        </Route>
        <Route path='/sick_yesterday'>
          { authUser ? <Department/> : <Login/> }
        </Route>
        <Route path='/vacation_today'>
          { authUser ? <Department/> : <Login/> }
        </Route>
        <Route path='/vacation_yesterday'>
          { authUser ? <Department/> : <Login/> }
        </Route>
        <Route path='/Message'>
          { authUser ? <Message/> : <Login/> }
        </Route>
        <Route path='/VacanciesView'>
          { authUser ? <VacanciesView/> : <Login/> }
        </Route>
        <Route path='/VacanciesAdd/'>
        { authUser ? <VacanciesAdd /> : <Login/> }
      </Route>
        <Route path='/AdminPanel'>
          { authUser ? <AdminPanel/> : <Login/> }
        </Route>
        <Route path='/*'>
          <Error/>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
