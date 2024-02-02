export const API_URL = "http://localhost:9000";

export function getOtherUser(users, currentUser) {
  if (!users) {
    return currentUser;
  }
  return users[0]._id === currentUser._id ? users[1] : users[0];
}