// console.log("sanity check");

(function () {
    new Vue({
        // el - element in our html that has access to our VUE code
        el: "#main",
        data: {
            // name: "Masala",
            // seen: false,
            getImageAndTitle: [],
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

                    self.getImageAndTitle = res.data;
                })
                .catch(function (err) {
                    console.log("err in axios /images", err);
                });
        }, // mounted ends

        // here ALL of our functions go!!!
        // no arrow-functions and no jquery
        methods: {
            myFunction: function (arg) {
                console.log("myFunction is running!!!", arg);
            },
        }, //methods ends
    });
})();
