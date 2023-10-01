import React, { useEffect, useState } from "react";
import {
  saveSuitesToLocalStorage,
  getSuitesFromLocalStorage,
  getStandardsFromLocalStorage,
  getPropertiesFromLocalStorage,
} from "../../../Components/local-storage";
import { EditButton, SaveButton } from "../../../Components/buttons";
import OutsideClickListener from "../../../Components/event-listeners";

export function DataTable({
  suites,
  setSuites,
  standards,
  properties,
  onEdit,
  onSave,
}) {
  const propertieHeaders = properties.map((propertie) => (
    <th className="ColoumnHeadline" key={propertie.id}>
      {propertie.propertieName}
    </th>
  ));
  const handleStandardOptionChange = (suiteId, value) => {
    const updatedSuites = suites.map((suite) =>
      suite.id === suiteId
        ? {
            ...suite,
            selectedStandard: value,
          }
        : suite
    );
    setSuites(updatedSuites);
  };

  const handlePropertieOptionChange = (suiteId, propertieId, value) => {
    const updatedSuites = suites.map((suite) =>
      suite.id === suiteId
        ? {
            ...suite,
            propertieOptions: {
              ...suite.propertieOptions,
              [propertieId]: parseInt(value, 10),
            },
          }
        : suite
    );
    setSuites(updatedSuites);
  };

  return (
    <table className="PropertyTable">
      <thead>
        <tr>
          <th className="ColoumnHeadlineBigger">Suite:</th>
          <th></th>
          <th className="ColoumnHeadline">Standard:</th>
          {propertieHeaders}
        </tr>
      </thead>
      <tbody>
        {suites.map((suite) => (
          <tr key={suite.id}>
            <td className="ColoumnHeadline">{suite.suiteName}</td>
            <td className="EditBTNBox">
              <EditButton onEdit={() => onEdit(suite.id)} />
            </td>
            <td className="SuitesStandardBox">
              {suite.isEditing ? (
                <div className="InputWithDatalist">
                  <select
                    value={suite.selectedStandard}
                    onChange={(e) => {
                      handleStandardOptionChange(suite.id, e.target.value);
                    }}
                  >
                    <option value="">Select a standard</option>
                    {standards.map((standard) => (
                      <option key={standard.id} value={standard.standardName}>
                        {standard.standardName}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                suite.selectedStandard || (
                  <span className="NoSelection">{"-"}</span>
                )
              )}
            </td>
            {properties.map((propertie) => (
              <td key={propertie.id} className="SuitePropertieBox">
                {suite.isEditing ? (
                  <div className="ManualInputSetting">
                    <input
                      type="text"
                      className="SmallInput"
                      value={
                        (suite.propertieOptions &&
                          suite.propertieOptions[propertie.id]) ||
                        ""
                      }
                      onChange={(e) =>
                        handlePropertieOptionChange(
                          suite.id,
                          propertie.id,
                          e.target.value
                        )
                      }
                    ></input>
                  </div>
                ) : (
                  <div className="OptionChoice">
                    {suite.propertieOptions &&
                    suite.propertieOptions[propertie.id] ? (
                      <span className="OptionChoice">
                        {suite.propertieOptions[propertie.id]}
                      </span>
                    ) : (
                      <span className="NoSelection">{"-"}</span>
                    )}
                  </div>
                )}
              </td>
            ))}

            <td className="SaveBTNBox">
              {suite.isEditing && (
                <>
                  <SaveButton onSave={() => onSave(suite.id)} />
                </>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function AdminSettingsSuites() {
  const [suites, setSuites] = useState(getSuitesFromLocalStorage() || []);
  const [showInput, setShowInput] = useState(false);

  const [isEditingSuite, setIsEditingSuite] = useState(false);
  const [standards, setStandards] = useState([]);
  const [properties, setProperties] = useState(
    getPropertiesFromLocalStorage() || []
  );

  useEffect(() => {
    const savedSuites = getSuitesFromLocalStorage();
    if (savedSuites) {
      setSuites(savedSuites);
    }
  }, []);

  useEffect(() => {
    const savedStandards = getStandardsFromLocalStorage();
    if (savedStandards) {
      setStandards(savedStandards);
    }
  }, []);

  useEffect(() => {
    const savedProperties = getPropertiesFromLocalStorage();
    if (savedProperties) {
      setProperties(savedProperties);
    }
  }, []);

  const handleEdit = (id) => {
    const updatedSuites = suites.map((suite) => ({
      ...suite,
      isEditing: suite.id === id ? !suite.isEditing : suite.isEditing,
    }));

    setSuites(updatedSuites);
  };

  const handleSave = (id) => {
    const updatedSuites = suites.map((suite) => {
      if (suite.id === id) {
        return {
          ...suite,
          isEditing: false,
          selectedStandard: suite.selectedStandard,
          selectedPropertieSetting: suite.selectedPropertieSetting,
        };
      }
      return suite;
    });
    setSuites(updatedSuites);
    saveSuitesToLocalStorage(updatedSuites);
  };

  const handleOutsideClick = () => {
    if (!isEditingSuite) {
      setShowInput(false);
    }

    if (isEditingSuite) {
      const updatedSuites = suites.map((suite) => ({
        ...suite,
        isEditing: false,
      }));
      setSuites(updatedSuites);
      setIsEditingSuite(false);
    }
  };

  return (
    <div className="PropertyContainer">
      <OutsideClickListener onOutsideClick={handleOutsideClick}>
        <div className="PropertyContent">
          <h1>SUITES</h1>
          <h2>Suites, standard & properties</h2>
          <DataTable
            suites={suites}
            standards={standards}
            properties={properties}
            onEdit={handleEdit}
            onSave={handleSave}
            setSuites={setSuites}
            isEditingSuite={isEditingSuite}
            handleOutsideClick={handleOutsideClick}
          />
        </div>
      </OutsideClickListener>
    </div>
  );
}
