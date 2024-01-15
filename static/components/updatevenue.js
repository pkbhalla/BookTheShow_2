const updatevenue = {
    template: `
      <div>
        <h2>Update Venue</h2>
        <form @submit.prevent="updateVenue">
          <div class="mb-3">
            <label for="venueName" class="form-label">Venue Name</label>
            <input type="text" id="venueName" v-model="venueName" class="form-control" required>
          </div>
          <div class="mb-3">
            <label for="venueCapacity" class="form-label">Venue Capacity</label>
            <input type="number" id="venueCapacity" v-model="venueCapacity" class="form-control" required>
          </div>
          <div class="mb-3">
            <label for="venueImage" class="form-label">Venue Image</label>
            <input type="file" id="venueImage" @change="handleImageUpload" accept="image/*" class="form-control-file">
          </div>
          <button type="submit" class="btn btn-primary">Update Venue</button>
        </form>
      </div>
    `,
    data() {
      return {
        venueName: '',
        venueCapacity: '',
        venueImage: null,
      };
    },
    methods: {
      handleImageUpload(event) {
        this.venueImage = event.target.files[0];
      },
      async updateVenue() {
        const formData = new FormData();
        formData.append('venue_name', this.venueName);
        formData.append('venue_capacity', this.venueCapacity);
        formData.append('venue_img', this.venueImage);
  
        try {
          const response = await fetch(`/api/admin/${this.$route.params.venue_id}/modify`, {
            method: 'PUT',
            headers: {
              'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: formData
          });
  
          if (response.ok) {
            const data = await response.json();
            alert(data.message);
            this.$router.push('/dashboard');
          } else {
            const error = await response.json();
            console.error('Failed to update venue:', error.message);
          }
        } catch (error) {
          console.error('An error occurred:', error);
        }
      },
    }
  };
  
  export default updatevenue;
  