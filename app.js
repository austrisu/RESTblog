var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    faker           = require("faker"),
    methodOverride  = require("method-override"),
    sanitizer       = require("express-sanitizer");
    
mongoose.connect("mongodb://austris:austrisdb@ds239117.mlab.com:39117/blog");
// mongodb://localhost/restful_blog_app
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(sanitizer());
app.use(methodOverride('_method'));

//MONGOOS DB CONFIG
var blogSchema = new mongoose.Schema({
    title: String,
    // {type: String, default:<deafult image> for default image
    img: String,
    body: String,
    created: {type: Date, default: Date.now}
});

var blogDB = mongoose.model("Blog", blogSchema);

// blogDB.create({
//     titel: "Dog",
//     img: "https://images.unsplash.com/photo-1501789924847-cbbec7dabcf7?auto=format&fit=crop&w=1350&q=60&ixid=dW5zcGxhc2guY29tOzs7Ozs%3D",
//     body: "This is blog post"
// });

//RESTFUL ROUTES

//ROOT route
app.get("/", function(req, res){
    res.redirect("/blogs");
})

//INDEX route
app.get("/blogs", function(req, res){
    blogDB.find({}, function(err, blogs){
        if (err) {
            console.log(err);
        } else {
            res.render("index", {blogs: blogs});
        }
    })
})

//NEW ROUTE
app.get('/blogs/new', function(req, res){
    res.render("new");
})

//CREATE ROUTE
app.post('/blogs', function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    blogDB.create(req.body.blog, function(err, newBlog){
        if (err) {
            res.render('new');
        } else {
            res.redirect('/blogs');
        }
    })
});

//SHOW ROUTE
app.get('/blogs/:id', function(req, res) {
    blogDB.findById(req.params.id, function(err, foundBlog){
        if(err){ 
            res.redirect('/blogs');
        } else {
            res.render('show', {blog: foundBlog});
        }
    })
})

//EDIT ROUTE
app.get('/blogs/:id/edit', function(req, res) {
    blogDB.findById(req.params.id, function(err, foundBlog){
        if(err){ 
            res.redirect('/blogs');
        } else {
            res.render('edit', {blog: foundBlog});
        }
    })
})

//UPDATE ROUTE
app.put('/blogs/:id',  function(req, res) {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    blogDB.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updateBlog){
        if(err){ 
            res.redirect('/blogs');
        } else {
            res.redirect('/blogs/'+req.params.id);
        }
    })
})

//DELETE ROUTE
app.delete('/blogs/:id', function(req, res){
    blogDB.findByIdAndRemove(req.params.id, function(err){
        if(err){ 
            res.redirect('/blogs');
        }
        res.redirect("/blogs");
    })
})

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("server up");
});