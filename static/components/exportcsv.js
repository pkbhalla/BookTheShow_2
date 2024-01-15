const exportcsv = {
    template: `
    <div>
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <a class="navbar-brand">Admin Dashboard</a>
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
        <h2>Export CSV Dashboard</h2>
        <div v-if="venues.length !== 0">
          <div v-for="venue in venues" :key="venue.venue_id">
            <p>
            <button @click="exportVenueCSV(venue.venue_id)" class="btn btn-secondary">
            {{ venue.venue_name }}
          </button>
            </p>
          </div>
        </div>
        <div v-else>
          <p>No venues found.</p>
        </div>
      </div>
      </div>
    `,
    data() {
      return {
        venues: []
      };
    },
    mounted() {
      this.fetchVenues();
    },
    methods: {
      async fetchVenues() {
        const token = localStorage.getItem('token'); // Get JWT token from local storage
        const url = '/api/admin'; // Replace with the appropriate API endpoint
  
        try {
          const response = await fetch(url, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
  
          const data = await response.json();
  
          if (response.ok) {
            this.venues = data;
          } else {
            // Handle error response
            console.error('Error fetching venues:', data.message);
          }
        } catch (error) {
          console.error('An error occurred:', error);
        }
      },
        exportVenueCSV: async function(venueId) {
          const token = localStorage.getItem('token');
          const url = `/api/admin/export?venue_id=${venueId}`;
      
          try {
            const response = await fetch(url, {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${token}`
              }
            });
      
            const data = await response.json();
      
            if (response.ok) {
              alert(data.message); // Display success message
              this.$router.push('/dashboard');
            } else {
              alert(data.message); // Display error message
            }
          } catch (error) {
            console.error('An error occurred:', error);
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
  
  export default exportcsv;
  