const createshow = {
    template: `
      <div>
        <h2>Create Show</h2>
        <form @submit.prevent="createShow">
          <div class="form-group">
            <label for="show_name">Show Name:</label>
            <input type="text" id="show_name" v-model="showName" class="form-control" required>
          </div>
          <div class="form-group">
            <label for="show_rating">Rating:</label>
            <input type="number" id="show_rating" v-model="showRating" class="form-control" required>
          </div>
          <div class="form-group">
            <label for="show_genre">Genre:</label>
            <input type="text" id="show_genre" v-model="showGenre" class="form-control" required>
          </div>
          <div class="form-group">
            <label for="show_date">Date:</label>
            <input type="date" id="show_date" v-model="showDate" class="form-control" required>
          </div>
          <div class="form-group">
            <label for="show_time">Time:</label>
            <input type="time" id="show_time" v-model="showTime" class="form-control" required>
          </div>
          <div class="form-group">
            <label for="show_price">Price:</label>
            <input type="number" id="show_price" v-model="showPrice" class="form-control" required>
          </div>
          <div class="form-group">
            <label for="show_img">Image:</label>
            <input type="file" id="show_img" @change="handleImageUpload" accept="image/*" class="form-control" required>
          </div>
          <button type="submit" class="btn btn-primary">Create Show</button>
        </form>
      </div>
    `,
    data() {
      return {
        showName: '',
        showRating: '',
        showGenre: '',
        showDate: '',
        showTime: '',
        showPrice: '',
        showImage: null,
      };
    },
    methods: {
      handleImageUpload(event) {
        this.showImage = event.target.files[0];
      },
      async createShow() {
        const formData = new FormData();
        formData.append('show_name', this.showName);
        formData.append('show_rating', this.showRating);
        formData.append('show_genre', this.showGenre);
        formData.append('show_date', this.showDate);
        formData.append('show_time', this.showTime);
        formData.append('show_price', this.showPrice);
        formData.append('show_img', this.showImage);
  
        try {
          const venueId = this.$route.params.venue_id;
          const response = await fetch(`/api/admin/${venueId}/create`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: formData,
          });
  
          if (response.ok) {
            alert('Show created successfully');
            this.$router.push(`/${venueId}`);
          } else {
            const error = await response.json();
            console.error('Failed to create show:', error.message);
          }
        } catch (error) {
          console.error('An error occurred:', error);
        }
      },
    },
  };
  
  export default createshow;
  