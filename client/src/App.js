import {useContext,useState} from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
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
import AdminPanel from './components/AdminPanel/AdminPanel'
import Layout from "./components/Layout/Layout";



function App() {
  const [isLoading, setIsLoading] = useState(true);

  const {user} = useContext(AuthContext)
  const userStorage = JSON.parse(localStorage.getItem('user'))

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
            {authUser ? <Layout><Profile authUser={authUser} /></Layout> : <Login />}
          </Route>
          <Route path="/department/:username">
            {authUser ? <Layout><Department /></Layout> : <Login />}
          </Route>
          <Route path="/information">
            {authUser ? <Information /> : <Login />}
          </Route>
          <Route path="/reports">
            {authUser ? <Reports /> : <Login />}
          </Route>
          <Route path="/reportsnominations">
            {authUser ? <ReportsNominations /> : <Login />}
          </Route>
          <Route path="/reportshistory">
            {authUser ? <ReportsHistory /> : <Login />}
          </Route>
          <Route path="/all_users">
            {authUser ? <Department /> : <Login />}
          </Route>
          <Route path="/not_working_today">
            {authUser ? <Department /> : <Login />}
          </Route>
          <Route path="/not_worked_yesterday">
            {authUser ? <Department /> : <Login />}
          </Route>
          <Route path="/sick_today">
            {authUser ? <Department /> : <Login />}
          </Route>
          <Route path="/sick_yesterday">
            {authUser ? <Department /> : <Login />}
          </Route>
          <Route path="/vacation_today">
            {authUser ? <Department /> : <Login />}
          </Route>
          <Route path="/vacation_yesterday">
            {authUser ? <Department /> : <Login />}
          </Route>
          <Route path="/message">
            {authUser ? <Message /> : <Login />}
          </Route>
          <Route path="/vacanciesview">
            {authUser ? <VacanciesView /> : <Login />}
          </Route>
          <Route path="/vacanciesadd">
            {authUser ? <VacanciesAdd /> : <Login />}
          </Route>
          <Route path="/adminpanel">
            {authUser ?  <Layout><AdminPanel /></Layout> : <Login />}
          </Route>
          <Route path="*">
            <Error />
          </Route>
        </Switch>
      </Router>
  );
}

export default App;
