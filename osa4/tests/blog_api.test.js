const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('a specific blog is within the returned notes', async () => {
  const response = await api.get('/api/blogs')

  const titles = response.body.map(r => r.title)

  expect(titles).toContain(
    'Jarkon ploki'
  )
})

test('blog has an id', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body[0].id).toBeDefined()
})

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'Roskaruokablogi',
    author: 'MC Donald',
    url: 'https://www.ruokea.fi',
    likes: 6
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

  const titles = blogsAtEnd.map(n => n.title)
  expect(titles).toContain(
    'Roskaruokablogi'
  )
})

test('if likes not set, set likes to zero', async () => {
  const newBlog = {
    title: 'Roskaruokablogi',
    author: 'MC Donald',
    url: 'https://www.ruokea.fi'
  }
  
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()

  expect(blogsAtEnd[2].likes).toBe(0)
})

test('blog without title or url is not added', async () => {
  const newBlog1 = {
    title: 'Roskaruokablogi',
    author: 'MC Donald',
    likes: 6
  }
  const newBlog2 = {
    author: 'MC Donald',
    url: 'https://www.ruokea.fi',
    likes: 6
  }

  await api
    .post('/api/blogs')
    .send(newBlog1)
    .expect(400)
  await api
    .post('/api/blogs')
    .send(newBlog2)
    .expect(400)

  const blogsAtEnd = await helper.blogsInDb()

  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
})

test('deletion of a blog succeeds with status code 204 if id is valid', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()

  expect(blogsAtEnd).toHaveLength(
    helper.initialBlogs.length - 1
  )

  const titles = blogsAtEnd.map(r => r.title)

  expect(titles).not.toContain(blogToDelete.title)
})

test('updating likes of a blog succeeds with status code 200 and likes are updated', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToUpdate = blogsAtStart[0]

  const newBlog = {
    title: 'Jarkon ploki',
    author: 'Jarkko Jurkka',
    url: "https://www.jartsunosote.com",
    likes: 100
  }

  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(newBlog)
    .expect(200)

  const blogsAtEnd = await helper.blogsInDb()

  expect(blogsAtEnd[0].likes).toBe(100)
})

afterAll(async () => {
  await mongoose.connection.close()
})
