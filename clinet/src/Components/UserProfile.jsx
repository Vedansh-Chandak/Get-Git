import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import ContributionGraph from "./ContributionGraph";

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

  if (loading) return <div className="p-4 text-center">Loading...</div>;
  if (!userInfo) return <div className="p-4 text-center">User not found.</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex flex-col items-center gap-4">
        <img src={userInfo.avatar_url} alt="Avatar" className="w-28 h-28 rounded-full" />
        <h2 className="text-2xl font-bold">{userInfo.name || userInfo.login}</h2>
        <p>{userInfo.bio}</p>
        <div className="flex gap-4">
          <span>Followers: {userInfo.followers}</span>
          <span>Following: {userInfo.following}</span>
          <span>Repos: {userInfo.public_repos}</span>
        </div>
      </div>

      <hr className="my-6" />

      <h3 className="text-xl font-semibold mb-4">Repositories</h3>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {repos.map((repo) => (
          <li key={repo.id} className="p-4 border rounded-lg shadow">
            <a href={repo.html_url} className="text-blue-700 font-bold" target="_blank" rel="noopener noreferrer">
              {repo.name}
            </a>
            <p>{repo.description}</p>
            <span>⭐ {repo.stargazers_count}</span>
          </li>
        ))}
      </ul>
<ContributionGraph username={username} />

    </div>
  );
};

export default UserProfile;
