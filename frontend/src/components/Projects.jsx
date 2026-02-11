import { useState } from 'react'
import projectImg1 from '/assets/project_img_1.jpg'
import projectImg2 from '/assets/project_img_2.jpg'
import projectImg3 from '/assets/project_img_3.jpg'
import projectImg4 from '/assets/project_img_4.jpg'
import projectImg5 from '/assets/project_img_5.jpg'
import projectImg6 from '/assets/project_img_6.jpg'

const Projects = () => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const projects = [
    { img: projectImg1, title: "Skyline Haven", price: "$2,50,000", location: "California" },
    { img: projectImg2, title: "Vista Verde", price: "$2,50,000", location: "San Francisco" },
    { img: projectImg3, title: "Serenity Suites", price: "$2,50,000", location: "Chicago" },
    { img: projectImg4, title: "Central Square", price: "$2,50,000", location: "Los Angeles" },
    { img: projectImg5, title: "Vista Verde", price: "$2,50,000", location: "San Francisco" },
    { img: projectImg6, title: "Serenity Suites", price: "$2,50,000", location: "Chicago" },
  ]

  const nextProject = () => {
    setCurrentIndex((prev) => (prev + 1) % projects.length)
  }

  const prevProject = () => {
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length)
  }

  return (
    <div className="container mx-auto py-4 pt-20 px-6 md:px-20 lg:px-32 my-20 w-full overflow-hidden"
         id="Projects" style={{opacity: 1, transform: 'none'}}>
      <h1 className="text-2xl sm:text-4xl font-bold mb-2 text-center">
        Projects <span className="underline underline-offset-4 decoration-1 under font-light">Completed</span>
      </h1>
      <p className="text-center text-gray-500 mb-8 max-w-80 mx-auto">
        Crafting Spaces, Building Legacies—Explore Our Portfolio
      </p>
      <div className="flex justify-end items-center mb-8">
        <button 
          className="p-3 bg-gray-200 rounded mr-2" 
          aria-label="Previous Project"
          onClick={prevProject}
        >
          <img
            src="data:image/svg+xml,%3csvg%20width='9'%20height='14'%20viewBox='0%200%209%2014'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M8%201L1%207L8%2013'%20stroke='%232563EB'%20stroke-width='1.5'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/svg%3e"
            alt="Previous"
          />
        </button>
        <button 
          className="p-3 bg-gray-200 rounded mr-2" 
          aria-label="Next Project"
          onClick={nextProject}
        >
          <img
            src="data:image/svg+xml,%3csvg%20width='9'%20height='14'%20viewBox='0%200%209%2014'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M1%201L8%207L1%2013'%20stroke='%232563EB'%20stroke-width='1.5'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/svg%3e"
            alt="Next"
          />
        </button>
      </div>
      <div className="overflow-hidden">
        <div className="flex gap-8 transition-transform duration-500 ease-in-out"
             style={{transform: `translateX(-${currentIndex * 25}%)`}}>
          {projects.map((project, index) => (
            <div key={index} className="relative flex-shrink-0 w-full sm:w-1/4">
              <img
                src={project.img} 
                alt={project.title}
                className="w-full h-auto mb-14"
              />
              <div className="absolute left-0 right-0 bottom-5 flex justify-center">
                <div className="inline-block bg-white w-3/4 px-4 py-2 shadow-md">
                  <h2 className="text-xl font-semibold text-gray-800">{project.title}</h2>
                  <p className="text-gray-500 text-sm">
                    {project.price} <span className="px-1">|</span> {project.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Projects

