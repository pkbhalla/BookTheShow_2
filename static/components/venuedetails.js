const venuedetails = {
    template: `
      <div>
        <h2>Venue Details</h2>
        <div class="card" style="width:18rem">
          <img :src="'./static/images/' + venue.venue_img" class="card-img-top" alt="Venue Image">
          <div class="card-body">
            <h5 class="card-title">{{ venue.venue_name }}</h5>
            <p class="card-text">Place: {{ venue.venue_place }}</p>
            <p class="card-text">Location: {{ venue.venue_location }}</p>
          </div>
        </div>
  
        <h3>Shows at this Venue</h3>
        <div v-for="show in venue.shows" :key="show.show_id" class="card" style="width:18rem">
          <img :src="'./static/images/' + show.show_img" class="card-img-top" alt="Show Image">
          <div class="card-body">
            <h5 class="card-title">{{ show.show_name }}</h5>
            <p class="card-text">{{ show.show_date }} | {{ show.show_time }}</p>
            <p class="card-text">Rating: {{ show.show_rating }}</p>
            <router-link :to="'/book/' + show.show_id" class="btn btn-primary">Book Show</router-link>
          </div>
        </div>
      </div>
    `,
    data() {
      return {
        venue: {
          venue_name: '',
          venue_img: '',
          venue_place: '',
          venue_location: '',
          shows: []
        }
      };
    },
    created() {
      const venueId = this.$route.params.venue_id;
      this.fetchVenueDetails(venueId);
    },
    methods: {
      async fetchVenueDetails(venueId) {
        try {
          const response = await fetch(`/api/user/venue/${venueId}`,
          {
            method: 'GET',
            headers: {
              'Authorization': 'Bearer ' + localStorage.getItem('token'),
            },
          });
          if (response.ok) {
            const data = await response.json();
            this.venue = data;
          } else {
            console.error('Failed to fetch venue details');
          }
        } catch (error) {
          console.error('An error occurred:', error);
        }
      }
    }
  };
  
  export default venuedetails;
  