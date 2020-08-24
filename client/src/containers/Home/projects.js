import React from "react";
import CollegeProject from "../../images/project.jpg";
import AT from "../../images/at.png";
import Card from "../../components/Card";

const Projects = () => {
  const projects = [
    {
      url: "https://nirajshrestha01.com.np/website/index.html",
      image: CollegeProject,
      alt: "College Project",
      title: "Personal Website",
      desc:
        "Second year college project, developed with plain HTML5, CSS and JS with JQuery",
      linkText: "View Project",
      translateY: 0,
    },
    {
      url: "https://crestniraj12.github.io/profile-page/index.html",
      image: AT,
      alt: "First year college project",
      title: "Profile page",
      desc: "First year college project, developed with plain HTML5 and CSS",
      linkText: "View Project",
      translateY: -10,
    },
  ];

  return (
    <div className="projects">
      {projects.map(
        ({ url, image, alt, title, desc, linkText, translateY }, index) => (
          <Card
            key={index + url}
            url={url}
            image={image}
            alt={alt}
            title={title}
            desc={desc}
            linkText={linkText}
            translateY={translateY}
          />
        )
      )}
    </div>
  );
};

export default Projects;
