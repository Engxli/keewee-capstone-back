const Post = require('../../models/Post')
const Place = require('../../models/Place')

exports.getAllPosts = async (req, res, next) => {
    try {
        const posts = Post.find().populate("username image");
        res.status(200).json(posts);
    } catch (error) {
        next(error)
    }
}


exports.createPost = async (req, res, next) => {
    try {


        req.body.user = req.user._id;
        if (req.file) {
            req.body.image = `${req.file.path}`;
        }
        const place = await Place.findOne({ name: req.body.name })
        if (!place) { return res.status(404).json({ message: "place is not found" }); }

        const post = await Post.create(req.body);
        await req.user.updateOne({ $push: { posts: post._id } });
        return res.status(201).json(post);
    } catch (error) {
        next(error)
    }

}
exports.getPostById = async (req, res, next) => {
    try {
        const { postId } = req.params;
        const post = await Post.findById(postId).populate("username");
        res.status(200).json(post);
    } catch (error) {
        next(error);
    }
};

exports.upadatePost = async (req, res, next) => {
    try {
        const { postId } = req.params;
        if (req.file) {
            req.body.image = `${req.file.path}`;
        }

        const post = await Post.findById(postId);
        if (!post) {
            res.status(404).json({ message: "post not found" });
        }
        await post.updateOne(req.body);
        return res.status(200).json({ message: "post is updated" });

    } catch (error) {
        next(error);
    }
};

exports.deletePost = async (req, res, next) => {
    try {
        const { postId } = req.params;
        const post = await Post.findById(postId);
        if (post) {

            await post.deleteOne();
            return res.status(204).json({ message: "post is deleted" });

        }
    } catch (error) {
        next(error);
    }
};
