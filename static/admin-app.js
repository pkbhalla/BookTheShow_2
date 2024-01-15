import adminlogin from "./components/adminlogin.js"
import adminregister from "./components/adminregister.js"
import admindashboard from "./components/admindashboard.js"
import createvenue from "./components/createvenue.js"
import updatevenue from "./components/updatevenue.js"
import viewshows from "./components/viewshows.js"
import createshow from "./components/createshow.js"
import updateshow from "./components/updateshow.js"
import adminprofile from "./components/adminprofile.js"
import summary from "./components/adminsummary.js"
import exportcsv from "./components/exportcsv.js"

  const routes = [
    { path: "/" , redirect: '/login'},
    { path: "/login", component: adminlogin},
    { path: "/register", component: adminregister},
    { path: "/dashboard", component: admindashboard},
    { path: "/create_venue", component: createvenue},
    {path: "/summary", component: summary},
    { path: "/update_venue/:venue_id", component: updatevenue},
    {path: "/:venue_id/create_show", component: createshow},
    {path: "/:venue_id/update_show/:show_id", component: updateshow}, 
    { path: "/profile", component: adminprofile},
    { path: "/export-csv", component: exportcsv},
    { path: "/:venue_id", component: viewshows}
   
  ];
  
  const router = new VueRouter({
    routes,
  });
  
  new Vue({
    el: '#admin-app',
    router,
  });
  

  