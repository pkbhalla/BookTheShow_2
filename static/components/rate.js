// rate.js file
const rate = {
    template: `
      <div class="container">
        <h1>Rate the show</h1>
        <div class="rating">
          <span class="star" v-for="n in 5" :class="{active: n <= rating}" @click="rate(n)">★</span>
        </div>
      </div>
    `,
    data() {
      return {
        rating: 0, // initial rating value
      };
    },
    methods: {
      rate(n) {
        // check if the user has already rated the show
        if (localStorage.getItem('rated')) {
          alert("You have already rated this show");
          return;
        }
        // set the rating value
        this.rating = n;
        // get the show id from the route parameter
        const show_id = this.$route.params.show_id;
        // get the jwt token from the local storage
        const token = localStorage.getItem("token");
        // create the post request body
        const body = JSON.stringify({ rating_value: n });
        // create the post request headers
        const headers = new Headers({
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        });
        // send the post request to the Rating API endpoint
        fetch(`/api/user/${show_id}/rate`, {
          method: "POST",
          body,
          headers,
        })
          .then((response) => response.json())
          .then((data) => {
            // check if the response is successful
            if (data.message === "Rating submitted successfully") {
              // set the local storage flag to prevent multiple ratings
              localStorage.setItem('rated_${show_id}', true);
              // show an alert to the user
              alert(data.message);
              // redirect to the dashboard route
              this.$router.push("/dashboard");
            } else {
              // show an error message to the user
              alert(data.message);
            }
          })
          .catch((error) => {
            // handle any errors
            console.error(error);
            alert("Something went wrong");
          });
      },
    },
  };
  
  export default rate;
  