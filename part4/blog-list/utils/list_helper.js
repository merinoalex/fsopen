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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
}
