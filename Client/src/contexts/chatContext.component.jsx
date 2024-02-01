import { createContext, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

export const chatState = createContext({
  currentUser: null,
  currentChat: null,
  ChatsArray: null,
  fetchChats: false,
  notification: [],
});

const ChatProvider = ({ children }) => {
  const history = useHistory();
  const [currentUser, setCurrentUser] = useState(null);
  const [currentChat, setCurrentChat] = useState(null);
  const [chatsArray, setChatsArray] = useState([]);
  const [fetchChats, setFetchChats] = useState(false);
  const [notification, setNotification] = useState([]);

  useEffect(() => {
    let user = localStorage.getItem("user");

    setCurrentUser(JSON.parse(user));
    if (!user) history.push("/");
  }, [history]);

  return (
    <chatState.Provider
      value={{
        currentUser,
        currentChat,
        setCurrentChat,
        setCurrentUser,
        chatsArray,
        setChatsArray,
        fetchChats,
        setFetchChats,
        notification,
        setNotification,
      }}
    >
      {children}
    </chatState.Provider>
  );
};

export default ChatProvider;
