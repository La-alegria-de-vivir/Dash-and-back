import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 30,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  table: {
    display: 'table',
    width: 'auto',
    marginTop: 20,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableCol: {
    width: '25%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000',
    padding: 5,
  },
  tableCellHeader: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  tableCell: {
    fontSize: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 100, // Ajusta el ancho de la imagen aquí
    height: 50,
    marginRight: 10,
  },
});

const ReportPDF = ({ reservations, startDate, endDate }) => {
  const logoUrl = '/images/logo.png';

  const totalComensales = reservations.reduce((total, reservation) => total + reservation.people, 0);

  // Contar reservas completadas y pendientes
  const completadas = reservations.filter(reservation => reservation.completed).length;
  const pendientes = reservations.length - completadas;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
        <Image style={{ ...styles.logo, width: 150 }} src={logoUrl} />
          <Text style={styles.title}>Informe de Reservas</Text>
        </View>
        <Text style={styles.subtitle}>Fecha del informe: {startDate} - {endDate}</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableCol}><Text style={styles.tableCellHeader}>Nombre</Text></View>
            <View style={styles.tableCol}><Text style={styles.tableCellHeader}>Teléfono</Text></View>
            <View style={styles.tableCol}><Text style={styles.tableCellHeader}>Comensales</Text></View>
            <View style={styles.tableCol}><Text style={styles.tableCellHeader}>Lugar</Text></View>
            <View style={styles.tableCol}><Text style={styles.tableCellHeader}>Estado</Text></View>
          </View>
          {reservations.map((reservation) => (
            <View key={reservation._id} style={styles.tableRow}>
              <View style={styles.tableCol}><Text style={styles.tableCell}>{reservation.name}</Text></View>
              <View style={styles.tableCol}><Text style={styles.tableCell}>{reservation.phoneNumber}</Text></View>
              <View style={styles.tableCol}><Text style={styles.tableCell}>{reservation.people}</Text></View>
              <View style={styles.tableCol}><Text style={styles.tableCell}>{reservation.place}</Text></View>
              <View style={styles.tableCol}><Text style={styles.tableCell}>{reservation.completed ? 'Completada' : 'Abierta'}</Text></View>
            </View>
          ))}
        </View>
          <Text style={{ textAlign: 'right', marginBottom: 10 }}>Total de comensales: {totalComensales}</Text>
          <Text style={{ textAlign: 'right', marginBottom: 10 }}>Reservas completadas: {completadas}</Text>
          <Text style={{ textAlign: 'right', marginBottom: 10 }}>Reservas abiertas: {pendientes}</Text>
          <Text style={{ textAlign: 'right', marginBottom: 10 }}>Total de reservas: {reservations.length}</Text>
      </Page>
    </Document>
  );
};

export default ReportPDF;
