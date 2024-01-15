const bookshow = {
    template: `
      <div>
        <h2>Book Show</h2>
        <div class="card mb-3" style="width:18rem">
          <img :src="'./static/images/'+ show.show_img" class="card-img-top" alt="Show Image">
          <div class="card-body">
            <h5 class="card-title">{{ show.show_name }}</h5>
            <p class="card-text">{{ show.show_date }} | {{ show.show_time }}</p>
            <p class="card-text">Price: {{ show.show_price }}</p>
            <label for="noOfSeats" class="form-label">Number of Seats</label>
            <input type="number" id="noOfSeats" v-model="noOfSeats" class="form-control" required>
            <button class="btn btn-primary mt-2" @click="bookSeats">Book Now</button>
          </div>
        </div>
      </div>
    `,
    data() {
      return {
        show: {},
        noOfSeats: 1
      };
    },
    created() {
      this.fetchShowDetails();
    },
    methods: {
      async fetchShowDetails() {
        const showId = this.$route.params.show_id;
        try {
          const response = await fetch(`/api/user/show/${showId}`, {
            method: 'GET',
            headers: {
              'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
          });
  
          if (response.ok) {
            const data = await response.json();
            console.log(data)
            this.show = data;
            console.log(this.show)
          } else {
            console.error('Failed to fetch show details');
          }
        } catch (error) {
          console.error('An error occurred:', error);
        }
      },
      async bookSeats() {
        const showId = this.$route.params.show_id;
        try {
          const response = await fetch(`/api/user/${showId}/book`, {
            method: 'POST',
            headers: {
              'Authorization': 'Bearer ' + localStorage.getItem('token'),
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ no_of_seats: this.noOfSeats })
          });
  
          if (response.ok) {
            const data = await response.json();
            if (data.message === 'Booking Successful') {
              alert(`Booking Successful! Total Price: ${this.show.show_price * this.noOfSeats}`);
              alert('Booking Successful!');
              this.$router.push('/dashboard');
            } else {
              alert('Housefull!');
            }
          } else {
            console.error('Booking failed');
          }
        } catch (error) {
          console.error('An error occurred:', error);
        }
      }
    }
  };
  
  export default bookshow;
  