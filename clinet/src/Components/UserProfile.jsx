import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import ContributionGraph from "./ContributionGraph";
import { Tooltip } from "react-tooltip";

const UserProfile = () => {
  const { username } = useParams();
  const [userInfo, setUserInfo] = useState(null);
  const [repos, setRepos] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/github/user/${username}`);
        setUserInfo(res.data.user);
        setRepos(res.data.repos);
        setFollowers(res.data.followers);
        setFollowing(res.data.following);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching GitHub user data", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [username]);

  if (loading) return <div className="p-4 text-center text-gray-400">Loading...</div>;
  if (!userInfo) return <div className="p-4 text-center text-gray-400">User not found.</div>;

  return (
    <div className="bg-[#0d1117] text-white min-h-screen py-10 px-6 font-sans">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col items-center gap-4 text-center">
          <img
            src={userInfo.avatar_url}
            alt="Avatar"
            className="w-28 h-28 rounded-full border-2 border-gray-600 shadow"
          />
          <h2 className="text-3xl font-bold text-gray-100">{userInfo.name || userInfo.login}</h2>
          {userInfo.bio && <p className="text-gray-400 max-w-md">{userInfo.bio}</p>}
          <div className="flex gap-6 mt-2 text-sm text-gray-300">
            <span>👥 Followers: {userInfo.followers}</span>
            <span>🔁 Following: {userInfo.following}</span>
            <span>📦 Repos: {userInfo.public_repos}</span>
          </div>
        </div>

        <hr className="my-8 border-gray-700" />

        <h3 className="text-2xl font-semibold mb-6 text-gray-200">📂 Repositories</h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {repos.map((repo) => (
            <li
              key={repo.id}
              className="bg-[#161b22] p-4 rounded-lg border border-gray-700 shadow-md hover:shadow-lg transition"
            >
              <a
                href={repo.html_url}
                className="text-blue-400 font-bold text-lg hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {repo.name}
              </a>
              <p className="text-gray-400 mt-1">{repo.description}</p>
              <span className="text-sm text-gray-500 block mt-2">⭐ {repo.stargazers_count} stars</span>
            </li>
          ))}
        </ul>

        <div className="mt-10">
          <h3 className="text-2xl font-semibold text-gray-200 mb-4">📊 Contribution Activity</h3>
          <ContributionGraph username={username} />
        </div>

        <Tooltip id="my-tooltip" place="top" content="Hello from tooltip!" />
      </div>
    </div>
  );
};

export default UserProfile;
