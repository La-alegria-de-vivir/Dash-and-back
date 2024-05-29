import React, { useEffect, useState } from 'react';
import { FaTrash } from "react-icons/fa";
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { IoRestaurantSharp } from "react-icons/io5";
import { Link } from 'react-router-dom';
import { MdOutlineRestaurant } from "react-icons/md";
import { PiPencilSimpleLineFill } from "react-icons/pi";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';
import ReportPDF from '../../Components/Report/Report.jsx';
import { PDFDownloadLink } from '@react-pdf/renderer';

export default function Reservation() {
  const [reservations, setReservations] = useState([]);
  const [allReservations, setAllReservations] = useState([]);
  const [totalReservations, setTotalReservations] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [reservationIdToDelete, setReservationIdToDelete] = useState('');
  const [sortBy, setSortBy] = useState({ field: '', order: 'asc' });
  const [searchName, setSearchName] = useState('');
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;

  useEffect(() => {
    fetchReservations();
  }, [sortBy, searchName, currentPage, startDate, endDate]);

  useEffect(() => {
    fetchAllReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const params = new URLSearchParams();
      const startIndex = (currentPage - 1) * 7;
      params.append('startIndex', startIndex);
      params.append('limit', 7);
      if (searchName) params.append('name', searchName);
      if (startDate) params.append('startDate', startDate.toISOString());
      if (endDate) params.append('endDate', endDate.toISOString());
      if (sortBy.field) {
        params.append('sortBy', sortBy.field);
        params.append('sortOrder', sortBy.order);
      }

      const res = await fetch(`/api/reserve/getTotalReservations?${params.toString()}`);
      const data = await res.json();

      if (res.ok) {
        setReservations(data.reservations);
        setTotalReservations(data.totalReservations);
      } else {
        console.log("Error al obtener las reservas:", res.status);
      }
    } catch (error) {
      console.log("Error en la solicitud de reservas:", error.message);
    }
  };

  const fetchAllReservations = async () => {
    try {
      const res = await fetch(`/api/reserve/getTotalReservations`);
      const data = await res.json();

      if (res.ok) {
        setAllReservations(data.reservations);
        
      } else {
        console.log("Error al obtener todas las reservas:", res.status);
      }
    } catch (error) {
      console.log("Error en la solicitud de todas las reservas:", error.message);
    }
  };

  const handleDateChange = (update) => {
    setDateRange(update);
    setCurrentPage(1); 
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleDeleteReservation = async () => {
    try {
      const res = await fetch(`/api/reserve/deletereservations/${reservationIdToDelete}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setReservations((prev) => prev.filter((reservation) => reservation._id !== reservationIdToDelete));
        setShowModal(false);
        fetchAllReservations();
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleMarkAsCompleted = async (reservationId) => {
    try {
        const response = await fetch(`/api/reserve/close-reservation/${reservationId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) {
            throw new Error('Error al cerrar la reserva');
        }
        console.log('Reserva marcada como cerrada correctamente');

        setReservations((prevReservations) => 
            prevReservations.map((reservation) => 
                reservation._id === reservationId 
                    ? { ...reservation, status: 'closed', completed: true } 
                    : reservation
            )
        );

        fetchAllReservations();
    } catch (error) {
        console.log('Error al cerrar la reserva:', error.message);
    }
};

  const formatDate = (dateString) => {
    if (!dateString) {
      console.error('Error: dateString is empty');
      return null;
    }
    return new Date(dateString).toLocaleDateString();
  };

  const handleSortBy = (field) => {
    if (sortBy.field === field) {
      setSortBy({ ...sortBy, order: sortBy.order === 'asc' ? 'desc' : 'asc' });
    } else {
      setSortBy({ field, order: 'asc' });
    }
  };

  const filterReservations = (allReservations) => {
    return allReservations
      .filter(reservation =>
        reservation.name.toLowerCase().includes(searchName.toLowerCase())
      )
      .filter(reservation => {
        if (!startDate || !endDate) return true;
        const reservationDate = new Date(reservation.date);
        return reservationDate >= startDate && reservationDate <= endDate;
      });
  };

  const handleChange = (e) => {
    setSearchName(e.target.value);
    setCurrentPage(1); // Reset to first page on name search change
  };

  const filteredReservations = filterReservations(allReservations);
  const paginatedReservations = filteredReservations.slice((currentPage - 1) * 7, currentPage * 7);
  const totalPages = Math.ceil(filteredReservations.length / 7);

  // Formatear las fechas antes de pasarlas a ReportPDF
  const formattedStartDate = startDate ? startDate.toLocaleDateString() : 'N/A';
  const formattedEndDate = endDate ? endDate.toLocaleDateString() : 'N/A';

  return (
    <div className='table-auto overflow-y-hidden md:mx-auto p-3 h-screen mt-24 w-full mx-auto px-6'>
      <div className="overflow-y-auto h-full">
        {paginatedReservations.length > 0 ? (
          <>
  <table className='min-w-full divide-y divide-gray-200 shadow-md'>
  <thead className='bg-gray-50'>
    <tr>
      <th scope='col' className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5'>
        <input
          type="text"
          value={searchName}
          onChange={handleChange}
          placeholder="Buscar por nombre"
          className="mt-2 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </th>
      <th scope='col' className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5'>
        Teléfono
      </th>
      <th scope='col' className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5'>
        Hora
        <button onClick={() => handleSortBy('hour')} className='inline-block ml-1'>
          {sortBy.field === 'hour' && sortBy.order === 'asc' ? (
            <FaArrowUp />
          ) : (
            <FaArrowDown />
          )}
        </button>
      </th>
      <th scope='col' className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5'>
        <DatePicker
          selectsRange={true}
          startDate={startDate}
          endDate={endDate}
          onChange={handleDateChange}
          placeholderText="Fechas"
          className="mt-2 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          dateFormat="dd-MM-yyyy"
          isClearable={true}
        />
      </th>
      <th scope='col' className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5'>
        Lugar
      </th>
      <th scope='col' className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5'>
        Comensales
      </th>
      <th scope='col' className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5'>
        Acciones
      </th>
    </tr>
  </thead>
  <tbody className='bg-white divide-y divide-gray-200'>
    {paginatedReservations.map((reservation) => (
      <tr key={reservation._id} className={`${reservation.completed ? 'bg-green-100' : ''}`}>
        <td className='px-4 py-2 whitespace-nowrap'>
          <div className='text-sm text-gray-900'>{reservation.name}</div>
        </td>
        <td className='px-4 py-2 whitespace-nowrap'>
          <div className='text-sm text-gray-900'>{reservation.phoneNumber}</div>
        </td>
        <td className='px-4 py-2 whitespace-nowrap'>
          <div className='text-sm text-gray-900'>{reservation.hour}</div>
        </td>
        <td className='px-4 py-2 whitespace-nowrap'>
          <div className='text-sm text-gray-900'>{formatDate(reservation.date)}</div>
        </td>
        <td className='px-4 py-2 whitespace-nowrap'>
          <div className='text-sm text-gray-900'>{reservation.place}</div>
        </td>
        <td className='px-4 py-2 whitespace-nowrap'>
          <div className='text-sm text-gray-900'>{reservation.people}</div>
        </td>
        <td className='px-4 py-2 whitespace-nowrap text-sm font-medium flex'>
          <Link to={`/update-reservation/reserve/${reservation._id}`} className='text-indigo-600 hover:text-indigo-900 mr-2'>
            <PiPencilSimpleLineFill />
          </Link>
          {reservation.completed ? (
            <IoRestaurantSharp className='text-red-600' />
          ) : (
            <button
              onClick={() => handleMarkAsCompleted(reservation._id)}
              className='text-green-600 hover:text-green-900'
            >
              <MdOutlineRestaurant />
            </button>
          )}
          <button
            onClick={() => { setShowModal(true); setReservationIdToDelete(reservation._id); }}
            className='ml-2 text-red-600 hover:text-red-900'
          >
            <FaTrash />
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>

            <div className="flex items-center justify-between mt-4">
              <button
                onClick={() => handlePageClick(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center px-2 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50"
              >
                <ChevronLeftIcon className="w-5 h-5" />
                Anterior
              </button>
              <span className="text-sm text-gray-500">
                Página {currentPage} de {totalPages}
              </span>
              <button
                onClick={() => handlePageClick(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center px-2 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50"
              >
                Siguiente
                <ChevronRightIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Sección para generar el informe PDF */}
            <div className="mt-4">
              <PDFDownloadLink
                document={<ReportPDF reservations={filteredReservations} startDate={formattedStartDate} endDate={formattedEndDate} />}
                fileName="informe_reservas.pdf"
                className="text-blue-600 hover:text-blue-900"
              >
                {({ blob, url, loading, error }) =>
                  loading ? 'Generando informe...' : 'Descargar informe PDF'
                }
              </PDFDownloadLink>
            </div>
          </>
        ) : (
          <p className='text-center text-gray-500'>No se encontraron reservas.</p>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <p>¿Estás seguro de que quieres eliminar esta reserva?</p>
            <div className="mt-4 flex justify-end">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-300 rounded-md mr-2">
                Cancelar
              </button>
              <button onClick={handleDeleteReservation} className="px-4 py-2 bg-red-600 text-white rounded-md">
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
