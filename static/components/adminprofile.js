const adminprofile = {
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
          const response = await fetch('/api/admin/profile', {
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
  
  export default adminprofile;
  