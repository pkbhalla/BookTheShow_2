import userlogin from "./components/userlogin.js"
import userregister from "./components/userregister.js"
import userdashboard from "./components/userdashboard.js"
import bookshow from "./components/bookshow.js"
import userbookings from "./components/userbookings.js"
import rate from "./components/rate.js"
import searchresults from "./components/searchresults.js"
import venuedetails from "./components/venuedetails.js"
import showdetails from "./components/showdetails.js"
import userprofile from "./components/userprofile.js"

const routes = [
  { path: "/" , redirect: '/login'},
  { path: "/login", component: userlogin},
  { path: "/register", component: userregister},
  { path: "/dashboard", component: userdashboard},
  { path: "/book/:show_id", component: bookshow},
  { path: "/bookings", component: userbookings},
  { path: "/rate/:show_id", component: rate},
  { path: "/searchresults", component: searchresults},
  { path: "/venue/:venue_id", component: venuedetails},
  { path: "/show/:show_id", component: showdetails},
  { path: "/profile", component: userprofile}
];

const router = new VueRouter({
  routes,
});

new Vue({
  el: '#user-app',
  router,
})