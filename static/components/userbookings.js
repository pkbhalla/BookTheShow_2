const userbookings = {
    template: `
    <div>
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <a class="navbar-brand">User Dashboard</a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav"
            aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav ml-auto">
                <li class="nav-item">
                    <router-link class="nav-link" to="/profile">User Profile</router-link>
                </li>
                <li class="nav-item">
                    <router-link class="nav-link" to="/bookings">My Bookings</router-link>
                </li>
                <li class="nav-item">
                    <button class="nav-link btn btn-secondary" @click="logout">Logout</button>
                </li>
            </ul>
            <form class="form-inline ml-2" @submit.prevent="submitSearch">
                <input v-model="searchQuery" class="form-control mr-sm-2" type="search" placeholder="Search"
                    aria-label="Search">
                <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
            </form>

        </div>
    </nav>
      <div>
        <h2>User Bookings</h2>
        <table class="table">
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Show Name</th>
              <th>Show Date</th>
              <th>Show Time</th>
              <th>Show Rating</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="booking in bookings" :key="booking.booking_id">
              <td>{{ booking.bid }}</td>
              <td>{{ booking.show_name }}</td>
              <td>{{ booking.show_date }}</td>
              <td>{{ booking.show_time }}</td>
              <td>{{ booking.show_rating }}</td>
              <td>
                <button class="btn btn-primary" @click="rateShow(booking.show_id)">Rate</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      </div>
    `,
    data() {
      return {
        bookings: [],
      };
    },
    methods: {
      async rateShow(show_id) {
        this.$router.push(`/rate/${show_id}`);
      },
      async fetchBookings() {
        try {
          const response = await fetch('/api/user/bookings', {
            method: 'GET',
            headers: {
              'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
          });
  
          if (response.ok) {
            const bookings = await response.json();
            this.bookings = await Promise.all(bookings.map(async booking => {
              const showDetailsResponse = await fetch(`/api/user/show/${booking.show_id}`, {
                method: 'GET',
                headers: {
                  'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
              });
              
              if (showDetailsResponse.ok) {
                const showDetails = await showDetailsResponse.json();
                return {
                  ...booking,
                  ...showDetails
                };
              }
              
              return booking;
            }));
          } else {
            console.error('Failed to fetch bookings');
          }
        } catch (error) {
          console.error('An error occurred:', error);
        }
      },
      logout: async function(){
        const req = await fetch("/api/user/logout", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
        })

        const d = await req.json();
        if (req.ok) {
            localStorage.removeItem('token');
            this.$router.replace({ path: '/login' })
        } else {
            alert(d.message)
        }
    
    },
    },
    created() {
      this.fetchBookings();
    },
  };
  
  export default userbookings;
  