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
    const { page = 1, limit = 10, search = "" } = req.query;

    const query = {
      $or: [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ],
    };

    const total = await Post.countDocuments(query);
    const posts = await Post.find(query)
      .populate("author", "username")
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .sort({ createdAt: -1 });

    res.json({
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit),
      posts,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Gagal mengambil post", error: err.message });
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

    const isOwner = post.author.toString() === req.user.id;
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res
        .status(403)
        .json({ message: "Kamu tidak punya izin untuk menghapus post ini" });
    }

    await post.deleteOne();
    res.json({ message: "Post berhasil dihapus" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Gagal menghapus post", error: err.message });
  }
};

exports.uploadCover = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post tidak ditemukan" });

    // Cek pemilik post
    if (post.author.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Tidak diizinkan mengubah post ini" });
    }

    // Simpan path file ke post
    post.coverImage = req.file.path; // misalnya: uploads/1720128498433.png
    await post.save();

    res.json({
      message: "Cover berhasil diupload",
      coverImage: post.coverImage,
    });
  } catch (err) {
    res.status(500).json({ message: "Gagal upload cover", error: err.message });
  }
};

exports.toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post tidak ditemukan" });

    const userId = req.user.id;
    const alreadyLiked = post.likes.includes(userId);

    if (alreadyLiked) {
      // Unlike
      post.likes = post.likes.filter((id) => id.toString() !== userId);
      await post.save();
      return res.json({
        message: "Berhasil di-unlike",
        totalLikes: post.likes.length,
      });
    } else {
      // Like
      post.likes.push(userId);
      await post.save();
      return res.json({
        message: "Berhasil like post",
        totalLikes: post.likes.length,
      });
    }
  } catch (err) {
    res.status(500).json({ message: "Terjadi kesalahan", error: err.message });
  }
};
