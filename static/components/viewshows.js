const viewshows = {
  template: `
  <div>
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <a class="navbar-brand" href="#">Admin Dashboard</a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav"
            aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav ml-auto">
                <li class="nav-item">
                    <router-link to="/profile" class="nav-link">Admin Profile</router-link>
                </li>
                <li class="nav-item">
                    <router-link to="/summary" class="nav-link">Summary</router-link>
                </li>
                <li class="nav-item">
                <router-link to="/export-csv" class="nav-link">Export CSV</router-link>
                </li>
                <li class="nav-item">
                    <button class="nav-link btn btn-secondary" @click="logout">Logout</button>
                </li>
            </ul>
        </div>
    </nav>
      <div>
        <h2>Available Shows</h2>
        <div v-if="shows.length !== 0">
          <div class="row">
            <div class="col-md-4 mb-4" v-for="show in shows" :key="show.show_id">
              <div class="card">
                <img :src="'./static/images/' + show.show_img" class="card-img-top" alt="Show Image" height="100px"
                width="70px">
                <div class="card-body">
                  <h5 class="card-title">{{ show.show_name }}</h5>
                  <p class="card-text">Rating: {{ show.show_rating }}</p>
                  <p class="card-text">Genre: {{ show.show_genre }}</p>
                  <p class="card-text">Date: {{ show.show_date }}</p>
                  <p class="card-text">Time: {{ show.show_time }}</p>
                  <p class="card-text">Price: {{ show.show_price }}</p>
                  <div class="d-flex">
                  <button @click="deleteShow(show.show_id)" class="btn btn-danger">Delete Show</button>
                  <router-link :to="venueId +'/update_show/'+ show.show_id" class="btn btn-warning">Update Show</router-link>
                  </div> 
                  </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else>
          <p>No shows available.</p>
        </div>
        <router-link :to="venueId+'/create_show'" class="btn btn-primary">Add Show</router-link>
      </div>
      </div>
    `,
  data() {
    return {
      shows: [],
      venueId: 0
    };
  },
  async mounted() {
    this.venueId = this.$route.params.venue_id;
    await this.fetchShows();
  },
  methods: {
    async fetchShows() {
      try {
        const response = await fetch(`/api/admin/${this.venueId}`, {
          method: 'GET',
          headers: {
            'Content-type': "application/json",
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          console.log(data)
          if (data.message === "Show not found") {
            this.shows = []; // Set venues array to an empty list
          } else {
            this.shows = data; // Populate venues array with fetched data
          }
        } else {
          console.error('Failed to fetch venues');
        }
      } catch (error) {
        console.error('An error occurred:', error);
      }
    },
    async deleteShow(showId) {
      const confirmDelete = confirm('Are you sure you want to delete this show?');
      if (confirmDelete) {
        try {
          const response = await fetch(`/api/admin/${this.venueId}/${showId}/delete`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });
          if (response.ok) {
            alert('Show deleted successfully');
            await this.fetchShows();
          } else {
            console.error('Failed to delete show');
          }
        } catch (error) {
          console.error('An error occurred:', error);
        }
      }
    },
    logout: async function () {
      const req = await fetch("/api/admin/logout", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
      })

      const d = await req.json();
      if (req.ok) {
        localStorage.removeItem('token');
        alert("Logout Successful")
        this.$router.replace({ path: '/login' })
      } else {
        alert(d.message)
      }
    }
  }
};

export default viewshows;
