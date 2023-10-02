// STANDARDS
export const saveStandardsToLocalStorage = (standards) => {
  try {
    const serializedStandards = JSON.stringify(standards);
    localStorage.setItem("standards", serializedStandards);
  } catch (error) {
    console.error("Error saving standards to local storage:", error);
  }
};
export const getStandardsFromLocalStorage = () => {
  try {
    const serializedStandards = localStorage.getItem("standards");
    if (serializedStandards === null) {
      return undefined;
    }
    return JSON.parse(serializedStandards);
  } catch (error) {
    console.error("Error getting standards from local storage:", error);
    return undefined;
  }
};

//SUITES
export const saveSuitesToLocalStorage = (suites) => {
  try {
    const serializedSuites = JSON.stringify(suites);
    localStorage.setItem("suites", serializedSuites);
  } catch (error) {
    console.error("Error saving suites to local storage:", error);
  }
};
export const getSuitesFromLocalStorage = () => {
  try {
    const serializedSuites = localStorage.getItem("suites");
    if (serializedSuites === null) {
      return undefined;
    }
    return JSON.parse(serializedSuites);
  } catch (error) {
    console.error("Error getting suites from local storage:", error);
    return undefined;
  }
};
// BEDS
export const saveBedsToLocalStorage = (beds) => {
  try {
    const serializedBeds = JSON.stringify(beds);
    localStorage.setItem("beds", serializedBeds);
  } catch (error) {
    console.error("Error saving beds to local storage:", error);
  }
};
export const getBedsFromLocalStorage = () => {
  try {
    const serializedBeds = localStorage.getItem("beds");
    if (serializedBeds === null) {
      return undefined;
    }
    return JSON.parse(serializedBeds);
  } catch (error) {
    console.error("Error getting beds from local storage:", error);
    return undefined;
  }
};
// ADDITIONAL BEDS
export const saveAddBedsToLocalStorage = (addBeds) => {
  try {
    const serializedAddBeds = JSON.stringify(addBeds);
    localStorage.setItem("addBeds", serializedAddBeds);
  } catch (error) {
    console.error("Error saving add beds to local storage:", error);
  }
};
export const getAddBedsFromLocalStorage = () => {
  try {
    const serializedAddBeds = localStorage.getItem("addBeds");
    if (serializedAddBeds === null) {
      return undefined;
    }
    return JSON.parse(serializedAddBeds);
  } catch (error) {
    console.error("Error getting add beds from local storage:", error);
    return undefined;
  }
};

// ROOMTYPES
export const saveRoomtypesToLocalStorage = (roomtypes) => {
  try {
    const serializedRoomtypes = JSON.stringify(roomtypes);
    localStorage.setItem("roomtypes", serializedRoomtypes);
  } catch (error) {
    console.error("Error saving roomtypes to local storage:", error);
  }
};
export const getRoomtypesFromLocalStorage = () => {
  try {
    const serializedRoomtypes = localStorage.getItem("roomtypes");
    if (serializedRoomtypes === null) {
      return undefined;
    }
    return JSON.parse(serializedRoomtypes);
  } catch (error) {
    console.error("Error getting roomtypes from local storage:", error);
    return undefined;
  }
};

// PROPERTIES
export const savePropertiesToLocalStorage = (properties) => {
  try {
    const serializedProperties = JSON.stringify(properties);
    localStorage.setItem("properties", serializedProperties);
  } catch (error) {
    console.error("Error saving properties to local storage:", error);
  }
};
export const getPropertiesFromLocalStorage = () => {
  try {
    const serializedProperties = localStorage.getItem("properties");
    if (serializedProperties === null) {
      return undefined;
    }
    return JSON.parse(serializedProperties);
  } catch (error) {
    console.error("Error getting properties from local storage:", error);
    return undefined;
  }
};

// FACILITIES
export const saveFacilitiesToLocalStorage = (facilities) => {
  try {
    const serializedFacilities = JSON.stringify(facilities);
    localStorage.setItem("facilities", serializedFacilities);
  } catch (error) {
    console.error("Error saving Facilities to local storage:", error);
  }
};
export const getFacilitiesFromLocalStorage = () => {
  try {
    const serializedFacilities = localStorage.getItem("facilities");
    if (serializedFacilities === null) {
      return undefined;
    }
    return JSON.parse(serializedFacilities);
  } catch (error) {
    console.error("Error getting Facilities from local storage:", error);
    return undefined;
  }
};
