import React, { useEffect, useState } from "react";
import {
  getStandardsFromLocalStorage,
  saveStandardsToLocalStorage,
  getRoomtypesFromLocalStorage,
} from "../../Components/local-storage";
import { EditButton, SaveButton } from "../../Components/buttons";
import OutsideClickListener from "../../Components/event-listeners";

export function DataTable({
  standards,
  setStandards,
  roomtypes,
  onEdit,
  onSave,
}) {
  const roomtypeHeaders =
    roomtypes &&
    roomtypes.map((roomtype) =>
      roomtype ? (
        <th className="ColoumnHeadline" key={roomtype.id}>
          {roomtype.roomtypeName}
        </th>
      ) : null
    );

  const handleRoomtypeOptionChange = (standardId, roomtypeId, value) => {
    const updatedStandards = standards.map((standard) =>
      standard.id === standardId
        ? {
            ...standard,
            roomtypeOptions: {
              ...standard.roomtypeOptions,
              [roomtypeId]: parseInt(value, 10),
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
          <th className="ColoumnHeadlineBigger">Standard:</th>
          <th></th>
          {roomtypeHeaders}
        </tr>
      </thead>
      <tbody>
        {standards.map((standard) => (
          <tr key={standard.id}>
            <td className="ColoumnHeadline">{standard.standardName}</td>
            <td className="EditBTNBox">
              <EditButton onEdit={() => onEdit(standard.id)} />
            </td>
            {roomtypes.map((roomtype) => (
              <td key={roomtype.id} className="StandardRoomtypeBox">
                {standard.isEditing ? (
                  <div className="InputWithDatalist">
                    <select
                      className="SmallInput"
                      value={
                        (standard.roomtypeOptions &&
                          standard.roomtypeOptions[roomtype.id]) !== undefined
                          ? standard.roomtypeOptions[roomtype.id]
                          : "no_selection"
                      }
                      onChange={(e) =>
                        handleRoomtypeOptionChange(
                          standard.id,
                          roomtype.id,
                          e.target.value
                        )
                      }
                    >
                      <option value="no_selection">
                        No. of {roomtype.roomtypeName}:
                      </option>
                      {[...Array(11).keys()].map((value) => (
                        <option key={value} value={value}>
                          {value}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="OptionChoice">
                    {standard.roomtypeOptions &&
                    standard.roomtypeOptions[roomtype.id] !== undefined
                      ? standard.roomtypeOptions[roomtype.id]
                      : "-"}
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

export function AdminSettingsRoomtypes() {
  const [standards, setStandards] = useState(
    getStandardsFromLocalStorage() || []
  );
  const [roomtypes, setRoomtypes] = useState(
    getRoomtypesFromLocalStorage() || []
  );
  const [showInput, setShowInput] = useState(false);
  const [isEditingStandard, setIsEditingStandard] = useState(false);
  const [standard, setStandard] = useState(false);

  useEffect(() => {
    const savedRoomtypes = getRoomtypesFromLocalStorage();
    if (savedRoomtypes) {
      setRoomtypes(savedRoomtypes);
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
          selectedAmountOfRoomtypes: standard.selectedAmountOfRoomtypes,
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
          <h1>ROOMTYPES</h1>
          <h2>Standards & roomtypes</h2>
          <DataTable
            standards={standards}
            setStandards={setStandards}
            roomtypes={roomtypes}
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
