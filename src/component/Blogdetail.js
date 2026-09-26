import React from 'react';
import { Link, useParams } from 'react-router-dom';
import BLOG_POSTS from './Blogdata';
export default function BlogDetail() {
  const { slug } = useParams();
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="container sm:pt-28 pt-24 pb-20 flex flex-col items-center gap-4">
        <p className="body2 text-secondary text-center">
          Cet article n'existe pas ou plus.
        </p>
        <Link to="/" className="button-main">
          Retour à l'accueil
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Breadcrumb */}
      <section className="breadcrumb">
        <div className="breadcrumb_inner relative h-[330px] flex items-center pt-16 sm:pt-20">
          <div className="breadcrumb_bg absolute top-0 left-0 w-full h-full">
            <img
              src="/assets/images/logo.png"
              alt="breadcrumb"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="container relative h-full">
            <div className="breadcrumb_content flex flex-col items-start justify-center xl:w-[1000px] lg:w-[848px] md:w-5/6 w-full h-full">
              <span className="caption1 text-white">{post.tag}</span>
              <h3 className="heading3 text-white mt-2">{post.title}</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Article */}
      <section className="lg:py-20 sm:py-14 py-10">
        <div className="container">
          <div className="max-w-[760px] mx-auto">

            <div className="rounded-xl overflow-hidden mb-10">
              <img src={post.image} alt={post.title} className="w-full" />
            </div>

            {post.content.map((section, index) => (
              <div key={index} className={index > 0 ? 'mt-8' : ''}>
                <h4 className="heading5">{section.heading}</h4>
                {section.paragraphs.map((paragraph, pIndex) => (
                  <p key={pIndex} className="body2 text-secondary mt-3">
                    {paragraph}
                  </p>
                ))}
              </div>
            ))}

            <div className="mt-12 pt-8 border-t border-line flex items-center justify-between flex-wrap gap-4">
              <Link to="/" className="text-button pb-0.5 border-b-2 border-primary duration-300 hover:text-primary">
                Retour à l'accueil
              </Link>
              <Link to="/Liste_proj" className="button-main">
                Découvrir les projets
              </Link>
            </div>

          </div>
        </div>
      </section>

      <button className="scroll-to-top-btn">
        <span className="ph-bold ph-caret-up" />
      </button>
    </div>
  );
}