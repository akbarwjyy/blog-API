const Comment = require("../models/Comment");
const Post = require("../models/Post");

exports.addComment = async (req, res) => {
  const { text } = req.body;
  const { postId } = req.params;

  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post tidak ditemukan" });

    const comment = await Comment.create({
      text,
      post: postId,
      user: req.user.id,
    });

    res.status(201).json(comment);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Gagal menambah komentar", error: err.message });
  }
};

exports.getCommentsByPost = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate("user", "username")
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Gagal mengambil komentar", error: err.message });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment)
      return res.status(404).json({ message: "Komentar tidak ditemukan" });

    if (comment.user.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Tidak diizinkan menghapus komentar orang lain" });
    }

    await comment.deleteOne();
    res.json({ message: "Komentar dihapus" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Gagal menghapus komentar", error: err.message });
  }
};
