const dummy = (blogs) => {
  return 1
}

const totalLikes = (list) => {
/*   let total = 0
  for (let blog of list) {
    total += blog.likes
  }
  return total */
  return list.reduce((a, b) => a + b.likes, 0)
}

module.exports = {
  dummy,
  totalLikes,
}
