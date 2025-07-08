const Post = require("../models/Post");

exports.createPost = async (req, res) => {
  const { title, content } = req.body;
  try {
    const newPost = await Post.create({
      title,
      content,
      author: req.user.id, // dari JWT decoded
    });
    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ message: "Gagal membuat post", error: err.message });
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate("author", "username");
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Gagal mengambil post" });
  }
};

exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      "author",
      "username"
    );
    if (!post) return res.status(404).json({ message: "Post tidak ditemukan" });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: "Gagal mengambil post" });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post tidak ditemukan" });

    // Pastikan user adalah pemilik
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "Tidak diizinkan" });
    }

    post.title = req.body.title || post.title;
    post.content = req.body.content || post.content;
    await post.save();

    res.json(post);
  } catch (err) {
    res.status(500).json({ message: "Gagal update post", error: err.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post tidak ditemukan" });

    // Cek kepemilikan
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "Tidak diizinkan" });
    }

    await post.deleteOne();
    res.json({ message: "Post dihapus" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Gagal menghapus post", error: err.message });
  }
};
