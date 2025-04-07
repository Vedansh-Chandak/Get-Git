import { useEffect, useState } from "react";
import axios from "axios";

axios.defaults.withCredentials = true;

const Hero = () => {
  const [user, setUser] = useState(null);
  const [search, setSearch] = useState("");
  const [repos, setRepos] = useState([]);
  const [history, setHistory] = useState([]);
const [bookmarks, setBookmarks]= useState([]);
  useEffect(() => {
    axios
      .get("http://localhost:8000/api/auth/user")
      .then((res) => {
        setUser(res.data);
        if (res.data && res.data.id) {
          fetchHistory(res.data.id);
        }
      })
      .catch((err) => {
        console.log("Error in fetching user data", err);
      });
  }, []);

  useEffect(()=>{
if(user){
  axios.get(`http://localhost:8000/api/bookmark/${user.id}`)
  .then(res => setBookmarks(res.data))
  .catch(err => console.log("Bookmark fetch error", err))
}

  },[user])

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
      console.log("search error", error);
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
      fetchHistory(user.id); // Refresh history
    } catch (error) {
      console.log("Failed to save watch", error);
    }
  };

  //Bookmark controller

  const handleBookmark = async (repo) => {
    if (!user) return alert("please login first");
    try {
      await axios.post("http://localhost:8000/api/bookmark", {
        userId: user.id,
        repoId: repo.id,
        repoName: repo.full_name,
        htmlUrl: repo.html_url,
        stars: repo.stargazers_count,
        description: repo.description,
      });
      alert("bookmark added");
    } catch (error) {
      console.error("bookmark error", error);
    }
  };

  return (
    <div className="text-center p-10 max-w-3xl mx-auto">
      {user ? (
        <>
          <h2 className="text-2xl font-bold mb-4">Welcome, {user.username}</h2>
          <img
            src={user.photos[0].value}
            alt="Profile"
            className="w-20 h-20 rounded-full mx-auto mb-4"
          onClick={()=> window.location.href= `/user/${user.username}`}
          />
        </>
      ) : (
        <button
          onClick={() =>
            (window.location.href = "http://localhost:8000/api/auth/github")
          }
          className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800"
        >
          Login with GitHub
        </button>
      )}

      {/* Search */}
      <div className="mt-8 flex flex-col gap-4">
        <input
          type="text"
          placeholder="Search GitHub repositories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg shadow"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
        >
          Search
        </button>
      </div>

      {/* Repo Results */}
      {repos.length > 0 && (
        <div className="mt-8 text-left">
          <h3 className="text-xl font-semibold mb-4">Top Results</h3>
          <ul className="space-y-4">
            {repos.map((repo) => (
              <li key={repo.id} className="p-4 border rounded-lg shadow">
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleWatch(repo)}
                  className="text-lg font-bold text-blue-700"
                >
                  {repo.full_name}
                </a>
                <p>{repo.description}</p>
                <span className="text-sm text-gray-600">
                  ⭐ {repo.stargazers_count} stars
                </span>
                <button
                  onClick={() => handleBookmark(repo)}
                  className="ml-4 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
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
        <div className="mt-10 text-left">
          <h3 className="text-xl font-bold mb-2">
            Recently Watched Repositories
          </h3>
          <ul className="space-y-2">
            {history.map((item) => (
              <li
                key={item._id}
                className="p-3 border rounded-md shadow-sm bg-gray-50"
              >
                <a
                  href={item.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 font-medium"
                >
                  {item.repoName}
                </a>{" "}
                — ⭐ {item.stars}
              </li>
            ))}
          </ul>
        </div>
      )}


{bookmarks.length > 0 && (
  <div className="mt-10 text-left">
    <h3 className="text-xl font-semibold mb-4">📌 Bookmarked Repositories</h3>
    <ul className="space-y-4">
      {bookmarks.map((bookmark) => (
        <li key={bookmark.repoId} className="p-4 border rounded-lg shadow">
          <a href={bookmark.htmlUrl} target="_blank" rel="noopener noreferrer" className="text-lg font-bold text-purple-700">
            {bookmark.repoName}
          </a>
          <p>{bookmark.description}</p>
          <span className="text-sm text-gray-600">⭐ {bookmark.stars} stars</span>
        </li>
      ))}
    </ul>
  </div>
)}




    </div>
  );
};

export default Hero;
