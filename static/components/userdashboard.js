const userdashboard = {
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
    <div class="row">
        <div class="col-md-4" v-for="(venue, index) in venues" :key="index">
            <div class="card mb-3">
                <img :src="'./static/images/'+ venue.venue_img" class="card-img-top" alt="Venue Image" height="250px"
                    width="50px">
                <div class="card-body">
                    <h5 class="card-title">{{ venue.venue_name }}</h5>
                    <p class="card-text">Place: {{ venue.venue_place }}</p>
                    <p class="card-text">Location: {{ venue.venue_location }}</p>
                    <div v-for="show in venue.shows" :key="show.show_name">
                        <div class="card mb-2">
                            <img :src="'./static/images/'+ show.show_img" class="card-img-top" alt="Show Image">
                            <div class="card-body">
                                <h6 class="card-title">{{ show.show_name }}</h6>
                                <p class="card-text">{{ show.show_date }} | {{ show.show_time }}</p>
                                <p class="card-text">Rating: {{ show.show_rating }}</p>
                                <button class="btn btn-primary" @click="bookShow(show.show_id)">Book Show</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
    `,
    data() {
      return {
        venues: [],
        searchQuery:''
      };
    },
    created() {
      this.fetchUserDashboard();
    },
    methods: {
      async fetchUserDashboard() {
        try {
          const response = await fetch('/api/user', {
            method: 'GET',
            headers: {
              'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
          });
  
          if (response.ok) {
            const data = await response.json();
            this.venues = data.venues;
          } else {
            console.error('Failed to fetch user dashboard');
          }
        } catch (error) {
          console.error('An error occurred:', error);
        }
      },
      bookShow(show_id) {
        this.$router.push(`/book/${show_id}`);
      },
      async submitSearch() {
        // Redirect to the search results page with the search query as a parameter
        this.$router.push({ path: '/searchresults', query: { query: this.searchQuery } });
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
    
    }
    }
  };
  
  export default userdashboard;
  