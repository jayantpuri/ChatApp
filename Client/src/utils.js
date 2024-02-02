export const API_URL = "https://chat-app-mu-inky.vercel.app";

export function getOtherUser(users, currentUser) {
  if (!users) {
    return currentUser;
  }
  return users[0]._id === currentUser._id ? users[1] : users[0];
}
