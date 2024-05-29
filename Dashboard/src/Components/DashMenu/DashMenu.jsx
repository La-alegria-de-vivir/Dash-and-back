import React, { useEffect, useState } from 'react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { PiPencilSimpleLineFill } from "react-icons/pi";

import { Link } from 'react-router-dom';

export default function DashMenu() {
  const [menus, setMenus] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [menuIdToDelete, setMenuIdToDelete] = useState('');

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    try {
      const res = await fetch(`/api/menu/getMenu`);
      const data = await res.json();
      if (res.ok) {
        setMenus(data.menu.slice(0, 5)); 
        if (data.menu.length <= 5) { 
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleShowMore = async () => {
    const startIndex = menus.length;
    try {
      const res = await fetch(`/api/menu/getMenu?startIndex=${startIndex}`);
      const data = await res.json();
      if (res.ok) {
        setMenus((prev) => [...prev, ...data.menu]);
        if (data.menu.length < 7) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeleteMenu = async () => {
    try {
      const res = await fetch(`/api/menu/deletemenu/${menuIdToDelete}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setMenus((prev) => prev.filter((menu) => menu._id !== menuIdToDelete));
        setShowModal(false);
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  

  return (
    <div className='table-auto overflow-y-hidden md:mx-auto p-3 h-screen mt-24 w-full'>
      <div className="overflow-y-auto h-full">
        {menus.length > 0 ? (
          <>
            <table className='min-w-full divide-y divide-gray-200 shadow-md'>
              <thead className='bg-gray-50'>
                <tr>
                  <th scope='col' className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5'>
                    Título
                  </th>
                  <th scope='col' className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[20]'>
                    Descripción
                  </th>
                  <th scope='col' className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5'>
                    Precio
                  </th>
                  <th scope='col' className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5'>
                    Imagen
                  </th>
                  <th scope='col' className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5'>
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {menus.map((menu) => (
                  <tr key={menu._id}>
                    <td className='px-4 py-4 whitespace-nowrap'>{menu.title}</td>
                    <td className='px-4 py-4 whitespace-nowrap overflow-hidden overflow-ellipsis w-1/5 text-sm max-w-[10rem]'>{menu.description}</td>
                    <td className='px-4 py-4 whitespace-nowrap'>{menu.price}€</td> {/* Agregar símbolo del euro */}
                    <td className='px-4 py-4 whitespace-nowrap'><img src={menu.image} alt={menu.title} className="w-16 h-16" /></td>
                    <td className='px-4 py-4 whitespace-nowrap flex'>
                      <span
                        onClick={() => {
                          setShowModal(true);
                          setMenuIdToDelete(menu._id);
                        }}
                        className='text-red-500 hover:underline cursor-pointer mr-4'
                      >
                        <HiOutlineExclamationCircle />
                      </span>
                      <span>
                      <Link
                      className='text-teal-500 hover:underline'
                      to={`/update-menu/${menu._id}`}
                      >
                      <span><PiPencilSimpleLineFill /></span>
                       </Link>

                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {showMore && (
              <button
                onClick={handleShowMore}
                className='w-full text-teal-500 self-center text-sm py-7'
              >
                Mostar más
              </button>
            )}
          </>
        ) : (
          <p>Aún no tienes ningún menú!</p>
        )}
      </div>
      {showModal && (
        <div className='fixed z-10 inset-0 overflow-y-auto'>
          <div className='flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0'>
            <div className='fixed inset-0 transition-opacity' aria-hidden='true'>
              <div className='absolute inset-0 bg-gray-500 opacity-75'></div>
            </div>
            <span className='hidden sm:inline-block sm:align-middle sm:h-screen' aria-hidden='true'></span>
            <div className='inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full'>
              <div className='bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4'>
                <div className='sm:flex sm:items-start'>
                  <div className='mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10'>
                    <HiOutlineExclamationCircle className='h-6 w-6 text-red-600' />
                  </div>
                  <div className='mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left'>
                    <h3 className='text-lg leading-6 font-medium text-gray-900' id='modal-title'>
                      ¿Seguro que quieres eliminar este plato?
                    </h3>
                  </div>
                </div>
              </div>
              <div className='bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse'>
                <button
                  onClick={handleDeleteMenu}
                  className='w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm'
                >
                  Si, estoy seguro
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className='mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm'
                >
                  No, cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


