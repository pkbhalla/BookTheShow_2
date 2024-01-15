const showdetails = {
    template: `
      <div>
        <h2>Show Details</h2>
        <div class="card" style="width:18rem">
          <img :src="'./static/images/' + show.show_img" class="card-img-top" alt="Show Image">
          <div class="card-body">
            <h5 class="card-title">{{ show.show_name }}</h5>
            <p class="card-text">Genre: {{ show.show_genre }}</p>
            <p class="card-text">Date: {{ show.show_date }}</p>
            <p class="card-text">Time: {{ show.show_time }}</p>
            <p class="card-text">Price: {{ show.show_price }}</p>
            <p class="card-text">Rating: {{ show.show_rating }}</p>
            <router-link :to="'/book/' + show.show_id" class="btn btn-primary">Book Show</router-link>
          </div>
        </div>
      </div>
    `,
    data() {
        return {
            show: {
                show_name: '',
                show_genre: '',
                show_date: '',
                show_time: '',
                show_price: '',
                show_rating: '',
                show_img: ''
            }
        };
    },
    created() {
        const showId = this.$route.params.show_id;
        this.fetchShowDetails(showId);
    },
    methods: {
        async fetchShowDetails(showId) {
            try {
                const response = await fetch(`/api/user/show/${showId}`, {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('token')
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    this.show = data;
                } else {
                    console.error('Failed to fetch show details');
                }
            } catch (error) {
                console.error('An error occurred:', error);
            }
        },
        logout: async function () {
            const req = await fetch("/api/user/logout", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
            })

            const d = await req.json();
            if (req.ok) {
                localStorage.removeItem('token');
                this.$router.replace({ path: '/login' })
            } else {
                alert(d.message)
            }

        }
    }
};

export default showdetails;
