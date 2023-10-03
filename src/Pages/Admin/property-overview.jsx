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
  const propertieHeaders = properties.map(
    (
      propertie
      //MAP över alla properties och och visa deras propertieName.
    ) => (
      <th className="ColoumnHeadline" key={propertie.id}>
        {propertie.propertieName}
      </th>
    )
  );
  const roomtypeHeaders = roomtypes.map((roomtype) => (
    <th className="ColoumnHeadline" key={roomtype.id}>
      {roomtype.roomtypeName}
    </th>
  ));

  const getSuitesFromLocalStorage = () => {
    const suites = JSON.parse(localStorage.getItem("suites"));
    //Definierar suites i den här komponenten för att kunna hantera, lägga till och räkna ut data baserat på suiten, då  det är utifrån suiten jag visar datan.
    const standards = getStandardsFromLocalStorage() || [];
    //OM det finns standards, blir dem assigned const "standards", finns inte, kommer en tom array tilldelas "standards"(error prev.).
    const roomtypes = getRoomtypesFromLocalStorage() || [];
    const facilities = getFacilitiesFromLocalStorage() || [];
    const suiteCapacities = calculateSuiteCapacity(standards, roomtypes, beds); //Funktionen skapas och tar standards..etc som argument.

    if (suites && suites.length > 0 && standards && standards.length > 0) {
      //Kollar så suites och standards har ett värden=True, (null eller undefiened=False)(error prev.)
      return suites.map((suite) => {
        //OM ovan värde är true:
        const standard = standards.find(
          (s) => s.standardName === suite.selectedStandard
        ); // //För varje suite används "FIND" metoden för att söka efter en standard som matchar med standardens standarName för varje suites selectedStandard. Om en match hittas, blir den definerad som "standard". (s) är en parameter deklaration för en => funktion. Den specifierar en enstaka parameter för funktionen, i de här fallet en individuell standard i "standards" arrayen.
        if (standard) {
          //Om en matchande standard hittades:
          const roomtypeOptions = standard.roomtypeOptions || {};
          //Sätter ihop "roomtypeOptions" utifrån "standard"". ||OR Om en standard saknar "roomtypeOptions", är standardens roomtypeOption ett tomt objekt.
          const facilitieOptions = standard.facilitieOptions || {};
          return {
            ...suite,
            selectedRoomtypes: roomtypeOptions,
            selectedFacilities: facilitieOptions,
          }; //Konstruerar ett nytt objekt för varje "suite", lägger till egenskaper baserat på suitens "selectedRoomtypes" och selectedFacilities, baserat på datan som kom från den matchande standarden.
        }
        return suite; //Om ingen matchning hittades, returneras suiten oförändrad.
      });
    }
    return suites; //Finns inga suites eller standards, eller om villkoren(genom map) inte justerade suiterna, returneras den orginala "suites" arrayen.
  };

  //Räknar ut totala kapaciteten för en rumstyp baserad på antal av varje bedOptions och personer i varje bed:
  function calculateRoomtypeCapacity(roomtype, beds) {
    //Funktion med 2 parametrar.
    return Object.keys(roomtype.bedOptions).reduce((totalCapacity, bedId) => {
      //Object.keys...: Tar emot en array med "Object"s "keys"(bed ID) utifrån vilket "bedOptions" rumstypen har. Den tar fram sängens ID som är accossierad med den rumstypen.
      //Använder "REDUCE" metoden för att gå igenom arrayen med bedId:s (från Object.keys(roomtype.bedOptions)). Callback funktionen tar 2 parametrar. För varje bedId, kalkylerar funktionen & tar fram den totala kapaciteten baserat på antal personer i varje bed, och antalet beds i den rumstypen.
      const bed = beds.find((bed) => bed.id === parseInt(bedId));
      //Söker igenom arrayen för att hitta(FIND) bed Objektet som matchat bedId:et, genom parseInt säkerhetställs att bedId behandlas som en integer(ser till en korrekt jämförelse i beds arrayn)
      if (bed) {
        //OM en säng med matchande Id hittas, utför koden nedan:
        const bedCapacity = bed.selectedBedPersons || 0;
        const bedCount = roomtype.bedOptions[bedId] || 0;
        return totalCapacity + bedCapacity * bedCount;
        //Räknar ut Kapaciteten för den specifika sängen och läggar till det i den totala kapaciteten som är uträknad än så länge.(OR "0" error prev.)
      }
      return totalCapacity; //
    }, 0); //OM en säng med matchande id Inte hittas, returneras den nuvarande totalCapacity utan några förändringar.("0" är det initiala värdet som skickas som argument till Reduce metoden)
  }

  function calculateSuiteCapacity(standards, roomtypes, beds) {
    //Funktion med 3 parametrar.
    return standards.map((standard) => {
      //Map varje standard i standards arrayn, för varje standard=ändra om till ett nytt objekt med en tillagd egenskap: "capacity".
      const capacity = roomtypes
        .filter((roomtype) => roomtype.standardId === standard.id) //För varje standard, filtrerar roomtypes och väljer endast dem som matchar med standardId.
        .reduce((totalCapacity, roomtype) => {
          //Reduce går igenom den filtrerade roomtypes för den standarden. För varje roomtype:...
          return totalCapacity + calculateRoomtypeCapacity(roomtype, beds); //...räknar den ut den totala kapaciteten genom calculateRoomtypeCapacity funktionen och tar fram the "totalCapacity"
        }, 0);
      return { ...standard, capacity }; //För varje standard returneras ett nytt "standard" objekt med dem orginala egenskaperna+den tillagda egenskapen "capacity", som representerar totala kapaciteten för dem associerade "roomtypes" baserat på sängarna.
    });
  }

  function calculateTotalPersonsInSuite(suite, roomtypes, beds) {
    let totalPersons = 0; //Initialt värde for att ha koll på totala antalet personer i Varje suite.
    if (suite && suite.selectedRoomtypes && beds) {
      //Kollar så alla är definerade och sannna innan det räknas på.
      totalPersons = roomtypes.reduce((totalPersons, roomtype) => {
        //Använder Reduce for att räkna ut tot antalet personer i suiten baserat på varje roomtype och dens associerade roomCount & bed capacity:
        const roomCount = suite.selectedRoomtypes[roomtype.id] || 0;
        const bedCapacity = calculateRoomtypeCapacity(roomtype, beds);
        totalPersons += roomCount * bedCapacity; //För varje roomtype, räknas antalet personer i den rumstypen ut och totala antalet personer för varje suite tas fram.
        return totalPersons;
      }, 0);
    }
    return totalPersons;
  }

  const calculateTotalRoomsInSuite = (suite) => {
    let totalRooms = 0;
    if (suite && suite.selectedRoomtypes) {
      //Kollar så alla är definerade och sannna innan det räknas på.
      for (const roomtype of roomtypes) {
        //Går igenom varje roomtype i den globala roomtypes arrayn.
        const roomCount = suite.selectedRoomtypes[roomtype.id] || 0; //För varje roomtype tas roomCount fram från suite.selectedRoomtypes fram, baserat på roomtype.id
        totalRooms += parseInt(roomCount, 10); //Tar fram totala antalet rum. ("10" spec base radix, 10=decimal nummer. error prev.)
      }
    }
    return totalRooms; //Totala rumsantalet per Suite.
  };

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
              <th className="ColoumnHeadlineBigger">Tot. Rms:</th>
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
                  </div>
                </td>
                <td>
                  <div className="OptionChoice">
                    <span className="OptionChoiceTotal">
                      {calculateTotalPersonsInSuite(suite, roomtypes, beds)}
                    </span>
                  </div>
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
