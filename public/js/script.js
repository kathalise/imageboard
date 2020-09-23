// console.log("sanity check");

(function () {
    Vue.component("my-modal", {
        data: function () {
            // console.log("MY-COMPONENT IS DOING STH");
            return {
                title: "",
                url: "",
                description: "",
                username: "",
                comments: null,
            };
        },
        template: "#modal-template",
        props: ["id"],

        mounted: function () {
            console.log("props:", this.id);
            const id = this.id;
            var self = this;
            axios
                .get(`/image/${id}`)
                .then(function (res) {
                    console.log("response from GET /image/:modal", res.data);

                    self.title = res.data.title;
                    self.url = res.data.url;
                    self.description = res.data.description;
                    self.username = res.data.username;
                })
                .catch(function (err) {
                    console.log("err in axios /image/:modal", err);
                });
        },
        methods: {
            closeModal: function () {
                // console.log("closeModal runs!!!");
                console.log("about to emit an event from the component!!!");
                this.$emit("close");
            },
        },
        handleAddComment: function () {
            console.log("Added comment!!");
        },
    });

    new Vue({
        // el - element in our html that has access to our VUE code
        el: "#main",
        data: {
            images: [],
            title: "",
            description: "",
            username: "",
            file: null,
            id: null,
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

            showModal: function (id) {
                console.log("showModal function is running, SHOW ME ID", id);
                var self = this;
                self.id = id;
            },

            closeMe: function () {
                console.log(
                    "closeMe in the instance / parent is running! This was emitted from the component"
                );

                // id = null;
            },
        }, //methods ends
    });
})();
