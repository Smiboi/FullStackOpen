const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: 'Jarkon ploki',
    author: 'Jarkko Jurkka',
    url: "https://www.jartsunosote.com",
    likes: 56
  },
  {
    title: 'Näin se elämä makaa',
    author: 'Hellevi Hälläväliä',
    url: "https://www.elämä.com",
    likes: 2
  }
]

const nonExistingId = async () => {
  const blog = new Blog({ title: 'willremovethissoon',  author: 'Will Removethissoon',  title: 'https://www.willremovethissoon.com',  })
  await blog.save()
  await blog.remove()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs, nonExistingId, blogsInDb
}
