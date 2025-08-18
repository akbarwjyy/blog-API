# Blog API

REST API sederhana untuk aplikasi blog yang dibangun dengan Node.js, Express.js, dan MongoDB.

## Fitur

- **Autentikasi**: Register, login, logout, dan refresh token dengan JWT
- **Role-based Access Control**: Sistem role (user, admin) dengan middleware
- **Manajemen Post**: CRUD operasi untuk blog posts
- **Pagination**: Pagination untuk posts dengan page dan limit
- **Search**: Pencarian posts berdasarkan title atau content
- **Upload Gambar**: Upload cover image untuk posts
- **Like System**: Like/unlike posts
- **Sistem Komentar**: Tambah dan hapus komentar pada posts
- **Keamanan**: Rate limiting, CORS, helmet, password hashing
- **Middleware Autentikasi**: Proteksi endpoint yang memerlukan login

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB dengan Mongoose ODM
- **Autentikasi**: JWT (JSON Web Token)
- **Password Hashing**: bcryptjs

## Instalasi

1. Clone repository

```bash
git clone https://github.com/akbarwjyy/blog-API.git
cd blog-api
```

2. Install dependencies

```bash
npm install
```

3. Setup environment variables
   Buat file `.env` di root directory:

```env
MONGO_URI=mongodb://localhost:27017/blog-api
PORT=3000
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret-key
```

4. Jalankan aplikasi

```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register pengguna baru
- `POST /api/auth/login` - Login pengguna
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout pengguna

### Posts

- `GET /api/posts` - Ambil semua posts (dengan pagination & search)
  - Query Parameters:
    - `page` - Halaman (default: 1)
    - `limit` - Jumlah posts per halaman (default: 10)
    - `search` - Pencarian berdasarkan title atau content
- `GET /api/posts/:id` - Ambil post berdasarkan ID
- `POST /api/posts` - Buat post baru (perlu login)
- `PUT /api/posts/:id` - Update post (perlu login)
- `DELETE /api/posts/:id` - Hapus post (perlu login)
- `POST /api/posts/:id/cover` - Upload cover image untuk post (perlu login)
- `POST /api/posts/:id/like` - Toggle like/unlike post (perlu login)

### Comments

- `GET /api/posts/:postId/comments` - Ambil komentar dari post
- `POST /api/posts/:postId/comments` - Tambah komentar (perlu login)
- `DELETE /api/comments/:id` - Hapus komentar (perlu login)
