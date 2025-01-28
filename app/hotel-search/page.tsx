"use client";

import React, { useState, useEffect, useContext } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import Card from '../components/Card';
import SortButton from '../components/SortButton';
import axios from 'axios';
import { MyContext } from '../context/MyContext';

const Home: React.FC = () => {
  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [clickedIndex, setClickedIndex] = useState<number>(0);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const { ages, startDate, endDate } = useContext(MyContext);
  const IATAcode = "DXB";

  const generateBirthdateFromAge = (age: number): string => {
    const currentYear = new Date().getFullYear();
    const birthYear = currentYear - age;
    const birthMonth = Math.floor(Math.random() * 12) + 1;
    const birthDay = Math.floor(Math.random() * 28) + 1;
    return `${birthYear}/${String(birthMonth).padStart(2, '0')}/${String(birthDay).padStart(2, '0')}`;
  };

  const passengersWithBirthdates = ages.map((age: string) => ({
    age,
    birthdate: generateBirthdateFromAge(parseInt(age)),
  }));

  useEffect(() => {
    axios.get('https://api-dev.outletdehoteles.com/api/availability/public')
      .then((response) => {
        if (response.data.success) {
          const hotelsData = response.data.data.map((hotel: any) => {
            const fullAddress = [hotel.address.address1, hotel.address.address2, hotel.address.address3]
              .filter(Boolean)
              .join(", ");
          
            return {
              id: hotel.id,
              name: hotel.name,
              regionName: hotel.regionName,
              city: hotel.address.city,
              stars: hotel.stars,
              address: fullAddress,
              pricePerNight: parseFloat(hotel.pricePerNight.toFixed(2)),
              originalPricePerNight: parseFloat(hotel.originalPricePerNight.toFixed(2)),
              imageUrl: hotel.photos,
              mealType: typeof hotel.mealType === 'object' && hotel.mealType.text ? hotel.mealType.text : hotel.mealType,
              discount: hotel.discounts[0],
              hasRefundableOptions: hotel.hasRefundableOptions
            };
          });
          setHotels(hotelsData);
        } else {
          setError('No se pudieron cargar los datos.');
        }
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  },);

  useEffect(() => {
    if (startDate && endDate && passengersWithBirthdates.length > 0) {

      console.log('Sending request with data:', { passengersWithBirthdates, IATAcode, startDate, endDate });

      axios.post('http://localhost:3001/api/related-products', {
        passengers: passengersWithBirthdates,
        IATAcode,
        startDate,
        endDate,
      })
        .then((response) => {
          setRelatedProducts(response.data);
        })
        .catch((err) => {
          setError('Error al obtener los productos relacionados: ' + err.message);
        });
    }
  });

  const sortedHotels = [...hotels].sort((a, b) => {
    switch (clickedIndex) {
      case 0:
        return a.pricePerNight - b.pricePerNight;
      case 1:
        return b.pricePerNight - a.pricePerNight;
      case 2:
        return a.stars - b.stars;
      case 3:
        return b.stars - a.stars;
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <DotLottieReact
        className="w-3/4 h-auto m-auto"
        src="https://lottie.host/22a00728-31ff-40e1-a8df-8bb8fb105702/pMwD2aBWQn.lottie"
        loop
        autoplay
      />
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="flex flex-col flex-wrap justify-around font-montserrat">
      {sortedHotels.map((hotel) => (
        <Card
          key={hotel.id}
          id={hotel.id}
          name={hotel.name}
          regionName={hotel.regionName}
          city={hotel.city}
          stars={hotel.stars}
          address={hotel.address}
          pricePerNight={hotel.pricePerNight}
          originalPricePerNight={hotel.originalPricePerNight}
          imageUrl={hotel.imageUrl}
          mealType={hotel.mealType}
          discount={hotel.discount}
          hasRefundableOptions={hotel.hasRefundableOptions}
          relatedProducts={relatedProducts}
        />
      ))}
      <SortButton setClickedIndex={setClickedIndex} />
    </div>
  );
};

export default Home;