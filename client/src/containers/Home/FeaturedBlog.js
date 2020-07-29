import React from "react";
import { Link } from "react-router-dom";

const FeaturedBlog = ({ posts }) => {
  const handleCreateUrl = (title, id) => {
    title = title
      .replace(/[^a-zA-Z ]/g, "")
      .toLowerCase()
      .split(" ")
      .join("-");
    return "/posts/" + title + "-" + id;
  };

  return (
    <section className="featured__posts">
      <Link
        className="featured__posts--large"
        to={() => handleCreateUrl(posts[0].title, posts[0]._id)}
      >
        <img
          className="featured__posts--large__thumbnail"
          src={`../../images/${posts[0].thumbnail}`}
          alt="MongoDB, Express and Node Stack"
        />
        <div className="featured__posts--large__text-wrapper">
          <h3>{posts[0].subhead}</h3>
          <h1>{posts[0].title}</h1>
          <p>{posts[0].description}</p>
        </div>
      </Link>
      <div className="featured__posts--small">
        {posts.length > 2 &&
          posts
            .slice(1)
            .map(({ _id, title, subhead, thumbnail, description }) => (
              <Link
                className="featured__posts--small-item"
                key={_id}
                to={handleCreateUrl(title, _id)}
              >
                <img
                  className="featured__posts--small-item__thumbnail"
                  src={`/images/${thumbnail}`}
                  alt="MongoDB, Express and Node Stack"
                />
                <div className="featured__posts--small-item__text-wrapper">
                  <h3>{subhead}</h3>
                  <h1>{title}</h1>
                  <p>{description}</p>
                </div>
              </Link>
            ))}
      </div>
    </section>
  );
};

export default FeaturedBlog;
