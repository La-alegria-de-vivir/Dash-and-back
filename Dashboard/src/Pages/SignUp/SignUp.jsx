import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../../public/images/logo.png'
import '../Home/Home.css'

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password) {
      return setErrorMessage('Please fill out all fields.');
    }
    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        return setErrorMessage(data.message);
      }
      setLoading(false);
      if(res.ok) {
        navigate('/sign-in');
      }
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
    }
  };
  return (
    <div className='min-h-screen mt-40'>
      <div className='flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5'>
        {/* left */}
        <div className='flex-1'>
          <Link to='/' className='font-bold dark:text-white text-4xl'>
          <img
            src={logo}
            width={250}
            height={250}
            className="rounded-full"
            alt="Logo"
              />
          </Link>
          <p className=' text-md mt-5 '>
              Disfruta de la Cocina Viva y en Constante Evolución!
            </p>
        </div>
   

        <div className='flex-1 bg-white bg-opacity-75 p-6 rounded-lg shadow-md'>
          <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <div>
              <Label value='Nombre de usuario' />
              <TextInput
                type='text'
                placeholder='Nombre de usuario'
                id='username'
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value='Correo electrónico' />
              <TextInput
                type='email'
                placeholder='correo@correo.com'
                id='email'
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value='Contraseña' />
              <TextInput
                type='password'
                placeholder='******'
                id='password'
                onChange={handleChange}
              />
            </div>
            <Button 
                className='bg-gradient-to-r from-[#AEAF50] to-[#F3C14C] hover:from-[#adaf50bd] hover:to-[#F3C14C] text-white font-bold justify-center rounded transition-colors duration-300 h-8' 
                type='submit' 
              >
                Registrarse
              </Button>
          </form>
          <div className='flex gap-2 text-sm mt-5'>
            <span>¿Tienes una cuenta?</span>
            <Link to='/' className='text-blue-500'>
              Inicia sesión
            </Link>
          </div>
          {errorMessage && (
            <Alert className='mt-5' color='failure'>
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}