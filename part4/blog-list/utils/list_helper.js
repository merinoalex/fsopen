const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (list) => {
  return list.reduce((a, b) => a + b.likes, 0)
}

const favoriteBlog = (list) => {
  if (list.length === 0) return null
  let fav = list.reduce((a, b) => a.likes > b.likes ? a : b)
  return fav.title
}

const mostBlogs = (array) => {
  if (array.length === 0) return null
  return _.zipObject(['author', 'blogs'], _(array)
    .countBy('author')
    .toPairs()
    .maxBy(_.last))
}

const mostLikes = (array) => {
  if (array.length === 0) return null
  return _(array)
    .groupBy('author')
    .map((objs, key) => ({
      author: key,
      likes: _.sumBy(objs, 'likes')
    }))
    .maxBy('likes')
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
