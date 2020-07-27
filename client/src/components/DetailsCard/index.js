import React, { useEffect } from "react";
import { ReactComponent as CloseIcon } from "../../images/close-icon.svg";

const DetailsCard = ({ query, handleCloseCard, details }) => {
  useEffect(() => {
    document.getElementById("detailsCard").focus();
  }, []);

  return (
    <ul id="detailsCard" onBlur={handleCloseCard} tabIndex={0}>
      <li>
        <CloseIcon width="15px" height="15px" onClick={handleCloseCard} />
      </li>
      <li>{details.id}</li>
      {query === "posts" ||
        (query === "ownPosts" && (
          <>
            <li>
              <strong>Title:</strong> {details.title}
            </li>

            {query !== "ownPosts" && (
              <li>
                <strong>Author:</strong> {details.author}
              </li>
            )}

            <li>
              <strong>Created:</strong> {details.created}
            </li>
            <li>
              <strong>Updated on:</strong> {details.updated}
            </li>
          </>
        ))}
      {query === "users" && (
        <>
          <li>
            <strong>Name:</strong> {details.fullname}
          </li>
          <li>
            <strong>Email:</strong> {details.email}
          </li>
          <li>
            <strong>Role:</strong> {details.role}
          </li>
          <li>
            <strong>Posts:</strong> {details.posts && details.posts.length}
          </li>
        </>
      )}
    </ul>
  );
};

export default DetailsCard;
