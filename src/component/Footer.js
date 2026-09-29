import React from 'react'
import { Link } from 'react-router-dom';
import api from '../api'
export default function Footer() {
  return (
    <div>
       
    <footer className="footer">
  <div className="footer_inner bg-feature">
    <div className="container">
      <div className="footer_heading flex flex-wrap items-center justify-between gap-4 w-full md:pt-10 pt-7 md:pb-5 pb-4 border-b border-light">
        <a href="index.html" className="footer_logo">
          <img src="./assets/images/logo-white.png" alt="logo-white" className="h-[42px] w-auto" />
        </a>
        <div className="list_social flex flex-wrap items-center gap-4">
          <span className="text-subtitle text-white">Suivez nous sur:</span>
          <div className="list flex flex-wrap items-center gap-3">
            <a href="https://www.facebook.com/" target="_blank" className="w-10 h-10 flex items-center justify-center border border-light text-white rounded-full duration-300 hover:bg-white hover:text-black">
              <span className="icon-facebook text-lg" />
            </a>
            <a href="https://www.linkedin.com/" target="_blank" className="w-10 h-10 flex items-center justify-center border border-light text-white rounded-full duration-300 hover:bg-white hover:text-black">
              <span className="icon-linkedin text-lg" />
            </a>
            <a href="https://www.twitter.com/" target="_blank" className="w-10 h-10 flex items-center justify-center border border-light text-white rounded-full duration-300 hover:bg-white hover:text-black">
              <span className="icon-twitter text-lg" />
            </a>
            <a href="https://www.instagram.com/" target="_blank" className="w-10 h-10 flex items-center justify-center border border-light text-white rounded-full duration-300 hover:bg-white hover:text-black">
              <span className="icon-instagram text-lg" />
            </a>
            <a href="https://www.pinterest.com/" target="_blank" className="w-10 h-10 flex items-center justify-center border border-light text-white rounded-full duration-300 hover:bg-white hover:text-black">
              <span className="icon-pinterest text-lg" />
            </a>
            <a href="https://www.youtube.com/" target="_blank" className="w-10 h-10 flex items-center justify-center border border-light text-white rounded-full duration-300 hover:bg-white hover:text-black">
              <span className="icon-youtube text-lg" />
            </a>
          </div>
        </div>
      </div>
      <div className="footer_content flex max-xl:flex-wrap items-start justify-between gap-y-8 md:py-10 py-7">
        <div className="footer_nav max-md:w-1/2">
          <strong className="nav_heading text-button-sm text-white">Secteurs d'activité </strong>
          <ul className="list_nav flex flex-col gap-3 mt-4">
            <li>technologie</li>
            <li>construction et immobilier</li>
            <li>agriculture et agroalimentaire</li>
            <li>commerce et e-commerce</li>
            <li>santé</li>
            <li>education</li>
            <li>energie et environnement</li>
          </ul>
        </div>
        <div className="footer_nav max-md:w-1/2">
          <strong className="nav_heading text-button-sm text-white">Pour les investisseurs</strong>
          <ul className="list_nav flex flex-col gap-3 mt-4">
<li>
  <Link
    className="caption1 capitalize line-before line-white text-placehover hover:text-white duration-300"
    to="/Liste_proj"
  >
    liste des projets
  </Link>
</li>         
<li>
  <Link
    className="caption1 capitalize line-before line-white text-placehover hover:text-white duration-300"
    to="/Liste_des_reuinions"
  >
    liste des réunions
  </Link>
</li>          </ul>
        </div>
        <div className="footer_nav max-md:w-1/2">
          <strong className="nav_heading text-button-sm text-white">Pour les entrepreneurs</strong>
          <ul className="list_nav flex flex-col gap-3 mt-4">
<li>
  <Link
    className="caption1 capitalize line-before line-white text-placehover hover:text-white duration-300"
    to="/Poster"
  >
    ajouter un Projet
  </Link>
</li>             
<li>
  <Link
    className="caption1 capitalize line-before line-white text-placehover hover:text-white duration-300"
    to="/Liste_des_reuinions"
  >
    liste des réunions
  </Link>
</li>           </ul>
        </div>
        <div className="footer_nav max-md:w-1/2">
          <strong className="nav_heading text-button-sm text-white">Support</strong>
          <ul className="list_nav flex flex-col gap-3 mt-4">
<li><a className="caption1 capitalize line-before line-white text-placehover hover:text-white duration-300" href="mailto:support@tondomaine.com">contacter le staff technique pour toute reclamation</a></li>          </ul>
        </div>
      </div>
      <div className="footer_bottom flex items-center justify-between max-sm:flex-col gap-2 py-2 border-t border-light">
        <div className="left-block flex items-center">
          <div className="copyright text-placehover caption1">©2024 FreelanHub. All Rights Reserved.</div>
        </div>
        <div className="nav-link flex items-center gap-2.5">
          <a className="text-placehover caption1 hover-underline" href="term-of-use.html">Terms Of Services</a>
          <span className="text-placehover caption1">|</span>
          <a className="text-placehover caption1 hover-underline" href="term-of-use.html">Privacy Policy</a>
        </div>
      </div>
    </div>
  </div>
</footer>


    </div>
  )
}
