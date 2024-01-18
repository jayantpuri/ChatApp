import { createContext, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

export const chatState = createContext({
  currentUser: null,
  currentChat: null,
});

const ChatProvider = ({ children }) => {
  console.log('render')
  const history = useHistory();
  const [currentUser, setCurrentUser] = useState("");
  const [currentChat, setCurrentChat] = useState(null);

  useEffect(() => {
    let user = localStorage.getItem("user");
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
    if (!user) {
      history.push("/");
    }
  }, [history]);

  return (
    <chatState.Provider
      value={{ currentUser, currentChat, setCurrentChat, setCurrentUser }}
    >
      {children}
    </chatState.Provider>
  );
};

export default ChatProvider;
