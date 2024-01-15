const createvenue = {
    template: `
      <div>
        <h2>Create Venue</h2>
        <form @submit.prevent="createVenue">
          <div class="mb-3">
            <label for="venueName" class="form-label">Venue Name:</label>
            <input type="text" id="venueName" v-model="venueName" class="form-control" required>
          </div>
          <div class="mb-3">
            <label for="capacity" class="form-label">Capacity:</label>
            <input type="number" id="capacity" v-model="capacity" class="form-control" required>
          </div>
          <div class="mb-3">
            <label for="location" class="form-label">Location:</label>
            <input type="text" id="location" v-model="location" class="form-control" required>
          </div>
          <div class="mb-3">
            <label for="place" class="form-label">Place:</label>
            <input type="text" id="place" v-model="place" class="form-control" required>
          </div>
          <div class="mb-3">
            <label for="image" class="form-label">Image:</label>
            <input type="file" @change="handleImageUpload" accept="image/*" class="form-control" required>
          </div>
          <button type="submit" class="btn btn-primary">Create Venue</button>
        </form>
      </div>
    `,
    data() {
        return {
            venueName: '',
            capacity: '',
            location: '',
            place: '',
            image: null,
        };
    },
    methods: {
        handleImageUpload(event) {
            this.image = event.target.files[0];
        },
        async createVenue() {
            const formData = new FormData();
            formData.append('venue_name', this.venueName);
            formData.append('venue_capacity', this.capacity);
            formData.append('venue_location', this.location);
            formData.append('venue_place', this.place);
            formData.append('venue_img', this.image);

            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.error('Token not found');
                    return;
                }

                const response = await fetch('/api/admin/create_venue', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                    body: formData,
                });

                if (response.ok) {
                    console.log('Venue created successfully');
                    alert('Venue created successfully');
                    this.$router.push('/dashboard');
                    // Redirect to the admin dashboard or any other appropriate route
                } else {
                    const error = await response.json();
                    console.error('Failed to create venue:', error.message);
                }
            } catch (error) {
                console.error('An error occurred:', error);
            }
        },
    },
};

export default createvenue;
