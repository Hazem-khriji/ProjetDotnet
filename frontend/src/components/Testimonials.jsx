import profileImg1 from '/assets/profile_img_1.png'
import profileImg2 from '/assets/profile_img_2.png'
import profileImg3 from '/assets/profile_img_3.png'

const StarRating = () => {
  const starSvg = "data:image/svg+xml,%3csvg%20width='16'%20height='15'%20viewBox='0%200%2016%2015'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M7.52447%200.463526C7.67415%200.0028708%208.32585%200.00286996%208.47553%200.463525L9.90837%204.87336C9.97531%205.07937%2010.1673%205.21885%2010.3839%205.21885H15.0207C15.505%205.21885%2015.7064%205.83865%2015.3146%206.12336L11.5633%208.84878C11.3881%208.9761%2011.3148%209.20179%2011.3817%209.4078L12.8145%2013.8176C12.9642%2014.2783%2012.437%2014.6613%2012.0451%2014.3766L8.29389%2011.6512C8.11865%2011.5239%207.88135%2011.5239%207.70611%2011.6512L3.95488%2014.3766C3.56303%2014.6613%203.03578%2014.2783%203.18546%2013.8176L4.6183%209.4078C4.68524%209.20179%204.61191%208.9761%204.43667%208.84878L0.685441%206.12336C0.293584%205.83866%200.494972%205.21885%200.979333%205.21885H5.6161C5.83272%205.21885%206.02469%205.07937%206.09163%204.87336L7.52447%200.463526Z'%20fill='%23FF532E'/%3e%3c/svg%3e"
  
  return (
    <div className="flex justify-center gap-1 text-red-500 mb-4">
      {[...Array(5)].map((_, i) => (
        <img key={i} src={starSvg} alt="star" />
      ))}
    </div>
  )
}

const TestimonialCard = ({ image, name, role, testimonial }) => {
  return (
    <div className="max-w-[340px] border shadow-lg rounded px-8 py-12 text-center">
      <img
        className="w-20 h-20 rounded-full mx-auto mb-4"
        src={image}
        alt={`Portrait of ${name}`}
      />
      <h2 className="text-xl text-gray-700 font-medium">{name}</h2>
      <p className="text-gray-500 mb-4 text-sm">{role}</p>
      <StarRating />
      <p className="text-gray-600">{testimonial}</p>
    </div>
  )
}

const Testimonials = () => {
  const testimonials = [
    {
      image: profileImg1,
      name: "Donald Jackman",
      role: "Marketing Manager",
      testimonial: "From the very first meeting, they understood my vision and helped me find the perfect property. Their attention to detail and commitment to client satisfaction is unmatched."
    },
    {
      image: profileImg2,
      name: "Richard Nelson",
      role: "UI/UX Designer",
      testimonial: "From the very first meeting, they understood my vision and helped me find the perfect property. Their attention to detail and commitment to client satisfaction is unmatched."
    },
    {
      image: profileImg3,
      name: "James Washington",
      role: "Co-Founder",
      testimonial: "From the very first meeting, they understood my vision and helped me find the perfect property. Their attention to detail and commitment to client satisfaction is unmatched."
    }
  ]

  return (
    <div className="container mx-auto py-10 lg:px-32 w-full overflow-hidden" id="Testimonials"
         style={{opacity: 1, transform: 'none'}}>
      <h1 className="text-2xl sm:text-4xl font-bold mb-2 text-center">
        Customer <span className="underline underline-offset-4 decoration-1 under font-light">Testimonials</span>
      </h1>
      <p className="text-center text-gray-500 mb-12 max-w-80 mx-auto">
        Real Stories from Those Who Found Home with Us
      </p>
      <div className="flex flex-wrap justify-center gap-8">
        {testimonials.map((testimonial, index) => (
          <TestimonialCard key={index} {...testimonial} />
        ))}
      </div>
    </div>
  )
}

export default Testimonials

