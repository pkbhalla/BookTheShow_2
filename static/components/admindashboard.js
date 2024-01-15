const admindashboard = {
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
    <div v-if="venues.length !== 0">
        <div class="venue-container">
            <div class="venue-card" v-for="venue in venues" :key="venue.venue_id">
                <img :src="'./static/images/'+venue.venue_img" alt="Venue Image" class="card-img-top" height="100px"
                    width="70px">
                <div class="card-body">
                    <h5 class="card-title">{{ venue.venue_name }}</h5>
                    <p class="card-text">{{ venue.venue_place }}</p>
                    <p class="card-text">{{ venue.venue_location }}</p>
                    <p class="card-text">Capacity: {{ venue.venue_capacity }}</p>
                    <div class="d-flex">
                        <router-link :to="'/update_venue/' + venue.venue_id" class="btn btn-warning">Update
                            Venue</router-link>
                        <button @click="deleteVenue(venue.venue_id)" class="btn btn-danger">Delete Venue</button>
                    </div>
                    <router-link :to="'/'+venue.venue_id" class="btn btn-success">Available
                        Shows</router-link>
                </div>
            </div>
        </div>
        </br>
        <router-link to="/create_venue" class="btn btn-primary"> Add Venue </router-link>
    </div>
    <div v-else>
        <p>No venues found.</p>
        <router-link to="/create_venue" class="btn btn-primary"> Add Venue </router-link>
    </div>
</div>
    `,
    data() {
        return {
            venues: [],
        };
    },
    methods: {
        async fetchVenues() {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.error('Token not found');
                    return;
                }

                const response = await fetch('/api/admin', {
                    method: "GET",
                    headers: {
                        'Content-type': "application/json",
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.message === "No venues found") {
                        this.venues = []; // Set venues array to an empty list
                    } else {
                        this.venues = data; // Populate venues array with fetched data
                    }
                } else {
                    console.error('Failed to fetch venues');
                }

            } catch (error) {
                console.error('An error occurred:', error);
            }
        },
        async deleteVenue(venueId) {
            try {
                if (confirm('Are you sure you want to delete this venue? This will delete all shows inside the venue as well.')) {
                    const token = localStorage.getItem('token');
                    if (!token) {
                        console.error('Token not found');
                        return;
                    }

                    const response = await fetch(`/api/admin/${venueId}/delete`, {
                        method: 'DELETE',
                        headers: {
                            'Content-type': "application/json",
                            'Authorization': `Bearer ${token}`,
                        },
                    });

                    if (response.ok) {
                        console.log('Venue deleted successfully');
                        this.fetchVenues();
                    } else {
                        console.error('Failed to delete venue');
                    }
                }
            } catch (error) {
                console.error('An error occurred:', error);
            }
        },
        logout: async function(){
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
    },
    mounted() {
        this.fetchVenues();
    },
};

export default admindashboard;
