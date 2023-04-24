const Notification = ({ info }) => {
  const style = {
    color: info.type === 'error' ? 'red' : 'green',
    background: info.type === 'error' ? '#FFCCBB' : '#99C68E',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }

  if (!info.message) return null

  return (
    <div style={style} className="notification">
      {info.message}
    </div>
  )
}

export default Notification
