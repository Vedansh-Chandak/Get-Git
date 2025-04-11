import { useEffect, useState } from "react";
import axios from "axios";

axios.defaults.withCredentials = true;

const Hero = () => {
  const [user, setUser] = useState(null);
  const [search, setSearch] = useState("");
  const [repos, setRepos] = useState([]);
  const [history, setHistory] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/auth/user")
      .then((res) => {
        setUser(res.data);
        if (res.data?.id) fetchHistory(res.data.id);
      })
      .catch((err) => console.log("Error fetching user data", err));
  }, []);

  useEffect(() => {
    if (user) {
      axios
        .get(`http://localhost:8000/api/bookmark/${user.id}`)
        .then((res) => setBookmarks(res.data))
        .catch((err) => console.log("Bookmark fetch error", err));
    }
  }, [user]);

  const fetchHistory = async (userId) => {
    try {
      const { data } = await axios.get(
        `http://localhost:8000/api/watch/${userId}`
      );
      setHistory(data);
    } catch (error) {
      console.log("Error fetching watch history", error);
    }
  };

  const handleSearch = async () => {
    if (!search.trim()) return;
    try {
      const { data } = await axios.get(
        `http://localhost:8000/api/github/search?q=${search}`
      );
      setRepos(data.items);
    } catch (error) {
      console.log("Search error", error);
    }
  };

  const handleWatch = async (repo) => {
    if (!user) return;
    try {
      await axios.post("http://localhost:8000/api/watch", {
        userId: user.id,
        repoName: repo.full_name,
        repoUrl: repo.html_url,
        stars: repo.stargazers_count,
      });
      fetchHistory(user.id);
    } catch (error) {
      console.log("Failed to save watch", error);
    }
  };

  const handleBookmark = async (repo) => {
    if (!user) return alert("Please login first");
    try {
      await axios.post("http://localhost:8000/api/bookmark", {
        userId: user.id,
        repoId: repo.id,
        repoName: repo.full_name,
        htmlUrl: repo.html_url,
        stars: repo.stargazers_count,
        description: repo.description,
      });
      alert("Bookmark added");
    } catch (error) {
      console.error("Bookmark error", error);
    }
  };

  return (
    <div className="bg-[#0d1117] min-h-screen text-white p-6 font-sans">
      <div className="max-w-4xl mx-auto">
        {user ? (
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2 text-gray-200">
              Welcome, {user.username}
            </h2>
            <img
              src={user.photos[0].value}
              alt="Profile"
              className="w-20 h-20 rounded-full mx-auto border-2 border-gray-500 cursor-pointer"
              onClick={() => (window.location.href = `/user/${user.username}`)}
            />
          </div>
        ) : (
          <div className="text-center">
            <button
              onClick={() =>
                (window.location.href =
                  "http://localhost:8000/api/auth/github")
              }
              className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition duration-200"
            >
              Login with GitHub
            </button>
          </div>
        )}

        <div className="mt-10 flex flex-col gap-4">
          <input
            type="text"
            placeholder="🔍 Search GitHub repositories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-3 bg-[#161b22] text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Search
          </button>
        </div>

        {/* Repo Results */}
        {repos.length > 0 && (
          <div className="mt-10">
            <h3 className="text-2xl font-semibold text-gray-200 mb-4">
              🔎 Top Results
            </h3>
            <ul className="space-y-4">
              {repos.map((repo) => (
                <li
                  key={repo.id}
                  className="bg-[#161b22] p-4 rounded-lg shadow-md border border-gray-700"
                >
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleWatch(repo)}
                    className="text-lg font-bold text-blue-400 hover:underline"
                  >
                    {repo.full_name}
                  </a>
                  <p className="text-gray-400">{repo.description}</p>
                  <div className="text-sm text-gray-500 mt-2">
                    ⭐ {repo.stargazers_count} stars
                  </div>
                  <button
                    onClick={() => handleBookmark(repo)}
                    className="mt-2 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Bookmark
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Watch History */}
        {history.length > 0 && (
          <div className="mt-12">
            <h3 className="text-2xl font-bold text-gray-200 mb-4">
              👀 Recently Watched
            </h3>
            <ul className="space-y-3">
              {history.map((item) => (
                <li
                  key={item._id}
                  className="bg-[#1c2128] p-3 rounded-md shadow border border-gray-700"
                >
                  <a
                    href={item.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline font-medium"
                  >
                    {item.repoName}
                  </a>{" "}
                  — ⭐ {item.stars}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Bookmarks */}
        {bookmarks.length > 0 && (
          <div className="mt-12">
            <h3 className="text-2xl font-semibold text-gray-200 mb-4">
              📌 Bookmarked Repositories
            </h3>
            <ul className="space-y-4">
              {bookmarks.map((bookmark) => (
                <li
                  key={bookmark.repoId}
                  className="bg-[#161b22] p-4 rounded-lg shadow border border-gray-700"
                >
                  <a
                    href={bookmark.htmlUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg font-bold text-purple-400 hover:underline"
                  >
                    {bookmark.repoName}
                  </a>
                  <p className="text-gray-400">{bookmark.description}</p>
                  <span className="text-sm text-gray-500">
                    ⭐ {bookmark.stars} stars
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Hero;
