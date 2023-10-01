import React, { useEffect, useState } from "react";
import {
  getStandardsFromLocalStorage,
  saveStandardsToLocalStorage,
  getFacilitiesFromLocalStorage,
} from "../../Components/local-storage";
import { EditButton, SaveButton } from "../../Components/buttons";
import OutsideClickListener from "../../Components/event-listeners";
import CheckedIcon from "../../Images/CheckedIcon.png";

export function DataTable({
  standards,
  setStandards,
  facilities,
  onEdit,
  onSave,
}) {
  const facilitieHeaders = facilities.map((facilitie) => (
    <th className="ColHeadline" key={facilitie.id}>
      {facilitie.facilitieName}
    </th>
  ));

  const handleFacilitieOptionChange = (standardId, facilitieId, isChecked) => {
    const updatedStandards = standards.map((standard) =>
      standard.id === standardId
        ? {
            ...standard,
            facilitieOptions: {
              ...standard.facilitieOptions,
              [facilitieId]: isChecked,
            },
          }
        : standard
    );
    setStandards(updatedStandards);
  };

  return (
    <table className="PropertyTable">
      <thead>
        <tr>
          <th className="ColHeadlineBigger">Standard:</th>
          <th></th>
          {facilitieHeaders}
        </tr>
      </thead>
      <tbody>
        {standards.map((standard) => (
          <tr key={standard.id}>
            <td className="ColHeadline">{standard.standardName}</td>
            <td className="EditBTNBox">
              <EditButton onEdit={() => onEdit(standard.id)} />
            </td>
            {facilities.map((facilitie) => (
              <td key={facilitie.id} className="StandardFacilityBox">
                {standard.isEditing ? (
                  <div className="Checkbox">
                    <input
                      type="checkbox"
                      className="Checkbox"
                      checked={
                        standard.facilitieOptions &&
                        standard.facilitieOptions[facilitie.id]
                          ? standard.facilitieOptions[facilitie.id]
                          : false
                      }
                      onChange={(e) =>
                        handleFacilitieOptionChange(
                          standard.id,
                          facilitie.id,
                          e.target.checked
                        )
                      }
                    />
                  </div>
                ) : standard.facilitieOptions &&
                  standard.facilitieOptions[facilitie.id] ? (
                  <div className="OptionChoice">
                    <img
                      className="CheckedIcon"
                      src={CheckedIcon}
                      alt="Checked icon"
                    />
                  </div>
                ) : (
                  <div className="OptionChoice">
                    <span className="NoSelection">-</span>
                  </div>
                )}
              </td>
            ))}
            <td className="SaveBTNBox">
              {standard.isEditing && (
                <>
                  <SaveButton onSave={() => onSave(standard.id)} />
                </>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function AdminSettingsFacilities() {
  const [standards, setStandards] = useState(
    getStandardsFromLocalStorage() || []
  );
  const [facilities, setFacilities] = useState(
    getFacilitiesFromLocalStorage() || []
  );
  const [showInput, setShowInput] = useState(false);
  const [isEditingStandard, setIsEditingStandard] = useState(false);
  const [standard, setStandard] = useState(false);

  useEffect(() => {
    const savedFacilities = getFacilitiesFromLocalStorage();
    if (savedFacilities) {
      setFacilities(savedFacilities);
    }
  }, []);

  useEffect(() => {
    const savedStandards = getStandardsFromLocalStorage();
    if (savedStandards) {
      setStandards(savedStandards);
    }
  }, []);

  const handleEdit = (id) => {
    const updatedStandards = standards.map((standard) => {
      if (standard.id === id) {
        return {
          ...standard,
          isEditing: !standard.isEditing,
        };
      }
      return {
        ...standard,
        isEditing: false,
      };
    });

    setStandards(updatedStandards);
  };

  const handleSave = (id) => {
    const updatedStandards = standards.map((standard) => {
      if (standard.id === id) {
        return {
          ...standard,
          isEditing: false,
          selectedFacilitieSetting: standard.selectedFacilitieSetting,
        };
      }
      return standard;
    });

    setStandards(updatedStandards);
    saveStandardsToLocalStorage(updatedStandards);
  };

  const handleOutsideClick = () => {
    if (!isEditingStandard) {
      setShowInput(false);
    }

    if (isEditingStandard) {
      const updatedStandards = standards.map((standard) => ({
        ...standard,
        isEditing: false,
      }));
      setStandards(updatedStandards);
      setIsEditingStandard(false);
    }
  };

  return (
    <div className="PropertyContainer">
      <OutsideClickListener onOutsideClick={handleOutsideClick}>
        <div className="PropertyContent">
          <h1>FACILITIES</h1>
          <h2>Standards & facilities</h2>
          <DataTable
            standards={standards}
            setStandards={setStandards}
            facilities={facilities}
            onEdit={handleEdit}
            onSave={handleSave}
            isEditingStandard={isEditingStandard}
            handleOutsideClick={handleOutsideClick}
          />
        </div>
      </OutsideClickListener>
    </div>
  );
}
