'use client';
import { useEffect, useState } from 'react';
import { Coordinate } from '@/interfaces/map';
import Map from './map';

export default function MapContainer({
  address,
  placename,
}: {
  address: string;
  placename?: string;
}) {
  const isInvalidPlacename = (p: string): boolean => {
    const regex = /^[a-zA-Z0-9가-힣\s]+$/;
    return regex.test(p);
  };

  const initMap = (x: number, y: number) => {
    var map = new naver.maps.Map('map', {
      center: new naver.maps.LatLng(x, y),
      zoom: 15,
    });

    if (!isInvalidPlacename(placename)) {
      alert(
        'invalid placename. Please use only alphanumeric characters and spaces.'
      );
      return;
    }

    var marker = new naver.maps.Marker({
      position: new naver.maps.LatLng(x, y),
      map: map,
      icon: {
        content: [
          '<img src="https://map.pstatic.net/resource/api/v2/image/maps/selected-marker/default@1x.png?version=16" alt="마커 이미지" ' +
            'style="margin: 0px; padding: 0px; border: 0px solid transparent; display: block; max-width: none; max-height: none; ' +
            '-webkit-user-select: none; width: 46px; height: 59px; left: 0px; top: 0px;"></img>',
          '<div class="relative ml-[50%]">',
          '<div class="flex flex-col items-center -translate-x-1/2 absolute text-[12px] text-shadow max-w-[120px] min-w-[70px] break-words break-keep text-center">',
          `<strong class="absolute">${placename}</strong>`,
          '</div>',
          '</div>',
        ].join(''),
        size: new naver.maps.Size(46, 59),
        anchor: new naver.maps.Point(23, 59),
      },
    });
  };

  useEffect(() => {
    console.log('MapContainer mounted with address:', address);

    if (!window.naver || !window.naver.maps || !window.naver.maps.Service) {
      console.warn('naver.maps is not ready yet!');
      return;
    }

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
        console.log('Geocode result:', items[0].x, items[0].y);

        if (items.length === 0) {
          console.warn('No results found for the address:', address);
          return;
        }

        initMap(Number(items[0].y), Number(items[0].x));
      }
    );
  }, []);

  return (
    address && (
      <div className="absolute top-0 left-0 right-0 h-[100vh]">
        <div
          id="map"
          className="w-full h-[100vh]"
        ></div>
      </div>
    )
  );
}
