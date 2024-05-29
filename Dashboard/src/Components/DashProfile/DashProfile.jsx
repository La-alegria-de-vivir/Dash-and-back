import { Alert, Button, Modal, ModalBody, TextInput } from 'flowbite-react';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import 'react-circular-progressbar/dist/styles.css';
import { updateStart, updateSuccess, updateFailure, deleteUserStart, deleteUserFailure, deleteUserSuccess, signoutSuccess } from '../Redux/User/userSlice.js';
import {HiOutlineExclamationCircle} from 'react-icons/hi'
import { Link } from 'react-router-dom';





export default function DashProfile() {
  const { currentUser, error, loading } = useSelector(state => state.user);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});
  const filePickerRef = useRef();
  const dispatch = useDispatch();

const handleChange = (e) =>{
  setFormData({...formData, [e.target.id]: e.target.value})
};

const handleSubmit = async (e) =>{
  e.preventDefault();
  setUpdateUserError(null);
  setUpdateUserSuccess(null);
  if (Object.keys(formData).length === 0) {
    setUpdateUserError('No changes made');
    return;

  }
  try {
    dispatch(updateStart());
    const res = await fetch(`/api/user/update/${currentUser._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (!res.ok) {
      dispatch(updateFailure(data.message));
      setUpdateUserError(data.message);
    } else {
      dispatch(updateSuccess(data));
      setUpdateUserSuccess('User profile updated successfully');
    }
  } catch (error) {
    dispatch(updateFailure(error.message));
    setUpdateUserError(error.message);
  }
};
const handleDeleteUser = async () => {
  setShowModal(false);
  try {
    dispatch(deleteUserStart());
    const res = await fetch(`/api/user/delete/${currentUser._id}`,{
      method: 'DELETE'
    });
    const data = await res.json();
    if (!res.ok) {
      dispatch(deleteUserFailure(data.message));
    } else{
      dispatch(deleteUserSuccess(data));
    }
  } catch (error) {
    dispatch(deleteUserFailure(error.message));
  }
};

const handleSignout = async () =>{
  try {
    const res = await fetch('/api/user/signout', {
      method: 'POST',
    });
    const data = await res.json();
    if (!res.ok) {
      console.log(data.message);
    }else{
      dispatch(signoutSuccess());
    }
  } catch (error) {
    console.log(error.message);
  }
};
  return (
<div className=" max-w-lg mx-auto p-3 w-full mt-20">
  <h1 className=' my-7 text-center font-semibold text-3xl'>Perfil</h1>
  <form onSubmit={handleSubmit} className=' flex flex-col self-center gap-4'>

    <TextInput type='text' id='username'placeholder='Nombre usuario' defaultValue={currentUser.username} onChange={handleChange}/>
    <TextInput type='email' id='email'placeholder='Correo electrónico' defaultValue={currentUser.email} onChange={handleChange}/>
    <TextInput type='password' id='password'placeholder='contraseña' onChange={handleChange}/>
    <Button type='submit'className=' w-full bg-gradient-to-r from-[#AEAF50] to-[#F3C14C] hover:from-[#adaf50bd] hover:to-[#F3C14C] text-white font-bold justify-center rounded transition-colors duration-300 h-8'>
      {loading ? 'Loading...' : 'Actualizar'}
    </Button>
    {
      currentUser.isAdmin && (
        <Link to={'/create-menu'}>
        <Button
        type='button'
        className=' w-full bg-gradient-to-r from-[#AEAF50] to-[#F3C14C] hover:from-[#adaf50bd] hover:to-[#F3C14C] text-white font-bold justify-center rounded transition-colors duration-300 h-8' 
        >
          Crear nuevo plato

        </Button>        
        </Link>

      )
    }
  </form>
  <div className=" text-red-500 flex justify-between mt-5">
    <span onClick={()=>setShowModal(true)} className=' cursor-pointer'>Borrar cuenta</span>
    <span onClick={handleSignout} className=' cursor-pointer'>Salir</span>
  </div>
{updateUserSuccess && (
  <Alert color='success' className= 'me-5'>
    {updateUserSuccess}
  </Alert>
)

}
  
  {updateUserError && (
    <Alert color='failure' className= 'mt-5'>
      {updateUserError}
    </Alert>
  )

  }
    {error && (
    <Alert color='failure' className= 'mt-5'>
      {error}
    </Alert>
  )

  }

  <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
  <Modal.Header/>
    <ModalBody>
      <div className="text-center mt-20">
        <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto'/>
        <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>¿Estás seguro que quieres borrar la cuenta?</h3>
        <div className=" flex justify-center gap-6">
          <Button color='black' onClick={handleDeleteUser}>
            Si, estoy segura
          </Button>
          <Button color='gray' onClick={() => setShowModal(false)}>
            No, cancelar
          </Button>
        </div>
      </div>
    </ModalBody>
  </Modal>
</div>

  );
}
