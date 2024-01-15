const userlogin = {
  template: `
    <section class="vh-100 gradient-custom-user">
      <div class="container py-5 h-100">
        <div class="row d-flex justify-content-center align-items-center h-100">
          <div class="col-12 col-md-8 col-lg-6 col-xl-5">
            <div class="card bg-dark text-white" style="border-radius: 1rem;">
              <div class="card-body p-5 text-center">
                <div class="mb-md-5 mt-md-4 pb-5">
                  <h2 class="fw-bold mb-2 text-uppercase">User Login</h2>
                  <p class="text-white-50 mb-5">Please enter your username and password!</p>
                  <div class="form-outline form-white mb-4">
                    <input v-model="username" type="text" id="typeUsernameX" class="form-control form-control-lg" />
                    <label class="form-label" for="typeUsernameX">Username</label>
                  </div>
                  <div class="form-outline form-white mb-4">
                    <input v-model="password" type="password" id="typePasswordX" class="form-control form-control-lg" />
                    <label class="form-label" for="typePasswordX">Password</label>
                  </div>
                  <button @click="login" class="btn btn-outline-light btn-lg px-5" type="button">Login</button>
                </div>
                <div>
                  <p class="mb-0">Don't have an account? <router-link to="/register" class="text-white-50 fw-bold">Register here</router-link></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  data() {
      return {
          username: '',
          password: ''
      };
  },
  methods: {
      async login() {
          const queryParams = new URLSearchParams({
              username: this.username,
              password: this.password
          });

          try {
              const response = await fetch(`/api/user/login?${queryParams}`, {
                  method: 'GET',
                  headers: {
                      'Content-Type': 'application/json'
                  }
              });
              
              if (response.ok) {
                const data = await response.json();
                  // console.log(data)
                  localStorage.setItem('token', data.token);
                  // Redirect to the dashboard
                  this.$router.push('/dashboard');
              } else {
                  const error = await response.json();
                  console.error('Login failed:', error.message);
                  alert('Invalid Credentials');
              }
          } catch (error) {
              console.error('An error occurred:', error);
          }
      }
  }
};

export default userlogin;
