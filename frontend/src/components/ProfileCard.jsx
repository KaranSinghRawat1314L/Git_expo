function ProfileCard({ profile }) {
  return (
    <div className="profile-card">
      <img
        src={profile.avatarUrl}
        alt={profile.name}
        className="avatar"
      />

      <h2>{profile.name || profile.login}</h2>

      <p className="bio">{profile.bio}</p>

      <div className="stats">
        <div>
          <strong>{profile.followers}</strong>
          <span> Followers</span>
        </div>

        <div>
          <strong>{profile.following}</strong>
          <span> Following</span>
        </div>

        <div>
          <strong>{profile.publicRepos}</strong>
          <span> Repositories</span>
        </div>
      </div>
    </div>
  );
}

export default ProfileCard;