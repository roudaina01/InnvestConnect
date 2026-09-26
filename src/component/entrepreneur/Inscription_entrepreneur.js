import React from 'react'

export default function Inscription_entrepreneur() {
  return (
    <div>
         {/* Slider */}
      <section className="slider">
        <div className="slider_inner relative sm:mt-20 mt-16 md:py-20 py-14">
          <div className="slider_bg absolute top-0 left-0 w-full h-full">
            <img
              src="./assets/images/components/breadcrumb_service.webp"
              alt="components/breadcrumb_service"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="container relative h-full">
            <div className="slider_content flex flex-col items-start justify-center xl:w-[600px] lg:w-[848px] md:w-5/6 w-full h-full">
              <h3 className="heading3 text-white mt-2 animate animate_top" style={{ "--i": 1 }}>
                chassez votre opprtuinité maintenant
              </h3>

              <p className="desc body2 text-white mt-3 animate animate_top" style={{ "--i": 2 }}>
                postez vos idées et nous réussisson ensemble.
              </p>

              <div className="mt-7.5 animate animate_top" style={{ "--i": 3 }}>
                <a href="register.html" className="button-main bg-white">
                  postez votre projet
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bring On The Benefits */}
      <section className="benefit_first lg:py-20 sm:py-14 py-10">
        <div className="container">
          <h3 className="heading3 text-center animate animate_top" style={{ "--i": 1 }}>
            les avantages
          </h3>

          

          <ul className="list_jobs grid lg:grid-cols-3 sm:grid-cols-2 sm:gap-7.5 gap-4 md:mt-10 mt-7">
            <li className="item flex flex-col items-center p-10 rounded-lg bg-white shadow-md duration-300 animate animate_top" style={{ "--i": 1 }}>
              <span className="ph-fill ph-seal-check text-6xl text-primary"></span>
              <h5 className="heading5 mt-6 text-center">investisseurs qualifiés</h5>
              <p className="desc mt-2 text-secondary text-center">avec notre partenaires le succée c'est à bord de vous</p>
            </li>

            <li className="item flex flex-col items-center p-10 rounded-lg bg-white shadow-md duration-300 animate animate_top" style={{ "--i": 2 }}>
              <span className="ph-fill ph-seal-check text-6xl text-primary"></span>
              <h5 className="heading5 mt-6 text-center">un process légere et rapide</h5>
              <p className="desc mt-2 text-secondary text-center">gagner votre temps avec un simple démarche  </p>
            </li>

            <li className="item flex flex-col items-center p-10 rounded-lg bg-white shadow-md duration-300 animate animate_top" style={{ "--i": 3 }}>
              <span className="ph-fill ph-seal-check text-6xl text-primary"></span>
              <h5 className="heading5 mt-6 text-center">equipe profisionelle</h5>
              <p className="desc mt-2 text-secondary text-center">une equipe jurudique et technique qualifiée est a votre disposition </p>
            </li>
          </ul>
        </div>
      </section>
       {/*
      {/* Benefit */}
      <section className="benefit bg-background lg:py-20 sm:py-14 py-10">
        <div className="container">
          <div className="benefit_inner flex max-lg:flex-col-reverse items-center justify-between gap-y-8">
            <div className="benefit_content xl:w-[570px] lg:w-5/12 w-full">
              <h3 className="heading3 animate animate_top" style={{ "--i": 1 }}>
                FreelanHub! The best choice?
              </h3>

              <p className="body2 mt-3 animate animate_top" style={{ "--i": 2 }}>
                Streamline your hiring process with strategic channels to reach qualified candidates
              </p>
            </div>

            <div className="benefit_bg relative lg:w-5/12 sm:w-[45%] w-[85%] lg:pl-3 lg:pr-15">
              <img
                src="./assets/images/components/benefit1.webp"
                alt="benefit1"
                className="w-full rounded-20"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How it work */}
      <section className="process">
        <div className="container">
          <div className="flex flex-col items-center lg:py-20 sm:py-14 py-10 border-b border-line">
            <h3 className="heading3 text-center animate animate_top" style={{ "--i": 1 }}>
              The application process
            </h3>

            <ul className="list grid xl:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-7.5 md:mt-10 mt-7">
              <li className="item flex flex-col items-center animate animate_top" style={{ "--i": 1 }}>
                <span className="icon-job text-6xl"></span>
                <h5 className="heading5 mt-6 text-center">Post Your Job</h5>
              </li>

              <li className="item flex flex-col items-center animate animate_top" style={{ "--i": 2 }}>
                <span className="icon-applicant text-6xl"></span>
                <h5 className="heading5 mt-6 text-center">Review Applicants</h5>
              </li>

              <li className="item flex flex-col items-center animate animate_top" style={{ "--i": 3 }}>
                <span className="icon-choose text-6xl"></span>
                <h5 className="heading5 mt-6 text-center">Choose a Freelancer</h5>
              </li>

              <li className="item flex flex-col items-center animate animate_top" style={{ "--i": 4 }}>
                <span className="icon-manage text-6xl"></span>
                <h5 className="heading5 mt-6 text-center">Manage the Project</h5>
              </li>
            </ul>
          </div>
        </div>
      </section>

         {/* Testimonials */}
      <section className="testimonials -style-6 lg:py-20 sm:py-14 py-10">
        <div className="container flex max-sm:flex-col items-center justify-between gap-y-8">
          
          <div className="testimonials_image flex-shrink-0 xl:w-[420px] lg:w-1/3 sm:w-2/5 w-full aspect-square rounded-xl overflow-hidden">
            <img src="./assets/images/avatar/IMG-1.webp" alt="IMG-1" className="w-full h-full object-cover" />
            <img src="./assets/images/avatar/IMG-2.webp" alt="IMG-2" className="w-full h-full object-cover hidden" />
            <img src="./assets/images/avatar/IMG-3.webp" alt="IMG-3" className="w-full h-full object-cover hidden" />
            <img src="./assets/images/avatar/IMG-4.webp" alt="IMG-4" className="w-full h-full object-cover hidden" />
          </div>

          <div className="list_testimonials lg:w-2/3 sm:w-3/5 w-full lg:pl-20 sm:pl-8">
            <div className="swiper swiper-list-testimonials6">
              <div className="swiper-wrapper">

                <div className="swiper-slide">
                  <div className="testimonials_item">
                    <div className="flex items-center gap-1">
                      <span className="ph-fill ph-star text-yellow text-2xl"></span>
                      <span className="ph-fill ph-star text-yellow text-2xl"></span>
                      <span className="ph-fill ph-star text-yellow text-2xl"></span>
                      <span className="ph-fill ph-star text-yellow text-2xl"></span>
                      <span className="ph-fill ph-star text-placehover text-2xl"></span>
                    </div>

                    <p className="lg:text-2xl text-xl lg:mt-5 mt-3">
                      Choosing FreelanHub was the best decision we made for our business.
                    </p>

                    <div className="mt-3">
                      <h5 className="heading5">Georgina Emma</h5>
                      <span className="caption1 text-secondary">Head of Recruitment</span>
                    </div>
                  </div>
                </div>

                <div className="swiper-slide">
                  <div className="testimonials_item">
                    <div className="flex items-center gap-1">
                      <span className="ph-fill ph-star text-yellow text-2xl"></span>
                      <span className="ph-fill ph-star text-yellow text-2xl"></span>
                      <span className="ph-fill ph-star text-yellow text-2xl"></span>
                      <span className="ph-fill ph-star text-yellow text-2xl"></span>
                      <span className="ph-fill ph-star text-placehover text-2xl"></span>
                    </div>

                    <p className="lg:text-2xl text-xl lg:mt-5 mt-3">
                      Choosing FreelanHub was the best decision we made for our business.
                    </p>

                    <div className="mt-3">
                      <h5 className="heading5">Alexander Pato</h5>
                      <span className="caption1 text-secondary">Head of Recruitment</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            <div className="list_action flex items-center justify-between lg:mt-8 mt-5">
              <div className="flex items-center gap-3">
                <button className="custom-button-testimonials-prev">
                  <span className="ph-bold ph-arrow-left text-xl"></span>
                </button>
                <button className="custom-button-testimonials-next">
                  <span className="ph-bold ph-arrow-right text-xl"></span>
                </button>
              </div>

              <a href="about1.html" className="border-b-2 border-black">
                Read Case Studies
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Counter */}
      <section className="counter lg:py-15 sm:py-12 py-8 bg-[#FAF7F1]">
        <div className="container flex max-lg:flex-wrap items-center justify-between max-lg:gap-y-8">

          <div className="item text-center">
            <h2 className="heading2">2,5M+</h2>
            <span className="body1">Jobs Available</span>
          </div>

          <div className="item text-center">
            <h2 className="heading2">177k+</h2>
            <span className="body1">New Jobs This Week!</span>
          </div>

          <div className="item text-center">
            <h2 className="heading2">298k+</h2>
            <span className="body1">Companies Hiring</span>
          </div>

          <div className="item text-center">
            <h2 className="heading2">5M+</h2>
            <span className="body1">Total Freelancers</span>
          </div>

        </div>
      </section>

      {/* FAQs */}
      <section className="faqs lg:py-20 sm:py-14 py-10">
        <div className="container flex flex-col items-center">

          <h3 className="heading3 text-center">
            Frequently asked questions
          </h3>

          <div className="md:w-5/6 flex flex-col gap-2 mt-10">

            <div className="faq_item py-6 border-b border-line">
              <h5 className="heading5">How do I post a job or find a freelancer?</h5>
              <p className="body2 text-secondary mt-3">
                Go to job section and follow instructions.
              </p>
            </div>

            <div className="faq_item py-6 border-b border-line">
              <h5 className="heading5">Is there a fee for using your services?</h5>
              <p className="body2 text-secondary mt-3">
                Some services may include fees.
              </p>
            </div>

            <div className="faq_item py-6 border-b border-line">
              <h5 className="heading5">Can I request support?</h5>
              <p className="body2 text-secondary mt-3">
                Yes, support is available anytime.
              </p>
            </div>

          </div>

        </div>
      </section>*/

      {/* Scroll to top */}
      <button className="scroll-to-top-btn">
        <span className="ph-bold ph-caret-up"></span>
      </button>
    </div>
  )
}
