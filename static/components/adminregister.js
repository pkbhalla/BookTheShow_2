const adminregister = {
    template: `
    <section class="vh-100">
    <div class="mask d-flex align-items-center h-100 gradient-custom-3">
      <div class="container h-100">
        <div class="row d-flex justify-content-center align-items-center h-100">
          <div class="col-12 col-md-9 col-lg-7 col-xl-6">
            <div class="card" style="border-radius: 15px;">
              <div class="card-body p-5">
                <h2 class="text-uppercase text-center mb-5">Create an account</h2>
  
                <form @submit.prevent="registerAdmin">
  
                  <div class="form-outline mb-4">
                    <input type="text" id="name" class="form-control form-control-lg" v-model="name" required />
                    <label class="form-label" for="name">Your Name</label>
                  </div>
  
                  <div class="form-outline mb-4">
                    <input type="text" id="username" class="form-control form-control-lg" v-model="username" required />
                    <label class="form-label" for="username">Your Username</label>
                  </div>
  
                  <div class="form-outline mb-4">
                    <input type="email" id="email" class="form-control form-control-lg" v-model="email" required />
                    <label class="form-label" for="email">Your Email</label>
                  </div>
  
                  <div class="form-outline mb-4">
                    <input type="password" id="password" class="form-control form-control-lg" v-model="password" required />
                    <label class="form-label" for="password">Your Password</label>
                  </div>
  
                  <div class="form-outline mb-4">
                    <input type="text" id="place" class="form-control form-control-lg" v-model="place" required />
                    <label class="form-label" for="place">Your Place</label>
                  </div>
  
                  <div class="form-outline mb-4">
                    <input type="file" @change="handleImageUpload" accept="image/*" />
                    <label class="form-label" for="image">Upload Image</label>
                  </div>

  
                  <div class="d-flex justify-content-center">
                    <button type="submit" class="btn btn-success btn-block btn-lg gradient-custom-4 text-body">
                      Register
                    </button>
                  </div>
  
                </form>
  
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
        name: '',
        username: '',
        email: '',
        password: '',
        place: '',
        image: null,
      };
    },
    methods: {
      handleImageUpload(event) {
        this.image = event.target.files[0];
      },
      async registerAdmin() {
        const formData = new FormData();
        formData.append('name', this.name);
        formData.append('username', this.username);
        formData.append('email', this.email);
        formData.append('password', this.password);
        formData.append('place', this.place);
        formData.append('img', this.image);
        try {
          const response = await fetch('/api/admin/register', {
            method: 'POST',
            body: formData
          });
  
          if (response.ok) {
            const data = await response.json();
            localStorage.setItem('token', data.token);
            // Redirect to the dashboard
            alert("Registration Successful.")
            this.$router.push('/dashboard');
          } else {
            const error = await response.json();
            console.error('Registration failed:', error.message);
            alert("Registration Failed")
          }
        } catch (error) {
          console.error('An error occurred:', error);
        }
      },
  }
};
  
  export default adminregister;