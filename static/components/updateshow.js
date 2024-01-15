const updateshow = {
    template: `
      <div>
        <h2>Update Show</h2>
        <form @submit.prevent="updateShow">
          <div class="mb-3">
            <label for="showGenre" class="form-label">Show Genre</label>
            <input type="text" id="showGenre" v-model="showGenre" class="form-control" required>
          </div>
          <div class="mb-3">
            <label for="showDate" class="form-label">Show Date</label>
            <input type="date" id="showDate" v-model="showDate" class="form-control" required>
          </div>
          <div class="mb-3">
            <label for="showTime" class="form-label">Show Time</label>
            <input type="time" id="showTime" v-model="showTime" class="form-control" required>
          </div>
          <div class="mb-3">
            <label for="showPrice" class="form-label">Show Price</label>
            <input type="number" id="showPrice" v-model="showPrice" class="form-control" required>
          </div>
          <div class="mb-3">
            <label for="showImage" class="form-label">Show Image</label>
            <input type="file" id="showImage" @change="handleImageUpload" accept="image/*" class="form-control-file">
          </div>
          <button type="submit" class="btn btn-primary">Update Show</button>
        </form>
      </div>
    `,
    data() {
      return {
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
      async updateShow() {
        const formData = new FormData();
        formData.append('show_genre', this.showGenre);
        formData.append('show_date', this.showDate);
        formData.append('show_time', this.showTime);
        formData.append('show_price', this.showPrice);
        if (this.showImage) {
          formData.append('show_img', this.showImage);
        }
  
        try {
          const response = await fetch(`/api/admin/${this.$route.params.venue_id}/${this.$route.params.show_id}/modify`, {
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
            console.error('Failed to update show:', error.message);
          }
        } catch (error) {
          console.error('An error occurred:', error);
        }
      },
    }
  };
  
  export default updateshow;
  