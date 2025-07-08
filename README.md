# Blog API

REST API sederhana untuk aplikasi blog yang dibangun dengan Node.js, Express.js, dan MongoDB.

## Fitur

- **Autentikasi**: Register dan login pengguna dengan JWT
- **Manajemen Post**: CRUD operasi untuk blog posts
- **Sistem Komentar**: Tambah dan hapus komentar pada posts
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

### Posts

- `GET /api/posts` - Ambil semua posts
- `GET /api/posts/:id` - Ambil post berdasarkan ID
- `POST /api/posts` - Buat post baru (perlu login)
- `PUT /api/posts/:id` - Update post (perlu login)
- `DELETE /api/posts/:id` - Hapus post (perlu login)

### Comments

- `GET /api/posts/:postId/comments` - Ambil komentar dari post
- `POST /api/posts/:postId/comments` - Tambah komentar (perlu login)
- `DELETE /api/comments/:id` - Hapus komentar (perlu login)
