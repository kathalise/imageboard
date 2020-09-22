// console.log("sanity check");

(function () {
    new Vue({
        // el - element in our html that has access to our VUE code
        el: "#main",
        data: {
            // name: "Masala",
            // seen: false,
            images: [],
            title: "",
            description: "",
            username: "",
            file: null,
        }, // data ends

        //this runs when our VUE instance renders
        // mounted is a life cicle method
        mounted: function () {
            // console.log("my vue instance has mounted");
            // this is a good place to retreat images from database
            // talking to my server (index.js)

            var self = this;
            console.log("this OUTSIDE axios", this);

            axios
                .get("/images")
                .then(function (res) {
                    console.log("response from /images", res.data);
                    // console.log("this INSIDE axios", self);

                    self.images = res.data;
                })
                .catch(function (err) {
                    console.log("err in axios /images", err);
                });
        }, // mounted ends

        // here ALL of our functions go!!!
        // no arrow-functions and no jquery
        methods: {
            handleClick: function (e) {
                e.preventDefault();
                // console.log("my properties in data with this", this);
                var formData = new FormData();

                formData.append("title", this.title);
                formData.append("description", this.description);
                formData.append("username", this.username);
                formData.append("file", this.file);

                var self = this;
                axios
                    .post("/upload", formData)
                    .then(function (res) {
                        console.log("res from POST /upload", res);
                        self.images.unshift(res.data);
                    })
                    .catch(function (err) {
                        console.log("err in /upload", err);
                    });
            },
            handleChange: function (e) {
                // console.log("handleChange is running!");
                // console.log("file:", e.target.files[0]);

                this.file = e.target.files[0];
            },
        }, //methods ends
    });
})();
