const userprofile = {
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
      <div class="container mt-5">
        <div class="card" style="width: 18rem">
          <img :src="'./static/images/' + profile.img" class="card-img-top" alt="User Image">
          <div class="card-body">
            <h5 class="card-title">{{ profile.name }}</h5>
            <p class="card-text">{{ profile.username }}</p>
            <p class="card-text">{{ profile.email }}</p>
            <p class="card-text">{{ profile.place }}</p>
          </div>
        </div>
      </div>
      </div>
    `,
    data() {
      return {
        profile: {}
      };
    },
    created() {
      this.fetchUserProfile();
    },
    methods: {
      async fetchUserProfile() {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch('/api/user/profile', {
            headers: {
              Authorization: 'Bearer ' + token
            }
          });
  
          if (response.ok) {
            const data = await response.json();
            this.profile = data;
          } else {
            console.error('Failed to fetch user profile');
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
    
    }
    }
  };
  
  export default userprofile;
  