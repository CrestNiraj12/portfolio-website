import React from "react";
import Woolwich from "../../images/woolwich.PNG";
import TBC from "../../images/tbc.PNG";
import Card from "../../components/Card";

const Projects = () => {
  const projects = [
    {
      url: "https://thewoolwichpharmacy.co.uk/",
      image: Woolwich,
      alt: "Woolwich Pharmacy website",
      title: "Woolwich Pharmacy website",
      desc: "Simple Pharmacy website with dynamic booking card",
      linkText: "View Project",
      translateY: 0,
    },
    {
      url: "https://tbc.edu.np",
      image: TBC,
      alt: "Official Website of The British College",
      title: "Official Website of The British College",
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
