'use client';
import { useEffect, useState } from 'react';
import { Coordinate } from '@/interfaces/map';
import Map from './map';
import Script from 'next/script';

export default function MapContainer({ address }: { address: string }) {
  const [loc, setLoc] = useState<Coordinate>();

  // const initLocation = () => {

  // };

  useEffect(() => {
    console.log('MapContainer mounted with address:', address);
    naver.maps.Service.geocode(
      {
        query: address,
      },
      function (status, response) {
        if (status !== naver.maps.Service.Status.OK) {
          console.error('Geocode error:', response);
          return;
        }

        const result = response.v2;
        const items = result.addresses;

        if (items.length === 0) {
          console.warn('No results found for the address:', address);
          return;
        }
        setLoc([parseFloat(items[0].x), parseFloat(items[0].y)] as Coordinate);
        console.log('Geocode result:', items);
      }
    );
  }, []);

  return address && <>hello world{/* <Map loc={loc} /> */}</>;
}
