import React, { useEffect, useState } from "react";
import {
  getBedsFromLocalStorage,
  getRoomtypesFromLocalStorage,
  saveRoomtypesToLocalStorage,
} from "../../../Components/local-storage";
import { EditButton, SaveButton } from "../../../Components/buttons";
import OutsideClickListener from "../../../Components/event-listeners";

export function DataTable({ roomtypes, beds, onEdit, onSave, setRoomtypes }) {
  const bedHeaders =
    beds && //Har lagt till detta villkor for att kolla att det finns sängar att mapa for att unvika errors "can't read properties of..." sa det finns ett alternativ (null) att leverera om det inte hittas
    beds.map((bed) =>
      bed ? (
        <th className="ColoumnHeadline" key={bed.id}>
          {bed.bedName}
        </th>
      ) : null
    );

  const handleBedOptionChange = (roomtypeId, bedId, value) => {
    const updatedRoomtypes = roomtypes.map((roomtype) =>
      roomtype.id === roomtypeId
        ? {
            ...roomtype,
            bedOptions: {
              ...roomtype.bedOptions,
              [bedId]: parseInt(value, 10), //ParseInt! INTRESSANT Här[] skapas ej en array, den skapar en key med ett värde of the `bedId`
            },
          }
        : roomtype
    );
    setRoomtypes(updatedRoomtypes);
  };

  return (
    <table className="PropertyTable">
      <thead>
        <tr>
          <th className="ColoumnHeadlineBigger">Roomtype:</th>
          <th></th>
          {bedHeaders}
        </tr>
      </thead>
      <tbody>
        {roomtypes.map((roomtype) => (
          <tr key={roomtype.id}>
            <td className="ColoumnHeadline">{roomtype.roomtypeName}</td>
            <td className="EditBTNBox">
              <EditButton onEdit={() => onEdit(roomtype.id)} />
            </td>
            {beds.map((bed) => (
              <td key={bed.id} className="BedsRoomtypeBox">
                {roomtype.isEditing ? (
                  <div className="InputWithDatalist">
                    <select
                      className="SmallInput"
                      value={
                        roomtype.bedOptions &&
                        roomtype.bedOptions[bed.id] !== undefined //Villkor för att sidan ej ska krasha(den har&overview) om det finns odefinerade/ej finns roomtypes och bedOptions som matchar.("can't read properties of...")+ undika varning nar man skriver i input faltet: "An uncontrolled value..."
                          ? roomtype.bedOptions[bed.id].toString()
                          : "no_selection"
                      }
                      onChange={(e) =>
                        handleBedOptionChange(
                          roomtype.id,
                          bed.id,
                          e.target.value
                        )
                      }
                    >
                      <option value="no_selection">
                        No. of {bed.bedName}:
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
                    {roomtype.bedOptions &&
                    roomtype.bedOptions[bed.id] !== undefined
                      ? roomtype.bedOptions[bed.id]
                      : "-"}
                  </div>
                )}
              </td>
            ))}
            <td className="SaveBTNBox">
              {roomtype.isEditing && (
                <>
                  <SaveButton onSave={() => onSave(roomtype.id)} />
                </>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function AdminSettingsBeds() {
  const [roomtypes, setRoomtypes] = useState(
    getRoomtypesFromLocalStorage() || []
  );
  const [beds, setBeds] = useState(getBedsFromLocalStorage() || []);
  const [showInput, setShowInput] = useState(false);
  const [isEditingRoomtype, setIsEditingRoomtype] = useState(false);
  const [roomtype, setRoomtype] = useState(false);

  useEffect(() => {
    const savedBeds = getBedsFromLocalStorage();
    if (savedBeds) {
      setBeds(savedBeds);
    }
  }, []);

  useEffect(() => {
    const savedRoomtypes = getRoomtypesFromLocalStorage();
    if (savedRoomtypes) {
      setRoomtypes(savedRoomtypes);
    }
  }, []);

  const handleEdit = (id) => {
    const updatedRoomtypes = roomtypes.map((roomtype) => {
      if (roomtype.id === id) {
        return {
          ...roomtype,
          isEditing: !roomtype.isEditing,
        };
      }
      return {
        ...roomtype,
        isEditing: false,
      };
    });

    setRoomtypes(updatedRoomtypes);
  };

  const handleSave = (id) => {
    const updatedRoomtypes = roomtypes.map((roomtype) => {
      if (roomtype.id === id) {
        return {
          ...roomtype,
          isEditing: false,
          selectedAmountOfBeds: roomtype.selectedAmountOfBeds,
        };
      }
      return roomtype;
    });
    setRoomtypes(updatedRoomtypes);
    saveRoomtypesToLocalStorage(updatedRoomtypes);
  };

  const handleOutsideClick = () => {
    if (!isEditingRoomtype) {
      setShowInput(false);
    }

    if (isEditingRoomtype) {
      const updatedRoomtypes = roomtypes.map((roomtype) => ({
        ...roomtype,
        isEditing: false,
      }));
      setRoomtypes(updatedRoomtypes);
      setIsEditingRoomtype(false);
    }
  };

  return (
    <div className="PropertyContainer">
      <OutsideClickListener onOutsideClick={handleOutsideClick}>
        <div className="PropertySettings">
          <h1>BEDS</h1>
          <h2>Roomtypes & beds</h2>
          <DataTable
            roomtypes={roomtypes}
            setRoomtypes={setRoomtypes}
            beds={beds}
            onEdit={handleEdit}
            onSave={handleSave}
            isEditingRoomtype={isEditingRoomtype}
            handleOutsideClick={handleOutsideClick}
          />
        </div>
        <div className="DividerLine"></div>
      </OutsideClickListener>
    </div>
  );
}
