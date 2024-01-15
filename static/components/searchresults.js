const searchresults = {
    template: `
      <div>
        <h2>Search Results</h2>
        <div v-if="searchResults.shows.length > 0">
          <h3>Shows:</h3>
          <div v-for="show in searchResults.shows" :key="show.show_name" class="card mb-3">
            <div class="card-body">
              <h5 class="card-title">{{ show.show_name }}</h5>
              <p class="card-text">{{ show.show_date }} | {{ show.show_time }}</p>
              <p class="card-text">Genre: {{ show.show_genre }}</p>
              <p class="card-text">Price: {{ show.show_price }}</p>
              <router-link :to="'/show/' + show.show_id">Show Details</router-link>
            </div>
          </div>
        </div>
        <div v-if="searchResults.venues.length > 0">
          <h3>Venues:</h3>
          <div v-for="venue in searchResults.venues" :key="venue.venue_name" class="card mb-3">
            <div class="card-body">
              <h5 class="card-title">{{ venue.venue_name }}</h5>
              <p class="card-text">{{ venue.venue_location }}</p>
              <p class="card-text">{{ venue.venue_place }}</p>
              <router-link :to="'/venue/' + venue.venue_id">Venue Details</router-link>
            </div>
          </div>
        </div>
      </div>
    `,
    data() {
      return {
        searchResults: {
          shows: [],
          venues: []
        }
      };
    },
    created() {
      this.search();
    },
    methods: {
      async search() {
        const query = this.$route.query.query;
        if (query) {
          try {
            const response = await fetch(`/api/user/search?query=${query}`, {
              method: 'GET',
              headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
              }
            });
  
            if (response.ok) {
              const data = await response.json();
              this.searchResults = data;
            } else {
              console.error('Search failed');
            }
          } catch (error) {
            console.error('An error occurred:', error);
          }
        }
      }
    }
  };
  
  export default searchresults;
  