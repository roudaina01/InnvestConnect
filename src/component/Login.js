import React, {  useState } from 'react'
import { useNavigate } from 'react-router-dom';
import api from '../api'
export default function Login() {
  const navigate = useNavigate(); 
  const [statut, setStatut] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [erreur, setErreur] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();

  let data = {
  statut: statut,
  email: email,
  mot_de_passe: password, 
}

  console.log(data);

 
 
api.post('/Login', data)
    .then((res) => {
      console.log("profile trouvé", res.data);
        localStorage.setItem('token', res.data.token);         
    localStorage.setItem('user', JSON.stringify(res.data.user));
     navigate('/')
    })
    .catch((err) => {
     if (err.response && err.response.status === 404) {
      alert("Email ou mot de passe incorrect !");
    } else {
      alert("Erreur serveur, réessayez plus tard");
    }
   

    });
 }
  



  return (
    <div>
      {/* Breadcrumb */}
<section className="breadcrumb">
  <div className="breadcrumb_inner relative sm:mt-20 mt-16 lg:py-20 py-14">

    <div className="breadcrumb_bg absolute top-0 left-0 w-full h-full">
      <img
        src="/assets/images/logo.png"
        alt="breadcrumb_candidate"
        className="w-full h-full object-cover"
      />
    </div>

    <div className="container relative h-full">

      <div className="breadcrumb_content flex flex-col items-start justify-center xl:w-[1000px] lg:w-[848px] md:w-5/6 w-full h-full">

        <div
          className="list_breadcrumb flex items-center gap-2 animate animate_top"
          style={{ "--i": 1 }}
        >
          
        </div>

        <h3
          className="heading3 text-white mt-2 animate animate_top"
          style={{ "--i": 2 }}
        >
          Se connecter
        </h3>

      </div>

    </div>

  </div>
</section>
{/* Form Login */}
<section className="form_login lg:py-20 sm:py-14 py-10">
  <div className="container flex items-center justify-center">

    <div className="content sm:w-[448px] w-full">

      <h3 className="heading3 text-center">Se connecter</h3>

      <form   className="form mt-6"  onSubmit={handleSubmit}>

        <div className="form-group">
          <label htmlFor="username">E-mail*</label>
          <input
            id="username"
            type="email"
            name="username"
            className="form-control w-full mt-3 border border-line px-4 h-[50px] rounded-lg"
            placeholder="Email address*"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-group mt-6">
          <label htmlFor="password">Mot de passe*</label>
          <input
            id="password"
            type="password"
            name="password"
            className="form-control w-full mt-3 border border-line px-4 h-[50px] rounded-lg"
            placeholder="Password*"
            required
             onChange={(p) => setPassword(p.target.value)}
          />
        </div>

         <div className="form-group mt-6">
          <label htmlFor="password">statut*</label> <br></br>
        <select        className="form-control w-full mt-3 border border-line px-4 h-[50px] rounded-lg"

           id="statut" name="statut" value={statut} onChange={(s) => setStatut(s.target.value)}>
         <option >choisissez votre statut</option>
         <option value="entrepreneur">entrepreneur</option>
          <option value="investisseur">investisseur</option>
          <option value="admin">admin</option>
         </select>
        </div>

        <div className="flex items-center justify-between mt-6">

          <div className="sub-input-checkbox flex items-center gap-2">
            <input id="checkbox" type="checkbox" name="checkbox" />
            <label htmlFor="checkbox" className="text-surface1">
              enregistrer mes données
            </label>
          </div>

          <a className="text-primary hover:underline" href="#!">
            mot de passe oublié?
          </a>

        </div>

        <div className="block-button mt-6">
          <button   type="submit" className="button-main bg-primary w-full text-center">
  Se connecter
</button>
        </div>

        <div className="navigate flex items-center justify-center gap-2 mt-6">
          <span className="text-surface1">Pas encore enregistré?</span>
         <button
                    type="button"
                    className={`tab_btn -fill -fill-primary w-full py-3 text-button text-center rounded bg-surface duration-300 hover:text-primary ${statut === 'entrepreneur' ? 'active' : ''}`}
                    onClick={() => navigate('/Register_inv')}
                  >
                    Inscription
                  </button>
        </div>

      </form>

    </div>

  </div>
</section>
    </div>
  )
}