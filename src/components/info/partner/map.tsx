'use client';
import Script from 'next/script';
import { Coordinate, NaverMap } from '@/interfaces/map';
import { useCallback, useRef } from 'react';

export default function Map({ loc }: { loc: Coordinate }) {
  const mapRef = useRef<NaverMap | null>(null);
  const CLIENT_ID = process.env.NAVER_MAP_CLIENT_ID;

  const intializeMap = useCallback(() => {
    const mapOptions = {
      center: new naver.maps.LatLng(37.5665, 126.9789), // 서울시청 좌표
      zoom: 10,
      scaleControl: true,
      mapTypeControl: true,
    };
    const map = new naver.maps.Map('map', mapOptions);
    mapRef.current = map;
  }, [loc]);

  return (
    <>
      <div
        id="map"
        style={{ width: '100%', height: '100%' }}
      ></div>
    </>
  );
}
