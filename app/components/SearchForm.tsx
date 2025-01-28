import React, { useState, useRef, useEffect, useContext } from "react";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { MyContext } from '../context/MyContext';
import { LuLoaderCircle } from "react-icons/lu";

const SearchForm: React.FC = () => {

  const { setDays, setPassengers, setAges, setStartDate, setEndDate } = useContext(MyContext);

  const router = useRouter();
  const [destination, setDestination] = useState("");
  const [startDateLocal, setStartDateLocal] = useState<Date | null>(null);
  const [endDateLocal, setEndDateLocal] = useState<Date | null>(null);
  const [passengersLocal, setPassengersLocal] = useState<number>(1);
  const [agesLocal, setAgesLocal] = useState<string[]>([""]);
  const [isPassengerMenuOpen, setIsPassengerMenuOpen] = useState(false);
  const [isDateMenuOpen, setIsDateMenuOpen] = useState(false);
  const [isDestinationMenuOpen, setIsDestinationMenuOpen] = useState(false);
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [totalDays, setTotalDays] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);

  const passengerMenuRef = useRef<HTMLDivElement>(null);
  const dateMenuRef = useRef<HTMLDivElement>(null);
  const destinationMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setPassengers(1);
    setStartDate("");
    setEndDate("");
    setAges([""]);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        passengerMenuRef.current &&
        !passengerMenuRef.current.contains(event.target as Node)
      ) {
        setIsPassengerMenuOpen(false);
      }
      if (dateMenuRef.current && !dateMenuRef.current.contains(event.target as Node)) {
        setIsDateMenuOpen(false);
      }
      if (
        destinationMenuRef.current &&
        !destinationMenuRef.current.contains(event.target as Node)
      ) {
        setIsDestinationMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handlePassengerChange = (increment: boolean) => {
    const newCount = increment ? passengersLocal + 1 : Math.max(1, passengersLocal - 1);
    setPassengersLocal(newCount);
    setPassengers(newCount);
    setAgesLocal(new Array(newCount).fill(""));
    setAges(new Array(newCount).fill(""));
  };

  const handleAgeChange = (index: number, age: string) => {
    const updatedAges = [...agesLocal];
    updatedAges[index] = age;

    setAgesLocal(updatedAges);
    setAges(updatedAges);
  };

  const handleDateChange = (ranges: any) => {
    const { startDate, endDate } = ranges.selection;
  
    const formatDate = (date: { getDate: () => { (): any; new(): any; toString: { (): string; new(): any; }; }; getMonth: () => number; getFullYear: () => any; }) => {
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${year}/${month}/${day}`;
    };
  
    setStartDate(formatDate(startDate));
    setEndDate(formatDate(endDate));
  
    setStartDateLocal(startDate);
    setEndDateLocal(endDate);
  
    if (startDate && endDate) {
      const differenceInTime = endDate.getTime() - startDate.getTime();
      const days = Math.floor(differenceInTime / (1000 * 3600 * 24)) + 1;
      setTotalDays(days);
      setDays(days);
    }
  };  

  const handleFormSubmit = () => {
    setIsFormSubmitted(true);
    setIsLoading(true);
    let errors: string[] = [];
    if (!destination) errors.push("Selecciona un destino.");
    if (!startDateLocal || !endDateLocal) errors.push("Selecciona las fechas del viaje.");
    if (agesLocal.some((age: string) => age === "" || parseInt(age) <= 0)) errors.push("Asegúrate de ingresar las edades de todos los pasajeros.");

    setFormErrors(errors);

    if (errors.length === 0) {  
      router.push("/hotel-search");
    } else {
      setIsLoading(false);
    }
  };

  const today = new Date();

  return (
    <div className="flex flex-col gap-4 border border-gray-300 p-6 rounded-2xl w-11/12 font-montserrat mx-auto">
      <h2 className="text-2xl font-semibold text-gray-700">Buscar Hoteles</h2>
      <form className="flex flex-col md:flex-row gap-4 w-full">
        <div className="relative w-full md:w-1/3 m-auto text-sm lg:text-xl">
          <button
            type="button"
            onClick={() => setIsDestinationMenuOpen(!isDestinationMenuOpen)}
            className="w-full h-20 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg shadow-md hover:bg-gray-200 transition-all duration-150"
          >
            {destination || "Seleccionar destino"}
          </button>

          {isDestinationMenuOpen && (
            <motion.div
              ref={destinationMenuRef}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="absolute z-10 bg-white border rounded-lg shadow-lg p-4 top-full mt-2 w-full"
            >
              <ul>
                <li
                  className="cursor-pointer hover:bg-gray-200 px-4 py-2 transition-all duration-150"
                  onClick={() => {
                    setDestination("Dubai");
                    setIsDestinationMenuOpen(false);
                  }}
                >
                  Dubai
                </li>
              </ul>
            </motion.div>
          )}
        </div>

        <div className="relative flex w-full md:w-1/4 text-sm lg:text-lg">
          <button
            type="button"
            onClick={() => setIsDateMenuOpen(!isDateMenuOpen)}
            className="w-full h-20 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg shadow-md hover:bg-gray-200 transition-all duration-150"
          >
            {startDateLocal && endDateLocal
              ? `${startDateLocal.toLocaleDateString("es-ES")} - ${endDateLocal.toLocaleDateString("es-ES")}`
              : "Seleccionar fechas"}
          </button>

          {isDateMenuOpen && (
            <motion.div
              ref={dateMenuRef}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="absolute z-10 bg-white border rounded-lg shadow-lg p-4 top-full mt-2 w-fit"
            >
              <DateRange
                ranges={[{
                  startDate: startDateLocal || today,
                  endDate: endDateLocal || today,
                  key: "selection",
                }]}
                minDate={today}
                onChange={handleDateChange}
              />
            </motion.div>
          )}
        </div>

        <div className="relative w-full md:w-2/12 text-sm lg:text-lg">
          <button
            type="button"
            onClick={() => setIsPassengerMenuOpen(!isPassengerMenuOpen)}
            className="w-full h-20 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg shadow-md hover:bg-gray-200 transition-all duration-150"
          >
            Huéspedes: {passengersLocal}
          </button>

          {isPassengerMenuOpen && (
            <motion.div
              ref={passengerMenuRef}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="absolute z-10 bg-white border rounded-lg shadow-lg p-4 top-full mt-2 w-60"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-600 font-medium">Cantidad de huéspedes:</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handlePassengerChange(false)}
                    className="bg-gray-200 text-gray-700 rounded-lg px-3 py-1 hover:bg-gray-300 transition-all duration-150"
                  >
                    -
                  </button>
                  <span>{passengersLocal}</span>
                  <button
                    type="button"
                    onClick={() => handlePassengerChange(true)}
                    className="bg-gray-200 text-gray-700 rounded-lg px-3 py-1 hover:bg-gray-300 transition-all duration-150"
                  >
                    +
                  </button>
                </div>
              </div>

              <div>
                <span className="block text-gray-600 font-medium mb-2">Edades</span>
                {agesLocal.map((age, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <span className="text-sm text-gray-600">Huésped {index + 1}:</span>
                    <input
                      type="number"
                      min={0}
                      value={age}
                      onChange={(e) => handleAgeChange(index, e.target.value)}
                      className="w-20 p-2 border rounded-lg shadow-sm"
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            handleFormSubmit();
          }}
          className="flex w-full md:w-2/12 h-20 m-auto bg-blue-400 text-white font-semibold p-4 rounded-lg shadow-md hover:bg-white hover:text-blue-400 transition-all duration-150"
        >
          {isLoading ? (
            <div className="loader m-auto animate-spin">
              <LuLoaderCircle />
            </div>
          ) : (
            <h1 className="m-auto">Buscar</h1>
          )}
        </button>
      </form>

      {isFormSubmitted && formErrors.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="absolute z-20 top-0 right-0 mt-4 mr-4 bg-red-500 text-white p-4 rounded-lg shadow-md"
        >
          <p>{formErrors[0]}</p>
        </motion.div>
      )}

      {totalDays > 0 && (
        <p className="text-lg text-gray-700 mt-4">
          Duración de la estadía: {totalDays} día{totalDays > 1 ? "s" : ""}
        </p>
      )}
    </div>
  );
};

export default SearchForm;