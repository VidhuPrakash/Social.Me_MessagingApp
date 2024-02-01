export const getSender = (loggedUser, users, onlineUsers) => {
  if (!loggedUser || !users || users.length < 2) {
    return "Unknown Sender";
  }

  const user1 = users[0] || {};
  const user2 = users[1] || {};

  const senderId = user1._id === loggedUser._id ? user2._id : user1._id;
  const senderName = user1._id === loggedUser._id ? user2.name : user1.name;
  const isOnline = onlineUsers && onlineUsers.includes(senderId);

  const statusColor = isOnline ? "green" : "red";
  const statusText = isOnline ? "Online" : "Offline";
  const statusStyle = {
    color: statusColor,
    fontSize: "14px", // Adjust the font size as needed
  };

  return (
    <>
      {senderName} <span style={statusStyle}>({statusText})</span>
    </>
  );
};

// full sender details
export const getSenderFull = (loggedUser, users) => {
  return users[0]._id === loggedUser._id ? users[1] : users[0];
};
// message length,sender undefined,same sender check
export const isSameSender = (messages, m, i, userId) => {
  return (
    i < messages.length - 1 &&
    (messages[i + 1].sender._id !== m.sender._id ||
      messages[i + 1].sender._id === undefined) &&
    messages[i].sender._id !== userId
  );
};
// last message
export const isLastMessage = (messages, i, userId) => {
  return (
    i === messages.length - 1 &&
    messages[messages.length - 1].sender._id !== userId &&
    messages[messages.length - 1].sender._id
  );
};
// spacing message
export const isSameSenderMargin = (messages, m, i, userId) => {
  if (
    i < messages.length - 1 &&
    messages[i + 1].sender._id === m.sender._id &&
    messages[i].sender._id !== userId
  )
    return 33;
  else if (
    (i < messages.length - 1 &&
      messages[i + 1].sender._id !== m.sender._id &&
      messages[i].sender._id !== userId) ||
    (i === messages.length - 1 && messages[i].sender._id !== userId)
  )
    return 0;
  else return "auto";
};
// sameUser
export const isSameUser = (messages, m, i) => {
  return i > 0 && messages[i - 1].sender._id === m.sender._id;
};
