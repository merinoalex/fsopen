const Notification = ({ notifMessage }) => {
    const successNotif = {
      background: 'rgb(150, 185, 155)',
      borderLeftColor: 'rgb(94, 163, 103)',
    }
    const errorNotif = {
      background: 'rgb(212, 130, 130)',
      borderLeftColor: 'rgb(212, 60, 60)'
    }
    let status
  
    if (notifMessage.status === null) {
      return null
    } else if (notifMessage.status === 'success') {
      status = successNotif
    } else if (notifMessage.status === 'error') {
      status = errorNotif
    }
    return (
      <div style={status} className='notification'>
        {notifMessage.message}
      </div>
    )
    
  }

export default Notification
