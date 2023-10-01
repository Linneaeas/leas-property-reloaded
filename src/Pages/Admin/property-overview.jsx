import React, { useEffect, useState } from "react";
import {
  getStandardsFromLocalStorage,
  getSuitesFromLocalStorage,
  getPropertiesFromLocalStorage,
  getRoomtypesFromLocalStorage,
  getFacilitiesFromLocalStorage,
  getBedsFromLocalStorage,
} from "../../Components/local-storage";

export function AdminPropertyOverview() {
  const [standards, setStandards] = useState([]);
  const [suites, setSuites] = useState([]);
  const [properties, setProperties] = useState([]);
  const [roomtypes, setRoomtypes] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [beds, setBeds] = useState([]);

  useEffect(() => {
    const savedStandards = getStandardsFromLocalStorage() || [];
    if (savedStandards) {
      setStandards(savedStandards);
    }
  }, []);

  useEffect(() => {
    const savedSuites = getSuitesFromLocalStorage() || [];
    if (savedSuites) {
      setSuites(savedSuites);
    }
  }, []);

  useEffect(() => {
    const savedProperties = getPropertiesFromLocalStorage() || [];
    if (savedProperties) {
      setProperties(savedProperties);
    }
  }, []);

  useEffect(() => {
    const savedRoomtypes = getRoomtypesFromLocalStorage() || [];
    if (savedRoomtypes) {
      setRoomtypes(savedRoomtypes);
    }
  }, []);

  useEffect(() => {
    const savedFacilities = getFacilitiesFromLocalStorage() || [];
    if (savedFacilities) {
      setFacilities(savedFacilities);
    }
  }, []);

  useEffect(() => {
    const savedBeds = getBedsFromLocalStorage() || [];
    if (savedBeds) {
      setBeds(savedBeds);
    }
  }, []);

  const propertieHeaders = properties.map((propertie) => (
    <th className="ColoumnHeadline" key={propertie.id}>
      {propertie.propertieName}
    </th>
  ));

  const getSuitesFromLocalStorage = () => {
    const suites = JSON.parse(localStorage.getItem("suites"));
    const standards = getStandardsFromLocalStorage() || [];
    const facilities = getFacilitiesFromLocalStorage() || [];
    const suiteCapacities = calculateSuiteCapacity(standards, roomtypes, beds);

    if (suites && suites.length > 0 && standards && standards.length > 0) {
      return suites.map((suite) => {
        const standard = standards.find(
          (s) => s.standardName === suite.selectedStandard
        );

        if (standard) {
          const roomtypeOptions = standard.roomtypeOptions || {};
          const facilitieOptions = standard.facilitieOptions || {};
          return {
            ...suite,
            selectedRoomtypes: roomtypeOptions,
            selectedFacilities: facilitieOptions,
          };
        }
        return suite;
      });
    }
    return suites;
  };

  const roomtypeHeaders = roomtypes.map((roomtype) => (
    <th className="ColoumnHeadline" key={roomtype.id}>
      {roomtype.roomtypeName}
    </th>
  ));

  const calculateTotalRoomsInSuite = (suite) => {
    let totalRooms = 0;

    // Check if suite and selectedRoomtypes are defined
    if (suite && suite.selectedRoomtypes) {
      for (const roomtype of roomtypes) {
        const roomCount = suite.selectedRoomtypes[roomtype.id] || 0;
        totalRooms += parseInt(roomCount, 10);
      }
    }

    return totalRooms;
  };

  function calculateRoomtypeCapacity(roomtype, beds) {
    return Object.keys(roomtype.bedOptions).reduce((totalCapacity, bedId) => {
      const bed = beds.find((bed) => bed.id === bedId);
      if (bed) {
        const bedCapacity = bed.selectedBedPersons || 0;
        const bedCount = roomtype.bedOptions[bedId] || 0;
        return totalCapacity + bedCapacity * bedCount;
      }
      return totalCapacity;
    }, 0);
  }

  function calculateSuiteCapacity(standards, roomtypes, beds) {
    return standards.map((standard) => {
      const capacity = roomtypes
        .filter((roomtype) => roomtype.standardId === standard.id)
        .reduce((totalCapacity, roomtype) => {
          return totalCapacity + calculateRoomtypeCapacity(roomtype, beds);
        }, 0);

      return { ...standard, capacity };
    });
  }
  function calculateTotalPersonsInSuite(suite, roomtypes, beds) {
    let totalPersons = 0;

    // Check if suite, selectedRoomtypes, and beds are defined
    if (suite && suite.selectedRoomtypes && beds) {
      totalPersons = roomtypes.reduce((totalPersons, roomtype) => {
        const roomCount = suite.selectedRoomtypes[roomtype.id] || 0;
        const bedCapacity = calculateRoomtypeCapacity(roomtype, beds);
        totalPersons += roomCount * bedCapacity;
        return totalPersons;
      }, 0);
    }

    return totalPersons;
  }

  return (
    <div className="PropertyContainer">
      <div className="PropertyContent">
        <h1>PROPERTY OVERVIEW</h1>
        <table className="PropertyTable" id="Overview">
          <thead>
            <tr>
              <th className="ColoumnHeadline">Name:</th>
              <th className="ColoumnHeadline">Standard:</th>
              {propertieHeaders}
              {roomtypeHeaders}
              <th className="ColoumnHeadlineBigger">Tot, Rms:</th>
              <th className="ColoumnHeadlineBigger">Tot. Prs:</th>
              <th className="ColoumnHeadline">Facilities:</th>
            </tr>
          </thead>
          <tbody>
            {suites.map((suite) => (
              <tr className="OverviewRow" key={suite.id}>
                <td>{suite?.suiteName || "-"}</td>
                <td>{suite?.selectedStandard || "-"}</td>
                {properties.map((propertie) => (
                  <td key={propertie.id}>
                    {suite &&
                    propertie &&
                    suite.propertieOptions &&
                    suite.propertieOptions[propertie.id] ? (
                      <div className="OptionChoice">
                        <span className="OptionChoice">
                          {suite.propertieOptions[propertie.id]}
                        </span>
                      </div>
                    ) : (
                      <div className="NoSelection">{"-"}</div>
                    )}
                  </td>
                ))}
                {roomtypes.map((roomtype) => (
                  <td key={roomtype.id}>
                    {suite &&
                    suite.selectedRoomtypes &&
                    suite.selectedRoomtypes[roomtype.id] ? (
                      <div className="OptionChoice">
                        <span className="OptionChoice">
                          {suite.selectedRoomtypes[roomtype.id]}
                        </span>
                      </div>
                    ) : (
                      <div className="NoSelection">{"-"}</div>
                    )}
                  </td>
                ))}

                <td>
                  <div className="OptionChoice">
                    <span className="OptionChoiceTotal">
                      {calculateTotalRoomsInSuite(suite)}
                    </span>
                  </div>{" "}
                </td>
                <td>
                  <div className="OptionChoice">
                    <span className="OptionChoiceTotal">
                      {calculateTotalPersonsInSuite(suite, roomtypes, beds)}
                    </span>
                  </div>{" "}
                </td>

                <td id="SuiteStandardFacilitieBox">
                  <div className="OptionChoiceFacilities">
                    {suite?.selectedFacilities &&
                      facilities
                        .filter((facilitie) =>
                          suite.selectedFacilities.hasOwnProperty(facilitie.id)
                        )
                        .map((facilitie) => (
                          <span key={facilitie.id}>
                            {facilitie.facilitieName},{" "}
                          </span>
                        ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
