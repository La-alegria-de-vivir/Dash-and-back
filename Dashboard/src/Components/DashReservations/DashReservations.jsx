import React, { useEffect, useState } from 'react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { MdOutlineRestaurant } from "react-icons/md";
import { IoRestaurantSharp } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import { PiPencilSimpleLineFill } from "react-icons/pi";

export default function DashReservation() {
  const [reservations, setReservations] = useState([]);
  const [totalReservations, setTotalReservations] = useState(0);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [reservationIdToDelete, setReservationIdToDelete] = useState('');
  const [sortBy, setSortBy] = useState({ field: 'hour', order: 'desc' });

  useEffect(() => {
    fetchReservations();
  }, [sortBy]);

  const fetchReservations = async () => {
    try {
      const res = await fetch(`/api/reserve/getreservations`);
      const data = await res.json();

      if (res.ok) {
        if (data) {
          const currentDate = new Date().toISOString().slice(0, 10); 
          const filteredData = data.filter(reservation => reservation.date.slice(0, 10) === currentDate); 
          const sortedData = sortData(filteredData);

          setReservations(sortedData.slice(0, 7));
          setTotalReservations(sortedData.length);
          setShowMore(filteredData.length > 7);
        } else {
          console.log("La respuesta de la API no contiene reservaciones:", data);
        }
      } else {
        console.log("Error al obtener las reservas:", res.status);
      }
    } catch (error) {
      console.log("Error en la solicitud de reservas:", error.message);
    }
  };

  const handleShowMore = async () => {
    const startIndex = reservations.length;
    try {
      const res = await fetch(`/api/reserve/getreservations?startIndex=${startIndex}`);
      const newData = await res.json();
      if (res.ok) {
        const currentDate = new Date().toISOString().slice(0, 10); 
        const filteredData = newData.filter(reservation => reservation.date.slice(0, 10) === currentDate); 
        const allData = [...reservations, ...filteredData];
        const uniqueData = Array.from(new Set(allData.map(r => r._id))).map(id => {
          return allData.find(r => r._id === id);
        });
        const sortedData = sortData(uniqueData);

        setReservations(sortedData);
        setTotalReservations(sortedData.length);
        setShowMore(filteredData.length > 0); 
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeleteReservation = async () => {
    try {
      const res = await fetch(`/api/reserve/deletereservations/${reservationIdToDelete}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setReservations((prev) => prev.filter((reservation) => reservation._id !== reservationIdToDelete));
        setShowModal(false);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleMarkAsCompleted = async (reservationId) => {
    try {
      const response = await fetch(`/api/reserve/close-reservation/${reservationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Error al cerrar la reserva');
      }

      const data = await response.json();

      setReservations(prevReservations =>
        prevReservations.map(reservation =>
          reservation._id === reservationId ? { ...reservation, completed: true } : reservation
        )
      );
      console.log(data.message); 
    } catch (error) {
      console.log('Error al cerrar la reserva:', error.message);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleSortBy = (field) => {
    if (sortBy.field === field) {
      setSortBy({ ...sortBy, order: sortBy.order === 'asc' ? 'desc' : 'asc' });
    } else {
      setSortBy({ field, order: 'desc' });
    }
  };

  const sortData = (data) => {
    return data.sort((a, b) => {
      if (sortBy.field === 'hour') {

        const hourA = parseInt(a.hour.split(':')[0]);
        const hourB = parseInt(b.hour.split(':')[0]);
        return sortBy.order === 'asc' ? hourA - hourB : hourB - hourA;
      }
      return 0;
    });
  };

  return (
    <div className='table-auto overflow-y-hidden md:mx-auto p-3 h-screen mt-24 w-full'>
      <div className="overflow-y-auto h-full">
        {reservations.length > 0 ? (
          <>
            <table className='min-w-full divide-y divide-gray-200 shadow-md'>
              <thead className='bg-gray-50'>
                <tr>
                  <th scope='col' className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5'>
                    Nombre
                  </th>
                  <th scope='col' className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5'>
                    Teléfono
                  </th>
                  <th scope='col' className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5'>
                    Hora
                    <button onClick={() => handleSortBy('hour')} className='inline-block ml-1'>
                      {sortBy.order === 'asc' ? (
                        <FaArrowUp />
                      ) : (
                        <FaArrowDown />
                      )}
                    </button>
                  </th>
                  <th scope='col' className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5'>
                    Fecha
                  </th>
                  <th scope='col' className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5'>
                    Lugar
                  </th>
                  <th scope='col' className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5'>
                    Comensales
                  </th>
                  <th scope='col' className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5'>
                    Estado
                  </th>
                  <th scope='col' className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5'>
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {reservations.map((reservation) => (
                  <tr key={reservation._id}>
                    <td className='px-4 py-4 whitespace-nowrap'>{reservation.name}</td>
                    <td className='px-4 py-4 whitespace-nowrap'>{reservation.phoneNumber}</td>
                    <td className='px-4 py-4 whitespace-nowrap'>{reservation.hour}</td>
                    <td className='px-4 py-4 whitespace-nowrap'>{formatDate(reservation.date)}</td>
                    <td className='px-4 py-4 whitespace-nowrap'>{reservation.place}</td>
                    <td className='px-4 py-4 whitespace-nowrap'>{reservation.people}</td>
                    <td className='px-4 py-4 whitespace-nowrap'>
                      {!reservation.completed ? (
                        <MdOutlineRestaurant className='text-green-500 hover:underline cursor-pointer mr-4' onClick={() => handleMarkAsCompleted(reservation._id)} />
                      ) : (
                        <IoRestaurantSharp className='text-red-500' />
                      )}
                    </td>
                    <td className='px-4 py-4 whitespace-nowrap flex'>
                      <span
                        onClick={() => {
                          setShowModal(true);
                          setReservationIdToDelete(reservation._id);
                        }}
                        className='text-red-500 hover:underline cursor-pointer ml-4'
                      >
                        <MdDelete />
                      </span>
                      <Link
                        className='text-teal-500 hover:underline ml-4'
                        to={`/update-reservation/reserve/${reservation._id}`}
                      >
                        <PiPencilSimpleLineFill />
                      </Link>
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
                Mostrar más
              </button>
            )}
          </>
        ) : (
          <p>Aún no tienes ninguna reserva!</p>
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
                      ¿Seguro que quieres eliminar esta reserva?
                    </h3>
                  </div>
                </div>
              </div>
              <div className='bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse'>
                <button
                  onClick={handleDeleteReservation}
                  className='w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm'
                >
                  Sí, estoy seguro
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
