import { createContext, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

export const chatState = createContext({
  currentUser: null,
  currentChat: null,
  ChatsArray: null,
  fetchChats: false,
});

const ChatProvider = ({ children }) => {
  const history = useHistory();
  const [currentUser, setCurrentUser] = useState("");
  const [currentChat, setCurrentChat] = useState({});
  const [chatsArray, setChatsArray] = useState(null);
  const [fetchChats, setFetchChats] = useState(false);
  
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
      }}
    >
      {children}
    </chatState.Provider>
  );
};

export default ChatProvider;
