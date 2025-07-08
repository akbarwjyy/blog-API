const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");
const authMiddleware = require("../middlewares/authMiddleware");

// Tambah komentar ke post
router.post(
  "/posts/:postId/comments",
  authMiddleware,
  commentController.addComment
);

// Ambil semua komentar dari post
router.get("/posts/:postId/comments", commentController.getCommentsByPost);

// Hapus komentar (hanya oleh pemilik)
router.delete("/comments/:id", authMiddleware, commentController.deleteComment);

module.exports = router;
