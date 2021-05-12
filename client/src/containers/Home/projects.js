import React from "react";
import CollegeProject from "../../images/project.jpg";
import TBC from "../../images/tbc.PNG";
import Card from "../../components/Card";

const Projects = () => {
  const projects = [
    {
      url: "https://nirajshrestha01.com.np/website/index.html",
      image: CollegeProject,
      alt: "College Project",
      title: "Personal Website",
      desc: "Second year college project, developed with plain HTML5, CSS and JS with JQuery",
      linkText: "View Project",
      translateY: 0,
    },
    {
      url: "https://tbc.edu.np",
      image: TBC,
      alt: "Official Website of The British College",
      title: "Profile page",
      desc: "Official Website of The British College, developed with Laravel with ReactJS scaffolding",
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
