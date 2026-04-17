import { Shipment } from './types';

export const MOCK_SHIPMENTS: Shipment[] = [
  {
    id: 'SHP-1001',
    origin: 'Shanghai, CN',
    destination: 'Long Beach, US',
    status: 'In Transit',
    eta: '2026-04-22',
    volume: 450,
    value: 1250000,
    currentLat: 31.2304,
    currentLng: 121.4737,
  },
  {
    id: 'SHP-1002',
    origin: 'Rotterdam, NL',
    destination: 'New York, US',
    status: 'At Port',
    eta: '2026-04-19',
    volume: 200,
    value: 850000,
    currentLat: 51.9225,
    currentLng: 4.4791,
  },
  {
    id: 'SHP-1003',
    origin: 'Singapore, SG',
    destination: 'Hamburg, DE',
    status: 'In Transit',
    eta: '2026-05-05',
    volume: 320,
    value: 2100000,
    currentLat: 1.3521,
    currentLng: 103.8198,
  },
  {
    id: 'SHP-1004',
    origin: 'Busan, KR',
    destination: 'Savannah, US',
    status: 'Delayed',
    eta: '2026-04-25',
    volume: 150,
    value: 450000,
    currentLat: 35.1796,
    currentLng: 129.0756,
  },
];

export const RAW_SNAPSHOT = {
  weather: 'Tropical Storm "Nexus" forming in the Pacific, heading towards California coast. Wind speeds 75mph.',
  portStatus: 'Long Beach current dwell time increased by 14% due to crane maintenance. Hamburg experiencing labor strikes.',
  carrierAlerts: 'Maersk reporting system slowdowns in European hubs. Hapag-Lloyd vessel "Berlin Express" diverted due to engine issues.',
  geopolitical: 'Tensions in the Red Sea causing continuous rerouting around the Cape of Good Hope.'
};
