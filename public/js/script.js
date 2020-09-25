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
                // usernameComment: "",
                comment: "",
                comments: [],
            };
        },
        template: "#modal-template",
        props: ["id"],

        mounted: function () {
            console.log("props:", this.id);
            var self = this;
            const id = self.id;
            axios
                .get(`/image/${id}`)
                .then(function (res) {
                    console.log("response from GET /image/:modal", res.data);
                    if (res.data.id == undefined) {
                        self.closeModal();
                    } else {
                        self.title = res.data.title;
                        self.url = res.data.url;
                        self.description = res.data.description;
                        self.username = res.data.username;
                    }
                })
                .catch(function (err) {
                    console.log("err in axios /image/:modal", err);
                });

            axios
                .get(`/comment/${id}`)
                .then(function (res) {
                    // console.log("response from GET /comment", res.data);
                    self.comments = res.data;
                })
                .catch((err) => {
                    console.log("Err in GET /comment", err);
                });
        },
        methods: {
            closeModal: function () {
                // console.log("closeModal runs!!!");
                this.$emit("close");
            },

            deleteImage: function () {
                console.log("deleteImage runs!!!");
                this.$emit("delete");
            },

            deleteComments: function () {
                console.log("deleteComments runs!!!");
                this.$emit("delete-comment");
            },

            addComment: function (e) {
                // console.log("am I inside addComment??");
                e.preventDefault();
                var self = this;
                var commentInfo = {
                    username: self.username,
                    comment: self.comment,
                    id: self.id,
                };

                axios
                    .post("/comment", commentInfo)
                    .then(function (res) {
                        // console.log("res from POST /comment went throu", res.data);
                        self.comments.push(res.data);
                        self.comment = null;
                        self.username = null;
                    })
                    .catch((err) => {
                        console.log("error in addComment", err);
                    });
            },
        },
        watch: {
            checkImageId: function () {
                console.log("change in prop", this.id);
                var self = this;
                const id = self.id;

                axios
                    .get(`/image/${id}`)
                    .then(function (res) {
                        console.log(
                            "response from GET /image/:modal",
                            res.data
                        );
                        if (res.data.id == undefined) {
                            self.closeModal();
                        } else {
                            self.title = res.data.title;
                            self.url = res.data.url;
                            self.description = res.data.description;
                            self.username = res.data.username;
                        }
                    })
                    .catch(function (err) {
                        console.log("err in axios /image/:modal", err);
                    });

                axios
                    .get(`/comment/${id}`)
                    .then(function (res) {
                        // console.log("response from GET /comment", res.data);
                        self.comments = res.data;
                    })
                    .catch((err) => {
                        console.log("Err in GET /comment", err);
                    });
            },
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
            id: location.hash.slice(1),
        }, // data ends

        //this runs when our VUE instance renders
        // mounted is a life cicle method
        mounted: function () {
            // console.log("my vue instance has mounted");
            // this is a good place to retreat images from database
            // talking to my server (index.js)

            var self = this;
            // console.log("this OUTSIDE axios", this);

            addEventListener("hashchange", function () {
                console.log("hashchange is happening");
                self.id = location.hash.slice(1);
            });

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

                /// empty input fields without refresh ///
                this.title = null;
                this.description = null;
                this.username = null;
                this.file = null;

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

            loadMoreImages: function () {
                var self = this;
                var arrLength = self.images.length;
                var highest_id = self.images[arrLength - 1].id;
                console.log("highest_id: ", highest_id);
                console.log(
                    "INSIDE self.images.length, arrLength: ",
                    arrLength
                );
                console.log(
                    "INSIDE self.images[inTotal - 1].id",
                    self.images[arrLength - 1].id
                );
                axios
                    .get(`/moreImages/${highest_id}`)
                    .then(function (res) {
                        for (var i = 0; i < res.data.length; i++) {
                            console.log("res.data.length: ", res.data.length);
                            self.images.push(res.data[i]);
                        }
                        if (self.images[arrLength].id < arrLength - 1) {
                            console.log("THIS IS THE END");
                            var loadMoreButton = document.getElementById(
                                "more"
                            );
                            loadMoreButton.style.display = "none";
                        }
                    })
                    .catch(function (err) {
                        console.log(
                            "err in GET /images/oldest_id loading more images",
                            err
                        );
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
                    "closeMe in the instance / parent is running! This was emitted from the component",
                    this.id
                );
                var self = this;
                self.id = null;

                location.hash = "";
                /// to delete hash not allowed to ask questions!
                history.replaceState(null, null, " ");
            },

            deleteMe: function () {
                var self = this;
                const id = self.id;
                console.log("INSIDE DELETING FUNCTION");

                axios
                    .post(`/delete/${id}`)
                    .then(function (res) {
                        console.log("INSIDE POST /delete image", res.data);
                        self.id = null;
                    })
                    .catch(function (err) {
                        console.log("err in POST /delete image", err);
                    });
            },

            deleteComments: function () {
                var self = this;
                const id = self.id;

                console.log("INSIDE DELETING COMMENTS FUNCTION");

                axios
                    .post(`/deleteComments/${id}`)
                    .then(function (res) {
                        console.log(
                            "INSIDE POST /delete comments + res.data + ID",
                            res.data
                        );
                        self.closeMe();
                    })
                    .catch((err) => {
                        console.log("err in catch blcok deleteMeComments", err);
                    });
            },
        }, //methods ends
    });
})();
