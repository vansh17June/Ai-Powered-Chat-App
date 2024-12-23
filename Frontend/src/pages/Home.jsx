import React, { useState, useEffect } from "react";
import { IoMdSend } from "react-icons/io";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState([]);
  const [result, setResult] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [currentTitle, setCurrentTitle] = useState(null); // Active history title
  const [currentHistory, setCurrentHistory] = useState([]); // Store conversations of selected history
  const [isNewChat, setIsNewChat] = useState(false); // Check if it's a new chat session

  useEffect(() => {
    const fetchSearchHistory = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/v1/user/getSearchHistory", {
          withCredentials: true,
        });
        setSearchHistory(res.data.searchHistory || []);
      } catch (err) {
        console.error(err);
        const message = err.response?.data?.message || "Failed to fetch search history.";
        alert(message);
      }
    };

    fetchSearchHistory();
  }, []);

  const handleLogout = async () => {
    localStorage.removeItem("id");
    try {
      await axios.get("http://localhost:5000/api/v1/user/logout", {
        withCredentials: true,
      });
      navigate("/login");
    } catch (err) {
      const message = err.response?.data?.message || "Internal server error";
      alert(message);
    }
  };

  const handleClick = async () => {
    if (!input) return;

    try {
      const question = input;
      setInput("");
      setQuery([...query, question]);
      setLoading(true);
      console.log(currentHistory)
      const res = await axios.post(
        "http://localhost:5000/api/v1/user/giveResponse",
        { question, history: currentHistory },
        { withCredentials: true }
      );

      setLoading(false);
      const answer = res.data.message;
      setResult([...result, answer]);

      // Update the current history for later backend update
      setCurrentHistory([...currentHistory, { question, answer }]);

      if (!currentTitle) {
        setIsNewChat(true); // Indicate a new chat if there's no active title
      }
    } catch (err) {
      setLoading(false);
      console.error(err);
      const message = err.response?.data?.message || "Internal server error";
      alert(message);
    }
  };

  const handleSaveChat = async () => {
    if (query.length === 0 || !result[0]) {
      alert("Cannot save an empty chat.");
      return;
    }

    const title = prompt("Enter a title for this chat:", "New Chat");
    if (!title) return;

    try {
      await axios.post(
        "http://localhost:5000/api/v1/user/updateSearch",
        {
          title,
          question: query[0],
          answer: result[0],
        },
        { withCredentials: true }
      );

      alert("Chat saved successfully!");
      setIsNewChat(false); // Reset new chat indicator
      setCurrentTitle(title); // Mark the chat as saved

      // Dynamically update the search history with the new chat
      setSearchHistory([
        ...searchHistory,
        {
          TopicWiseSearches: {
            title,
            search: [{ question: query[0], answer: result[0] }],
          },
        },
      ]);
    } catch (err) {
      console.error(err);
      const message = err.response?.data?.message || "Failed to save chat.";
      alert(message);
    }
  };

  const handleHistoryClick = (search) => {
    setCurrentTitle(search.title);
    setQuery(search.search.map((item) => item.question));
    setResult(search.search.map((item) => item.answer));
    setCurrentHistory([]);
    setIsNewChat(false); // Reset the new chat indicator
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleClick();
  };

  return (
    <div className="h-screen w-full bg-gray-100">
      <div className="flex h-full">
        {/* Left Sidebar */}
        <div className="w-2/12 bg-gray-800 text-white flex flex-col">
          <h1 className="text-2xl font-bold p-4 border-b border-gray-700">Search History</h1>
          <div className="flex-1 overflow-y-auto">
            {searchHistory.map((item, index) => (
              <div
                key={index}
                className={`p-3 cursor-pointer hover:bg-gray-700 ${currentTitle === item.TopicWiseSearches.title ? "bg-gray-700" : ""}`}
                onClick={() => handleHistoryClick(item.TopicWiseSearches)}
              >
                {item.TopicWiseSearches.title}
              </div>
            ))}
          </div>
        </div>

        {/* Right Chat Panel */}
        <div className="flex-1 flex flex-col relative bg-white">
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4">
            {query.map((q, index) => (
              <div key={index} className="mb-4">
                <div className="text-right">
                  <div className="inline-block bg-blue-500 text-white py-2 px-4 rounded-lg">
                    {q}
                  </div>
                </div>
                <div className="text-left mt-2">
                  {loading && index === query.length - 1 ? (
                    <div className="inline-block bg-gray-300 py-2 px-4 rounded-lg animate-pulse">
                      Typing...
                    </div>
                  ) : (
                    <div className="inline-block bg-gray-200 py-2 px-4 rounded-lg">
                      {result[index]}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Save Button */}
          {isNewChat && (
            <button
              className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 mb-6"
              onClick={handleSaveChat}
            >
              Save Chat
            </button>
          )}

          {/* Input Section */}
          <div className="flex items-center p-4 border-t border-gray-300">
            <input
              type="text"
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              className="ml-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              onClick={handleClick}
            >
              <IoMdSend size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
