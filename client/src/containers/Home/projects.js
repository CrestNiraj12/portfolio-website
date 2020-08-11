import React from "react";
import CollegeProject from "../../images/project.jpg";
import AT from "../../images/at.gif";
import Card from "../../components/Card";

const Projects = () => (
  <div className="projects">
    <Card
      url="https://nirajshrestha01.com.np/website/index.html"
      image={CollegeProject}
      alt="College Project"
      title="Personal Website"
      desc="Second year college project, developed with plain HTML5, CSS and
                JS with JQuery"
      linkText="View Project"
    />

    <Card
      url="https://crestniraj12.github.io/profile-page/index.html"
      image={AT}
      alt="First year college project"
      title="Profile page"
      desc="First year college project, developed with plain HTML5 and CSS"
      linkText="View Project"
    />
  </div>
);

export default Projects;
